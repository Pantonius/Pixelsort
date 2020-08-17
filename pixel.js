class Pixel {
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.isEdge = false;
  }

  grayscale() {
    return (this.r + this.g + this.b) / 3;
  }
}