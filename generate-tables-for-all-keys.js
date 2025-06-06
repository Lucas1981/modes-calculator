const fs = require("fs");
const { outputTable } = require("./functions.js");

(function generateTablesForAllKeys() {
  const rawData = fs.readFileSync("./output/major-modes-chords.json", "utf8");
  const data = JSON.parse(rawData);

  Object.entries(data).map(([key, records]) => {
    console.log(`For the key of: ${key}`);
    outputTable(records);
    console.log("\n");
  });
})();
