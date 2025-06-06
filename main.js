const fs = require("fs");
const {
  generateTable,
  getChords,
  getModes,
  outputTable,
} = require("./functions.js");

(function main() {
  const rawData = fs.readFileSync("./output/scales-and-chords.json", "utf8");
  const data = JSON.parse(rawData);
  const baseNote = "E";
  const modes = getModes(baseNote, data);
  const chords = getChords(data, modes);
  const table = generateTable(data[baseNote]["major"]["scale"], modes, chords);

  console.log("Modal scales");
  console.log(modes);
  console.log("\nChords");
  console.log(chords);
  console.log("\nChords as a table");
  outputTable(table);
})();
