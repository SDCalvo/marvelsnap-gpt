// pages/api/threads/[threadId]/runs/[runId]/steps.ts

import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listRunSteps(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { threadId, runId } = req.query;

    const assistantService = new AssistantService();

    try {
      const runSteps = await assistantService.listRunSteps(
        threadId as string,
        runId as string
      );
      res.status(200).json(runSteps);
    } catch (error) {
      console.error("Error retrieving run steps:", error);
      res.status(500).json({ message: "Failed to retrieve run steps" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method Not Allowed");
  }
}
