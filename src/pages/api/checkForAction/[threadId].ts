// pages/api/check-for-action/[threadId].ts

import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

// Assuming AssistantService is properly typed in its definition

export default async function checkForAction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const assistantService = new AssistantService();
    const { threadId } = req.query;

    if (typeof threadId !== "string") {
      res.status(400).json({ error: "threadId must be a string" });
      return;
    }

    const actionRequired = assistantService.getFrontendAction(threadId);

    if (actionRequired) {
      // Optionally, you can clear the action after retrieving it
      assistantService.clearFrontendAction(threadId);

      res.status(200).json({ action: actionRequired });
    } else {
      res.status(200).json({ action: null });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method Not Allowed");
  }
}
