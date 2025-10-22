import { Request, Response } from "express";
import { AccessToken } from "livekit-server-sdk";

export const getLiveKitToken = async (req: Request, res: Response) => {
  const { identity, roomName } = req.params;

  if (!identity || !roomName) {
    return res.status(400).json({ error: "identity and roomName required" });
  }

  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    console.error("Missing LiveKit environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // Create AccessToken
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity }
    );

    // Add room permissions
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    // Debug logging
    console.log("Generated token:", token);
    console.log("Identity:", identity);
    console.log("Room:", roomName);

    res.json({ token, roomName });
  } catch (err: any) {
    console.error("Error generating LiveKit token:", err);
    res.status(500).json({ error: "Failed to generate token: " + err.message });
  }
};
