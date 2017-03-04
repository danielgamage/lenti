[...Array(2).keys()].map((el, i, arr) => {
    let layer = document.querySelector(`#layer-${i + 1}`)
    let ctx = layer.getContext('2d')
    var img = new Image()
    img.crossOrigin = "Anonymous";
    img.src = `http://placekitten.com/700/500?image=${i + 1}`
    let ctxImageData
    img.onload = () => {
        ctx.drawImage(img, 0, 0)
        ctxImageData = ctx.getImageData(0,0,width, height)
    }
    const width = window.innerWidth
    const height = window.innerHeight
    layer.addEventListener("click", () => { redraw(ctxImageData, ctx, width, height) })
})
const redraw = (imageData, ctx, width, height) => {

    console.log(imageData)
    let data = imageData.data

    // only works if width is even num
    for (var i = 0; i < data.length; i += 8) {
      // data[i]     = 0; // red
      // data[i + 1] = 0; // green
      // data[i + 2] = 0; // blue
      data[i + 3] = 0; // alpha
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, width, height)
}
