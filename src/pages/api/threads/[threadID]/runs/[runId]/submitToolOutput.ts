import AssistantService from "@/services/Assistant";
import { NextApiRequest, NextApiResponse } from "next";

export default async function submitToolOutputsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { threadId, runId } = req.query;
    const { toolOutputs } = req.body;

    if (!threadId || !runId || !toolOutputs) {
      res
        .status(400)
        .json({ error: "Missing threadId, runId, or toolOutputs" });
      return;
    }

    const service = new AssistantService();

    try {
      // Submit the tool outputs
      await service.openAi.beta.threads.runs.submitToolOutputs(
        threadId as string,
        runId as string,
        {
          tool_outputs: toolOutputs,
        }
      );

      res.status(200).json({ message: "Tool outputs submitted successfully." });
    } catch (error: any) {
      console.error("Failed to submit tool outputs:", error);
      res.status(500).json({ error: error?.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
