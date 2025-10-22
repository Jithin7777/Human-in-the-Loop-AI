import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { connectDB } from "./config/db";
import helpRequestsRoute from "./routes/helpRequests";
import knowledgeBaseRoute from "./routes/knowledgeBase";
import livekitRoute from "./routes/liveKit";

const app = express();

app.use(cors());
app.use(bodyParser.json());
connectDB(process.env.MONGO_URI!);
app.use("/api/helpRequests", helpRequestsRoute);
app.use("/api/knowledgeBase", knowledgeBaseRoute);
app.use("/api/livekit", livekitRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
