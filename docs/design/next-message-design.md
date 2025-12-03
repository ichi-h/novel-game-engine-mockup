# Next Message Design

## Overview

This document describes the design for introducing a `Next` message type that wraps scenario messages and controls scenario progression (index advancement).

## Problem Statement

### Current Issues

1. **Ambiguous index update timing** - The `index` is currently managed in the UI layer (`GamePage.tsx`), making it unclear when and how it should be updated.
2. **Risk of index desynchronization** - If a message is fired at an unintended timing, the `index` may become inconsistent with the actual scenario state.
3. **Lack of scenario identification** - The model only holds an `index`, but doesn't know which scenario it belongs to.

### Current Architecture

```
GamePage.tsx (UI Layer)
    ↓ messages[model.index]
    ↓ send(msg)
Engine (update function)
    ↓ processes NovelMessage
NovelModel (index managed externally)
```

## Proposed Solution

### Core Concept

Introduce a `Next` message type that:

1. **Wraps the actual scenario message** to be executed
2. **Is the only message type that advances the `index`**
3. **Executes the wrapped message** as part of its processing

### New Message Type

```typescript
// packages/engine/src/update/message-handlers/next.ts

export type NextMessage = {
  type: "Next";
  message: NovelMessage;
};
```

### Model Changes

Add `currentScenario` to identify which scenario is currently being played:

```typescript
// packages/engine/src/model.ts

export interface NovelModel {
  status: NovelStatus;
  currentScenario: string; // NEW: Scenario alias (e.g., "main", "chapter1", "ending_a")
  index: number; // Position within the current scenario
  mixer: {
    value: Mixer;
    isApplying: boolean;
  };
  ui: NovelWidget[];
  animationTickets: AnimationTicket[];
  history: {
    [K in NovelMessageType]: Extract<NovelMessage, { type: K }>[];
  };
  config: NovelConfig;
}
```

### Message Handler Implementation

```typescript
// packages/engine/src/update/message-handlers/next.ts

import type { ReturnModel } from "elmish";
import type { NovelModel } from "../../model";
import type { NovelMessage } from "../message";

export type NextMessage = {
  type: "Next";
  message: NovelMessage;
};

export const handleNext = (
  model: NovelModel,
  msg: NextMessage,
  update: Update<NovelModel, NovelMessage>
): ReturnModel<NovelModel, NovelMessage> => {
  // 1. Execute the wrapped message
  const result = update(model, msg.message);

  const [newModel, cmd] = Array.isArray(result)
    ? [result[0], result[1]]
    : [result, undefined];

  // 2. Advance the index AFTER message execution
  return [
    {
      ...newModel,
      index: newModel.index + 1,
    },
    cmd,
  ];
};
```

### Update Function Changes

```typescript
// packages/engine/src/update/update.ts

// Add to the switch statement:
case 'Next':
  return handleNext(model, msg, updateWrapped);
```

### NovelMessage Type Union Update

```typescript
// packages/engine/src/update/message.ts

export type NovelMessage =
  // General
  | NextMessage        // NEW
  | DelayMessage
  | DelayCompletedMessage;
// ... rest of messages
```

## Usage Pattern

### Before (Current)

```typescript
// GamePage.tsx
const next = () => {
  const msg = messages[model.index];
  if (!msg) return;
  send(msg); // index management is unclear
};
```

### After (Proposed)

```typescript
// GamePage.tsx
const next = () => {
  const msg = scenarios[model.currentScenario]?.[model.index];
  if (!msg) return;

  // Wrap with Next - this is the ONLY way to advance the scenario
  send({ type: "Next", message: msg });
};
```

### Scenario Definition (Unchanged)

```typescript
// Scenario authors write NovelMessage arrays as before
// They don't need to know about Next or index
export const scenarios: Record<string, NovelMessage[]> = {
  main: [
    sequence([showDialog('Hello'), showImage(...)]),
    sequence([showDialog('World')]),
  ],
  chapter1: [...],
  ending_a: [...],
};
```

## Behavioral Contract

| Message Type | Index Change | Description                                        |
| ------------ | ------------ | -------------------------------------------------- |
| `Next`       | `index + 1`  | Only message that advances scenario                |
| `ShowText`   | No change    | Can be fired independently without affecting index |
| `Sequence`   | No change    | Groups messages, doesn't affect index              |
| `Delay`      | No change    | Internal timing, doesn't affect index              |
| All others   | No change    | No direct scenario progression                     |

## Benefits

1. **Clear separation of concerns**

   - Scenario authors: Write `NovelMessage` arrays
   - UI layer: Wraps messages with `Next` on user interaction
   - Engine: Guarantees index only changes via `Next`

2. **Declarative scenario definition**

   - No index manipulation in scenarios
   - Scenarios remain pure data

3. **Safe message firing**

   - Internal messages (animations, delays) don't affect index
   - Only explicit `Next` calls advance the scenario

4. **Scenario switching support**
   - `currentScenario` alias enables multiple scenario management
   - Save/Load can restore exact position: `{ currentScenario: "main", index: 5 }`

## Implementation Checklist

- [ ] Add `NextMessage` type to `packages/engine/src/update/message-handlers/next.ts`
- [ ] Create `handleNext` function in the same file
- [ ] Export from `packages/engine/src/update/message-handlers/index.ts`
- [ ] Add `NextMessage` to `NovelMessage` union in `packages/engine/src/update/message.ts`
- [ ] Add `'Next'` to `NovelMessageType` in `packages/engine/src/update/message.ts`
- [ ] Add case for `'Next'` in `packages/engine/src/update/update.ts`
- [ ] Add `currentScenario: string` to `NovelModel` interface in `packages/engine/src/model.ts`
- [ ] Update `generateInitModel` to accept `currentScenario` parameter
- [ ] Update `NovelConfig.historyLength` to include `Next` if history tracking is needed
- [ ] Update `examples/react/src/pages/GamePage.tsx` to use `Next` message pattern
- [ ] Update serialization in `packages/driver/src/persistence/serialization.ts` if needed
- [ ] Add tests for `handleNext`

## Future Considerations

### Scenario Switching

A `SwitchScenario` message could be added later:

```typescript
type SwitchScenarioMessage = {
  type: "SwitchScenario";
  scenario: string;
  index?: number; // Optional: start position, defaults to 0
};
```
