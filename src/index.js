/* global window */
class Lenti {
  constructor (options) {
    // Config
    this.container = options.container
    this.accelerometerEvents = (options.accelerometerEvents !== undefined)
      ? options.accelerometerEvents
      : true
    this.mouseEvents = (options.mouseEvents !== undefined)
      ? options.mouseEvents
      : true
    this.stripWidth = options.stripWidth || 16
    this.height = options.height || 50
    this.width = options.width || 50
    this.tiltMax = options.tiltMax || 45
    this.tiltMin = options.tiltMin || -45

    this.init = this.init.bind(this)
    this.sampleImages = this.sampleImages.bind(this)
    this.getImage = this.getImage.bind(this)
    this.handleSizing = this.handleSizing.bind(this)
    this.getBoxPosition = this.getBoxPosition.bind(this)
    this.checkVisibility = this.checkVisibility.bind(this)
    this.bindEvents = this.bindEvents.bind(this)
    this.destroy = this.destroy.bind(this)
    this.redraw = this.redraw.bind(this)
    this.handleMouse = this.handleMouse.bind(this)
    this.handleOrientation = this.handleOrientation.bind(this)
    this.remap = this.remap.bind(this)
  }

  // Initialize
  init () {
    this.images = [...this.container.querySelectorAll(`img`)]
    this.imageCount = this.images.length
    this.imageDataArray = [...Array(this.imageCount).keys()] // empty array w/ same length as this.images
    this.container.innerHTML += `<canvas />`
    this.canvas = this.container.querySelector(`canvas`)
    this.ctx = this.canvas.getContext(`2d`)
    this.tempCanvas = document.createElement(`canvas`)
    this.tempCtx = this.tempCanvas.getContext(`2d`)

    this.handleSizing()
    this.bindEvents()
    this.getBoxPosition()
    this.checkVisibility()
  }

  // Sample image
  sampleImages () {
    this.images.map((imageEl, imageIndex) => {
      if (this.imageDataArray[0]) {
        this.getImage(imageEl, imageIndex)
      } else {
        imageEl.addEventListener(`load`, function () {
          this.getImage(imageEl, imageIndex)
        }.bind(this))
        return imageEl
      }
    })
  }
  getImage (image, imageIndex) {
    this.tempCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)
    const currImageData = this.tempCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
    this.imageDataArray[imageIndex] = new Uint32Array(currImageData.data.buffer)
  }

  // Handle window resize
  handleSizing () {
    // use offsetWidth bc clientWidth = 0 when resizing
    // multiply by device pixel ratio to convert css pixels → device pixels
    this.canvasWidth = Math.floor(this.canvas.offsetWidth * window.devicePixelRatio)
    this.canvasHeight = Math.floor(this.canvasWidth * (this.height / this.width))
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    this.tempCanvas.width = this.canvasWidth
    this.tempCanvas.height = this.canvasHeight
    // Resample images
    // careful on the fire rate here.
    this.sampleImages()
    this.imageData = this.tempCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
    this.getBoxPosition()
  }

  getBoxPosition () {
    const boxyRect = this.canvas.getBoundingClientRect()
    this.box = {
      top: boxyRect.top + window.pageYOffset
    }
  }
  // Check if canvas is in view
  checkVisibility () {
    const vTop = window.pageYOffset
    const vHeight = window.innerHeight
    if (vTop + vHeight < this.box.top ||
      this.box.top + this.canvasHeight < vTop) {
      // viewport doesn't include canvas
      this.visible = false
    } else {
      // viewport includes canvas
      this.visible = true
    }
  }

  // Event Binding
  bindEvents () {
    if (this.mouseEvents) {
      this.canvas.addEventListener(`mousemove`, this.handleMouse)
    }
    if (this.accelerometerEvents) {
      window.addEventListener(`deviceorientation`, this.handleOrientation)
    }
    window.addEventListener(`scroll`, this.checkVisibility)
    window.addEventListener(`resize`, this.handleSizing)
  }

  // Event Unbinding
  destroy () {
    this.canvas.removeEventListener(`mousemove`, this.handleMouse)
    window.removeEventListener(`deviceorientation`, this.handleOrientation)
    window.removeEventListener(`scroll`, this.checkVisibility)
    window.removeEventListener(`resize`, this.handleSizing)
  }

  // Redraw canvas
  redraw (balance) {
    // make sure data is loaded before redrawing
    if (this.imageDataArray[0]) {
      let data = this.imageData.data
      let data32 = new Uint32Array(data.buffer)

      const dataArray = this.imageDataArray
      const canvasWidth = this.canvasWidth
      const canvasHeight = this.canvasHeight
      const stripWidth = this.stripWidth
      const imageCount = this.imageCount

      const addOn = (balance * (imageCount - 1))

      for (let x = 0; x < canvasWidth; x++) {
        const set = (x % stripWidth / stripWidth) + addOn
        const setClamped = Math.floor(set)

        for (let y = 0; y < canvasHeight; y++) {
          const pixel = x + (canvasWidth * y)
          data32[pixel] = dataArray[setClamped][pixel]
        }
      }

      this.ctx.putImageData(this.imageData, 0, 0, 0, 0, this.canvasWidth, this.canvasHeight)
    }
  }

  // Handle mouse events
  handleMouse (e) {
    const balance = this.remap(e.offsetX / this.canvasWidth, 0, 1, 1, 0)
    this.redraw(balance)
  }

  // Handle device accelerometer events
  handleOrientation (e) {
    if (this.visible) {
      const clamped = Math.min(Math.max(e.gamma, this.tiltMin), this.tiltMax)
      const balance = this.remap(clamped, this.tiltMin, this.tiltMax, 1, 0)
      this.redraw(balance)
    }
  }

  // Map values from one range to another
  remap (value, inLow, inHigh, outLow, outHigh) {
    return outLow + ((value - inLow) * (outHigh - outLow) / (inHigh - inLow))
  }
}

export default Lenti
