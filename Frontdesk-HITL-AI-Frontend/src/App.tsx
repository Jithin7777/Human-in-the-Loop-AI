import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
        <AppRoutes />
      </main>
    </>
  );
};

export default App;
