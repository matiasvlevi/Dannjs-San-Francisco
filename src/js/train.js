
/**
 * Train the Dann model with the training dataset.
 * Saves the loss value,
 * Saves the test accuracy
 */
let trainIndex = 0;
function train(epoch = 1) {

  // save dataset length
  let len = houses.data.length;

  // Train multiple epochs
  for (let e = 0; e < epoch; e++) {

    // Log
    if (logs == true) {
      console.log("Epoch :" + nn.epoch);
    }

    // Train 1 epoch
    let sum = 0;
    for (let i = 0; i < len; i++) {
      nn.backpropagate(
        houses.data[i].inputs,
        houses.data[i].target
      );
      sum += nn.loss;
    }

    // Save average epoch loss
    losses.push(sum/len);

    // Save epoch's accuracy with testing dataset
    let result = test(logs);
    accuracies.push(result);

    // Increment the Dann model's epoch
    nn.epoch++;
  }
}
