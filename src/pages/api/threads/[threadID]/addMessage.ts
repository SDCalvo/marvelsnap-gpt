// pages/api/threads/[threadId]/add-message.js

import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function addMessageToThread(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { threadId } = req.query;
    const { content } = req.body;
    if (!content || !threadId) {
      res.status(400).json({ error: "Missing content or threadId" });
      return;
    }
    // Instantiate your service
    const service = new AssistantService();

    try {
      const response = await service.addMessageToThread(threadId as string, {
        role: "user", // role must be 'user' for messages sent by the user
        content: content,
      });
      res.status(200).json(response);
    } catch (error: any) {
      console.error("Failed to add message to thread:", error);
      res.status(500).json({ error: error?.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
