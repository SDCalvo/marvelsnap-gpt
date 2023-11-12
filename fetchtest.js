const mtg = require("mtgsdk");
const fs = require("fs");

// Function handler for fetching MTG cards
async function fetchMTGCards(filters) {
  try {
    console.log("Standalone Script: Fetching cards with filters:", filters);
    const cards = await mtg.card.where(filters);
    console.log("Standalone Script: Number of cards fetched:", cards.length);
    return { cards };
  } catch (error) {
    console.error("Standalone Script: Error fetching MTG cards:");
    return;
  }
}

// Main function
async function main() {
  console.log(fs.readFileSync("filters.json", "utf8"));
  const filters = fs.readFileSync("filters.json", "utf8");
  await fetchMTGCards(filters);
}

main();
