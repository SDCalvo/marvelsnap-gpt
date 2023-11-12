// pages/api/config.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const configPath = path.join(process.cwd(), "config.json");

  try {
    const configData = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configData);
    res.status(200).json(config);
  } catch (error) {
    console.error("Error reading config file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
