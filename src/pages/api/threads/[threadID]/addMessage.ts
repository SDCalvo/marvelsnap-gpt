// pages/api/threads/[threadId]/add-message.js

import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function addMessageToThread(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { threadID } = req.query;
    const { content } = req.body;
    if (!content || !threadID) {
      res.status(400).json({ error: "Missing content or threadId" });
      return;
    }

    const service = new AssistantService();

    try {
      // Add the message to the thread
      const messageResponse = await service.addMessageToThread(
        threadID as string,
        {
          role: "user", // role must be 'user' for messages sent by the user
          content: content,
        }
      );

      // Retrieve the configuration to get the assistant ID
      const config = await service.getConfig();
      const assistantId = config.ASSISTANT_ID;

      if (!assistantId) {
        throw new Error("Assistant ID is not configured.");
      }

      // Start a run with the assistant
      const run = await service.createRun(threadID as string, assistantId);

      // Handle the run lifecycle
      const runResult = await service.orchestrateRun(
        threadID as string,
        run.id
      );

      // Retrieve the updated messages from the thread after the run completes
      const updatedMessages = await service.getMessagesFromThread(
        threadID as string
      );

      const finalResult = {
        messages: updatedMessages,
        run: runResult,
      };

      // Respond with the updated messages
      res.status(200).json(finalResult);
    } catch (error: any) {
      console.error("Failed to process message and run:", error);
      res.status(500).json({ error: error?.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
