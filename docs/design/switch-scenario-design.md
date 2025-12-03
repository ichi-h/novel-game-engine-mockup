# Switch Scenario Design

## Overview

This document describes the design for the `SwitchScenario` message type, which enables switching between different scenarios (story branches, chapters, routes, etc.) during gameplay.

## Background

With the introduction of the `Next` message and `currentScenario` field in `NovelModel`, we now have the foundation for multi-scenario support. However, we need a way to transition between scenarios programmatically during gameplay.

## Use Cases

1. **Story Branching**

   - Player makes a choice → switch to different story route
   - Example: "Good ending" vs "Bad ending" routes

2. **Chapter System**

   - Completing chapter 1 → automatically switch to chapter 2
   - Save system that can jump to specific chapters

3. **Flashback Scenes**

   - Temporarily switch to flashback scenario → return to main scenario
   - Requires scenario stack/history for return navigation

4. **Game Loop**
   - Title screen → Main story → Ending → Back to title screen

## Proposed Solution

### Message Type Definition

```typescript
// packages/engine/src/update/message-handlers/general/switch-scenario.ts

export type SwitchScenarioMessage = {
  type: "SwitchScenario";
  scenario: string; // Scenario alias to switch to (e.g., "chapter2", "ending_good")
  index?: number; // Optional: Starting position in the new scenario (defaults to 0)
  resetState?: boolean; // Optional: Whether to reset mixer/UI state (defaults to false)
};
```

### Behavior Specification

#### Basic Behavior

```typescript
{
  type: "SwitchScenario",
  scenario: "chapter2"
}
// → currentScenario: "chapter2", index: 0
// → Mixer and UI state are preserved
```

#### With Starting Index

```typescript
{
  type: "SwitchScenario",
  scenario: "flashback",
  index: 5
}
// → currentScenario: "flashback", index: 5
// → Useful for jumping to specific points
```

#### With State Reset

```typescript
{
  type: "SwitchScenario",
  scenario: "ending_good",
  resetState: true
}
// → currentScenario: "ending_good", index: 0
// → Status is reset to 'Processed'
// → Mixer channels are cleared
// → UI widgets are cleared
// → Animation tickets are cleared
// → Useful for clean transitions between major sections
```

### Handler Implementation

```typescript
// packages/engine/src/update/message-handlers/general/switch-scenario.ts

import type { ReturnModel } from "elmish";
import type { NovelModel } from "../../model";
import type { NovelMessage } from "../message";
import { clearAllChannels } from "../../mixer/clear-all-channels";

export type SwitchScenarioMessage = {
  type: "SwitchScenario";
  scenario: string;
  index?: number;
  resetState?: boolean;
};

export const handleSwitchScenario = (
  model: NovelModel,
  msg: SwitchScenarioMessage
): ReturnModel<NovelModel, NovelMessage> => {
  const newIndex = msg.index ?? 0;

  // Base scenario switch
  let newModel: NovelModel = {
    ...model,
    currentScenario: msg.scenario,
    index: newIndex,
  };

  // Reset state if requested
  if (msg.resetState) {
    newModel = {
      ...newModel,
      status: { value: "Processed" },
      mixer: {
        value: clearAllChannels(newModel.mixer.value),
        isApplying: false,
      },
      ui: [],
      animationTickets: [],
    };
  }

  return newModel;
};
```

### Model Changes

No changes to `NovelModel` are required - the existing `currentScenario` field supports this feature.

### NovelMessage Type Union Update

```typescript
// packages/engine/src/update/message.ts

export type NovelMessage =
  // General
  | NextMessage
  | SwitchScenarioMessage // NEW
  | DelayMessage
  | DelayCompletedMessage;
// ... rest of messages
```

## Usage Patterns

### Pattern 1: Choice-Based Branching

```typescript
// scenario.ts
export const scenarios: Record<string, NovelMessage[]> = {
  prologue: [
    showTextBox({ id: "dialog" }),
    showText({ textBoxId: "dialog", body: "Which path will you take?" }),
    // User clicks a choice button in UI
    // UI fires: { type: "SwitchScenario", scenario: "route_a" } or "route_b"
  ],
  route_a: [
    showText({ textBoxId: "dialog", body: "You chose route A" }),
    // ... route A story
  ],
  route_b: [
    showText({ textBoxId: "dialog", body: "You chose route B" }),
    // ... route B story
  ],
};
```

### Pattern 2: Sequential Chapters

```typescript
export const scenarios: Record<string, NovelMessage[]> = {
  chapter1: [
    // ... chapter 1 content
    showText({ textBoxId: "dialog", body: "Chapter 1 Complete!" }),
    { type: "SwitchScenario", scenario: "chapter2", resetState: true },
  ],
  chapter2: [
    showText({ textBoxId: "dialog", body: "Chapter 2 begins..." }),
    // ... chapter 2 content
  ],
};
```

### Pattern 3: Flashback and Return

```typescript
// For flashbacks that return to the original scenario,
// the UI layer needs to track the return point

// GamePage.tsx
const handleFlashback = () => {
  // Save current position
  const returnPoint = {
    scenario: model.currentScenario,
    index: model.index,
  };
  sessionStorage.setItem("returnPoint", JSON.stringify(returnPoint));

  // Switch to flashback
  send({
    type: "SwitchScenario",
    scenario: "flashback_scene",
    resetState: false,
  });
};

const handleReturnFromFlashback = () => {
  const returnPoint = JSON.parse(sessionStorage.getItem("returnPoint") || "{}");
  send({
    type: "SwitchScenario",
    scenario: returnPoint.scenario,
    index: returnPoint.index,
  });
};
```

## Edge Cases and Validation

### 1. Invalid Scenario Alias

**Problem**: What happens if `scenario` doesn't exist in the scenarios object?

**Solution**: This is handled at the UI layer (GamePage.tsx). The engine only updates the model state. The UI layer should:

- Validate scenario existence before firing the message
- Or handle missing scenarios gracefully (show error screen, fallback to title)

```typescript
// GamePage.tsx
const scenarios: Record<string, NovelMessage[]> = {
  /* ... */
};

// When processing Next message after SwitchScenario
const next = () => {
  const currentScenario = scenarios[model.currentScenario];

  if (!currentScenario) {
    console.error(`Scenario not found: ${model.currentScenario}`);
    // Fallback: return to title or show error
    send({ type: "SwitchScenario", scenario: "title", resetState: true });
    return;
  }

  const msg = currentScenario[model.index];
  if (!msg) {
    // End of scenario - could auto-advance or wait for user
    return;
  }

  send({ type: "Next", message: msg });
};
```

### 2. Index Out of Bounds

**Problem**: What if `index` is larger than the scenario length?

**Solution**:

- The handler doesn't validate this - it sets the index as requested
- The UI layer checks if `scenarios[model.currentScenario][model.index]` exists
- If not, it can treat it as "scenario complete" or show an error

### 3. Switching During Animation or Delay

**Problem**: What happens if we switch scenarios while animations are in progress?

**Options**:

- **A**: Preserve animations (current behavior with `resetState: false`)
- **B**: Clear animations (use `resetState: true`)
- **C**: Cancel in-flight delays/animations

**Recommendation**:

- Default behavior (`resetState: false`): Animations continue
- For clean transitions: Use `resetState: true`
- The UI layer can send explicit cleanup messages before switching if needed

### 4. History Tracking

**Question**: Should `SwitchScenario` be added to message history?

**Answer**: Yes, for debugging and save/load consistency. The history should show when scenario switches occurred.

Update `NovelConfig.historyLength`:

```typescript
export interface NovelConfig {
  historyLength: {
    // ... other message types
    SwitchScenario: number; // NEW
  };
}
```

## Interaction with Save/Load System

The save system already stores `currentScenario` and `index`, so loading a save will automatically restore the scenario state:

```typescript
// Saved state
{
  currentScenario: "chapter3",
  index: 42,
  // ... other state
}
```

When loaded, the game will be at scenario "chapter3", position 42.

**Consideration**: Should we validate scenario existence on load?

- Yes - the load handler in the UI layer should check if the saved scenario exists
- If not, fallback to a safe scenario (e.g., title screen) or show an error

## Benefits

1. **Flexible Story Structure**

   - Support for branching narratives
   - Chapter-based progression
   - Multiple routes/endings

2. **Clean Separation of Concerns**

   - Engine: Updates model state only
   - UI Layer: Validates scenarios and handles edge cases
   - Scenario Authors: Can use SwitchScenario in scenario definitions

3. **State Control**

   - `resetState` flag allows control over whether to preserve or clear game state
   - Useful for both seamless transitions and clean breaks

4. **Save/Load Compatible**
   - Works with existing serialization system
   - No additional data needed beyond `currentScenario` and `index`

## Implementation Checklist

- [ ] Create `SwitchScenarioMessage` type in `packages/engine/src/update/message-handlers/general/switch-scenario.ts`
- [ ] Create `handleSwitchScenario` function in the same file
- [ ] Export from `packages/engine/src/update/message-handlers/index.ts`
- [ ] Add `SwitchScenarioMessage` to `NovelMessage` union in `packages/engine/src/update/message.ts`
- [ ] Add `'SwitchScenario'` to `NovelMessageType` in `packages/engine/src/update/message.ts`
- [ ] Add case for `'SwitchScenario'` in `packages/engine/src/update/update.ts`
- [ ] Add `SwitchScenario: number` to `NovelConfig.historyLength`
- [ ] Create helper function `clearAllChannels` in `packages/engine/src/mixer/clear-all-channels.ts` if it doesn't exist
- [ ] Update `examples/react/src/game/scenario.ts` to demonstrate multi-scenario structure
- [ ] Update `examples/react/src/pages/GamePage.tsx` to handle scenario switching and validation
- [ ] Add tests for `handleSwitchScenario`
- [ ] Update documentation

## Future Considerations

### Transition Effects

Scenario switches could trigger transition effects:

```typescript
type SwitchScenarioMessage = {
  type: "SwitchScenario";
  scenario: string;
  index?: number;
  resetState?: boolean;
  transition?: {
    type: "fade" | "slide" | "none";
    duration: number;
  };
};
```

This would require coordination with the UI layer to play the transition animation.
