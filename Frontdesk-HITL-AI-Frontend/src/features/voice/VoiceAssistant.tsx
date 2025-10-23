import React, { useState, useEffect } from "react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { useLiveKit } from "../../hooks/useLiveKit";
import {
  Mic,
  MicOff,
  Play,
  CheckCircle,
  StopCircle,
  Volume2,
  User,
  Bot,
  Lightbulb,
} from "lucide-react";
import { getResolvedRequests } from "../helpRequests/helpRequest.service";
import { Button } from "../../components/ui/button";
import type { ResolvedAnswer } from "../../types/index";

const VoiceAssistant: React.FC = () => {
  const [customerId] = useState(() => {
    let id = localStorage.getItem("customerId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("customerId", id);
    }
    return id;
  });

  const { isConnected, joinLiveKit, leaveLiveKit, localTrack, publishTTS } =
    useLiveKit();

  const { listening, heard, reply, startSTT, stopSTT } = useSpeechRecognition({
    customerId,
    liveKitTrack: localTrack,
    publishTTS,
  });

  const [resolvedAnswers, setResolvedAnswers] = useState<ResolvedAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch resolved answers from backend
  useEffect(() => {
    const fetchResolved = async () => {
      try {
        setIsLoading(true);
        const data = await getResolvedRequests(customerId);
        setResolvedAnswers(data);
      } catch (err) {
        console.error("Failed to fetch resolved answers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResolved();
  }, [customerId]);

  const handleStartAssistant = async () => {
    setIsLoading(true);
    try {
      await joinLiveKit();
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListening = () => {
    if (listening) {
      stopSTT();
    } else {
      startSTT();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Volume2 className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Voice Assistant</h1>
        </div>
        <p className="text-gray-600">
          Speak naturally and get instant AI-powered responses
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="font-medium text-gray-700">
              {isConnected ? "Assistant Active" : "Assistant Offline"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle
              size={16}
              className={isConnected ? "text-green-500" : "text-gray-400"}
            />
            <span>LiveKit</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!isConnected ? (
            <Button
              onClick={handleStartAssistant}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              size="lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play size={20} />
              )}
              {isLoading ? "Starting..." : "Start Assistant"}
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                onClick={leaveLiveKit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all"
              >
                <StopCircle size={20} />
                Stop Assistant
              </Button>

              <Button
                onClick={handleToggleListening}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 ${
                  listening
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {listening ? (
                  <>
                    <MicOff size={20} />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    Start Listening
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        <div className="text-center space-y-2">
          {!isConnected ? (
            <p className="text-gray-600 text-sm">
              Click "Start Assistant" to begin your conversation
            </p>
          ) : listening ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-ping" />
              Listening... Speak now
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              Ready to listen. Click the microphone when you're ready to speak.
            </p>
          )}
        </div>
      </div>

      {(heard || reply) && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
            <Bot size={20} className="text-blue-600" />
            Current Conversation
          </h3>

          {heard && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <User size={16} className="text-blue-600" />
                <span className="font-medium">You:</span>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-gray-800">{heard}</p>
              </div>
            </div>
          )}

          {reply && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Bot size={16} className="text-green-600" />
                <span className="font-medium">Assistant:</span>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-gray-800">{reply}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conversation History */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-purple-600" />
          Conversation History
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Loading history...</p>
          </div>
        ) : resolvedAnswers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Volume2 size={32} className="mx-auto mb-2 opacity-50" />
            <p>No conversations yet. Start talking to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {resolvedAnswers.map((r, idx) => (
              <div
                key={idx}
                className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded-r-lg"
              >
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <User size={14} className="text-blue-600" />
                    <span className="font-medium text-sm">Question:</span>
                  </div>
                  <p className="text-gray-800 ml-6">{r.question}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Bot size={14} className="text-green-600" />
                    <span className="font-medium text-sm">Answer:</span>
                  </div>
                  <p className="text-gray-800 ml-6">{r.resolvedAnswer}</p>
                </div>

                {r.supervisorReply && (
                  <div className="flex items-center gap-2 text-yellow-700 mt-2">
                    <User size={14} className="text-yellow-600" />
                    <span className="font-medium text-sm">Supervisor:</span>
                    <p className="ml-2">{r.supervisorReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        role="note"
        className="max-w-xl mx-auto flex justify-center items-center text-sm text-gray-700 bg-blue-100 rounded-lg p-4 shadow-sm"
      >
        <p className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" aria-hidden="true" />
          <strong>Tip:</strong> Speak clearly and naturally. The AI will
          understand and respond to your questions in real-time.
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
