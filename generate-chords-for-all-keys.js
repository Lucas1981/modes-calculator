const fs = require("fs");
const { applyTemplate, getModes, rearrange } = require("./functions.js");

const keys = ["Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#", "G#"];

(function getChordsForAllKeys() {
  const rawTemplate = fs.readFileSync("./output/template.json", "utf8");
  const template = JSON.parse(rawTemplate);
  const rawData = fs.readFileSync("./output/scales-and-chords.json", "utf8");
  const data = JSON.parse(rawData);
  const result = {};

  for (const baseNote of keys) {
    const modes = getModes(baseNote, data);
    const applied = applyTemplate(template, modes);
    result[baseNote] = applied;
  }

  console.log(JSON.stringify(result, null, 2));
})();
