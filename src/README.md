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

## Usage
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

<picture>
  <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/webgpu.webp">
  <source type="image/png" srcset="https://caniuse.bitsofco.de/image/webgpu.png">
  <img src="https://caniuse.bitsofco.de/image/webgpu.jpg" alt="Data on support for the webgpu feature across the major browsers from caniuse.com">
</picture>

_Thanks to Ire for their [Can I Use Embed](https://caniuse.bitsofco.de/#how-to-use)_

# API
