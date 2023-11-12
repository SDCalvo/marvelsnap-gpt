export type FunctionHandler = (args: any) => Promise<any>;

const mtg = require("mtgsdk");

// Function handler for fetching MTG cards
async function fetchMTGCards(filters: any) {
  try {
    delete filters.page;
    delete filters.pageSize;
    console.log("Assistant Function: Fetching cards with filters:", filters);
    console.log(`Type of filters: ${typeof filters}`);
    const cards = await mtg.card.where(filters);
    console.log("Assistant Function: Number of cards fetched:", cards.length);
    return cards;
  } catch (error: any) {
    console.error("Assistant Function: Error fetching MTG cards:", error.error);
    return {
      cards: `Error fetching cards: using ${JSON.stringify(
        filters
      )}, filters provided are not valid.`,
    };
  }
}

const FunctionHandlers: Record<string, FunctionHandler> = {
  fetchMTGCards,
};

export default FunctionHandlers;
