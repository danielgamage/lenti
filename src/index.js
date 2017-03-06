/* global window */
class Lenti {
  constructor(options) {
    // Config
    this.container = options.container
    this.accelerometerEvents = options.accelerometerEvents || true
    this.mouseEvents = options.mouseEvents || true
    this.stripWidth = options.stripWidth || 16
    this.height = options.height || 50
    this.width = options.width || 50

    this.bindEvents = this.bindEvents.bind(this)
    this.init = this.init.bind(this)
    this.getImage = this.getImage.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.bindEvents = this.bindEvents.bind(this)
    this.destroy = this.destroy.bind(this)
    this.redraw = this.redraw.bind(this)
    this.handleMouse = this.handleMouse.bind(this)
    this.handleOrientation = this.handleOrientation.bind(this)
    this.remap = this.remap.bind(this)
  }

  // Initialize
  init() {
    this.images = [...this.container.querySelectorAll(`img`)]
    this.imageDataArray = [...Array(this.images.length).keys()] // empty array w/ same length as this.images
    this.container.innerHTML += `<canvas />`
    this.canvas = this.container.querySelector(`canvas`)
    this.ctx = this.canvas.getContext(`2d`)
    this.canvas.setAttribute(`width`, this.width)
    this.canvas.setAttribute(`height`, this.height)
    this.canvasWidth = this.canvas.clientWidth
    this.canvasHeight = this.canvas.clientHeight
    this.imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)

    this.images.map((imageEl, imageIndex) => {
      let htmlImg = new window.Image()
      htmlImg.addEventListener(`load`, function() {
        this.getImage(imageEl, imageIndex)
      }.bind(this))
      htmlImg.crossOrigin = `Anonymous`
      htmlImg.src = imageEl.src
      return imageEl
    })

    this.bindEvents()
  }

  getImage(image, imageIndex) {
    this.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, this.canvasWidth, this.canvas.clientHeight)
    const currImageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvas.clientHeight)
    this.imageDataArray[imageIndex] = JSON.parse(JSON.stringify(currImageData))
  }

  // Handle window resize
  handleResize() {
    this.canvasWidth = this.canvas.clientWidth
    this.canvasHeight = this.canvas.clientHeight
  }

  // Event Binding
  bindEvents() {
    if (this.mouseEvents) {
      this.canvas.addEventListener(`mousemove`, this.handleMouse)
    }
    if (this.accelerometerEvents) {
      window.addEventListener(`deviceorientation`, this.handleOrientation)
    }
    window.addEventListener(`resize`, this.handleResize)
  }

  // Event Unbinding
  destroy() {
    this.canvas.addEventListener(`mousemove`, this.handleMouse)
    window.addEventListener(`deviceorientation`, this.handleOrientation)
    window.removeEventListener(`resize`, this.handleResize)
  }

  // Redraw canvas
  redraw(balance) {
    // make sure data is loaded before redrawing
    if (this.imageDataArray[0]) {
      let data = this.imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const set = (i / 4 % this.canvasWidth % this.stripWidth / this.stripWidth) + (balance * this.images.length) - 0.5
        const setClamped = Math.floor(Math.min(Math.max(set, 0), this.images.length - 1))

        data[i + 0] = this.imageDataArray[setClamped].data[i + 0] // r
        data[i + 1] = this.imageDataArray[setClamped].data[i + 1] // g
        data[i + 2] = this.imageDataArray[setClamped].data[i + 2] // b
        data[i + 3] = this.imageDataArray[setClamped].data[i + 3] // a
      }
      this.ctx.putImageData(this.imageData, 0, 0, 0, 0, this.canvasWidth, this.canvasHeight)
    }
  }

  // Handle mouse events
  handleMouse(e) {
    this.redraw(e.offsetX / this.canvasWidth)
  }

  // Handle device accelerometer events
  handleOrientation(e) {
    const clamped = Math.max(Math.min(e.gamma, 45), -45)
    const balance = this.remap(clamped, -45, 45, 0, 1)
    this.redraw(balance)
  }

  // Map values from one range to another
  remap(value, inLow, inHigh, outLow, outHigh) {
    return outLow + ((value - inLow) * (outHigh - outLow) / (inHigh - inLow))
  }
}

export default Lenti
