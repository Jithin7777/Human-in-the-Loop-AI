import express from "express";
import {
  askQuestion,
  resolveQuestion,
  getPendingRequests,
  getAllRequests,
  getResolvedRequests,
  updateSupervisorReply,
} from "../controllers/helpRequestController";

const router = express.Router();

router.post("/ask", askQuestion);
router.post("/resolve/:id", resolveQuestion);
router.get("/pending", getPendingRequests);
router.get("/all", getAllRequests);
router.get("/resolved/:customerId", getResolvedRequests);
router.put("/:id/supervisor-reply", updateSupervisorReply);

export default router;
