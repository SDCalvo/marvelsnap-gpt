import axios from "axios";
import { AssistantCreateParams } from "openai/resources/beta/assistants/assistants.mjs";

// Define an interface for MTG API Response to type-check the response data
interface MTGApiResponse {
  cards: MTGCard[];
  card?: MTGCard;
}

// Define an interface for the MTG Card to type-check each card in the response
export interface MTGCard {
  name: string;
  manaCost: string;
  cmc: number;
  colors: string[];
  colorIdentity: string[];
  type: string;
  supertypes: string[];
  types: string[];
  subtypes: string[];
  rarity: string;
  set: string;
  setName: string;
  text: string;
  flavor: string;
  artist: string;
  number: string;
  power: string;
  toughness: string;
  layout: string;
  multiverseid: number;
  imageUrl: string;
  rulings: { date: string; text: string }[];
  foreignNames: {
    name: string;
    text: string;
    flavor: string;
    imageUrl: string;
    language: string;
    multiverseid: number;
  }[];
  printings: string[];
  originalText: string;
  originalType: string;
  legalities: { format: string; legality: string }[];
  id: string;
  // ... (include any other properties provided by the MTG API)
}

class MTGAPITool {
  type: "function" = "function";
  function: AssistantCreateParams.AssistantToolsFunction.Function = {
    description:
      "Fetches a list of Magic: The Gathering cards with specified filters",
    name: "fetchMTGCards",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The card name",
          optional: true,
        },
        manaCost: {
          type: "string",
          description: "The mana cost of the card",
          optional: true,
        },
        cmc: {
          type: "number",
          description: "The converted mana cost of the card",
          optional: true,
        },
        colors: {
          type: "array",
          description: "The card colors",
          optional: true,
          items: {
            type: "string",
          },
        },
        colorIdentity: {
          type: "array",
          description: "The color identity of the card",
          optional: true,
          items: {
            type: "string",
          },
        },
        type: {
          type: "string",
          description: "The card type",
          optional: true,
        },
        types: {
          type: "array",
          description: "The card types",
          optional: true,
          items: {
            type: "string",
          },
        },
        subtypes: {
          type: "array",
          description: "The card subtypes",
          optional: true,
          items: {
            type: "string",
          },
        },
        rarity: {
          type: "string",
          description: "The rarity of the card",
          optional: true,
        },
        set: {
          type: "string",
          description: "The set the card belongs to (set code)",
          optional: true,
        },
        setName: {
          type: "string",
          description: "The full name of the set the card belongs to",
          optional: true,
        },
        text: {
          type: "string",
          description: "The text of the card",
          optional: true,
        },
        flavor: {
          type: "string",
          description: "The flavor text of the card",
          optional: true,
        },
        artist: {
          type: "string",
          description: "The artist of the card",
          optional: true,
        },
        number: {
          type: "string",
          description: "The card number",
          optional: true,
        },
        power: {
          type: "string",
          description: "The power of the card",
          optional: true,
        },
        toughness: {
          type: "string",
          description: "The toughness of the card",
          optional: true,
        },
        layout: {
          type: "string",
          description: "The layout of the card",
          optional: true,
        },
        multiverseid: {
          type: "number",
          description: "The multiverse ID of the card",
          optional: true,
        },
        imageUrl: {
          type: "string",
          description: "The image URL of the card",
          optional: true,
        },
        language: {
          type: "string",
          description: "The language of the card",
          optional: true,
        },
        page: {
          type: "number",
          description: "The page of data to request",
          optional: true,
        },
        pageSize: {
          type: "number",
          description: "The amount of data to return in a single request",
          optional: true,
        },
        legality: {
          type: "string",
          description:
            "The legality of the card for a given format (e.g., 'Legal', 'Banned', 'Restricted')",
          optional: true,
        },
      },
      required: [],
    },
  };
}

export default MTGAPITool;
