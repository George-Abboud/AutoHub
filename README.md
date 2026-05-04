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

AutoHub is a high-fidelity visual automation workflow builder. It allows users to design and execute multi-node logical pipelines through a drag-and-drop canvas. With the latest update, AutoHub now features **Cloud Sync** for persistent workspaces and an **AI Assistant** that helps you build and manage your automation flows using natural language.

---

## 🚀 Key Features

### ☁️ Cloud Persistence (Supabase)
- **Automatic Syncing:** All nodes, edges, and settings are saved to the cloud in real-time.
- **Multi-Device Support:** Access your workspaces from anywhere by logging in.
- **Secure Authentication:** User profiles and settings are protected via Supabase Auth.

### 🤖 AI Assistant (SaaS Ready)
- **Natural Language Building:** Ask the bot to "Add a color node" or "Run the workflow" in Arabic or English.
- **Usage Tracking:** Daily limits (20 requests/day) are enforced per user to manage costs.
- **BYOK (Bring Your Own Key):** Users can add their own Gemini or OpenAI keys in settings to bypass daily limits and unlock advanced models.
- **Glassmorphic Chat UI:** A sleek, non-intrusive chat bar at the bottom for quick interactions.

### 🗂️ Workspace Management
- Create, rename, and delete multiple independent automation workspaces.
- Dashboard view with workspace cards showing node count and creation date.

### 🎨 Visual Flow Editor
- **Drag-and-drop** canvas powered by React Flow.
- Three node types: **Trigger**, **Color**, **Log**.
- Supports **Bezier**, **Step**, and **Straight** routing with customizable patterns.
- Snap-to-grid support and multiple background modes.

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