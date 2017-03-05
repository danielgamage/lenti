var Lenticula = function (options) {
  let _this = this

  // Config
  this.container = options.container
  this.imageData

  // Initialize
  this.init = () => {
    _this.images = [..._this.container.querySelectorAll(`img`)]
    _this.imageData = [..._this.images]
    _this.container.innerHTML += `<canvas />`
    _this.canvas = _this.container.querySelector(`canvas`)
    _this.ctx = _this.canvas.getContext(`2d`)
    _this.canvas.setAttribute(`width`, `500`)
    _this.canvas.setAttribute(`height`, `500`)
    _this.canvasWidth = _this.canvas.clientWidth
    _this.canvasHeight = _this.canvas.clientHeight

    _this.images.map((image, imageIndex) => {
      let htmlImg = new Image()
      htmlImg.addEventListener('load', function() {
        console.log('loaded')
        _this.ctx.drawImage(htmlImg, 0, 0, htmlImg.naturalWidth, htmlImg.naturalHeight, 0, 0, _this.canvasWidth, _this.canvas.clientHeight)
        const currImageData = _this.ctx.getImageData(0, 0, _this.canvasWidth, _this.canvas.clientHeight)
        _this.imageData[imageIndex] = JSON.parse(JSON.stringify(currImageData))
      }, false);
      htmlImg.crossOrigin = "Anonymous"
      htmlImg.src = image.src
    })

    _this.canvas.addEventListener(`mousemove`,   _this.handleMouse)
    window.addEventListener(`deviceorientation`, _this.handleOrientation)
  }

  // Redraw canvas
  this.redraw = (balance) => {
    const imageData = _this.ctx.getImageData(0, 0, _this.canvasWidth, _this.canvasHeight)

    let data = imageData.data

    const stripWidth = 8

    for (let i = 0; i < data.length; i += 4) {
      const set = Math.floor(((((i / 4) % _this.canvasWidth) % stripWidth) / stripWidth) + (balance * _this.images.length))
      const setClamped = Math.min(Math.max(set, 0), _this.images.length)
        // console.log(setClamped)
      data[i]     = _this.imageData[setClamped].data[i]; // r
      data[i + 1] = _this.imageData[setClamped].data[i + 1]; // g
      data[i + 2] = _this.imageData[setClamped].data[i + 2]; // b
      data[i + 3] = _this.imageData[setClamped].data[i + 3]; // a
    }
    _this.ctx.putImageData(imageData, 0, 0, 0, 0, _this.canvasWidth, _this.canvasHeight)
  }

  this.handleMouse = (e) => {
    _this.redraw(e.offsetX / _this.canvasWidth)
  }
  this.handleOrientation = (e) => {
    const clamped = Math.max(Math.min(e.gamma, 45), -45)
    const balance = _this.remap(clamped, -45, 45, 0, 1)
    _this.redraw(balance)
  }
  this.remap = (value, inLow, inHigh, outLow, outHigh) => {
    return ( outLow + (value - inLow) * (outHigh - outLow) / (inHigh - inLow) )
  }
}

let lenticulars = document.querySelectorAll('[data-lenticular-list]')
let instances = []
// convert → array & loop through
;[...lenticulars].map((el, i) => {
  // store instance in array for further manipulation
  instances[i] = new Lenticula({container: el})
  // initialize instance
  instances[i].init()
})
