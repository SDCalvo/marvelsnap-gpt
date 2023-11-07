export type FunctionHandler = (args: any) => Promise<any>;

const mtg = require("mtgsdk");

// Function handler for fetching MTG cards using the mtgsdk
async function fetchMTGCards(filters: any) {
  try {
    // Use the SDK's where method to fetch cards
    const cards = await mtg.card.where(filters);
    return { cards }; // Return the cards in an object to match the expected response format
  } catch (error) {
    console.error("Error fetching MTG cards:", error);
    throw error;
  }
}

// Export an object containing all the handlers
const FunctionHandlers: Record<string, FunctionHandler> = {
  fetchMTGCards,
};

export default FunctionHandlers;
