import express from "express";
import { getLiveKitToken } from "../controllers/livekitController";

const router = express.Router();
router.get("/get-token/:identity/:roomName", getLiveKitToken);

export default router;
