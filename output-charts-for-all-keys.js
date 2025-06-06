const fs = require("fs");
const { outputChart } = require("./functions.js");

(function outputChartsForAllKeys() {
  const rawData = fs.readFileSync("./major-modes-chords.json", "utf8");
  const data = JSON.parse(rawData);

  Object.entries(data).map(([key, records]) => {
    console.log(`For the key of: ${key}`);
    outputChart(records);
    console.log("\n");
  });
})();
