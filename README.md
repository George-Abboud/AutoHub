<div align="center">

<img src="https://raw.githubusercontent.com/George-Abboud/AutoHub/main/frontend/public/favicon.svg" width="80" alt="AutoHub Logo" />

# AutoHub

**Visual Automation Workflow Builder**

Design, compose, and execute multi-node automation pipelines through an intuitive drag-and-drop canvas — and watch your data flow in real time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-F2572B?style=for-the-badge&logo=github)](https://george-abboud.github.io/AutoHub/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vite.dev)

</div>

---

## 🌐 Live Demo

**[https://george-abboud.github.io/AutoHub/](https://george-abboud.github.io/AutoHub/)**

---

## ✨ Overview

AutoHub is a high-fidelity visual automation workflow builder. It allows users to design and execute multi-node logical pipelines through a drag-and-drop canvas — no code required. The platform targets engineers and power users who need to visualize complex data flows and observe them executing step by step.

> Think of it as a visual programming environment where data moves through connected nodes, and you can watch it happen live.

---

## 🚀 Features

### 🗂️ Workspace Management
- Create, rename, and delete multiple independent automation workspaces
- Each workspace persists its full state (nodes, edges, execution history) across sessions
- Dashboard view with workspace cards showing node count and creation date

### 🎨 Visual Flow Editor
- **Drag-and-drop** canvas powered by React Flow
- Three node types: **Trigger**, **Color**, **Log**
- Connect nodes by drawing edges between handles
- Supports **Bezier**, **Step**, and **Straight** edge routing
- Solid and dashed edge pattern options
- Three background grid modes: Dots, Lines, None
- Snap-to-grid support

### ⚡ Real-Time Execution Engine
- Sequential, animated workflow execution with visual node highlighting
- **Color propagation** — color data flows from node to node through edges
- **Color mixing** — multiple upstream colors blend into a single averaged output
- Live execution trace log with color-coded entries per node type
- Execution timer showing total run duration
- Last 5 execution runs saved per workspace

### 🎛️ Node Types
| Node | Role |
|---|---|
| **Workflow Trigger** | Entry point — starts and stops execution |
| **Color Node** | Emits a color payload — pick from presets or a full hex/RGB picker |
| **Log Node** | Output — displays a message and reflects upstream color data |

### 🔒 Editor Controls
- **Lock Mode** — freeze the canvas to prevent accidental edits
- **Zen Mode** — hide all UI chrome for distraction-free viewing

### 🎨 Theming
- 6 selectable accent colors with live preview
- Theme updates apply instantly across the entire UI
- Accent color drives edges, handles, node highlights, and all UI elements

### ⚙️ Settings and System
- Per-user preferences persisted to localStorage
- **Clear All Data** factory reset with confirmation dialog

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Canvas Engine | React Flow (`@xyflow/react` v12) |
| State Management | Zustand 5 (with `persist` middleware) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
| Styling | Vanilla CSS (inline styles) + global overrides |
| Deployment | GitHub Actions to GitHub Pages |

---

## 🏗️ Architecture

The project follows an **MVVM (Model–View–ViewModel)** pattern:

```
Model      →  src/store.ts           All state + business logic (Zustand)
ViewModel  →  src/viewmodels/        Custom hooks composing state per View
View       →  src/**/*.tsx           Pure UI — consumes state via ViewModels only
```

### ViewModels

| Hook | Responsibility |
|---|---|
| `useAppViewModel` | Global UI state: accent color, navigation, sidebar |
| `useWorkspaceViewModel` | Workspace CRUD and selection |
| `useFlowViewModel` | Canvas nodes/edges, lock, zen mode |
| `useExecutionViewModel` | Workflow run/stop, live trace, execution time |
| `useSettingsViewModel` | Visual preferences and factory reset |

---

## 📁 Project Structure

```
src/
├── store.ts               Zustand store (Model)
├── viewmodels/            MVVM ViewModels
├── components/
│   ├── flow/              Canvas components
│   ├── layout/            Page layout shells
│   └── ui/                Reusable UI atoms
├── nodes/                 Custom React Flow nodes
├── hooks/                 Global side-effect hooks
├── types/                 Shared TypeScript types
├── utils/                 Pure utility functions
├── App.tsx                Root: routing + theme sync
└── index.css              Global styles + React Flow overrides
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

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

<div align="center">

Built with ❤️ by **George.devign**

</div>