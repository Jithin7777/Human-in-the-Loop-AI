import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const HelpRequestsPage = lazy(() => import("../pages/HelpRequestsPage"));
const KnowledgeBasePage = lazy(() => import("../pages/KnowledgeBasePage"));
const VoiceAssistantPage = lazy(() => import("../pages/VoiceAssistantPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="py-10 text-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<HelpRequestsPage />} />
        <Route path="/knowledge" element={<KnowledgeBasePage />} />
        <Route path="/voice" element={<VoiceAssistantPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
