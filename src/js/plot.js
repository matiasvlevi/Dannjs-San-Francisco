let xs = [];
let ys = [];
let cs = [];
let ps = [];
// Map data for the display
function plotGraph() {
  if (houses.data.length > 0) {
    for (let i = 0; i < houses.data.length; i++) {
      xs[i] = map(houses.data[i].inputs[0], 0, zoom, 0, wnx);
      ys[i] = map(houses.data[i].inputs[1], 0, zoom, wny, 200);
      cs[i] = houses.data[i].inputs[8];
      ps[i] = houses.data[i].target[0];
    }
  }
}
// Map colors with a color scale
// Try the function on desmos:
// https://www.desmos.com/calculator/ycki0ogxqr
function mapColor(value) {
  let r = map(value, 0, 1, 0, 255);
  let g = map(value, 0, 1, 255, 0);
  let b = 255 - g - r;
  return { 
    r:r,
    g:g,
    b:b
  }
}
// Display a map or graph of all the training set samples.
// Red = High price
// Green = Low price
function pricesGraph() {
  for (let i = 0; i < houses.data.length; i++) {

    // Map colors
    let color = mapColor(ps[i]);

    // Render
    fill(color.r, color.g, color.b, 255);
    noStroke();
    ellipse(xs[i] + xoff, ys[i] + yoff, 2, 2);
  }
}
// Display a map or graph of all the training set sample
// And the neural network's guess on the testing houses.
function pricesGuessGraph() {
  pricesGraph();
  for (let i = 0; i < houses.testData.length / 3; i++) {
    // Map colors
    let color = mapColor(tprice[i]);

    fill(color.r, color.g, color.b, 255);
    stroke(0, 105);
    strokeWeight(1);
    let x = map(tlon[i], 0, zoom, 0, wnx);
    let y = map(tlat[i], 0, zoom, wny, 200);
    ellipse(x + xoff, y + yoff, 5, 5);
  }
}