[...Array(2).keys()].map((el, i, arr) => {
    let layer = document.querySelector(`#layer-${i + 1}`)
    let ctx = layer.getContext('2d')
    let img = new Image()
    const imageWidth = 720
    const imageHeight = 480
    img.crossOrigin = "Anonymous";
    img.src = `http://placekitten.com/${imageWidth}/${imageHeight}?image=${i * 2}`
    let width
    let height
    let ctxImageData
    img.onload = () => {
        width = layer.clientWidth
        height = layer.clientHeight
        ctx.drawImage(img, 0, 0, 700, 500, 0, 0, width, height)
        ctxImageData = ctx.getImageData(0,0,width, height)
    }

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
