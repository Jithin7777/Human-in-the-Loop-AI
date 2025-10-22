import axios from "axios";
import type { KnowledgeItem } from "../../types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 7000
});

export const getKnowledge = async (): Promise<KnowledgeItem[]> => {
  const res = await API.get("/knowledgeBase");
  return res.data;
};

export const addOrUpdate = async (question: string, answer: string): Promise<void> => {
  await API.post("/knowledgeBase", { question, answer });
};
