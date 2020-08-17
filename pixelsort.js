var imageData;

var minWidth = 2;
var maxWidth = imageData.width / 10;

function getIndex(x, y) {
  if(x < 0 || y < 0 || x > imageData.width-1 || y > imageData.height-1) {
    return -1;
  }

  return x + y * imageData.width;
}

function pixelsort() {
  let pixels = [];
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for(let i = 0; i < imageData.data.length; i += 4) {
    let r = imageData.data[i];
    let g = imageData.data[i +1];
    let b = imageData.data[i +2];
    let a = imageData.data[i +3];
    pixels.push(new Pixel(r, g, b, a));
  }

  stretchSort(pixels);
  
  let newData = new ImageData(imageData.width, imageData.height);
  for(let i = 0; i < pixels.length; i++) {
    let index = i*4;
    newData.data[index] = pixels[i].r;
    newData.data[index +1] = pixels[i].g;
    newData.data[index +2] = pixels[i].b;
    newData.data[index +3] = pixels[i].a;
  }

  return newData;
}

function stretchSort(pixels) {
  let start = 0;
  let end = 0;
  while(end < pixels.length-1) {
    let width = Math.round(Math.random() * (maxWidth - minWidth) + minWidth);
    start = end + 1;
    end = start + width;

    if(end >= pixels.length)
      end = pixels.length-1;

    let stretch = pixels.slice(start, end);

    stretch.sort((a, b) => {
      let min = 25;
      if(b.b > min && a.b > min)
        return b.grayscale() - a.grayscale();
      
      return 0;
    });

    for(let j = start; j < end; j++) {
      pixels[j] = stretch[j - start];
    }
  }
}