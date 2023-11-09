import OpenAIAssistantClient from "../lib/openAiClient";
import axios from "axios";
import * as fs from "fs";
import FormData from "form-data";
import FunctionHandlers, { FunctionHandler } from "./FuntionHandlers";
import { RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs.mjs";

export interface IAction {
  runId: string;
  toolCall: string;
}

export interface IActionStore {
  [key: string]: IAction;
}

class AssistantService {
  public openAi;
  public actionsStore: IActionStore;

  constructor() {
    this.openAi = OpenAIAssistantClient.getClient();
    this.actionsStore = {};
  }

  async getConfig() {
    try {
      const data = await fs.promises.readFile("../config.json", "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading configuration file:", error);
      throw error;
    }
  }

  async updateConfig(assistantId: string) {
    try {
      const config = await this.getConfig();
      config.ASSISTANT_ID = assistantId;
      await fs.promises.writeFile(
        "../config.json",
        JSON.stringify(config, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Error writing to configuration file:", error);
      throw error;
    }
  }

  setFrontendAction(threadId: string, action: any) {
    this.actionsStore[threadId] = action;
  }

  getFrontendAction(threadId: string) {
    return this.actionsStore[threadId] || null;
  }

  clearFrontendAction(threadId: string) {
    delete this.actionsStore[threadId];
  }

  // Method to create an assistant
  async createAssistant(
    name: string,
    description: string,
    model: string = "gpt-4-1106-preview",
    additionalTools: any[] = []
  ) {
    // Check if the assistant already exists, if so, query for the assistant and return it
    const config = await this.getConfig();
    if (config.ASSISTANT_ID) {
      try {
        const assistant = await this.openAi.beta.assistants.retrieve(
          config.ASSISTANT_ID
        );
        return assistant;
      } catch (error) {
        console.error("Error retrieving assistant:", error);
        throw error;
      }
    }

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

      const uploadResponse = await this.openAi.files.create({
        file: fs.createReadStream(csvFilePath),
        purpose: "assistants",
      });

      // Extract the file ID from the response
      const fileId = uploadResponse.id;

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

  // Method to add a message to a thread
  async addMessageToThread(
    threadId: string,
    message: { role: "user"; content: string; file_ids?: string[] }
  ) {
    try {
      const response = await this.openAi.beta.threads.messages.create(
        threadId,
        {
          ...message,
        }
      );
      return response;
    } catch (error) {
      console.error("Error adding message to thread:", error);
      throw error;
    }
  }

  // Method to get messages from a run
  async getMessagesFromThread(threadId: string) {
    try {
      // Retrieve all messages from the thread
      const response = await this.openAi.beta.threads.messages.list(threadId);
      // Assuming the API returns a structured response with a data property that holds the messages
      const allMessages = response.data;

      return allMessages;
    } catch (error) {
      console.error("Error retrieving messages from thread:", error);
      throw error;
    }
  }

  async getRun(threadId: string, runId: string) {
    try {
      const run = await this.openAi.beta.threads.runs.retrieve(threadId, runId);
      return run;
    } catch (error) {
      console.error("Error retrieving run:", error);
      throw error;
    }
  }

  // Method to retrieve the status of a run
  async getRunStatus(threadId: string, runId: string) {
    try {
      const run = await this.openAi.beta.threads.runs.retrieve(threadId, runId);
      return run.status;
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

  // Orchestrator method that handles the run lifecycle
  async orchestrateRun(threadId: string, runId: string) {
    let run = await this.getRun(threadId, runId);

    // Poll the run status at a set interval until a terminal state is reached
    while (run.status === "queued" || run.status === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
      run = await this.getRun(threadId, runId);
    }

    // Handle required action if the run status is 'requires_action'
    if (
      run.status === "requires_action" &&
      run.required_action?.type === "submit_tool_outputs"
    ) {
      for (const toolCall of run.required_action.submit_tool_outputs
        .tool_calls) {
        if (this.isFrontendFunction(toolCall.function.name)) {
          // Notify frontend to execute the function
          await this.notifyFrontend(threadId, runId, toolCall);
          // Wait for the frontend to submit the output
          // This might involve polling a database or listening to a webhook
        } else {
          // Execute backend function
          const toolOutput = await this.executeFunction(
            runId,
            threadId,
            toolCall.id,
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );

          // Submit the tool output
          await this.openAi.beta.threads.runs.submitToolOutputs(
            threadId,
            runId,
            {
              tool_outputs: [
                { tool_call_id: toolCall.id, output: toolOutput.output },
              ],
            }
          );
        }
      }

      // Continue polling the run status until a terminal state is reached
      do {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
        run = await this.getRun(threadId, runId);
      } while (run.status === "queued" || run.status === "in_progress");
    }

    // Check for terminal states and handle accordingly
    if (run.status === "completed") {
      console.log("Run completed successfully.");
      return run;
    } else if (run.status === "failed") {
      console.error("Run failed:", run.last_error);
      throw new Error(`Run failed: ${run.last_error?.message}`);
    } else if (run.status === "expired") {
      console.error("Run expired.");
      throw new Error("Run expired.");
    } else if (run.status === "cancelled") {
      console.error("Run was cancelled.");
      throw new Error("Run was cancelled.");
    } else {
      console.error("Unknown run status:", run.status);
      throw new Error(`Unknown run status: ${run.status}`);
    }
  }

  // Helper method to determine if a function call is for the frontend
  isFrontendFunction(functionName: string) {
    // Implement your logic to determine if it's a frontend function
    return functionName.startsWith("frontend_");
  }

  // Method to notify the frontend
  async notifyFrontend(threadId: string, runId: string, toolCall: any) {
    // Prepare the action detail
    const actionDetail = {
      runId,
      toolCall,
      // Add any other details you need
    };

    // Store the action
    this.setFrontendAction(threadId, actionDetail);
  }

  async executeFunction(
    runId: string,
    threadId: string,
    toolCallId: string,
    functionName: string,
    args: any
  ): Promise<RunSubmitToolOutputsParams.ToolOutput> {
    try {
      // Map the function name to a handler
      const functionResult = await this.handleFunctionCall(functionName, args);

      // Convert the function result to a string if necessary
      // The API expects the output to be a string, so you should stringify the result
      const output = JSON.stringify(functionResult);

      // Prepare the tool output for submission
      const toolOutput: RunSubmitToolOutputsParams.ToolOutput = {
        tool_call_id: toolCallId,
        output: output, // This is now a string
      };

      // Submit the tool output to the Assistant API
      await this.openAi.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: [toolOutput],
      });

      // Return the tool output in the correct format
      return toolOutput;
    } catch (error) {
      console.error(`Error executing function ${functionName}:`, error);
      throw error;
    }
  }

  // A method that handles the actual function call
  private async handleFunctionCall(
    functionName: string,
    args: any
  ): Promise<any> {
    const handler: FunctionHandler | undefined = FunctionHandlers[functionName];
    if (handler) {
      return handler(args);
    } else {
      throw new Error(`No handler defined for function: ${functionName}`);
    }
  }
}

export default AssistantService;
