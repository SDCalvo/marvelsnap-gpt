// api/[threadID]/getThread.ts

import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Instantiate the AssistantService
  const assistantService = new AssistantService();

  // Check if it's a GET request
  if (req.method === "GET") {
    try {
      // Extract data from the request body
      const { threadId } = req.query;

      if (!threadId) {
        throw new Error("Missing threadId");
      }

      // Call the createAssistant method
      const thread = await assistantService.getThread(threadId as string);

      // Return the created assistant
      res.status(200).json(thread);
    } catch (error: any) {
      // Handle any errors
      res.status(500).json({ statusCode: 500, message: error?.message });
    }
  } else {
    // If not a GET request, return 405 Method Not Allowed
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
