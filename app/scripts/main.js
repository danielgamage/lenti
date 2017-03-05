var Lenticula = function (options) {
  let _this = this

  // Config
  this.container = options.container

  // Init
  this.init = () => {
    _this.images = [..._this.container.querySelectorAll(`img`)]
    _this.container.innerHTML += `<canvas />`
    _this.canvas = _this.container.querySelector(`canvas`)
    _this.ctx = _this.canvas.getContext(`2d`)
    const imageWidth = 720
    const imageHeight = 480
    let width = _this.canvas.clientWidth
    let height = _this.canvas.clientHeight

    _this.canvas.addEventListener("click", () => { _this.redraw(width, height) })
  }
  this.redraw = (width, height) => {
      _this.ctx.drawImage(_this.images[0], 0, 0, 700, 500, 0, 0, width, height)
      const imageData = _this.ctx.getImageData(0,0,width, height)

      console.log(imageData)
      let data = imageData.data

      // only works if width is even num
      for (var i = 0; i < data.length; i += 8) {
        data[i + 3] = 0; // alpha
      }
      _this.ctx.putImageData(imageData, 0, 0, 0, 0, width, height)
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
