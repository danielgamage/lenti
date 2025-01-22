**lenti v0.3.0**

***

# lenti [![NPM version][npm-image]][npm-url]

Lenti is an image viewer that mimicks the effect of lenticular printing.
It displays images in a canvas element and binds events for mouse and accelerometer events,
so just as you would rotate a card or print with lenticular lenses on it, you can tilt your phone to transition between images.

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

**[Demo][demo-page]**

## Browser Support

<picture>
  <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/webgpu.webp">
  <source type="image/png" srcset="https://caniuse.bitsofco.de/image/webgpu.png">
  <img src="https://caniuse.bitsofco.de/image/webgpu.jpg" alt="Data on support for the webgpu feature across the major browsers from caniuse.com">
</picture>

_Thanks to Ire for their [Can IUse Embed](https://caniuse.bitsofco.de/#how-to-use)_

## API
<!-- INSERT GENERATED DOCS START -->

<!-- INSERT GENERATED DOCS END -->

[npm-image]: https://badge.fury.io/js/lenti.svg
[npm-url]: https://npmjs.org/package/lenti
[demo-page]: https://danielgamage.github.io/lenti/

## Classes

### Lenti

Defined in: [index.ts:157](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L157)

#### Todo

Add support for pivotted x/y values

#### Todo

Add support for touch events

#### Todo

Add better gyro support

#### Todo

MSAA instead of just rendering higher resolutions

#### Constructors

##### new Lenti()

> **new Lenti**(`options`: \{ `canvas`: [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement); `images`: [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)[]; `oversampling`: `number`; `samplerSettings`: `GPUSamplerDescriptor`; `uiAdapters`: (`this`: `any`, `options`: `object`) => `void`[]; \} & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<\{ `lensDarkening`: `number`; `lensDistortion`: `number`; `stripWidth`: `number`; `transition`: `number`; `viewX`: `number`; `viewY`: `number`; \}\>): [`Lenti`](README.md#lenti)

Defined in: [index.ts:220](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L220)

###### Parameters

###### options

\{ `canvas`: [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement); `images`: [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)[]; `oversampling`: `number`; `samplerSettings`: `GPUSamplerDescriptor`; `uiAdapters`: (`this`: `any`, `options`: `object`) => `void`[]; \} & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<\{ `lensDarkening`: `number`; `lensDistortion`: `number`; `stripWidth`: `number`; `transition`: `number`; `viewX`: `number`; `viewY`: `number`; \}\>

###### Returns

[`Lenti`](README.md#lenti)

#### Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="canvas-1"></a> `canvas` | [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement) | `null` | The output (rendered) canvas | [index.ts:161](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L161) |
| <a id="images-1"></a> `images` | ([`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement) \| `HTMLOrSVGImageElement` \| [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement) \| [`ImageBitmap`](https://developer.mozilla.org/docs/Web/API/ImageBitmap) \| [`OffscreenCanvas`](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) \| [`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData))[] | `[]` | Image elements to pull textures from. Also supports ImageData. | [index.ts:180](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L180) |
| <a id="inputs-1"></a> `inputs` | \{ `lensDarkening`: `number`; `lensDistortion`: `number`; `stripWidth`: `number`; `transition`: `number`; `viewX`: `number`; `viewY`: `number`; \} | `undefined` | - | [index.ts:198](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L198) |
| `inputs.lensDarkening` | `number` | `undefined` | Amount of darkening to apply near the virtual off-axis parts of the lenticule | [index.ts:206](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L206) |
| `inputs.lensDistortion` | `number` | `undefined` | Amount of y-axis distortion applied to the lenticule simulate vertical off-axis viewing | [index.ts:210](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L210) |
| `inputs.stripWidth` | `number` | `undefined` | Image-space width of the strip placed in an interlaced array under the lenticule | [index.ts:200](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L200) |
| `inputs.transition` | `number` | `undefined` | Amount of virtual warping to apply to the transition from left–right | [index.ts:208](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L208) |
| `inputs.viewX` | `number` | `undefined` | [0: Leftmost image, 1: Rightmost image] | [index.ts:202](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L202) |
| `inputs.viewY` | `number` | `undefined` | [0: Top distortion, 1: Bottom distortion] | [index.ts:204](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L204) |
| <a id="isvisible-1"></a> `isVisible` | `boolean` | `false` | Whether the canvas is visible in the viewport | [index.ts:172](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L172) |
| <a id="oversampling-1"></a> `oversampling` | `number` | `2` | Canvas oversampling | [index.ts:177](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L177) |
| <a id="uiadapters-1"></a> `uiAdapters` | [`UIAdapter`](README.md#uiadapter)[] | `undefined` | UI adapters connect user input to the shader settings, custom adapters can be made | [index.ts:167](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L167) |

#### Accessors

##### imageAspectRatio

###### Get Signature

> **get** **imageAspectRatio**(): `number`

Defined in: [index.ts:381](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L381)

###### Returns

`number`

#### Methods

##### createTextureFromImage()

> **createTextureFromImage**(`imageData`: [`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData)): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GPUTexture`](https://developer.mozilla.org/docs/Web/API/GPUTexture)\>

Defined in: [index.ts:533](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L533)

###### Parameters

###### imageData

[`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GPUTexture`](https://developer.mozilla.org/docs/Web/API/GPUTexture)\>

***

##### error()

> **error**(`e`: [`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)): `void`

Defined in: [index.ts:628](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L628)

###### Parameters

###### e

[`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

###### Returns

`void`

***

##### init()

> **init**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [index.ts:388](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L388)

###### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

##### render()

> **render**(): `void`

Defined in: [index.ts:577](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L577)

###### Returns

`void`

***

##### update()

> **update**(`updates`: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<\{ `lensDarkening`: `number`; `lensDistortion`: `number`; `stripWidth`: `number`; `transition`: `number`; `viewX`: `number`; `viewY`: `number`; \}\>): `void`

Defined in: [index.ts:568](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L568)

###### Parameters

###### updates

[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<\{ `lensDarkening`: `number`; `lensDistortion`: `number`; `stripWidth`: `number`; `transition`: `number`; `viewX`: `number`; `viewY`: `number`; \}\>

###### Returns

`void`

## Type Aliases

### NormalizedNumber

> **NormalizedNumber**: `number`

Defined in: [index.ts:7](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L7)

A number in the range [0, 1]

***

### UIAdapter()

> **UIAdapter**: (`lentiInstance`: [`Lenti`](README.md#lenti)) => `void`

Defined in: [index.ts:23](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L23)

UI Adapaters listen for events on a page and can access Lenti properties throughout the instance lifecycle.
UIAdapters expect a Lenti instance to be passed to them, and can be used to bind user input to shader settings.
In practive, this can be as simple as:
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

> **UIAdapterFactory**: (`options`?: `any`) => [`UIAdapter`](README.md#uiadapter)

Defined in: [index.ts:25](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L25)

UIAdapterFactory is an initializing function that is passed options for the UIAdapater it contains.

#### Parameters

##### options?

`any`

#### Returns

[`UIAdapter`](README.md#uiadapter)

## Functions

### clamp()

> **clamp**(`value`: `number`, `min`: `number`, `max`: `number`): `number`

Defined in: [index.ts:28](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L28)

Helper

#### Parameters

##### value

`number`

##### min

`number`

##### max

`number`

#### Returns

`number`

***

### remap()

> **remap**(`value`: `number`, `domain`: \[`number`, `number`\], `range`: \[`number`, `number`\]): `number`

Defined in: [index.ts:31](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L31)

Helper

#### Parameters

##### value

`number`

##### domain

\[`number`, `number`\]

##### range

\[`number`, `number`\]

#### Returns

`number`

## References

### default

Renames and re-exports [Lenti](README.md#lenti)

## UI Adapters

### bindGyroscopeXY()

> **bindGyroscopeXY**(`options`: \{ `relative`: `boolean`; `userGestureElement`: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement); `xBounds`: \[`number`, `number`\]; `yBounds`: \[`number`, `number`\]; \}): [`UIAdapter`](README.md#uiadapter)

Defined in: [index.ts:37](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L37)

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

> **bindMouseXY**(`options`: \{ `eventRoot`: [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| [`Window`](https://developer.mozilla.org/docs/Web/API/Window) \| [`Document`](https://developer.mozilla.org/docs/Web/API/Document); \}): [`UIAdapter`](README.md#uiadapter)

Defined in: [index.ts:119](https://github.com/danielgamage/lenti/blob/67a8ba46e5660e47e9f2ea2846534d1e8e9f9457/src/index.ts#L119)

Drives viewX/viewY based on the mouse position on the element, in the browser window, or in another element (like a touchstrip element)

#### Parameters

##### options

###### eventRoot

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| [`Window`](https://developer.mozilla.org/docs/Web/API/Window) \| [`Document`](https://developer.mozilla.org/docs/Web/API/Document)

#### Returns

[`UIAdapter`](README.md#uiadapter)
