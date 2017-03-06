/* global window */
class Lenti {
  constructor (options) {
    // Config
    this.container = options.container
    this.accelerometerEvents = options.accelerometerEvents || true
    this.mouseEvents = options.mouseEvents || true
    this.stripWidth = options.stripWidth || 16
    this.height = options.height || 50
    this.width = options.width || 50

    this.bindEvents = this.bindEvents.bind(this)
    this.init = this.init.bind(this)
    this.sampleImages = this.sampleImages.bind(this)
    this.getImage = this.getImage.bind(this)
    this.handleSizing = this.handleSizing.bind(this)
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
    this.handleSizing()
    this.bindEvents()
  }

  // Sample image
  sampleImages () {
    this.images.map((imageEl, imageIndex) => {
      if (this.imageDataArray[0]) {
        this.getImage(imageEl, imageIndex)
      } else {
        let htmlImg = new window.Image()
        htmlImg.addEventListener(`load`, function () {
          this.getImage(imageEl, imageIndex)
        }.bind(this))
        htmlImg.crossOrigin = `Anonymous`
        htmlImg.src = imageEl.src
        return imageEl
      }
    })
  }
  getImage (image, imageIndex) {
    this.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)
    const currImageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
    // slice is much faster than spread ([...]) or json.parse(json.stringify()) at copying, but performs a shallow copy
    this.imageDataArray[imageIndex] = currImageData.data.slice()
  }

  // Handle window resize
  handleSizing () {
    // use offsetWidth bc clientWidth = 0 when resizing
    this.canvasWidth = this.canvas.offsetWidth
    this.canvasHeight = this.canvasWidth * (this.height / this.width)
    this.canvas.setAttribute(`width`, this.canvasWidth)
    this.canvas.setAttribute(`height`, this.canvasHeight)
    // Resample images
    // careful on the fire rate here.
    this.sampleImages()
    this.imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
  }

  // Event Binding
  bindEvents () {
    if (this.mouseEvents) {
      this.canvas.addEventListener(`mousemove`, this.handleMouse)
    }
    if (this.accelerometerEvents) {
      window.addEventListener(`deviceorientation`, this.handleOrientation)
    }
    window.addEventListener(`resize`, this.handleSizing)
  }

  // Event Unbinding
  destroy () {
    this.canvas.addEventListener(`mousemove`, this.handleMouse)
    window.addEventListener(`deviceorientation`, this.handleOrientation)
    window.removeEventListener(`resize`, this.handleSizing)
  }

  // Redraw canvas
  redraw (balance) {
    // make sure data is loaded before redrawing
    if (this.imageDataArray[0]) {
      let data = this.imageData.data
      const dataArray = this.imageDataArray
      const canvasWidth = this.canvasWidth
      const stripWidth = this.stripWidth
      const imageCount = this.imageCount

      const addOn = (balance * imageCount) - 0.5

      for (let i = 0; i < data.length; i += 4) {
        const set = (i / 4 % canvasWidth % stripWidth / stripWidth) + addOn
        const setClamped = Math.floor(Math.min(Math.max(set, 0), imageCount - 1))

        data[i + 0] = dataArray[setClamped][i + 0] // r
        data[i + 1] = dataArray[setClamped][i + 1] // g
        data[i + 2] = dataArray[setClamped][i + 2] // b
        data[i + 3] = dataArray[setClamped][i + 3] // a
      }

      this.ctx.putImageData(this.imageData, 0, 0, 0, 0, this.canvasWidth, this.canvasHeight)
    }
  }

  // Handle mouse events
  handleMouse (e) {
    this.redraw(e.offsetX / this.canvasWidth)
  }

  // Handle device accelerometer events
  handleOrientation (e) {
    const clamped = Math.max(Math.min(e.gamma, 45), -45)
    const balance = this.remap(clamped, -45, 45, 0, 1)
    this.redraw(balance)
  }

  // Map values from one range to another
  remap (value, inLow, inHigh, outLow, outHigh) {
    return outLow + ((value - inLow) * (outHigh - outLow) / (inHigh - inLow))
  }
}

export default Lenti
