// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { FileCreateParams } from "openai/resources/files.mjs";

type UploadResponse = {
  fileId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method === "POST") {
    // Define the path to the CSV file
    const csvFilePath = path.join(process.cwd(), "public", "your-csv-file.csv");

    // Create an OpenAI client instance (assuming OPENAI_API_KEY is set in your environment variables)
    const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
      // Create a read stream for the CSV file
      const fileStream = fs.createReadStream(csvFilePath);

      // Define the file creation parameters
      const fileCreateParams: FileCreateParams = {
        file: fileStream, // Use the read stream as the file parameter
        purpose: "assistants",
      };

      // Upload the file to OpenAI
      const fileObject = await openAiClient.files.create(fileCreateParams);
      const fileId = fileObject.id; // Get the file ID from the response

      // Respond with the file ID
      res.status(200).json({ fileId });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Error uploading file" });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
