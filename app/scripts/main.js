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

    _this.images.map((image, imageIndex) => {
      let htmlImg = new Image()
      htmlImg.addEventListener('load', function() {
        console.log('loaded')
        _this.ctx.drawImage(htmlImg, 0, 0, htmlImg.naturalWidth, htmlImg.naturalHeight, 0, 0, _this.canvas.clientWidth, _this.canvas.clientHeight)
        const currImageData = _this.ctx.getImageData(0, 0, _this.canvas.clientWidth, _this.canvas.clientHeight)
        _this.imageData[imageIndex] = JSON.parse(JSON.stringify(currImageData))
      }, false);
      htmlImg.crossOrigin = "Anonymous"
      htmlImg.src = image.src
    })

    _this.canvas.addEventListener("mousemove", _this.handleMouse)
  }

  // Redraw canvas
  this.redraw = (balance) => {
    const imageData = _this.ctx.getImageData(0, 0, _this.canvas.clientWidth, _this.canvas.clientHeight)

    let data = imageData.data

    const stripWidth = 16

    for (let i = 0; i < data.length; i += 4) {
      const set = ((i % stripWidth) >= (stripWidth * balance)) ? 1 : 0
      // need some end-of-line reset for larger strip widths

      data[i]     = _this.imageData[set].data[i]; // r
      data[i + 1] = _this.imageData[set].data[i + 1]; // g
      data[i + 2] = _this.imageData[set].data[i + 2]; // b
      data[i + 3] = _this.imageData[set].data[i + 3]; // a
    }
    _this.ctx.putImageData(imageData, 0, 0, 0, 0, _this.canvas.clientWidth, _this.canvas.clientHeight)
  }

  this.handleMouse = (e) => {
    _this.redraw(e.offsetX / _this.canvas.clientWidth)

  }
}

let lenticulars = document.querySelectorAll('[data-lenticular-list]');
let instances = [];
// convert → array & loop through
[...lenticulars].map((el, i) => {
  // store instance in array for further manipulation
  instances[i] = new Lenticula({container: el})
  // initialize instance
  instances[i].init()
})
