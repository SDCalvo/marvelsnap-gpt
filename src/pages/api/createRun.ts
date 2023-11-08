import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function messageAndOrchestrateEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { threadId, assistantId, model, userMessage } = req.body;

  // Instantiate your service
  const service = new AssistantService();

  try {
    // Add the user message to the thread
    await service.addMessageToThread(threadId, userMessage);

    // Create a new run
    const run = await service.createRun(
      threadId,
      assistantId,
      model ? model : undefined
    );

    // Orchestrate the run and wait for it to complete
    const finalRunState = await service.orchestrateRun(threadId, run.id);

    // Get the assistant's response messages
    const messages = await service.getMessagesFromRun(threadId, run.id);

    // Respond with the messages from the run
    res.status(200).json({ run: finalRunState, messages });
  } catch (error: any) {
    console.error("Failed to create and orchestrate run:", error);
    res.status(500).json({ error: error?.message });
  }
}
