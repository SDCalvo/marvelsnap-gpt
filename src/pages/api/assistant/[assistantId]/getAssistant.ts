//api/getAssistant.ts

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
      const { assistantId } = req.query;

      if (!assistantId) {
        throw new Error("Missing assistantId");
      }

      // Call the createAssistant method
      const assistant = await assistantService.getAssistant(
        assistantId as string
      );

      // Return the created assistant
      res.status(200).json(assistant);
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
