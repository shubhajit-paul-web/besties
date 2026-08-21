# Chat Header and Message UI Implementation Plan

> **For agentic workers:** Implement this plan task-by-task with focused validation.

**Goal:** Move friend identity into a reusable chat header and make the message/composer surfaces cleaner and more professional.

**Architecture:** Add a presentational `ChatHeader` component under the chat feature. Keep message data and rendering in `Chat.tsx`, while `ChatMessage` renders only avatar and message content with direction-based styling.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, lucide-react.

---

### Task 1: Create chat header

**Files:**

- Create: `src/features/chat/components/ChatHeader.tsx`
- Modify: `src/features/chat/pages/Chat.tsx`

- [ ] Add a compact header with friend avatar, name, online dot, and status text.
- [ ] Place it above the message area with a restrained border and spacing.

### Task 2: Refine messages and composer

**Files:**

- Modify: `src/features/chat/components/ChatMessage.tsx`
- Modify: `src/features/chat/pages/Chat.tsx`

- [ ] Remove repeated author labels from every message.
- [ ] Preserve incoming/outgoing alignment and improve bubble sizing, contrast, and spacing.
- [ ] Polish the input, send button, and attachment button while retaining their current behavior.

### Task 3: Validate the chat slice

**Files:**

- No test framework is configured; validate the touched TypeScript and JSX through existing scripts.

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
