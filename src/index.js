/* global window */
let Lenti = function (options) {
  let _this = this

  // Config
  this.container = options.container
  this.accelerometerEvents = options.accelerometerEvents || true
  this.mouseEvents = options.mouseEvents || true
  this.stripWidth = options.stripWidth || 16
  this.height = options.height || 50
  this.width = options.width || 50

  // Initialize
  this.init = () => {
    _this.images = [..._this.container.querySelectorAll(`img`)]
    _this.imageDataArray = [..._this.images]
    _this.container.innerHTML += `<canvas />`
    _this.canvas = _this.container.querySelector(`canvas`)
    _this.ctx = _this.canvas.getContext(`2d`)
    _this.canvas.setAttribute(`width`, _this.width)
    _this.canvas.setAttribute(`height`, _this.height)
    _this.canvasWidth = _this.canvas.clientWidth
    _this.canvasHeight = _this.canvas.clientHeight
    _this.imageData = _this.ctx.getImageData(0, 0, _this.canvasWidth, _this.canvasHeight)

    _this.images.map((image, imageIndex) => {
      let htmlImg = new window.Image()
      htmlImg.addEventListener(`load`, function () {
        console.log(`loaded`)
        _this.ctx.drawImage(htmlImg, 0, 0, htmlImg.naturalWidth, htmlImg.naturalHeight, 0, 0, _this.canvasWidth, _this.canvas.clientHeight)
        const currImageData = _this.ctx.getImageData(0, 0, _this.canvasWidth, _this.canvas.clientHeight)
        _this.imageDataArray[imageIndex] = JSON.parse(JSON.stringify(currImageData))
      }, false)
      htmlImg.crossOrigin = `Anonymous`
      htmlImg.src = image.src
      return true
    })

    _this.bindEvents()
  }

  // Handle window resize
  this.handleResize = () => {
    _this.canvasWidth = _this.canvas.clientWidth
    _this.canvasHeight = _this.canvas.clientHeight
  }

  // Event Binding
  this.bindEvents = () => {
    if (_this.mouseEvents) {
      _this.canvas.addEventListener(`mousemove`, _this.handleMouse)
    }
    if (_this.accelerometerEvents) {
      window.addEventListener(`deviceorientation`, _this.handleOrientation)
    }
    window.addEventListener(`resize`, _this.handleResize)
  }

  // Event Unbinding
  this.destroy = () => {
    _this.canvas.addEventListener(`mousemove`, _this.handleMouse)
    window.addEventListener(`deviceorientation`, _this.handleOrientation)
    window.removeEventListener(`resize`, _this.handleResize)
  }

  // Redraw canvas
  this.redraw = balance => {
    let data = _this.imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const set = i / 4 % _this.canvasWidth % _this.stripWidth / _this.stripWidth + balance * _this.images.length - 0.5
      const setClamped = Math.floor(Math.min(Math.max(set, 0), _this.images.length - 1))

      data[i + 0] = _this.imageDataArray[setClamped].data[i + 0] // r
      data[i + 1] = _this.imageDataArray[setClamped].data[i + 1] // g
      data[i + 2] = _this.imageDataArray[setClamped].data[i + 2] // b
      data[i + 3] = _this.imageDataArray[setClamped].data[i + 3] // a
    }
    _this.ctx.putImageData(_this.imageData, 0, 0, 0, 0, _this.canvasWidth, _this.canvasHeight)
  }

  // Handle mouse events
  this.handleMouse = e => {
    _this.redraw(e.offsetX / _this.canvasWidth)
  }

  // Handle device accelerometer events
  this.handleOrientation = e => {
    const clamped = Math.max(Math.min(e.gamma, 45), -45)
    const balance = _this.remap(clamped, -45, 45, 0, 1)
    _this.redraw(balance)
  }

  // Map values from one range to another
  this.remap = (value, inLow, inHigh, outLow, outHigh) => {
    return outLow + (value - inLow) * (outHigh - outLow) / (inHigh - inLow)
  }
}

export default Lenti
