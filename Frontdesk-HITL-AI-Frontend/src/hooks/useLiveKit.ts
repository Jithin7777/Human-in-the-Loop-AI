import { useState, useRef } from "react";
import { Room, createLocalAudioTrack, LocalAudioTrack } from "livekit-client";
import axios from "axios";
import { ENV } from "../config/env";

export const useLiveKit = () => {
  const roomRef = useRef<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localTrack, setLocalTrack] = useState<MediaStreamTrack | null>(null);

  const joinLiveKit = async () => {
    const identity = `user-${Math.random().toString(36).slice(2, 8)}`;
    const roomName = "salonRoom";

    try {
      const res = await axios.get(
        `${ENV.API_BASE_URL}/livekit/get-token/${identity}/${roomName}`
      );
      const token = res.data.token;
      if (!token) throw new Error("No token returned");

      const room = new Room();
      await room.connect(ENV.LIVEKIT_URL!, token, { autoSubscribe: true });
      roomRef.current = room;
      setIsConnected(true);

      room.on("trackSubscribed", (track, _publication, participant) => {
        if (track.kind === "audio") {
          console.log("Remote audio received from:", participant.identity);
          const audioEl = document.createElement("audio");
          audioEl.autoplay = true;
          audioEl.srcObject = new MediaStream([track.mediaStreamTrack]);
          document.body.appendChild(audioEl);
        }
      });

      room.on("disconnected", () => {
        setIsConnected(false);
        roomRef.current = null;
        setLocalTrack(null);
      });

      const localAudioTrack: LocalAudioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
      });
      await room.localParticipant.publishTrack(localAudioTrack);
      setLocalTrack(localAudioTrack.mediaStreamTrack);

      alert("Connected to LiveKit & mic published.");
    } catch (err) {
      console.error("LiveKit error:", err);
      alert("LiveKit connection failed — using STT fallback.");
    }
  };

  const leaveLiveKit = async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      setIsConnected(false);
      roomRef.current = null;
      setLocalTrack(null);
    }
  };

 
  const publishTTS = async (text: string) => {
    if (!roomRef.current) return;
    console.log("Playing AI reply locally:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return { isConnected, joinLiveKit, leaveLiveKit, localTrack, publishTTS };
};
