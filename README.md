**lenti v0.3.0**

***

<a href="https://npmjs.org/package/lenti">
  <img src="https://badge.fury.io/js/lenti.svg" alt="NPM version"/>
</a>

Lenti is an image viewer that mimicks the effect of lenticular printing.
It displays images in a canvas element and binds events for mouse and accelerometer events,
so just as you would rotate a card or print with lenticular lenses on it, you can tilt your phone to transition between images.

**[Demo](https://danielgamage.github.io/lenti/)**

## Installation
```sh
npm install --save lenti
```

## Basic Usage
Lenti will accomodate any number of images in the container.

```html
<div class="wrapper">
  <div data-lenticular-list="true">
    <img src="./images/sample_a_1.png" alt="Left-facing view of object" width="1280" height="720" />
    <img src="./images/sample_a_2.png" alt="Center-left-facing view of object" width="1280" height="720" />
    <img src="./images/sample_a_3.png" alt="Center-facing view of object" width="1280" height="720" />
    <img src="./images/sample_a_4.png" alt="Center-right-facing view of object" width="1280" height="720" />
    <img src="./images/sample_a_5.png" alt="Right-facing view of object" width="1280" height="720" />
  </div>
</div>
<script type="module">
  import {Lenti, bindGyroscopeXY, bindMouseXY} from "PATH_TO_LENTI"

  let lenti
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("[data-lenticular-list]")
    const canvas = document.createElement("canvas")
    container.appendChild(canvas)
    lenti = new Lenti({
      container,
      canvas,
      eventRoot: window,
      images: Array.from(container.querySelectorAll("img")),
      uiAdapters: [bindMouseXY({eventRoot: window}), bindGyroscopeXY()]
    })
  })
</script>
```

## Browser Support

<picture>
  <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/webgpu.webp">
  <source type="image/png" srcset="https://caniuse.bitsofco.de/image/webgpu.png">
  <img src="https://caniuse.bitsofco.de/image/webgpu.jpg" alt="Data on support for the webgpu feature across the major browsers from caniuse.com">
</picture>

_Thanks to Ire for their [Can I Use Embed](https://caniuse.bitsofco.de/#how-to-use)_

# API

## Classes

### Lenti

Defined in: [index.ts:14](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L14)

TODOs:
- [ ] Add support for pivotted x/y values
- [ ] Add support for touch events
- [ ] Add better gyro support
- [ ] MSAA instead of just rendering higher resolutions

#### Constructors

##### new Lenti()

```ts
new Lenti(options: {
  canvas: HTMLCanvasElement;
  images: HTMLImageElement[];
  oversampling: number;
  samplerSettings: GPUSamplerDescriptor;
  uiAdapters: (this: any, options: object) => void[];
 } & Partial<{
  lensDarkening: number;
  lensDistortion: number;
  stripWidth: number;
  transition: number;
  viewX: number;
  viewY: number;
 }>): Lenti
```

Defined in: [index.ts:80](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L80)

###### Parameters

###### options

\{
  `canvas`: [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement);
  `images`: [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)[];
  `oversampling`: `number`;
  `samplerSettings`: `GPUSamplerDescriptor`;
  `uiAdapters`: (`this`: `any`, `options`: `object`) => `void`[];
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

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="canvas-1"></a> `canvas` | [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement) | `null` | The output (rendered) canvas | [index.ts:18](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L18) |
| <a id="images-1"></a> `images` | ( \| [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement) \| `HTMLOrSVGImageElement` \| [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement) \| [`ImageBitmap`](https://developer.mozilla.org/docs/Web/API/ImageBitmap) \| [`OffscreenCanvas`](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) \| [`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData))[] | `[]` | Image elements to pull textures from. Also supports ImageData. | [index.ts:40](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L40) |
| <a id="inputs-1"></a> `inputs` | \{ `lensDarkening`: `number`; `lensDistortion`: `number`; `stripWidth`: `number`; `transition`: `number`; `viewX`: `number`; `viewY`: `number`; \} | `undefined` | - | [index.ts:58](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L58) |
| `inputs.lensDarkening` | `number` | `undefined` | Amount of darkening to apply near the virtual off-axis parts of the lenticule | [index.ts:66](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L66) |
| `inputs.lensDistortion` | `number` | `undefined` | Amount of y-axis distortion applied to the lenticule simulate vertical off-axis viewing | [index.ts:70](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L70) |
| `inputs.stripWidth` | `number` | `undefined` | Image-space width of the strip placed in an interlaced array under the lenticule | [index.ts:60](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L60) |
| `inputs.transition` | `number` | `undefined` | Amount of virtual warping to apply to the transition from left–right | [index.ts:68](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L68) |
| `inputs.viewX` | `number` | `undefined` | [0: Leftmost image, 1: Rightmost image] | [index.ts:62](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L62) |
| `inputs.viewY` | `number` | `undefined` | [0: Top distortion, 1: Bottom distortion] | [index.ts:64](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L64) |
| <a id="isvisible-1"></a> `isVisible` | `boolean` | `false` | Whether the canvas is visible in the viewport | [index.ts:32](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L32) |
| <a id="oversampling-1"></a> `oversampling` | `number` | `2` | Canvas oversampling | [index.ts:37](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L37) |
| <a id="uiadapters-1"></a> `uiAdapters` | `UIAdapter`[] | `undefined` | UI adapters connect user input to the shader settings, custom adapters can be made **Default** `[bindMouseXY(), bindGyroscopeXY()]` | [index.ts:27](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L27) |

#### Accessors

##### imageAspectRatio

###### Get Signature

```ts
get imageAspectRatio(): number
```

Defined in: [index.ts:241](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L241)

###### Returns

`number`

#### Methods

##### createTextureFromImage()

```ts
createTextureFromImage(imageData: ImageData): Promise<GPUTexture>
```

Defined in: [index.ts:393](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L393)

###### Parameters

###### imageData

[`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GPUTexture`](https://developer.mozilla.org/docs/Web/API/GPUTexture)\>

***

##### error()

```ts
error(e: Error): void
```

Defined in: [index.ts:488](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L488)

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

Defined in: [index.ts:248](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L248)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

##### render()

```ts
render(): void
```

Defined in: [index.ts:437](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L437)

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

Defined in: [index.ts:428](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L428)

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

## Type Aliases

### NormalizedNumber

```ts
type NormalizedNumber = number;
```

Defined in: [index.ts:5](https://github.com/danielgamage/lenti/blob/624ce0f6f34492df1bb8d6fac81593ec82f8dfa3/src/index.ts#L5)

A number in the range [0, 1]

***

### UIAdapter()

```ts
type UIAdapter = (lentiInstance: Lenti) => void;
```

Defined in: adapters.ts:26

UI Adapaters listen for events on a page and can access Lenti properties throughout the instance lifecycle.
UIAdapters expect a Lenti instance to be passed to them, and can be used to bind user input to shader settings.
In practice, this can be as simple as:
```ts
// Sets the lensDarkening based on the amount of daylight when the page loads
new Lenti({uiAdapters: [function bindDaylight(lentiInstance: Lenti) => {
  lentiInstance.inputs.lensDarkening = 0.5
})]})
```
If you want your UIAdapter to be reusable and configurable, you can create a UIAdapterFactory that returns the UIAdapter.
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

##### lentiInstance

[`Lenti`](README.md#lenti)

#### Returns

`void`

***

### UIAdapterFactory()

```ts
type UIAdapterFactory = (options?: any) => UIAdapter;
```

Defined in: adapters.ts:28

UIAdapterFactory is an initializing function that is passed options for the UIAdapater it contains.

#### Parameters

##### options?

`any`

#### Returns

[`UIAdapter`](README.md#uiadapter)

## UI Adapters

### bindGyroscopeXY()

```ts
function bindGyroscopeXY(options: {
  relative: boolean;
  userGestureElement: HTMLElement;
  xBounds: [number, number];
  yBounds: [number, number];
 }): UIAdapter
```

Defined in: adapters.ts:34

Drives viewX/viewY based on the device viewing angle

#### Parameters

##### options

###### relative

`boolean`

when the deviceorientation listener is initiated, measure values against the start

###### userGestureElement

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

Some browsers require user gesture before requesting permission. This is the element that will require click if so.

###### xBounds

\[`number`, `number`\]

changes x values

###### yBounds

\[`number`, `number`\]

changes y values

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

Defined in: adapters.ts:116

Drives viewX/viewY based on the mouse position on the element, in the browser window, or in another element (like a touchstrip element)

#### Parameters

##### options

###### eventRoot

  \| [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
  \| [`Window`](https://developer.mozilla.org/docs/Web/API/Window)
  \| [`Document`](https://developer.mozilla.org/docs/Web/API/Document)

#### Returns

[`UIAdapter`](README.md#uiadapter)
