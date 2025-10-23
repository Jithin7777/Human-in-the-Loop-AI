import axios from "axios";
import type { HelpRequest } from "../../types/index";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 7000,
});

export const getPending = async (): Promise<HelpRequest[]> => {
  const res = await API.get("/helpRequests/pending");
  return res.data;
};

export const getAllRequests = async (): Promise<HelpRequest[]> => {
  const res = await API.get("/helpRequests/all");
  return res.data;
};

export const ask = async (
  question: string,
  customerId?: string
): Promise<{ answer: string; customerId?: string }> => {
  const res = await API.post("/helpRequests/ask", { question, customerId });
  return res.data;
};

export const resolveRequest = async (
  id: string,
  answer: string
): Promise<HelpRequest> => {
  const res = await API.post(`/helpRequests/resolve/${id}`, { answer });
  return res.data;
};

export const getResolvedRequests = async (
  customerId: string
): Promise<
  { question: string; resolvedAnswer: string; supervisorReply?: string }[]
> => {
  const res = await API.get(`/helpRequests/resolved/${customerId}`);
  return res.data;
};
