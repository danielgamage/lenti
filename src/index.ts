import { makeShaderDataDefinitions, makeStructuredView, StructuredView } from "webgpu-utils"
export { bindGyroscopeXY, bindMouseXY, UIAdapter, UIAdapterFactory } from "./adapters.ts"

/** A number in the range [0, 1] */
export type NormalizedNumber = number

/**
 * TODOs:
 * - [ ] Add support for pivotted x/y values
 * - [ ] Add support for touch events
 * - [ ] MSAA instead of just rendering higher resolutions
*/
export class Lenti {
  /** GPU device */
  #device?: GPUDevice = undefined
  /** The output (rendered) canvas */
  canvas: HTMLCanvasElement | null = null
  /** WebGPU context */
  #context: GPUCanvasContext | null = null
  /** WebGPU shader uniforms */
  #uniforms: StructuredView | null = null
  /**
   * UI adapters connect user input to the shader settings, custom adapters can be made
   * @default `[bindMouseXY(), bindGyroscopeXY()]`
   */
  uiAdapters: UIAdapter[] = [bindMouseXY(), bindGyroscopeXY()]

  /** Watches canvas visibility */
  #observer: IntersectionObserver;
  /** Whether the canvas is visible in the viewport */
  isVisible = false;

  /** Device pixel ratio */
  #dpr = 1
  /** Canvas oversampling */
  oversampling = 2;

  /** Image elements to pull textures from. Also supports ImageData. */
  images: (HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas | ImageData)[] = []
  #textureViews: GPUTextureView[] = []
  #imageDimensions: {
    width: number | null,
    height: number | null,
  } = {
    width: null,
    height: null,
  }

  #uniformBuffer: GPUBuffer | null = null
  #bindGroup: GPUBindGroup | null = null
  #pipeline: GPURenderPipeline | null = null
  #samplerSettings: GPUSamplerDescriptor = {
    addressModeU: "mirror-repeat",
    addressModeV: "mirror-repeat",
    magFilter: "linear",
  }
  inputs: {
    /** Image-space width of the strip placed in an interlaced array under the lenticule */
    stripWidth: number,
    /** [0: Leftmost image, 1: Rightmost image] */
    viewX: NormalizedNumber,
    /** [0: Top distortion, 1: Bottom distortion] */
    viewY: NormalizedNumber,
    /** Amount of darkening to apply near the virtual off-axis parts of the lenticule */
    lensDarkening: NormalizedNumber,
    /** Amount of virtual warping to apply to the transition from left–right */
    transition: NormalizedNumber,
    /** Amount of y-axis distortion applied to the lenticule simulate vertical off-axis viewing */
    lensDistortion: NormalizedNumber
  } = {
    stripWidth: 4,
    viewX: 0,
    viewY: 0,
    lensDarkening: 0.2,
    transition: 0.5,
    lensDistortion: 0.5,
  }

  constructor(options: {
    /** Image elements to pull textures from. Also supports ImageData. */
    images: HTMLImageElement[],
    /** UI adapters connect user input to the shader settings, custom adapters can be made  */
    uiAdapters?: ((this, options: object) => void)[],
    /** The canvas element */
    canvas: HTMLCanvasElement,
    /** Texture sampler settings. The defaults below are the primary options you may want to change. */
    samplerSettings?: GPUSamplerDescriptor,
    /** Canvas oversampling */
    oversampling?: number,
  } & Partial<typeof this.inputs>) {
    this.canvas = options.canvas
    this.images = options.images
    this.#context = this.canvas.getContext("webgpu")
    this.#dpr = window.devicePixelRatio || 1
    if (options.samplerSettings) { this.#samplerSettings = options.samplerSettings }
    if (options.oversampling) { this.oversampling = options.oversampling }
    if (options.stripWidth) { this.inputs.stripWidth = options.stripWidth }
    if (options.lensDarkening) { this.inputs.lensDarkening = options.lensDarkening }
    if (options.transition) { this.inputs.transition = options.transition }
    if (options.lensDistortion) { this.inputs.lensDistortion = options.lensDistortion }
    if (options.uiAdapters) { this.uiAdapters = options.uiAdapters }

    this.#observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        let renderIntent = (!this.isVisible && entry.isIntersecting)
        this.isVisible = entry.isIntersecting
        if (renderIntent) {
          this.render()
        }
      });
    });

    if (this.canvas) {
      this.#observer.observe(this.canvas);
    }

    this.init()
  }

  get #shaderSource() {
    return /* wgsl */`
      struct OurVertexShaderOutput {
        @builtin(position) position: vec4f,
        @location(0) texcoord: vec2f,
        @location(1) pxcoord: vec2f,
        @location(2) resolution: vec2f,
      };

      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> OurVertexShaderOutput {
        let pos = array(
          // 1st triangle
          vec2f(-1.0, -1.0), // center
          vec2f( 1.0, -1.0), // right, center
          vec2f(-1.0,  1.0), // center, top

          // 2st triangle
          vec2f(-1.0,  1.0), // center, top
          vec2f( 1.0, -1.0), // right, center
          vec2f( 1.0,  1.0), // right, top
        );

        var vsOutput: OurVertexShaderOutput;
        let xy = pos[vertexIndex];
        vsOutput.position = vec4f(xy, 0.0, 1.0);
        vsOutput.texcoord = xy;
        vsOutput.resolution = vec2(customUniforms.outputWidth, customUniforms.outputHeight);
        vsOutput.pxcoord = xy * vsOutput.resolution.xy;
        return vsOutput;
      }

      struct CustomUniforms {
        // the width of the interlaced image in pixels
        outputWidth: f32,
        // the height of the interlaced image in pixels
        outputHeight: f32,
        // the width of the interlaced image in pixels
        width: f32,
        // the height of the interlaced image in pixels
        height: f32,
        // the width of each strip in pixels
        stripWidth: f32,
        // the number of images in the interlaced image
        imageCount: f32,
        // the bias towards the first or last image [0,1]
        viewX: f32,
        // the vertical distortion bias [0,1]
        viewY: f32,
        // the lens darkening amount [0,1]
        lensDarkeningAttenuator: f32,
        // the amount of left–right difference in viewX [0,1]
        transitionAttenuator: f32,
        // the amount of lens distortion to apply [0,1]
        lensDistortionAttenuator: f32,
      }

      @group(0) @binding(0) var ourSampler: sampler;
      ${Array(this.images.length).fill(0).map((_, i) =>
        `@group(0) @binding(${i + 1}) var texture${i}: texture_2d<f32>;`
      ).join('\n')}
      @group(0) @binding(${this.images.length + 1}) var<uniform> customUniforms: CustomUniforms;

      fn parabola(x: f32, k: f32) -> f32 {
        return pow(4.0 * x * (1.0 - x), k);
      }

      fn circularParabola(x: f32) -> f32 {
        return 1.0 - select(
          sqrt(1.0 - pow(x * 2 - 1, 2.0)),
          sqrt(1.0 - pow(1.0 - (x  * 2), 2.0)),
          x < 0.5
        );
      }

      // strips /|/|/|/|/|/| + viewX * imageCount, send value to texture selector

      @fragment fn fs(fsInput: OurVertexShaderOutput) -> @location(0) vec4f {
        let uv = fsInput.texcoord / vec2f(2.0, 2.0) + vec2f(0.5, 0.5);
        let px = uv * fsInput.resolution;

        let stripWidth = customUniforms.stripWidth / 2; // TODO why does this need to be divided by 2?

        let stripIndex = floor(px.x / stripWidth);
        let stripRamp = fract(px.x / stripWidth);
        let transitionParabolicAttenuator = 1. - circularParabola(clamp(customUniforms.viewX, 0.0, 1.0));
        let transitionOffset = ((uv.x - 0.5) * stripWidth) * transitionParabolicAttenuator * customUniforms.transitionAttenuator * fsInput.resolution.x;
        let offsetPx = (customUniforms.imageCount - 1) + transitionOffset;
        let offsetUv = vec2f(offsetPx / fsInput.resolution.x, 0.0);

        // Create half-circle distortion
        let yOffset = circularParabola(stripRamp);
        let distortedY = uv.y + yOffset * (1 - customUniforms.viewY - 0.5) / 100 * stripWidth * customUniforms.lensDistortionAttenuator;
        let lensDarkeningAttenuator = customUniforms.lensDarkeningAttenuator;
        let lensDarkening = ((-1 * yOffset) + 0.1) * lensDarkeningAttenuator;

        // let color = textureSample(ourTexture, ourSampler, vec2(stripUv, distortedY) + offsetUv);
        let progress = clamp(stripRamp + customUniforms.viewX * (customUniforms.imageCount - 1) + offsetUv.x, 0, customUniforms.imageCount);

        // Sample from appropriate textures
        var color: vec4f;

        let leewayPX = 100.0 / stripWidth;
        let leeway = leewayPX / fsInput.resolution.x;
        ${Array(this.images.length).fill(0).map((_, i) => /* wgsl */`
          let color${i} = textureSample(texture${i}, ourSampler, vec2(uv.x, distortedY));
          if(progress >= ${i}.0 - leeway && progress < ${i + 1}.0 + leeway) {
            color = color + color${i}
              ${i !== 0 ? `* smoothstep(${i}.0 - leeway, ${i}.0 + leeway, progress)`: ""}
              ${i !== this.images.length - 1 ? `* smoothstep(${i + 1}.0 + leeway, ${i + 1}.0 - leeway, progress)`: ""};
          }
        `).join('\n')}

        // Blend between textures
        return vec4f(color.r + lensDarkening, color.g + lensDarkening, color.b + lensDarkening, color.a);

      }`;
  }

  get imageAspectRatio() {
    if (this.#imageDimensions.width && this.#imageDimensions.height) {
      return this.#imageDimensions.width / this.#imageDimensions.height;
    }
    return 1; // Default aspect ratio if dimensions are not set
  }

  async init() {
    if (!navigator.gpu) {
      this.error(new Error("Browser must support WebGPU and page must be served in a secure context. See https://caniuse.com/webgpu for more information."))
      return
    }
    const adapter = await navigator.gpu?.requestAdapter()
    this.#device = await adapter?.requestDevice()
    if (!this.#device) {
      this.error(new Error("Browser must support WebGPU. See https://caniuse.com/webgpu for more information."))
      return
    }

    const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
    try {
      this.#context?.configure({
        device: this.#device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      })
    } catch (e) {
      this.error(new Error("WebGPU context couldn't be configured. " + e))
      return
    }
    if (!this.canvas) {
      this.error(new Error("Canvas couldn't be created"))
      return
    }

    const module = this.#device.createShaderModule({
      label: "our hardcoded textured quad shaders",
      code: this.#shaderSource,
    })

    const defs = makeShaderDataDefinitions(this.#shaderSource)
    if (defs.uniforms !== undefined) {
      this.#uniforms = makeStructuredView(defs.uniforms.customUniforms)
      console.log(this.#uniforms, !this.#uniforms)
    }

    if (!this.#uniforms) {
      console.log("this c")
      this.error(new Error("Uniforms not initialized"))
      return
    }

    this.#uniformBuffer = this.#device.createBuffer({
      label: "Primary uniform buffer",
      size: this.#uniforms.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    this.#pipeline = this.#device.createRenderPipeline({
      label: "hardcoded textured quad pipeline",
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vs",
      },
      fragment: {
        module,
        entryPoint: "fs",
        targets: [{ format: presentationFormat }],
      },
    })

    // Create a texture view for each image
    await Promise.all(
      this.images.map(async (img, i) => {
        if (img instanceof HTMLImageElement && !img.complete) {
          await new Promise((resolve) => {
            img.onload = resolve
          })
        }
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const imageDimensions = {
          width: Number(img instanceof HTMLImageElement ? img.naturalWidth : img.width),
          height: Number(img instanceof HTMLImageElement ? img.naturalHeight : img.height)
        }
        const resizeWidth = Math.floor(Math.min(imageDimensions.width, this.#device.limits.maxTextureDimension2D / this.images.length))
        const resizeHeight = Math.floor(imageDimensions.height * (resizeWidth / imageDimensions.width))
        const bitmap = await createImageBitmap(img, {resizeWidth, resizeHeight, resizeQuality: 'high'})
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        this.#imageDimensions = {
          width: bitmap.width,
          height: bitmap.height
        }
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0)
          const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height)

          const texture = await this.createTextureFromImage(imageData);
          if (texture) {
            this.#textureViews[i] = texture.createView({
              label: `Image Texture View ${img.width}x${img.height}`,
            });
          }
          return imageData
        }
      })
    )

    const sampler = this.#device.createSampler(this.#samplerSettings)
    this.#bindGroup = this.#device.createBindGroup({
      label: "primary bind group",
      layout: this.#pipeline.getBindGroupLayout(0),
      entries: [
        {
          resource: sampler,
        },
        ...this.#textureViews.map((view, i) => ({
          resource: view,
        })),
        {
          resource: { buffer: this.#uniformBuffer },
        },
      ].map((entry, i) => ({ ...entry, binding: i })),
    })

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLCanvasElement) {
          if (this.#device && this.#uniforms) {
            const canvas = entry.target
            const width = entry.contentBoxSize[0].inlineSize
            const height = canvas.width / this.imageAspectRatio
            canvas.width = Math.max(
              1,
              Math.min(width * this.#dpr * this.oversampling, this.#device.limits.maxTextureDimension2D)
            )
            canvas.height = height

            this.#uniforms.set({ outputWidth: width / this.#dpr, outputHeight: height / this.#dpr })

            this.render()
          }
        }
      }
    })
    observer.observe(this.canvas)

    this.uiAdapters.forEach((adapter) => adapter(this))
  }

  async createTextureFromImage(imageData: ImageData) {
    // Create texture with correct dimensions
    if (!this.#device) {
      this.error(new Error("Device not initialized"))
      return
    }
    if (!this.#uniforms) {
      console.log("this a")
      this.error(new Error("Uniforms not initialized"))
      return
    }
    const texture = this.#device.createTexture({
      label: `Image Texture`,
      size: [
        imageData.width,
        imageData.height,
      ],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING |
             GPUTextureUsage.COPY_DST |
             GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // Copy image data to texture
    this.#device.queue.copyExternalImageToTexture(
      { source: imageData, flipY: true },
      { texture: texture },
      { width: imageData.width, height: imageData.height }
    );

    this.#uniforms.set({ width: imageData.width, height: imageData.height })

    return texture;
  }

  update(updates: Partial<typeof this.inputs>) {
    Object.entries(updates).forEach(([key, value]) => {
      if (key in this.inputs && typeof value === 'number') {
        this.inputs[key as keyof typeof this.inputs] = value;
      }
    });
    this.render();
  }

  render = () => {
    if (!this.isVisible || !this.#device || !this.#uniforms || !this.#uniformBuffer || !this.#pipeline || !this.#context) {
      return
    }

    this.#uniforms.set({
      viewX: this.inputs.viewX,
      viewY: this.inputs.viewY,
      imageCount: this.images.length,
      stripWidth: this.inputs.stripWidth,
      lensDarkeningAttenuator: this.inputs.lensDarkening,
      transitionAttenuator: this.inputs.transition,
      lensDistortionAttenuator: this.inputs.lensDistortion,
    })

    this.#device.queue.writeBuffer(
      this.#uniformBuffer,
      0,
      this.#uniforms.arrayBuffer
    )

    const renderPassDescriptor: GPURenderPassDescriptor = {
      label: "our basic canvas renderPass",
      colorAttachments: [
        {
          view: null,
          clearValue: [1, 0.3, 0.3, 1],
          loadOp: "clear",
          storeOp: "store",
        } as (GPURenderPassColorAttachment & { view: null }),
      ],
    }
    // Get the current texture from the canvas context and
    // set it as the texture to render to.
    renderPassDescriptor.colorAttachments[0].view = this.#context
      .getCurrentTexture()
      .createView()

    const encoder = this.#device.createCommandEncoder({
      label: "render quad encoder",
    })
    const pass = encoder.beginRenderPass(renderPassDescriptor)
    pass.setPipeline(this.#pipeline)
    pass.setBindGroup(0, this.#bindGroup)
    pass.draw(6) // render 2 triangles with 3 vertices each
    pass.end()

    const commandBuffer = encoder.finish()
    this.#device.queue.submit([commandBuffer])
  }

  error(e: Error) {
    console.error(`%c[Lenti Error]: %c${e.message}\n%cCause: %c${e.cause ?? 'N/A'}`, 'font-weight: bold;', '', '');
  }
}

export default Lenti
