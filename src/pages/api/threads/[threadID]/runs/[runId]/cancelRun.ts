// api/threads/[threadID]/runs/[runId]/cancelRun.ts

import { NextApiRequest, NextApiResponse } from "next";
import AssistantService from "@/services/Assistant";

export default async function cancelRun(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { threadId, runId } = req.query;

    const assistantService = new AssistantService();

    try {
      const run = await assistantService.cancelRun(
        threadId as string,
        runId as string
      );
      res.status(200).json(run);
    } catch (error) {
      console.error("Error canceling run:", error);
      res.status(500).json({ message: "Failed to cancel run" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
