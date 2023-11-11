const fs = require("fs");

const readJsonFile = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

const writeJsonFile = (filePath, data) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
};

const filterFields = (data) => {
  return data.map(
    ({
      MULTIVERSEID,
      ARTIST,
      FLAVOR,
      FOREIGN_NAMES,
      PRINTINGS,
      ORIGINAL_TEXT,
      ORIGINAL_TYPE,
      SET,
      SET_NAME,
      NUMBER,
      LANGUAGE,
      GAME_FORMAT,
      WATERMARK,
      TIMESHIFTED,
      HAND,
      LIFE,
      RELEASE_DATE,
      STARTER,
      RESERVED,
      SOURCE,
      LEGALITY,
      LAYOUT,
      RULINGS,
      BORDER,
      ...rest
    }) => rest
  );
};

const splitJsonFile = (originalFilePath, numberOfFiles) => {
  let data = readJsonFile(originalFilePath);

  // Filter out the unwanted fields
  data = filterFields(data);

  const itemsPerFile = Math.ceil(data.length / numberOfFiles);

  for (let i = 0; i < numberOfFiles; i++) {
    const start = i * itemsPerFile;
    const end = start + itemsPerFile;
    const slicedData = data.slice(start, end);
    const newFileName = `split_data_part_${i + 1}.json`;
    writeJsonFile(newFileName, slicedData);
  }
};

const originalFilePath = "public/mtg_cards.json";
const numberOfFiles = 15;

splitJsonFile(originalFilePath, numberOfFiles);
