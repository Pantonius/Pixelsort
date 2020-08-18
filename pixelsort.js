class Pixelsort {
  constructor(imageData) {
    this.imageData = imageData;
    this.pixels = [];

    this.stretch = {
      min: 2,
      max: this.imageData.width / 10
    }
    this.colorChannel = {
      red: { min: 0, max: 255},
      green: { min: 0, max: 255},
      blue: { min: 0, max: 255},
      alpha: { min: 0, max: 255}
    }
    this.toDark = true;

    this.loadPixels();

    this.onload = new function() {};
  }

  loadPixels() {
    this.pixels = [];
    for(let i = 0; i < this.imageData.data.length; i += 4) {
      let r = this.imageData.data[i];
      let g = this.imageData.data[i +1];
      let b = this.imageData.data[i +2];
      let a = this.imageData.data[i +3];
      this.pixels.push(new Pixel(r, g, b, a));
    }
  }

  loadImageData() {
    let newData = new ImageData(this.imageData.width, this.imageData.height);
    for(let i = 0; i < this.pixels.length; i++) {
      let index = i*4;
      newData.data[index] = this.pixels[i].r;
      newData.data[index +1] = this.pixels[i].g;
      newData.data[index +2] = this.pixels[i].b;
      newData.data[index +3] = this.pixels[i].a;
    }

    return new Promise((resolve, reject) => {
      resolve(newData);
    });
  }

  sort(x, y, w, h) {
    if(!x) x = 0;
    if(!y) y = 0;
    if(!w) w = this.imageData.width;
    if(!h) h = this.imageData.height;

    let subPixels = [];
    for(let sY = y; sY < h; sY++) {
      for(let sX = x; sX < w; sX++) {
        subPixels.push(this.pixels[this.getIndex(sX, sY)]);
      }
    }

    let end = 0;
    let limit = subPixels.length;
    while(end < limit) {
      let width = Math.round(Math.random() * (this.stretch.max - this.stretch.min) + this.stretch.min);
      let start = end;

      end += width;

      if(end > limit) {
        end = limit;
      }

      let stretch = subPixels.slice(start, end);

      stretch.sort((a, b) => {
        if( b.r >= this.colorChannel.red.min   && b.r <= this.colorChannel.red.max    &&
            b.g >= this.colorChannel.green.min && b.g <= this.colorChannel.green.max  &&
            b.b >= this.colorChannel.blue.min  && b.b <= this.colorChannel.blue.max   &&
            b.a >= this.colorChannel.alpha.min && b.a <= this.colorChannel.alpha.max  &&
            a.r >= this.colorChannel.red.min   && a.r <= this.colorChannel.red.max    &&
            a.g >= this.colorChannel.green.min && a.g <= this.colorChannel.green.max  &&
            a.b >= this.colorChannel.blue.min  && a.b <= this.colorChannel.blue.max   &&
            a.a >= this.colorChannel.alpha.min && a.a <= this.colorChannel.alpha.max)
          
              if(this.toDark) {
                return b.grayscale() - a.grayscale();
              } else {
                return a.grayscale() - b.grayscale();
              }
      
              return 0;
      });

      for(let j = start; j < end; j++) {
        subPixels[j] = stretch[j - start];
      }
    }

    for(let sY = 0; sY < (h - y); sY++) {
      for(let sX = 0; sX < (w - x); sX++) {
        this.pixels[this.getIndex(sX + x, sY + y)] = subPixels[this.getIndex(sX, sY, w, h)];
      }
    }
  }

  getIndex(x, y, width, height) {
    if(!width) width = this.imageData.width;
    
    if(!height) height = this.imageData.height;
    
    if(x < 0 || y < 0 || x > width || y > height) {
      return -1;
    }
  
    return x + y * width;
  }
}