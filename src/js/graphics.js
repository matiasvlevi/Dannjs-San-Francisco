let dragged = false;

//Color Functions & values
function colorGradientFunc(x) {
  return 1 / (1 + exp(-2 * x));
}
function colorGradientFunc2(x) {
  return 1 / (1 + exp(-10 * (x - 0.5)));
}
// Graph a Dann model
class NetPlot {
  constructor(x, y, w, h, nn) {
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
    this.nn = nn;
    this.spacingY = h / (this.nn.i - 1);
    this.layerSpacing = w / (this.nn.Layers.length - 1);
    this.bufferY = this.spacingY / 2;
    this.size = 8;
    this.frame = false;
    this.wColors = [
      [255, 60, 0],
      [0, 195, 255],
    ];
    this.contourColor = color(0,0,0);
  }
  renderWeights() {
    stroke(this.contourColor);
    for (let i = 0; i < this.nn.Layers.length; i++) {
      let layer = this.nn.Layers[i];

      this.spacingY = this.h / layer.size;
      this.bufferY = this.spacingY / 2;

      if (i !== this.nn.Layers.length - 1) {
        let nextLayer = this.nn.Layers[i + 1];
        let sY = this.h / nextLayer.size;
        let bY = sY / 2;

        for (let j = 0; j < nextLayer.size; j++) {
          let x = this.pos.x + (i + 1) * this.layerSpacing;
          let y = this.pos.y + bY + j * sY;
          let x2 = 0;
          let y2 = 0;

          for (let k = 0; k < layer.size; k++) {
            let weights = this.nn.weights[i].matrix;
            x2 = this.pos.x + i * this.layerSpacing;
            y2 = this.pos.y + this.bufferY + k * this.spacingY;
            stroke(this.mapColor(colorGradientFunc(weights[j][k])));
            strokeWeight(
              map(sqrt(int(weights[j][k] * 1000) / 1000), 0, 2, 1, 2)
            );
            line(x, y, x2, y2);
          }
        }
      }
    }
  }
  renderLayers() {
    fill(255);
    noStroke();

    for (let i = 0; i < this.nn.Layers.length; i++) {
      let layer = this.nn.Layers[i];
      this.spacingY = this.h / layer.size;
      this.bufferY = this.spacingY / 2;
      for (let j = 0; j < layer.size; j++) {
        let x = this.pos.x + i * this.layerSpacing;
        let y = this.pos.y + this.bufferY + j * this.spacingY;
        let col = this.mapColor(colorGradientFunc(layer.layer.matrix[j][0]));
        fill(col);
        ellipse(x, y, this.size, this.size);
      }
    }
  }
  mapColor(x) {
    let color1 = this.wColors[0];
    let color2 = this.wColors[1];
    let r = map(x, 0, 1, color2[0], color1[0]);
    let g = map(x, 0, 1, color2[1], color1[1]);
    let b = map(x, 0, 1, color2[2], color1[2]);
    return color(r, g, b);
  }
  render() {
    noFill();
    stroke(this.contourColor);
    if (this.frame == true) {
      rect(this.pos.x, this.pos.y, this.w, this.h);
    }

    if (
      dragged &&
      mouseX >= this.pos.x &&
      mouseX <= this.pos.x + this.w &&
      mouseY >= this.pos.y &&
      mouseY <= this.pos.y + this.h
    ) {
      this.pos.x = mouseX - this.w / 2;
      this.pos.y = mouseY - this.h / 2;
    }
    this.renderWeights();
    this.renderLayers();
  }
}
// 2D Graph for lists of values
class Graph {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
    this.s = 1;
    this.min = 1;
    this.max = 0;
    this.lines = [];
    this.names = [];
    this.color = [];
    this.dragged = false;
    this.contourColor = color(0,0,0);
    this.grid = 4;
    this.step = 0;
  }
  addValue(x, color, name) {
    this.color.push(color);
    this.lines.push(x);
    this.names.push(name);
  }
  render() {
    noFill();
    strokeWeight(1);
    stroke(this.contourColor.levels[0], this.contourColor.levels[1], this.contourColor.levels[2], 80);

    for (let i = 0; i < this.grid; i++) {
      let y = (this.h / this.grid) * i;
      line(this.pos.x, y + this.pos.y, this.pos.x + this.w, y + this.pos.y);
    }
    stroke(this.contourColor);
    rect(this.pos.x, this.pos.y, this.w, this.h);
    if (
      dragged &&
      mouseX >= this.pos.x &&
      mouseX <= this.pos.x + this.w &&
      mouseY >= this.pos.y &&
      mouseY <= this.pos.y + this.h
    ) {
      this.pos.x = mouseX - this.w / 2;
      this.pos.y = mouseY - this.h / 2;
    }
    for (let a = 0; a < this.lines.length; a++) {
      stroke(this.color[a]);
      beginShape();
      if (this.lines[a].length / int(this.s) >= this.w * int(this.s)) {
        this.s *= 2;
      }

      for (
        let i = 0;
        i < int(this.lines[a].length / int(this.s));
        i += int(this.s)
      ) {
        let x = i / int(this.s) + this.pos.x;
        let y = map(
          this.lines[a][i * int(this.s)],
          this.min,
          this.max,
          this.pos.y,
          this.pos.y + this.h
        );
        vertex(x, y);
      }
      endShape();
      noStroke();
      fill(this.color[a]);
      rect(
        this.pos.x + this.w - (this.pos.x + this.w) / 6,
        a * 20 + 10 + this.pos.y,
        20,
        10
      );
      text(
        this.names[a],
        this.pos.x + this.w - (this.pos.x + this.w) / 6 + 23,
        a * 20 + 19 + this.pos.y
      );
      noFill();
    }
    stroke(this.contourColor);
    let div = 1;
    if (this.s >= 8) {
      div = 10;
    }
    let length = int(this.w / (this.step / pow(this.s, 2)) / div);
    for (let i = 0; i < length; i++) {
      if (this.s >= 8) {
      }
      let x = (this.step / pow(this.s, 2)) * (i * div) + this.pos.x;
      let y = this.pos.y + this.h;
      line(x, y, x, y - 5);
    }
    noStroke();
  }
}

// Text detail information
function textInfo() {
  fill(246, 158, 123)
  text('Epoch: ' + nn.epoch, 10,260);
  text('Accuracy: ' + round(accuracies[accuracies.length-1] * 1000)/10 + "%", 10,275);
}