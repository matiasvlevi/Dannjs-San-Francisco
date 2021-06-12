
// -- Settings --

// Allow graphic Neural Network & other info
let detail = false;

// Log epochs in console
let logs = false;

// Display Ai guess on map
let map_ = true;

// Align data with canvas
let xoff = -500;
let yoff = 1100;
let zoom = 0.12;
// ------

// Dannjs Neural Network
let nn = new Dann(9,1);
nn.addHiddenLayer(8,'leakyReLU');
nn.addHiddenLayer(8,'leakyReLU');
nn.addHiddenLayer(6,'tanH');
nn.outputActivation('sigmoid');
nn.setLossFunction('mae');
nn.makeWeights();
nn.lr = 0.0001;
nn.log();

// Canvas
let wnx = 500;
let wny = 500;

// Graph
let losses = [];
let accuracies = [];


// p5js Setup
function setup() {
    // Graph (from ./src/js/graphics.js)
    g = new Graph(0,wny-100,wnx,100);
    g.min = 1;
    g.max = 0;
    g.step = houses.data.length;
    g.addValue(accuracies,color(246, 158, 123),"accuracy");
    g.addValue(losses,color(123, 211, 246),"loss");

    // Neural Network Graph (from ./src/js/graphics.js)
    netplot = new NetPlot(10,290,180,100,nn);

    // p5js canvas
    cn = createCanvas(wnx,wny);
    cn.parent('p5div');
    frameRate(60);
}

// p5js Draw
let graphFunc = pricesGraph;
function draw() {
    background(45,50,69);
    if (houses.data.length > 0) {
        train();
    }

    plotGraph();
    if (detail) {
        netplot.render();
        textInfo();
    }
    if (map_ == true) {
        graphFunc();
    }
    if (losses.length > 0) {
        graphFunc = pricesGuessGraph;
        fill(45,50,69)
        rect(0,wny-100,wnx,100)
        g.render();
    }
}
