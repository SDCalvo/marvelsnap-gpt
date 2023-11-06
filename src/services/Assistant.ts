import { FileCreateParams } from "openai/resources/files.mjs";
import OpenAIAssistantClient from "../lib/openAiClient";
import path from "path";
import axios from "axios";
import * as fs from "fs";
import FormData from "form-data";

class AssistantService {
  private openAi;

  constructor() {
    this.openAi = OpenAIAssistantClient.getClient();
  }

  // Method to create an assistant
  async createAssistant(
    name: string,
    description: string,
    model: string,
    additionalTools: any[] = []
  ) {
    // Define the default tools
    const defaultTools = [{ type: "code_interpreter" }, { type: "retrieval" }];

    // Combine the default tools with any additional tools passed as parameters
    const combinedTools = [...defaultTools, ...additionalTools];

    // The path to the CSV file in the public folder (adjust the filename as needed)
    const csvFilePath = "public/your-csv-filename.csv"; // This path should be relative to the public directory

    try {
      // Make a request to the upload API endpoint
      const formData = new FormData();
      formData.append("file", fs.createReadStream(csvFilePath)); // This is a Node.js example. Adjust if needed for your frontend logic.

      // Replace `apiBaseUrl` with the actual base URL of your Next.js API routes
      const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";
      const uploadResponse = await axios.post(
        `${apiBaseUrl}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract the file ID from the response
      const fileId = uploadResponse.data.fileId;

      // Create the assistant with the file ID included
      const assistant = await this.openAi.beta.assistants.create({
        name: name,
        description: description,
        model: model,
        tools: combinedTools,
        file_ids: [fileId], // Use the uploaded file ID
      });

      return assistant;
    } catch (error) {
      console.error("Error creating assistant or uploading file:", error);
      throw error;
    }
  }

  // Method to create a thread
  async createThread(messages: any[], fileIds: string[]) {
    try {
      const thread = await this.openAi.beta.threads.create({
        messages: messages.map((message) => ({
          ...message,
          file_ids: fileIds,
        })),
      });
      return thread;
    } catch (error) {
      console.error("Error creating thread:", error);
      throw error;
    }
  }

  // Method to retrieve a message from a thread
  async retrieveMessage(threadId: string, messageId: string) {
    try {
      const message = await this.openAi.beta.threads.messages.retrieve(
        threadId,
        messageId
      );
      return message;
    } catch (error) {
      console.error("Error retrieving message:", error);
      throw error;
    }
  }

  async createRun(
    threadId: string,
    assistantId: string,
    model?: string,
    instructions?: string,
    tools?: any[]
  ) {
    try {
      const run = await this.openAi.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        model: model,
        instructions: instructions,
        tools: tools,
      });
      return run;
    } catch (error) {
      console.error("Error creating run:", error);
      throw error;
    }
  }

  // Method to retrieve the status of a run
  async getRunStatus(threadId: string, runId: string) {
    try {
      const run = await this.openAi.beta.threads.runs.retrieve(threadId, runId);
      return run;
    } catch (error) {
      console.error("Error retrieving run status:", error);
      throw error;
    }
  }

  // Method to cancel a run
  async cancelRun(threadId: string, runId: string) {
    try {
      const run = await this.openAi.beta.threads.runs.cancel(threadId, runId);
      return run;
    } catch (error) {
      console.error("Error cancelling run:", error);
      throw error;
    }
  }

  // Add more methods to handle messages, runs, and run steps...
}

export default AssistantService;
