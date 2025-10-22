import { Request, Response } from "express";
import KnowledgeBase from "../models/KnowledgeBase";

export const getAllQA = async (_req: Request, res: Response) => {
  try {
    const data = await KnowledgeBase.find();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addOrUpdateQA = async (req: Request, res: Response) => {
  const { question, answer } = req.body;
  if (!question || !answer)
    return res.status(400).json({ error: "Question and answer required" });

  try {
    await KnowledgeBase.updateOne({ question }, { answer }, { upsert: true });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
