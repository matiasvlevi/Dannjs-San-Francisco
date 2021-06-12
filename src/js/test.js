let xs = [];
let ys = [];
let cs = [];
let ps = [];
let tlat = [];
let tlon = [];
let tprice = [];

/**
 * Ask the Dann model for a prediction with unknown data.
 * Returns the accuracy of the model.
 */
function test(log) {
  let sum = 0;
  let len = houses.testData.length / 3;
  for (let i = 0; i < len; i++) {
    // Randomize test samples to create moving dot effects 
    // ( not very accurate for a real ML application )
    let randomIndex = int(random(0, houses.testData.length));

    // Feed the model with the inputs to get a prediction
    let outs = nn.feedForward(houses.testData[randomIndex].inputs);

    // Save longitude & latitude values to display
    tlon[i] = houses.testData[randomIndex].inputs[0];
    tlat[i] = houses.testData[randomIndex].inputs[1];

    // save output prices in order to display
    tprice[i] = outs[0];

    // Compute accuracy
    let accuracy = outs[0] - houses.testData[randomIndex].target[0];
    if (accuracy < 0) {
      accuracy *= -1;
    }
    sum += accuracy;
  }
  // Average accuracy
  let accuracyPercentage = 1 - (sum / len);
  if (log == true) {
    console.log(
      "      Accuracy: " + round(accuracyPercentage * 1000 * 100) / 1000 + "%"
    );
  }
  return accuracyPercentage;
}



