export type HelpStatus = "Pending" | "Resolved" | "Unresolved";

export interface HelpRequest {
  _id: string;
  question: string;
  customerId?: string;
  status: HelpStatus;
  resolvedAnswer?: string;
  supervisorReply?: string; 
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeItem {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResolvedAnswer {
  question: string;
  resolvedAnswer: string;
  supervisorReply?: string;
}