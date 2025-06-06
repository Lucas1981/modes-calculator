const fs = require("fs");

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];

// Key name index
const keyIndex = [
  [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
  ],
  [2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2],
];

const calculateDistance = (note1, note2) => {
  // First get the base distance between the two notes.
  const base = note1.charAt(0);
  const dest = note2.charAt(0);

  let start = keyIndex[0].indexOf(base);
  const end = keyIndex[0].indexOf(dest, start);
  let dist = 0;

  while (start < end) {
    dist += keyIndex[1][start];
    start++;
  }

  // Then, add or subtract based on the flats and sharps
  const baseSharps = note1.split("#").length - 1;
  const baseFlats = note1.split("b").length - 1;
  const destSharps = note2.split("#").length - 1;
  const destFlats = note2.split("b").length - 1;

  return dist - baseSharps + baseFlats + destSharps - destFlats;
};

const symbolMap = {
  dominantSeventh: "7",
  majorSeventh: "maj7",
  minorSeventh: "m7",
  halfDiminishedSeventh: "°",
};

const rearrange = (arr, order) => {
  const firstHalf = arr.slice(0, order);
  const secondHalf = arr.slice(order);
  return [...secondHalf, ...firstHalf];
};

const getModes = (baseNote, data) => {
  // Get the "mirror image" of the base scale, which is a minor sixth above the base note
  const minorThird = data[baseNote]["minor"]["scale"][5];

  const unorderedMirrorScale = data[minorThird]["major"]["scale"];

  // Rearrange so we get the order right
  const mirrorScale = rearrange(unorderedMirrorScale, 2); // Rearranging to start from the minor third

  // Get all the modes of the base scale
  return mirrorScale.map((note) => {
    const scale = data[note]["major"]["scale"];
    const order = scale.indexOf(baseNote);
    return rearrange(scale, order);
  });
};

const getChords = (data, modes) =>
  modes.map((mode, modeIndex) => {
    const doubleMode = [...mode, ...mode];
    return mode.map((note, noteIndex) => {
      const notes = [];
      for (let i = 0; i < 4; i++) {
        notes.push(doubleMode[noteIndex + i * 2]);
      }

      const chord = data[mode[modeIndex]]["major"]["chords"][
        "seventhChords"
      ].find((chord) =>
        chord.notes.every((chordNote) => notes.includes(chordNote))
      );

      return `${note}${symbolMap[chord.name]}`;
    });
  });

const generateChart = (scale, modes, chords) => {
  const results = {
    I: new Array(modes.length).fill(null),
    bII: new Array(modes.length).fill(null),
    II: new Array(modes.length).fill(null),
    bIII: new Array(modes.length).fill(null),
    III: new Array(modes.length).fill(null),
    IV: new Array(modes.length).fill(null),
    bV: new Array(modes.length).fill(null),
    V: new Array(modes.length).fill(null),
    bVI: new Array(modes.length).fill(null),
    VI: new Array(modes.length).fill(null),
    bVII: new Array(modes.length).fill(null),
    VII: new Array(modes.length).fill(null),
  };

  chords.forEach((mode, modeIndex) => {
    mode.forEach((chord, chordIndex) => {
      const romanNumeral = romanNumerals[chordIndex];
      const distance = calculateDistance(
        scale[chordIndex],
        modes[modeIndex][chordIndex]
      );
      let key = romanNumeral;

      if (distance === -1) key = `b${key}`;
      // This next line feels a little dirty to map it, but it works for now
      if (distance === 1)
        key = `b${romanNumerals[(chordIndex + 1) % romanNumerals.length]}`;

      results[key][modeIndex] = chord;
    });
  });

  return results;
};

const applyTemplate = (template, modes) => {
  const result = {};
  modes.forEach((mode, modeIndex) => {
    let noteIndex = 0;
    Object.entries(template).forEach(([roman, arr]) => {
      if (!result[roman]) {
        result[roman] = [];
      }

      result[roman].push(
        arr[modeIndex] === null ? null : `${mode[noteIndex++]}${arr[modeIndex]}`
      );
    });
  });

  return result;
};

const outputChart = (chart) => {
  console.log("\nModes:\tI\tII\tIII\tIV\tV\tVI\tVII");
  Object.entries(chart).forEach(([key, value]) => {
    const manipulatedValue = rearrange(value.reverse(), 6);
    console.log(
      `${key}: ${manipulatedValue.map((chord) => `\t${chord || " "}`).join("")}`
    );
  });
};

module.exports = {
  applyTemplate,
  generateChart,
  getChords,
  getModes,
  rearrange,
  outputChart,
};
