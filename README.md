<div align="center">

<img src="https://raw.githubusercontent.com/George-Abboud/AutoHub/main/frontend/public/favicon.svg" width="80" alt="AutoHub Logo" />

# AutoHub

**Visual Automation Workflow Builder with AI Intelligence**

Design, compose, and execute multi-node automation pipelines through an intuitive drag-and-drop canvas — now powered by Cloud Persistence and AI Assistance.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-F2572B?style=for-the-badge&logo=github)](https://george-abboud.github.io/AutoHub/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![AI](https://img.shields.io/badge/AI-Gemini%20%2F%20OpenAI-blue?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

</div>

---

## 🌐 Live Demo

**[https://george-abboud.github.io/AutoHub/](https://george-abboud.github.io/AutoHub/)**

---

## ✨ Overview

AutoHub is a high-fidelity visual automation workflow builder. It allows users to design and execute multi-node logical pipelines through a drag-and-drop canvas. With the latest update, AutoHub now features **Full Cloud Synchronization**, a **Side-Panel AI Assistant**, and a **Premium Global Loading System** for a seamless, professional experience.

---

## 🚀 Key Features

### ☁️ Cloud Persistence (Supabase)
- **Automatic Syncing:** All nodes, edges, and settings are saved to the cloud in real-time.
- **Global Sync Loader:** A premium, glassmorphic loading overlay ("Syncing Reality") ensures data integrity during background operations.
- **Secure Authentication:** User profiles and workspaces are protected via Supabase Auth.

### 🤖 Side-Panel AI Assistant
- **Expanded Control:** The assistant can now create, connect, and run workflows through natural language commands.
- **Improved Stability:** Fixed layout shifting; the assistant now slides in without disrupting the canvas or dashboard layout.
- **Multi-Engine Support:** Powered by **Groq (Llama 3)** and **Google Gemini** for lightning-fast responses.
- **BYOK Support:** Add your own keys in settings for unlimited usage and advanced model selection.

### 🗂️ Workspace Management
- **Dashboard 2.0:** High-fidelity workspace cards with stable 3-column grid layout.
- **Safety First:** Confirmation dialogs for both **Deleting Workspaces** (permanent) and **Clearing Canvas** (reset).
- **MVVM Architecture:** Clean separation of logic and view for high performance.

### 🎨 Visual Flow Editor
- **Drag-and-drop** canvas powered by React Flow.
- Three node types: **Start Node**, **Color Node**, **Log Node**.
- Supports **Bezier**, **Step**, and **Straight** routing with customizable patterns.
- **Zen Mode:** Focus on your workflow by hiding all UI elements with a single click.

### ⚡ Real-Time Execution Engine
- Sequential, animated workflow execution with visual node highlighting.
- **Color propagation** and **blending** logic.
- Live execution trace log with color-coded entries.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 19 + TypeScript 6 + Vite 8 |
| Backend | Supabase (Database + Auth + Edge Functions) |
| Canvas Engine | React Flow (`@xyflow/react` v12) |
| State Management | Zustand 5 |
| Animations | Framer Motion 12 |
| AI | Google Gemini Pro / OpenAI GPT-4 |
| Styling | Vanilla CSS + Dynamic Theme Sync |

---

## 🏗️ Architecture (MVVM)

```
Model      →  src/store.ts           All state + Supabase syncing logic
ViewModel  →  src/viewmodels/        Business logic & Data transformation
View       →  src/**/*.tsx           High-fidelity UI components
```

---

## 📁 Project Structure

```
src/
├── store.ts               Zustand store (Model)
├── viewmodels/            MVVM ViewModels (Auth, Profile, Agent, etc.)
├── components/
│   ├── flow/              Canvas & Palette components
│   ├── layout/            Sidebar & Header shells
│   └── ui/                Chat bar, Modals, Buttons
├── nodes/                 Custom React Flow nodes
├── supabase/              Edge Functions (AI Proxy)
├── types/                 TypeScript interfaces
└── index.css              Global styles & dynamic theming
```

---

## 💻 Local Development

```bash
# Clone the repo
git clone https://github.com/George-Abboud/AutoHub.git

# Install dependencies
cd AutoHub/frontend
npm install

# Start dev server
npm run dev
```

---

<div align="center">

Built with ❤️ by **George.devign**

</div>