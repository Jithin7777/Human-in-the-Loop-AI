import express from "express";
import { getAllQA, addOrUpdateQA } from "../controllers/knowledgeBaseController";

const router = express.Router();

router.get("/", getAllQA);
router.post("/", addOrUpdateQA);

export default router;
