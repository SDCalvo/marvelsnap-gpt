//api/createThread.ts

import OpenAIAssistantClient from "@/lib/openAiClient";
import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Instantiate the AssistantService
  const assistantService = new AssistantService();

  // Check if it's a POST request
  if (req.method === "POST") {
    try {
      // Extract data from the request body
      const { messages, fileIds } = req.body;

      // Call the createThread method
      const thread = await assistantService.createThread(messages, fileIds);

      // Return the created thread
      res.status(200).json(thread);
    } catch (error: any) {
      // Handle any errors
      res.status(500).json({ statusCode: 500, message: error?.message });
    }
  } else {
    // If not a POST request, return 405 Method Not Allowed
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
