import mongoose, { Schema, Model, Document } from "mongoose";
import { IKnowledgeBase } from "../types/knowledgeBase";

const knowledgeBaseSchema: Schema<IKnowledgeBase & Document> = new Schema(
  {
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const KnowledgeBase: Model<IKnowledgeBase & Document> = mongoose.model(
  "KnowledgeBase",
  knowledgeBaseSchema
);

export default KnowledgeBase;
