const axios = require("axios");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs").promises;
const LAST_PAGE_FILE = "last_page.txt";

// CSV writer setup
const csvWriter = createObjectCsvWriter({
  path: "mtg_cards.csv",
  header: [
    { id: "name", title: "NAME" },
    { id: "layout", title: "LAYOUT" },
    { id: "cmc", title: "CMC" },
    { id: "colors", title: "COLORS" },
    { id: "colorIdentity", title: "COLOR_IDENTITY" },
    { id: "type", title: "TYPE" },
    { id: "supertypes", title: "SUPERTYPES" },
    { id: "types", title: "TYPES" },
    { id: "subtypes", title: "SUBTYPES" },
    { id: "rarity", title: "RARITY" },
    { id: "set", title: "SET" },
    { id: "setName", title: "SET_NAME" },
    { id: "text", title: "TEXT" },
    { id: "flavor", title: "FLAVOR" },
    { id: "artist", title: "ARTIST" },
    { id: "number", title: "NUMBER" },
    { id: "power", title: "POWER" },
    { id: "toughness", title: "TOUGHNESS" },
    { id: "loyalty", title: "LOYALTY" },
    { id: "language", title: "LANGUAGE" },
    { id: "gameFormat", title: "GAME_FORMAT" },
    { id: "legality", title: "LEGALITY" },
    { id: "id", title: "ID" },
    { id: "multiverseid", title: "MULTIVERSEID" },
    { id: "names", title: "NAMES" },
    { id: "manaCost", title: "MANA_COST" },
    { id: "imageUrl", title: "IMAGE_URL" },
    { id: "watermark", title: "WATERMARK" },
    { id: "border", title: "BORDER" },
    { id: "timeshifted", title: "TIMESHIFTED" },
    { id: "hand", title: "HAND" },
    { id: "life", title: "LIFE" },
    { id: "reserved", title: "RESERVED" },
    { id: "releaseDate", title: "RELEASE_DATE" },
    { id: "starter", title: "STARTER" },
    { id: "rulings", title: "RULINGS" },
    { id: "foreignNames", title: "FOREIGN_NAMES" },
    { id: "printings", title: "PRINTINGS" },
    { id: "originalText", title: "ORIGINAL_TEXT" },
    { id: "originalType", title: "ORIGINAL_TYPE" },
    { id: "legalities", title: "LEGALITIES" },
    { id: "source", title: "SOURCE" },
  ],
});

const baseUrl = "https://api.magicthegathering.io/v1/cards";

// Function to handle array fields and flatten them into strings
function processCardData(card) {
  // Join arrays of strings into comma-separated strings
  [
    "colors",
    "colorIdentity",
    "printings",
    "supertypes",
    "types",
    "subtypes",
  ].forEach((key) => {
    if (card[key]) {
      card[key] = card[key].join(", ");
    }
  });

  // Replace mana symbols with text
  if (card.manaCost) {
    card.manaCost = card.manaCost.replace(/{/g, "").replace(/}/g, "");
  }

  // Flatten nested arrays by joining their elements into a single string
  ["rulings", "foreignNames", "legalities"].forEach((key) => {
    if (card[key]) {
      card[key] = card[key]
        .map((obj) => Object.values(obj).join(": "))
        .join(" | ");
    }
  });

  // Handle names array
  if (card.names) {
    card.names = card.names.join(", ");
  }

  return card;
}

async function fetchCards(page = 1, pageSize = 100) {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        page,
        pageSize,
      },
    });

    // Extract headers
    const totalCount = parseInt(response.headers["total-count"], 10);
    const rateLimitRemaining = parseInt(
      response.headers["ratelimit-remaining"],
      10
    );

    // Log rate limit status
    console.log(`Rate Limit Remaining: ${rateLimitRemaining}`);

    // Check if we need to pause due to rate limiting
    if (rateLimitRemaining === 0) {
      // Handle rate limit reached scenario
      // You could pause the execution here and resume later
      console.log("Rate limit reached. Pausing execution.");
      // Save the current state, for example, to a file
      await writeLastPage(page);
      process.exit(); // Exit the process or implement a pause mechanism
    }

    return {
      cards: response.data.cards.map(processCardData),
      totalCount,
      rateLimitRemaining,
    };
  } catch (error) {
    console.error(`Error fetching cards on page ${page}:`, error);
    throw error;
  }
}

async function readLastPage() {
  try {
    const data = await fs.readFile(LAST_PAGE_FILE, "utf8");
    return parseInt(data, 10);
  } catch (error) {
    // If the file does not exist, start from page 1
    return 1;
  }
}

async function writeLastPage(page) {
  await fs.writeFile(LAST_PAGE_FILE, page.toString(), "utf8");
}

async function scrapeAllCards() {
  let page = await readLastPage();
  let hasMoreData = true;
  let totalCards;

  while (hasMoreData) {
    const { cards, totalCount, rateLimitRemaining } = await fetchCards(page);
    totalCards = totalCount; // update totalCards with the latest totalCount from response

    if (cards.length) {
      await csvWriter.writeRecords(cards);
      console.log(
        `Page ${page} written to CSV. Total cards saved: ${page * 100}`
      );
      page++;
      await writeLastPage(page);
    } else {
      hasMoreData = false;
    }

    // Log the progress
    console.log(
      `Progress: ${(((page - 1) * 100) / totalCards) * 100}% complete`
    );
    console.log(`Rate Limit Remaining: ${rateLimitRemaining}`);
  }

  console.log("Finished writing MTG card data to CSV.");
}

scrapeAllCards().catch(console.error);
