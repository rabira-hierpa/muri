import { populationPrediction } from "../helpers";
/* eslint-disable no-restricted-globals */
self.name = "populationPrediction.worker";

self.onmessage = (event) => {
  const { population, growthRate, years } = event.data;
  let populationPrediction: populationPrediction[] = [];
  let tempPop = population;
  let i = 1;

  // set the loop to delay by 5 seconds using setTimeout
  const process = setInterval(() => {
    if (i <= years) {
      const result = tempPop * (1 + growthRate / 100);
      tempPop = result;
      populationPrediction.push(Math.floor(result));
      console.log(`Calculated result for year ${i} is ${populationPrediction}`);
      i += 1;
    } else {
      // clear the interval
      clearInterval(process);
      self.postMessage(populationPrediction);
    }
  }, 500);
};
