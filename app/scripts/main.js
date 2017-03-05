var Lenticula = function (options) {
  let _this = this

  // Config
  this.container = options.container
  this.imageData


  // Initialize
  this.init = () => {
    _this.images = [..._this.container.querySelectorAll(`img`)]
    _this.imageDataArray = [..._this.images]
    _this.container.innerHTML += `<canvas />`
    _this.canvas = _this.container.querySelector(`canvas`)
    _this.ctx = _this.canvas.getContext(`2d`)
    _this.canvas.setAttribute(`width`, `500`)
    _this.canvas.setAttribute(`height`, `500`)
    _this.canvasWidth = _this.canvas.clientWidth
    _this.canvasHeight = _this.canvas.clientHeight
    _this.imageData = _this.ctx.getImageData(0, 0, _this.canvasWidth, _this.canvasHeight)
    _this.stripWidth = 16

    _this.images.map((image, imageIndex) => {
      let htmlImg = new Image()
      htmlImg.addEventListener('load', function() {
        console.log('loaded')
        _this.ctx.drawImage(htmlImg, 0, 0, htmlImg.naturalWidth, htmlImg.naturalHeight, 0, 0, _this.canvasWidth, _this.canvas.clientHeight)
        const currImageData = _this.ctx.getImageData(0, 0, _this.canvasWidth, _this.canvas.clientHeight)
        _this.imageDataArray[imageIndex] = JSON.parse(JSON.stringify(currImageData))
      }, false);
      htmlImg.crossOrigin = "Anonymous"
      htmlImg.src = image.src
    })

    _this.canvas.addEventListener(`mousemove`,   _this.handleMouse)
    window.addEventListener(`deviceorientation`, _this.handleOrientation)
  }

  // Redraw canvas
  this.redraw = (balance) => {
    let data = _this.imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const set = ((((i / 4) % _this.canvasWidth) % _this.stripWidth) / _this.stripWidth) + (balance * _this.images.length)
      const setClamped = Math.min(Math.max(Math.floor(set), 0), (_this.images.length - 1))

      data[i]     = _this.imageDataArray[setClamped].data[i]     // r
      data[i + 1] = _this.imageDataArray[setClamped].data[i + 1] // g
      data[i + 2] = _this.imageDataArray[setClamped].data[i + 2] // b
      data[i + 3] = _this.imageDataArray[setClamped].data[i + 3] // a
    }
    _this.ctx.putImageData(_this.imageData, 0, 0, 0, 0, _this.canvasWidth, _this.canvasHeight)
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
