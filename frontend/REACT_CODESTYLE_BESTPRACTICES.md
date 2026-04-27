# React + TypeScript + Vite — Senior Code Style Guide

This document defines the coding standards, patterns, and best practices for this project.  
All contributors must follow these rules without exception.

---

## 1. TypeScript Strict Mode

- **Never use `any`**. Use generics, `unknown`, or explicit union types.
- Always type component props with a dedicated `interface`, not inline.
- Prefer `type` for unions/aliases; prefer `interface` for object shapes and component props.
- Export types separately from implementation (`export type { Foo }`).

```ts
// ✅ Correct
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'danger';
}

// ❌ Wrong
const Button = ({ label, onClick, variant }: any) => { ... };
```

---

## 2. Component Structure

Every component file should follow this order:

```tsx
// 1. External library imports
// 2. Internal imports (viewmodels, components, utils, types)
// 3. Constants (outside the component if static)
// 4. Types / Interfaces
// 5. Component function
// 6. Sub-components (if file is a container)
// 7. Default export (only for App.tsx / pages)
```

- **Always use named exports** for components. Default exports only for the root `App.tsx`.
- **Arrow function components** exclusively — no `function` keyword for components.
- Keep components **under 200 lines**. If exceeded, extract sub-components or custom hooks.

```tsx
// ✅ Correct
export const UserCard: React.FC<UserCardProps> = ({ name, role }) => {
  return <div>...</div>;
};

// ❌ Wrong
export default function UserCard({ name, role }) { ... }
```

---

## 3. MVVM Layer Rules

| Layer | Where | Rule |
|---|---|---|
| **Model** | `src/store.ts` | All state and actions. Never imported directly in Views. |
| **ViewModel** | `src/viewmodels/` | Custom hooks composing state for a specific View. |
| **View** | `src/**/*.tsx` | Consumes state **only** via ViewModel hooks. |

```tsx
// ✅ Correct — View uses ViewModel
import { useFlowViewModel } from '../viewmodels/useFlowViewModel';
const { isLocked, nodes } = useFlowViewModel();

// ❌ Wrong — View imports store directly
import { useStore } from '../store';
const isLocked = useStore(s => s.isLocked);
```

**Exception:** `App.tsx` may use `useStore` directly for top-level routing and `ThemeSync` effects, since it orchestrates the whole app and sits above the MVVM boundary.

---

## 4. Zustand State Management

- Use **atomic selectors** — one `useStore` call per value to minimize re-renders.
- All actions belong in `store.ts`, never inline in components.
- Never mutate state directly — always use `set()`.
- The `persist` middleware uses `partialize` — only persist what needs to survive a page reload.

```ts
// ✅ Atomic selectors
const isLocked = useStore(s => s.isLocked);
const accentColor = useStore(s => s.accentColor);

// ❌ Selecting the entire store (causes re-renders on any state change)
const store = useStore();
```

---

## 5. React Performance

- **`React.memo`** is mandatory on all custom React Flow nodes and edges.
- Use **`useCallback`** for event handlers passed as props or used in `useEffect` deps.
- Use **`useMemo`** only when the computation is genuinely expensive — not for every derived value.
- Avoid creating objects/arrays inline in JSX (they cause unnecessary re-renders).

```tsx
// ✅
const handleClick = useCallback(() => {
  deleteNode(id);
}, [id, deleteNode]);

// ❌ New function reference every render
<button onClick={() => deleteNode(id)} />
```

---

## 6. Framer Motion — Animation Standards

All interactive elements must use Framer Motion. These are the project defaults:

```tsx
// Hover & Tap
whileHover={{ scale: 1.05, translateY: -1 }}
whileTap={{ scale: 0.95 }}

// Page / section transitions
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.2 }}

// Modals / overlays
initial={{ scale: 0.9, opacity: 0, y: 20 }}
animate={{ scale: 1, opacity: 1, y: 0 }}
exit={{ scale: 0.9, opacity: 0, y: 20 }}
```

Always wrap conditional renders with `<AnimatePresence>` so exit animations play.

---

## 7. Styling

This project uses **vanilla inline styles** for all component-level styling.

- **No Tailwind classes in `.tsx` files** (Tailwind is installed but not used in components).
- **No CSS modules** — all component styles are inline.
- **`index.css`** is reserved for:  
  - Google Fonts import  
  - CSS custom properties (`--accent-color`, `--accent-color-rgb`)  
  - Global resets (`*, html, body, #root`)  
  - React Flow class overrides (`.react-flow__*`)  
  - Scrollbar styling

**Design tokens (always use these values):**

```ts
const COLORS = {
  background: '#171717',
  surface: '#1c1c1c',
  border: '#262626',
  muted: '#404040',
  textPrimary: '#EBEBEB',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',
  success: '#4ade80',
};

const TRANSITIONS = 'all 0.2s';   // Strict 0.2s for all interactions

// Glassmorphism panels
const glass = {
  background: 'rgba(23, 23, 23, 0.85)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
};
```

---

## 8. File & Folder Naming

| Type | Convention | Example |
|---|---|---|
| Components | `PascalCase.tsx` | `FlowCanvas.tsx` |
| Hooks | `camelCase.ts`, prefix `use` | `useKeyboardShortcuts.ts` |
| ViewModels | `camelCase.ts`, prefix `use`, suffix `ViewModel` | `useFlowViewModel.ts` |
| Utilities | `camelCase.ts`, domain-named | `colors.ts` |
| Types | `index.ts` inside `types/` | `types/index.ts` |
| Folders | `camelCase` | `viewmodels/`, `components/flow/` |

---

## 9. Hooks Rules

- Custom hooks must start with `use`.
- Hooks should have a single, clear responsibility (SRP).
- Hooks that access the store must do so via `useStore.getState()` inside `useEffect` (not as a dependency) when the intent is to read fresh state at event time, not reactively.
- Never call hooks conditionally.

---

## 10. Imports Order

Maintain this import order (auto-fixable with ESLint):

```tsx
// 1. React core
import React, { useState, useCallback } from 'react';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { useReactFlow } from '@xyflow/react';

// 3. Internal ViewModels
import { useFlowViewModel } from '../../viewmodels/useFlowViewModel';

// 4. Internal components
import { Button } from '../ui/Button';

// 5. Types (always with `type` keyword)
import type { Workspace } from '../../types';
```

---

## 11. Dead Code Policy

- **Zero tolerance for commented-out code** — use Git history instead.
- **Zero unused imports** — clean up on every commit.
- **Zero unused variables** — TypeScript strict mode catches these.
- If a feature is partially built, stub it cleanly or remove it entirely.

---

## 12. JSDoc Requirements

JSDoc is required for:
- All public ViewModel hooks (document what state/actions they expose).
- All utility functions in `utils/`.
- Complex algorithms in `store.ts` (execution engine, color mixing).

```ts
/**
 * Recursively collects all hex colors emitted by upstream ColorNodes
 * in the graph relative to the given nodeId.
 *
 * @param nodeId   - The node to trace upstream from.
 * @param nodes    - All nodes in the current workspace.
 * @param edges    - All edges in the current workspace.
 * @param visited  - Set of visited node IDs (cycle prevention).
 * @returns Array of hex color strings from upstream ColorNodes.
 */
export const getSourceColor = (...): string[] => { ... };
```

---

## 13. Senior Checklist (Before Every Commit)

Before committing, verify:

- [ ] No direct `useStore` calls in View files (except `App.tsx`).
- [ ] No `any` types introduced.
- [ ] All new components use `React.memo` if they are nodes/edges.
- [ ] All interactive elements have `whileHover` / `whileTap`.
- [ ] Transitions are exactly `0.2s`.
- [ ] Colors match the design token palette.
- [ ] `isLocked` state is respected for any canvas-mutating action.
- [ ] No unused imports or variables.
- [ ] JSDoc added to any new utility or ViewModel.
