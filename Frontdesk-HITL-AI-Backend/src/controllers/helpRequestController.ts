import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import HelpRequest from "../models/HelpRequest";
import KnowledgeBase from "../models/KnowledgeBase";
import { HelpRequestStatus } from "../types/enums/HelpRequestStatus";
import { salonPrompt } from "../prompts/salonPrompt";

export const askQuestion = async (req: Request, res: Response) => {
  const { question, customerId: incomingId } = req.body;
  const customerId = incomingId || uuidv4();
  const fallbackAnswer = salonPrompt.includes("If you don't know")
    ? "Let me check with my supervisor and get back to you."
    : "I'm not sure, please wait.";
  try {
    // Escape special regex characters like ?, ., + etc.
    const normalize = (text: string) =>
      text
        .trim()
        .toLowerCase()
        .replace(/[?.,!]/g, "");

    const normalizedQuestion = normalize(question);

    const kbEntries = await KnowledgeBase.find();
    const matchedEntry = kbEntries.find(
      (kb) => normalize(kb.question) === normalizedQuestion
    );

    if (matchedEntry) {
      return res.json({ answer: matchedEntry.answer });
    }
    const helpRequest = await HelpRequest.create({
      question,
      customerId,
      status: HelpRequestStatus.Pending,
    });

    console.log(`Supervisor Notification: ${question}`);

    const timeoutMinutes = parseInt(
      process.env.HELP_REQUEST_TIMEOUT_MINUTES || "5"
    );
    setTimeout(async () => {
      const reqPending = await HelpRequest.findById(helpRequest._id);
      if (reqPending && reqPending.status === HelpRequestStatus.Pending) {
        reqPending.status = HelpRequestStatus.Unresolved;
        await reqPending.save();
        console.log(`HelpRequest ${reqPending._id} marked as Unresolved.`);
      }
    }, timeoutMinutes * 60 * 1000);

    res.json({
      answer: fallbackAnswer,
      customerId,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const resolveQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!answer) return res.status(400).json({ error: "Answer required" });

  try {
    const helpRequest = await HelpRequest.findById(id);
    if (!helpRequest)
      return res.status(404).json({ error: "Request not found" });

    //Update help request
    helpRequest.status = HelpRequestStatus.Resolved;
    helpRequest.resolvedAnswer = answer;
    await helpRequest.save();

    //Update Knowledge Base
    await KnowledgeBase.updateOne(
      { question: helpRequest.question },
      { answer },
      { upsert: true }
    );

    // 3️ Notify customer
    console.log(
      ` AI Follow-up to Customer (${helpRequest.customerId}): "Hey! I checked with my supervisor — ${answer}"`
    );

    // 4️ Send confirmation to supervisor UI
    res.json({
      message: "Help request resolved successfully",
      resolvedAnswer: answer,
      customerId: helpRequest.customerId,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPendingRequests = async (_req: Request, res: Response) => {
  try {
    const pending = await HelpRequest.find({
      status: HelpRequestStatus.Pending,
    });

    res.json(pending);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

//  Add this function
export const getAllRequests = async (_req: Request, res: Response) => {
  try {
    const allRequests = await HelpRequest.find();
    res.json(allRequests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getResolvedRequests = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }

    // Include supervisorReply in the returned data
    const resolvedRequests = await HelpRequest.find({
      customerId,
      status: HelpRequestStatus.Resolved,
    }).select("question resolvedAnswer supervisorReply -_id");

    res.json(resolvedRequests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSupervisorReply = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { supervisorReply } = req.body;

  if (!supervisorReply)
    return res.status(400).json({ error: "Supervisor reply is required" });

  try {
    const helpRequest = await HelpRequest.findById(id);
    if (!helpRequest)
      return res.status(404).json({ error: "Request not found" });

    helpRequest.supervisorReply = supervisorReply;
    await helpRequest.save();

    res.json({ message: "Supervisor reply updated", supervisorReply });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
