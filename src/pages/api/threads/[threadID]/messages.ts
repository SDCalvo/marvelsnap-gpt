// pages/api/threads/[threadId]/messages.js

import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getThreadMessagesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { threadId } = req.query;

    if (!threadId) {
      res.status(400).json({ error: "Missing threadId" });
      return;
    }

    // Instantiate your service
    const service = new AssistantService();

    try {
      const messages = await service.getMessagesFromThread(threadId as string);
      res.status(200).json(messages);
    } catch (error: any) {
      console.error("Failed to get messages from thread:", error);
      res.status(500).json({ error: error?.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
