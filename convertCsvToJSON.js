const csv = require("csv-parser");
const fs = require("fs");

const csvFilePath = "public/mtg_cards.csv";
const jsonFilePath = "public/mtg_cards.json";

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    fs.writeFile(
      jsonFilePath,
      JSON.stringify(results, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("An error occurred:", err);
          return;
        }
        console.log(
          "CSV file has been converted to JSON and saved to",
          jsonFilePath
        );
      }
    );
  });
