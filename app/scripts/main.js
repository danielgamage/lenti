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
        _this.imageData[imageIndex] = _this.ctx.getImageData(0, 0, _this.canvas.clientWidth, _this.canvas.clientHeight)
      }, false);
      htmlImg.crossOrigin = "Anonymous"
      htmlImg.src = image.src
    })

    _this.canvas.addEventListener("click", () => { _this.redraw() })
  }

  // Redraw canvas
  this.redraw = () => {
    console.log(_this.imageData)
    const imageData = _this.ctx.getImageData(0, 0, _this.canvas.clientWidth, _this.canvas.clientHeight)

    let data = imageData.data

    // only works if width is even num
    for (var i = 0; i < data.length; i += 8) {
      data[i + 3] = 0; // alpha
    }
    _this.ctx.putImageData(imageData, 0, 0, 0, 0, _this.canvas.clientWidth, _this.canvas.clientHeight)
  }
}

var lenticulars = document.querySelectorAll('[data-lenticular-list]');
var instances = [];
// convert → array & loop through
[...lenticulars].map((el, i) => {
  // store instance in array for further manipulation
  instances[i] = new Lenticula({container: el})
  // initialize instance
  instances[i].init()
})
