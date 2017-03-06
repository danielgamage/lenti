# lenti [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Lenticular image viewer

## Installation

```sh
$ npm install --save lenti
```

## Basic Usage
```html
<div data-lenticular-list="true" >
  <img src="assets/images/1.jpg" alt="Blue Image" width="1280" height="720" />
  <img src="assets/images/2.jpg" alt="Blue Image" width="1280" height="720" />
  <img src="assets/images/3.jpg" alt="Blue Image" width="1280" height="720" />
  <img src="assets/images/4.jpg" alt="Blue Image" width="1280" height="720" />
</div>
```

```js
import Lenti from 'lenti'

let lenticulars = document.querySelectorAll('[data-lenticular-list]')
let instances = []
// convert → array & loop through
;[...lenticulars].map((el, i) => {
  // store instance in array for further manipulation
  instances[i] = new Lenti({container: el, width: 1280, height: 720})
  // initialize instance
  instances[i].init()
})
```

Lenti doesn't make too many assumptions about your environment. You may turn off the default event handlers (see `accelerometerEvents` and `mouseEvents`) and make your own interaction system. Just send a value between 0–1 to your instance at `Lenti.redraw()`.

## Options

#### `container`
**Required**

Specifies the HTMLElement (not selector) that contains the images.
#### `accelerometerEvents`
**default**: true

Turns tilt interaction on or off.

#### `mouseEvents`
**default**: true

Turns mouse hover interaction on or off.

#### `stripWidth`
**default**: 16
The horizontal width (in pixels) of each lens strip.

#### `height` & `width`
**default**: 50
The height and width of the canvas (in pixels). You **definitely should** match this to the value of your images (which should all be the same size)

## Cross-origin images
Because Lenti uses canvas to produce this effect, most browsers will be upset if you fetch an image from another origin. Be sure to set `crossorigin="anonymous"`  on your images:

```html
  <img src="https://flickr.com/images/x/1280/720/1.jpg" alt="Blue Image" crossorigin="anonymous" width="1280" height="720" />
```

## License

Apache-2.0 © [Daniel Gamage](https://danielgamage.com)


[npm-image]: https://badge.fury.io/js/lenti.svg
[npm-url]: https://npmjs.org/package/lenti
[travis-image]: https://travis-ci.org/danielgamage/lenti.svg?branch=master
[travis-url]: https://travis-ci.org/danielgamage/lenti
[daviddm-image]: https://david-dm.org/danielgamage/lenti.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/danielgamage/lenti
[coveralls-image]: https://coveralls.io/repos/danielgamage/lenti/badge.svg
[coveralls-url]: https://coveralls.io/r/danielgamage/lenti
