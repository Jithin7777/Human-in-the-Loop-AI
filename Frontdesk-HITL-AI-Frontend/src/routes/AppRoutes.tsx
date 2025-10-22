import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const HelpRequestList = lazy(() => import("../features/helpRequests/HelpRequestList"));
const KnowledgeBase = lazy(() => import("../features/knowledgeBase/KnowledgeBase"));
const VoiceAssistant = lazy(() => import("../features/voice/VoiceAssistant"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="py-10 text-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<HelpRequestList />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/voice" element={<VoiceAssistant />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
