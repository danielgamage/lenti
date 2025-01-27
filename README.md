**lenti v0.3.2**

***

<a href="https://npmjs.org/package/lenti">
  <img src="https://badge.fury.io/js/lenti.svg" alt="NPM version"/>
</a>

Lenti is an image viewer that mimicks the effect of lenticular printing.
It displays images in a canvas element and binds events for mouse and accelerometer events,
so just as you would rotate a card or print with lenticular lenses on it, you can tilt your phone to transition between images.

**[Demo](https://lenti.vercel.app/)**

## Installation
```sh
npm install --save lenti
```

## Usage
Lenti will accomodate any number of images in the container.

```html
<div data-lenticular-list="true">
  <img src="./images/sample_a_1.png" alt="Left-facing view of object" width="1280" height="720" />
  <img src="./images/sample_a_2.png" alt="Center-left-facing view of object" width="1280" height="720" />
  <img src="./images/sample_a_3.png" alt="Center-facing view of object" width="1280" height="720" />
  <img src="./images/sample_a_4.png" alt="Center-right-facing view of object" width="1280" height="720" />
  <img src="./images/sample_a_5.png" alt="Right-facing view of object" width="1280" height="720" />
</div>
```
```ts
import {Lenti, bindGyroscopeXY, bindMouseXY} from "lenti"

const container = document.querySelector("[data-lenticular-list]")
const canvas = document.createElement("canvas") // programmatically creating canvas. could also just put it in the HTML
container.appendChild(canvas)
const lenti = new Lenti({
  container,
  canvas,
  images: Array.from(container.querySelectorAll("img")),
  uiAdapters: [bindMouseXY({eventRoot: window}), bindGyroscopeXY()]
})
```

## Browser Support

Lenti relies on WebGPU for buttery-smooth framerates on modern computers. Unflagged browser support below:

<picture>
  <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/webgpu.webp">
  <source type="image/png" srcset="https://caniuse.bitsofco.de/image/webgpu.png">
  <img src="https://caniuse.bitsofco.de/image/webgpu.jpg" alt="Data on support for the webgpu feature across the major browsers from caniuse.com">
</picture>

_Thanks to Ire for their [Can I Use Embed](https://caniuse.bitsofco.de/#how-to-use)_

# API

## Lenti

### Lenti

TODOs:
- [ ] Add support for pivotted x/y values
- [ ] Add support for touch events
- [ ] MSAA instead of just rendering higher resolutions https://webgpufundamentals.org/webgpu/lessons/webgpu-multisampling.html#a-multisampling

#### Constructors

##### new Lenti()

```ts
new Lenti(options: {
  canvas: HTMLCanvasElement;
  images: HTMLImageElement[];
  oversampling: number;
  samplerSettings: GPUSamplerDescriptor;
  uiAdapters: UIAdapter[];
 } & Partial<{
  lensDarkening: number;
  lensDistortion: number;
  stripWidth: number;
  transition: number;
  viewX: number;
  viewY: number;
 }>): Lenti
```

###### Parameters

###### options

\{
  `canvas`: [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement);
  `images`: [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)[];
  `oversampling`: `number`;
  `samplerSettings`: `GPUSamplerDescriptor`;
  `uiAdapters`: [`UIAdapter`](README.md#uiadapter)[];
 \} & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<\{
  `lensDarkening`: `number`;
  `lensDistortion`: `number`;
  `stripWidth`: `number`;
  `transition`: `number`;
  `viewX`: `number`;
  `viewY`: `number`;
 \}\>

###### Returns

[`Lenti`](README.md#lenti)

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="canvas-1"></a> `canvas` | [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement) | `null` | The output (rendered) canvas |
| <a id="images-1"></a> `images` | ( \| [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement) \| `HTMLOrSVGImageElement` \| [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement) \| [`ImageBitmap`](https://developer.mozilla.org/docs/Web/API/ImageBitmap) \| [`OffscreenCanvas`](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) \| [`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData))[] | `[]` | Image elements to pull textures from. Also supports ImageData. |
| <a id="inputs-1"></a> `inputs` | \{ `lensDarkening`: `number`; `lensDistortion`: `number`; `stripWidth`: `number`; `transition`: `number`; `viewX`: `number`; `viewY`: `number`; \} | `undefined` | - |
| `inputs.lensDarkening` | `number` | `undefined` | Amount of darkening to apply near the virtual off-axis parts of the lenticule |
| `inputs.lensDistortion` | `number` | `undefined` | Amount of y-axis distortion applied to the lenticule simulate vertical off-axis viewing |
| `inputs.stripWidth` | `number` | `undefined` | Image-space width of the strip placed in an interlaced array under the lenticule |
| `inputs.transition` | `number` | `undefined` | Amount of virtual warping to apply to the transition from left–right |
| `inputs.viewX` | `number` | `undefined` | [0: Leftmost image, 1: Rightmost image] |
| `inputs.viewY` | `number` | `undefined` | [0: Top distortion, 1: Bottom distortion] |
| <a id="isvisible-1"></a> `isVisible` | `boolean` | `false` | Whether the canvas is visible in the viewport |
| <a id="oversampling-1"></a> `oversampling` | `number` | `2` | Canvas oversampling |
| <a id="uiadaptercleanupcallbacks-1"></a> `uiAdapterCleanupCallbacks` | [`UIAdapterCleanupCallback`](README.md#uiadaptercleanupcallback)[] | `[]` | - |
| <a id="uiadapters-1"></a> `uiAdapters` | [`UIAdapter`](README.md#uiadapter)[] | `undefined` | UI adapters connect user input to the shader settings, custom adapters can be made **Default** `[bindMouseXY(), bindGyroscopeXY()]` |

#### Accessors

##### imageAspectRatio

###### Get Signature

```ts
get imageAspectRatio(): number
```

###### Returns

`number`

#### Methods

##### createTextureFromImage()

```ts
createTextureFromImage(imageData: ImageData): Promise<GPUTexture>
```

###### Parameters

###### imageData

[`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GPUTexture`](https://developer.mozilla.org/docs/Web/API/GPUTexture)\>

***

##### destroy()

```ts
destroy(): void
```

Destroys the instance and cleans up resources

###### Returns

`void`

***

##### error()

```ts
error(e: Error): void
```

Common Lenti errors may be fired from here

###### Parameters

###### e

[`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

###### Returns

`void`

***

##### init()

```ts
init(): Promise<void>
```

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

##### render()

```ts
render(): void
```

Renders the current state of the instance

###### Returns

`void`

***

##### update()

```ts
update(updates: Partial<{
  lensDarkening: number;
  lensDistortion: number;
  stripWidth: number;
  transition: number;
  viewX: number;
  viewY: number;
 }>): void
```

Updates the instance state with a subset of Lenti's state

###### Parameters

###### updates

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<\{
  `lensDarkening`: `number`;
  `lensDistortion`: `number`;
  `stripWidth`: `number`;
  `transition`: `number`;
  `viewX`: `number`;
  `viewY`: `number`;
 \}\>

###### Returns

`void`

***

### bindGyroscopeXYOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="usergestureelement-1"></a> `userGestureElement?` | [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) | Some browsers require user gesture before requesting permission. This is the element that will require click if so. By default, this is the Lenti instance's canvas element, but it can be a button or other interactive element. |
| <a id="xbounds-1"></a> `xBounds` | \[`number`, `number`\] | Range of angles in object-space x-rotation |
| <a id="ybounds-1"></a> `yBounds` | \[`number`, `number`\] | Range of angles in object-space y-rotation |

***

### Degree

```ts
type Degree = number;
```

A number representing degrees (typically [-360, 360])

***

### NormalizedNumber

```ts
type NormalizedNumber = number;
```

A number in the range [0, 1]

***

### PositiveInteger

```ts
type PositiveInteger = number;
```

A positive integer

## Managing User Interaction

### UIAdapter()

```ts
type UIAdapter = (lentiInstance: Lenti) => UIAdapterCleanupCallback | void;
```

UI Adapaters listen for events on a page and can access Lenti properties throughout the instance lifecycle.

UIAdapters expect a [Lenti](README.md#lenti) instance to be passed to them, and can be used to bind user input to shader settings.

In practice, this can be as simple as:
```ts
// Sets the lensDarkening based on the amount of daylight when the page loads
new Lenti({uiAdapters: [function bindDaylight(lentiInstance: Lenti) => {
  lentiInstance.inputs.lensDarkening = 0.5
})]})
```

#### Parameters

##### lentiInstance

[`Lenti`](README.md#lenti)

#### Returns

[`UIAdapterCleanupCallback`](README.md#uiadaptercleanupcallback) \| `void`

***

### UIAdapterCleanupCallback()

```ts
type UIAdapterCleanupCallback = () => void;
```

UIAdapterCleanupCallback is a function that is called when a Lenti instance is destroyed.

Some cases might be usage in a single-page application where the Lenti instance
is created and destroyed multiple times as a user navigates the site.

#### Returns

`void`

***

### UIAdapterFactory()

```ts
type UIAdapterFactory = (options?: any) => UIAdapter;
```

UIAdapterFactory is an initializing function that is passed options for the UIAdapater it contains.

If you want your UIAdapter to be reusable and configurable, you can create a [UIAdapterFactory](README.md#uiadapterfactory) that returns the [UIAdapter](README.md#uiadapter).
```ts
// Sets the lensDarkening based on the amount of daylight when the page loads
const bindDaylightFactory = (options: {daylight: number}) => {
  return function bindDaylight(lentiInstance: Lenti) => {
    lentiInstance.inputs.lensDarkening = 1 - options.daylight
  }
}

new Lenti({uiAdapters: [bindDaylightFactory({daylight: 0.5})]})
```

#### Parameters

##### options?

`any`

#### Returns

[`UIAdapter`](README.md#uiadapter)

***

### bindGyroscopeXY()

```ts
function bindGyroscopeXY(options: bindGyroscopeXYOptions): UIAdapter
```

Drives viewX/viewY based on the device viewing angle

#### Parameters

##### options

[`bindGyroscopeXYOptions`](README.md#bindgyroscopexyoptions) = `...`

#### Returns

[`UIAdapter`](README.md#uiadapter)

***

### bindMouseXY()

```ts
function bindMouseXY(options: {
  eventRoot:   | HTMLElement
     | Window
     | Document;
 }): UIAdapter
```

Drives viewX/viewY based on the mouse position on the element, in the browser window, or in another element (like a touchstrip element)

#### Parameters

##### options

###### eventRoot

  \| [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
  \| [`Window`](https://developer.mozilla.org/docs/Web/API/Window)
  \| [`Document`](https://developer.mozilla.org/docs/Web/API/Document)

The element that the mouse will be tracked on

#### Returns

[`UIAdapter`](README.md#uiadapter)
