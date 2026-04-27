# AutoHub — Project Rules & Coding Standards

> **This is the quick-reference ruleset.** For full documentation, see:
> - [`PROJECT_DESCRIPTION.md`](./PROJECT_DESCRIPTION.md) — Complete technical & functional specification
> - [`REACT_CODESTYLE_BESTPRACTICES.md`](./REACT_CODESTYLE_BESTPRACTICES.md) — Senior-level code style & best practices

---

## 1. Visual Identity (Design Tokens)

| Token | Value |
|---|---|
| Primary Accent | `#F2572B` (Orange-Coral) |
| Background | `#171717` (Deep Charcoal) |
| Surface | `#1c1c1c` |
| Border | `#262626` |
| Muted / Inactive | `#404040` |
| Text Primary | `#EBEBEB` |
| Text Secondary | `#A3A3A3` |
| Text Muted | `#737373` |
| Success | `#4ade80` |
| Transition | `0.2s` (strict, all UI interactions) |
| Font | `Inter` (Google Fonts) |

---

## 2. Architecture — MVVM

```
Model      →  src/store.ts           (state + actions — never import in Views)
ViewModel  →  src/viewmodels/        (custom hooks composing state per View)
View       →  src/**/*.tsx           (UI only — consumes state via ViewModels)
```

**Exception:** `App.tsx` may use `useStore` directly for top-level routing and CSS sync.

### ViewModels

| Hook | Responsibility |
|---|---|
| `useAppViewModel` | Global UI state: accentColor, currentView, sidebar |
| `useWorkspaceViewModel` | Workspace CRUD, selection, navigation |
| `useFlowViewModel` | Canvas nodes/edges, lock, zen mode, node mutations |
| `useExecutionViewModel` | Workflow run/stop, live trace, execution time, logs |
| `useSettingsViewModel` | Visual preferences, factory reset |

---

## 3. Directory Structure

```
src/
├── store.ts               Model: single Zustand store
├── viewmodels/            ViewModels (one per domain)
├── components/
│   ├── flow/              Canvas-specific components
│   ├── layout/            Page layout shells
│   └── ui/                Atomic / reusable components
├── nodes/                 Custom React Flow node types
├── hooks/                 Global side-effect hooks
├── types/index.ts         Shared TypeScript interfaces
├── utils/colors.ts        Pure color utility functions
├── ColorEdge.tsx          Custom React Flow edge renderer
├── ExecutionPanel.tsx     Floating execution log panel
├── HomePage.tsx           Workspace dashboard view
├── DocsPage.tsx           In-app documentation view
├── SettingsPage.tsx       User preferences view
├── App.tsx                Root: routing + theme sync
├── index.css              Global styles + React Flow overrides
└── main.tsx               Entry point
```

---

## 4. Core Rules (Non-Negotiable)

1. **No `any`** — use proper generics and explicit types.
2. **Views never import `useStore`** — always go through a ViewModel.
3. **`React.memo`** on all custom nodes and edges.
4. **All animations via Framer Motion** — hover, tap, transitions.
5. **`isLocked` must be checked** in every canvas-mutating action.
6. **Atomic Zustand selectors** — one value per `useStore` call.
7. **Components max 200 lines** — extract sub-components or hooks if exceeded.
8. **No unused imports, variables, or commented-out code.**

---

## 5. Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | `PascalCase.tsx` | `FlowCanvas.tsx` |
| Hooks | `use` prefix, `camelCase` | `useKeyboardShortcuts.ts` |
| ViewModels | `use` prefix + `ViewModel` suffix | `useFlowViewModel.ts` |
| Utilities | domain-named, `camelCase` | `colors.ts` |
| Folders | `camelCase` | `viewmodels/`, `components/flow/` |

---

## 6. Senior Checklist (Every PR)

- [ ] No `useStore` calls in View files (except `App.tsx`)
- [ ] No `any` types introduced
- [ ] New nodes/edges wrapped in `React.memo`
- [ ] All interactive elements have `whileHover` / `whileTap`
- [ ] All transitions are `0.2s`
- [ ] Colors match the design token table above
- [ ] `isLocked` respected for all canvas mutations
- [ ] No unused imports or dead code
- [ ] JSDoc on all new utilities and ViewModels
