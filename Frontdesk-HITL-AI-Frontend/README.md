# 🤖 Frontdesk-HITL-AI (Human-in-the-Loop System)

A simulated **Human-in-the-Loop AI Supervisor** system for a salon, built for the **Frontdesk Engineering Test**.  
This project demonstrates how an AI receptionist can intelligently **escalate to a human supervisor**, **learn from their response**, and **update its knowledge base** automatically.



When the AI agent receives a customer call:
- If it knows the answer → responds immediately.
- If it doesn’t → says *“Let me check with my supervisor”* and creates a **help request**.
- A human supervisor views pending requests on the dashboard and replies.
- The AI then:
  - Follows up with the customer.
  - Updates its **knowledge base** so it can answer next time.


  ## ⚙️ Tech Stack

### **Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Axios (API calls)
- pnpm (package manager)

### **Backend**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- LiveKit
- pnpm (package manager)


## 🚀 Getting Started

### **1️⃣ Clone the repository**
```bash
git clone git@github.com:Jithin7777/Human-in-the-Loop-AI.git
cd Human-in-the-Loop-AI
```
```bash
cd Frontdesk-HITL-AI-Backend
pnpm install
pnpm run dev
```

```bash
cd Frontdesk-HITL-AI-Backend
pnpm install
pnpm dev
```