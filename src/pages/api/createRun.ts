// This code would be part of your API routes in Next.js (e.g., pages/api/create-run.ts)

import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createRunEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { threadId, assistantId, model } = req.body;

  // Instantiate your service
  const service = new AssistantService();

  try {
    const run = await service.createRun(
      threadId,
      assistantId,
      model ? model : undefined
    );
    res.status(200).json(run);
  } catch (error: any) {
    console.error("Failed to create run:", error);
    res.status(500).json({ error: error?.message });
  }
}
