// CustomTool.ts

abstract class CustomTool {
  protected openAi;
  protected toolType: string;

  constructor(openAiClient: any, toolType: string) {
    this.openAi = openAiClient;
    this.toolType = toolType;
  }

  // Abstract method to create a tool configuration
  abstract createToolConfig(...args: any[]): any;

  // Method to add a tool to an assistant
  async addToAssistant(assistantId: string, toolConfig: any) {
    try {
      const assistantUpdateResponse = await this.openAi.beta.assistants.update({
        assistant_id: assistantId,
        tools: [...toolConfig],
      });
      return assistantUpdateResponse;
    } catch (error) {
      console.error(`Error adding ${this.toolType} tool to assistant:`, error);
      throw error;
    }
  }

  // Method to remove a tool from an assistant
  async removeFromAssistant(assistantId: string) {
    try {
      const assistantUpdateResponse = await this.openAi.beta.assistants.update({
        assistant_id: assistantId,
        tools: this.openAi.beta.assistants.tools.filter(
          (tool: any) => tool.type !== this.toolType
        ),
      });
      return assistantUpdateResponse;
    } catch (error) {
      console.error(
        `Error removing ${this.toolType} tool from assistant:`,
        error
      );
      throw error;
    }
  }

  // Method to handle the tool's output (could be extended for each specific tool)
  handleOutput(output: any) {
    // Default implementation could simply return the output or log it
    console.log(`Output from ${this.toolType}:`, output);
    return output;
  }

  // ... Additional methods common to all tools could be added here
}

export default CustomTool;
