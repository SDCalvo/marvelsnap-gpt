import { OpenAI } from "openai";

class OpenAIAssistantClient {
  private static instance: OpenAI | null = null;

  public static getClient(): OpenAI {
    if (!OpenAIAssistantClient.instance) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "OpenAI API key is not defined in environment variables"
        );
      }
      OpenAIAssistantClient.instance = new OpenAI({
        apiKey: apiKey,
      });
    }
    return OpenAIAssistantClient.instance;
  }
}

export default OpenAIAssistantClient;
