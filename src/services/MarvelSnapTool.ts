import axios from "axios";
import { CustomTool } from "./CustomTool"; // Assuming CustomTool is correctly defined elsewhere
import { AssistantCreateParams } from "path-to-your-openai-types"; // Ensure this path is correct

class MarvelSnapAPITool
  implements AssistantCreateParams.AssistantToolsFunction
{
  type: "function" = "function";
  function: AssistantCreateParams.AssistantToolsFunction.Function = {
    description: "Fetches a list of Marvel Snap cards with specified filters",
    name: "getMarvelSnapCards",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the card",
          optional: true,
        },
        type: {
          type: "string",
          description: "The type of the card (character, location, summon)",
          optional: true,
        },
        cost: {
          type: "number",
          description: "The cost of the card to play",
          optional: true,
        },
        upCost: {
          type: "number",
          description: "Upper range for card cost",
          optional: true,
        },
        downCost: {
          type: "number",
          description: "Lower range for card cost",
          optional: true,
        },
        power: {
          type: "number",
          description: "The power of the card",
          optional: true,
        },
        upPower: {
          type: "number",
          description: "Upper range for card power",
          optional: true,
        },
        downPower: {
          type: "number",
          description: "Lower range for card power",
          optional: true,
        },
        ability: {
          type: "string",
          description: "Search inside all abilities of any card",
          optional: true,
        },
        source: {
          type: "string",
          description: "The source of the card",
          optional: true,
        },
        added: {
          type: "string",
          description: "Date when the card was added",
          optional: true,
        },
        limit: {
          type: "number",
          description: "Limit the number of results returned",
          optional: true,
        },
        skip: {
          type: "number",
          description: "Number of results to skip for pagination",
          optional: true,
        },
        sort: {
          type: "string",
          description: "Sorting order of the results",
          optional: true,
        },
      },
      required: [], // List required parameters if any
    },
  };
}

export default MarvelSnapAPITool;
