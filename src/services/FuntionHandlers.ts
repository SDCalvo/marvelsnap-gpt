import axios from "axios";

export type FunctionHandler = (args: any) => Promise<any>;

// Define a type for the object that holds the function handlers
type FunctionHandlersType = {
  [key: string]: FunctionHandler;
};

// You can define interfaces for better type checking and autocompletion
interface MarvelSnapCard {
  _id: string;
  name: string;
  type: string;
  cost: number;
  power: number;
  ability: string;
  added: string;
  status: string | null;
  image: string;
  variants: string[];
  source: string;
  created: string;
}

interface MarvelSnapApiResponse {
  limit: number;
  skip: number;
  total: number;
  data: MarvelSnapCard[];
}

// Function handler for fetching Marvel Snap cards
async function fetchMarvelSnapCards(filters: {
  limit?: number;
  skip?: number;
}): Promise<MarvelSnapApiResponse> {
  const options = {
    method: "GET",
    url: `https://${process.env.RAPID_MSNAP_ENDPOINT}`,
    params: filters,
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": process.env.RAPID_MSNAP_ENDPOINT,
    },
  };

  try {
    const response = await axios.request<MarvelSnapApiResponse>(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Marvel Snap cards:", error);
    throw error; // You can handle the error as per your application's error handling policy
  }
}

// Export an object containing all the handlers
const FunctionHandlers: FunctionHandlersType = {
  fetchMarvelSnapCards,
  // ... other handlers ...
};

export default FunctionHandlers;
