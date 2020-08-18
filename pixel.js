class Pixel {
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  grayscale() {
    return (this.r + this.g + this.b) / 3;
  }
}