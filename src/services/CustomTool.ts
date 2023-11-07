abstract class CustomTool {
  abstract name: string;
  abstract description: string;
  abstract parameters: object;
  abstract required: string[];

  toAssistantTool(): object {
    return {
      type: "function",
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: "object",
          properties: this.parameters,
          required: this.required,
        },
      },
    };
  }
}
