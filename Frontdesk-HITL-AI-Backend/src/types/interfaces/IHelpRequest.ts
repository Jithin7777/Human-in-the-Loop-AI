import { Document } from "mongoose";
import { HelpRequestStatus } from "../enums/HelpRequestStatus";

export interface IHelpRequest extends Document {
  question: string;
  customerId: string;
  status: HelpRequestStatus;
  supervisorReply?: string;
  resolvedAnswer?: string;
}
