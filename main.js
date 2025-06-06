const fs = require("fs");
const {
  generateChart,
  getChords,
  getModes,
  outputChart,
} = require("./functions.js");

(function main() {
  const rawData = fs.readFileSync("./scales-and-chords.json", "utf8");
  const data = JSON.parse(rawData);
  const baseNote = "E";
  const modes = getModes(baseNote, data);
  const chords = getChords(data, modes);
  const chart = generateChart(data[baseNote]["major"]["scale"], modes, chords);

  // console.log("Modal scales");
  // console.log(modes);
  // console.log("\nChords");
  // console.log(chords);
  // console.log(chart);
  outputChart(chart);
})();
