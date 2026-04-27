# AutoHub — Project Description

## 1. Overview

**AutoHub** is a high-fidelity visual automation workflow builder for the web. It allows users to design, compose, and execute multi-node logical pipelines through an intuitive drag-and-drop canvas. The platform targets engineers and power users who need to visualize complex data flows without writing imperative glue code.

> Think of it as a visual programming environment where data moves through connected nodes, and you can watch it happen in real time.

---

## 2. Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Canvas Engine | `@xyflow/react` (React Flow v12) |
| State Management | Zustand 5 (with `persist` middleware) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |
| Styling | Vanilla CSS (inline styles) + `index.css` global overrides |

---

## 3. Architecture

The project follows an **MVVM (Model–View–ViewModel)** pattern:

```
src/
├── store.ts              ← Model: Single Zustand store (all state + actions)
├── viewmodels/           ← ViewModels: custom hooks that compose state for Views
│   ├── useAppViewModel.ts
│   ├── useWorkspaceViewModel.ts
│   ├── useFlowViewModel.ts
│   ├── useExecutionViewModel.ts
│   └── useSettingsViewModel.ts
├── components/           ← Views: pure UI components
│   ├── flow/             ← Canvas-specific components
│   │   ├── FlowCanvas.tsx
│   │   └── FlowPalette.tsx
│   ├── layout/           ← Page layout shells
│   │   ├── Sidebar.tsx
│   │   ├── FlowHeader.tsx
│   │   └── AnimatedBackground.tsx
│   └── ui/               ← Atomic / reusable components
│       ├── Button.tsx
│       ├── ConfirmModal.tsx
│       ├── HeaderButton.tsx
│       ├── Logo.tsx
│       ├── NodeDeleteButton.tsx
│       └── PaletteItem.tsx
├── nodes/                ← Custom React Flow node types
│   ├── StartNode.tsx
│   ├── ColorNode.tsx
│   └── LogNode.tsx
├── hooks/                ← Global side-effect hooks
│   └── useKeyboardShortcuts.ts
├── types/                ← Shared TypeScript interfaces
│   └── index.ts
├── utils/                ← Pure utility functions
│   └── colors.ts
├── ColorEdge.tsx         ← Custom React Flow edge renderer
├── ExecutionPanel.tsx    ← Floating execution log sidebar
├── HomePage.tsx          ← Workspace dashboard
├── DocsPage.tsx          ← In-app documentation
├── SettingsPage.tsx      ← User preferences + system controls
├── App.tsx               ← Root: routing, theme sync, keyboard shortcuts
├── index.css             ← Global styles, CSS vars, React Flow overrides
└── main.tsx              ← React entry point
```

### MVVM Rule
> **Views (`.tsx` files) must never import `useStore` directly.**  
> They consume state exclusively via their matching ViewModel hook.

---

## 4. Application Views

### 4.1 Home Page (`/home`)
- Displays all user workspaces as cards in a responsive grid.
- Each card shows the workspace name, creation date, and node count.
- Users can **create** a new workspace (via modal dialog), **open** an existing one, or **delete** it (with a hover trash icon that follows the accent theme color).
- Features an animated background with floating orbs for visual richness.

### 4.2 Flow Editor (`/editor`)
- The main canvas powered by `@xyflow/react`.
- **Drag-and-drop** nodes from the left palette onto the canvas.
- **Connect** nodes by drawing edges between handles.
- Nodes can be **moved**, **deleted**, or **configured** inline.
- The canvas supports three background patterns: Dots, Lines, None.
- Edges support Bezier, Step, and Straight routing with solid/dashed patterns.
- A **FlowHeader** bar provides: Go Home, Zoom In/Out, Zen Mode toggle, Lock toggle, and Clear canvas.
- A **FlowPalette** panel lists available node types for drag-and-drop.

### 4.3 Execution Panel (floating within Editor)
- A collapsible panel docked at the bottom of the canvas.
- Shows a **live trace log** of the current execution cycle.
- Each log entry is color-coded by node type and data color.
- Supports **clearing** the log history.
- Auto-scrolls to the latest entry.

### 4.4 Docs Page (`/docs`)
- In-app documentation organized in 4 sections:
  1. **Philosophy** — Design principles of AutoHub.
  2. **Quick Start** — Step-by-step guide for new users.
  3. **Node Library** — Descriptions of all node types.
  4. **Trace Engine** — Explanation of the execution model with a static state visualization diagram.
- Fully themed to the user's chosen accent color.

### 4.5 Settings Page (`/settings`)
- Three configuration tabs: **Canvas**, **Lines**, **Theme**.
- A fourth **System** tab houses the **Danger Zone** with a factory reset ("Clear All Data") action.
- All settings persist to `localStorage` via Zustand's `persist` middleware.

---

## 5. Node Types

### 5.1 StartNode (Trigger)
- The mandatory entry point of every workflow (undeletable, always present).
- Contains a Run / Stop button that starts or halts workflow execution.
- Displays the number of connected nodes and shows a warning if no edges are connected.
- Glows with the accent color when the node is actively running.

### 5.2 ColorNode (Processor)
- Emits a chosen hex color as its output data payload.
- Supports two modes:
  - **Presets**: 6 curated vibrant colors.
  - **Custom**: full hex color picker with RGB/HSL live preview.
- Remembers the last custom color used.
- Glows with the selected color during execution.

### 5.3 LogNode (Output)
- Displays a configurable text message.
- During execution, the node's border color reflects the **mixed color** of all upstream ColorNodes feeding into it, demonstrating real-time data propagation.
- Editable text input that respects the lock state.

---

## 6. Custom Edge — ColorEdge

A fully custom edge renderer that:
- Supports Step, Bezier, and Straight path types.
- Applies the edge's runtime color (mixed from upstream nodes) via inline SVG stroke.
- Adds a hover glow effect using Framer Motion.
- Respects the dashed/solid pattern setting from user preferences.

---

## 7. Execution Engine

The workflow execution engine lives entirely in `store.ts` → `runWorkflow()`.

**Execution Flow:**
1. Find all nodes of type `startNode` as the entry points.
2. Execute each node in the current batch concurrently (`Promise.all`).
3. For each node, compute a trace entry (message + color data).
4. Wait 1200ms (visual pause for the user to observe).
5. Traverse edges to find the next batch of nodes.
6. Repeat until no more edges or the user stops.

**Color Propagation:**  
`getSourceColor()` in `utils/colors.ts` recursively traverses the graph upstream from any node, collecting all emitted colors from ColorNodes. `mixColors()` averages them into a single hex value — this is the color shown on connecting edges and LogNodes during execution.

**History:**  
After each run, the full trace is saved to the workspace's `history[]` array (last 5 runs kept). When a workspace is re-opened, the last run's trace is restored to the ExecutionPanel.

---

## 8. State Management

All application state lives in a single **Zustand store** (`store.ts`) with `persist` middleware.

**Persisted fields (localStorage):**
- `workspaces` — all workspace data (nodes, edges, history)
- `accentColor` — user's chosen theme color
- `gridStyle`, `edgeType`, `snapToGrid`, `edgePattern` — canvas preferences
- `activeWorkspaceId` — last active workspace

**Runtime-only (not persisted):**
- `isRunning`, `runningNodeIds`, `activeEdges`, `liveTrace`, `executionTime`
- `isSidebarOpen`, `isLocked`, `isZenMode`

---

## 9. Theme System

- The accent color is stored in Zustand and written to CSS custom properties `--accent-color` and `--accent-color-rgb` via the `ThemeSync` component in `App.tsx`.
- All React Flow handle and control overrides in `index.css` use `var(--accent-color)`, so they live-update when the user changes their theme.
- Available themes: Spectrum Orange, Vibrant Blue, Vibrant Green, Vibrant Purple, Vibrant Pink, Vibrant Red.

---

## 10. Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Run / Stop workflow (editor only) |
| `Z` | Toggle Zen Mode (editor only) |
| `L` | Toggle Lock (editor only) |
| `Escape` | Go to Home from any view |

---

## 11. Key Design Decisions

- **Inline styles over CSS classes** — Chosen for maximum portability and dynamic theming without a CSS-in-JS runtime overhead.
- **No Tailwind in Views** — Tailwind is installed but not used in component code; all theming is driven by the accent color system.
- **MVVM over direct store access** — Prevents Views from becoming tightly coupled to the Model, making future store restructuring safe.
- **`React.memo` on all nodes** — Critical for React Flow performance with large graphs.
- **`persist` middleware with `partialize`** — Only business data is persisted; runtime flags always reset on load, preventing stale UI states.
