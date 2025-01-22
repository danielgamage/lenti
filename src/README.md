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
