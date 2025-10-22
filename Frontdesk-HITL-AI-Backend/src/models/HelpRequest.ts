import mongoose, { Schema, Model } from "mongoose";
import { IHelpRequest } from "../types/interfaces/IHelpRequest";
import { HelpRequestStatus } from "../types/enums/HelpRequestStatus";

const helpRequestSchema: Schema<IHelpRequest> = new Schema(
  {
    question: { type: String, required: true },
    customerId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(HelpRequestStatus),
      default: HelpRequestStatus.Pending,
    },
    resolvedAnswer: { type: String },
    supervisorReply: { type: String }, 
  },
  { timestamps: true }
);

const HelpRequest: Model<IHelpRequest> = mongoose.model<IHelpRequest>(
  "HelpRequest",
  helpRequestSchema
);

export default HelpRequest;
