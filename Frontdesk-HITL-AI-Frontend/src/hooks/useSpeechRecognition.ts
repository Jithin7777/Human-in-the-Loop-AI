import { useState, useEffect, useRef } from "react";
import { ask } from "../features/helpRequests/helpRequest.service";

type Props = {
  customerId: string;
  liveKitTrack: MediaStreamTrack | null;
  publishTTS: (text: string) => void;
};

export const useSpeechRecognition = ({
  customerId,
  liveKitTrack,
  publishTTS,
}: Props) => {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("");
  const recogRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!liveKitTrack) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }

    if (recogRef.current) return;

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setHeard(text);

      try {
        const res = await ask(text, customerId);
        const aiReply = res.answer;
        setReply(aiReply);

        publishTTS(aiReply);
      } catch (err) {
        console.error(err);
      }
    };

    recognition.onend = () => setListening(false);

    recogRef.current = recognition;

    return () => {
      recognition.stop();
      setListening(false);
    };
  }, [customerId, liveKitTrack, publishTTS]);

  const startSTT = () => {
    if (!recogRef.current || !liveKitTrack) return;
    recogRef.current.start();
    setListening(true);
  };

  const stopSTT = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  return { listening, heard, reply, startSTT, stopSTT };
};
