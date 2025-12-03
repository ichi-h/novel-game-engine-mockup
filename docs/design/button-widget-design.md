# Button Widget Design

## Overview

This document describes the design for the `ButtonWidget` and related messages, which enable interactive choice buttons in the novel game engine.

## Background

The novel game engine needs a way to display clickable buttons that can trigger game messages. This is essential for:

1. Presenting choices to players
2. Creating interactive UI elements
3. Triggering scenario switches, flag updates, or other game actions

## Use Cases

1. **Story Choices**

   - Display multiple choice buttons
   - Each button triggers a different story branch

2. **Confirmation Dialogs**

   - "Yes/No" buttons for confirmations
   - Each triggers appropriate action

3. **Menu Items**
   - In-game menu buttons (save, load, settings)
   - Navigation buttons

## Proposed Solution

### Widget Type Definition

```typescript
// packages/engine/src/ui/widgets/button.ts

import { murmurhash3, type Optional } from "@/utils";
import type { NovelWidgetBase } from "./core";
import type { NovelMessage } from "../../update/message";

export interface ButtonWidget extends NovelWidgetBase {
  type: "Button";
  style?: string;
  label: string;
  onClick: NovelMessage;
}

type ButtonProps = Optional<Omit<ButtonWidget, "type">, "id">;

export const button = (props: ButtonProps): ButtonWidget => {
  const { id, ...rests } = props;
  const result = {
    ...rests,
    type: "Button" as const,
    id: "",
  };
  result.id = id ?? murmurhash3(result);
  return result;
};
```

### NovelWidget Type Update

```typescript
// packages/engine/src/ui/widgets/core.ts

import type { ButtonWidget } from "./button";
import type { ImageWidget } from "./image";
import type { LayoutWidget } from "./layout";
import type { TextWidget } from "./text";
import type { TextBoxWidget } from "./text-box";

export interface NovelWidgetBase {
  id: string;
  type: string;
}

export type NovelWidget =
  | LayoutWidget
  | ImageWidget
  | TextBoxWidget
  | TextWidget
  | ButtonWidget; // NEW
```

### Message Type Definition

```typescript
// packages/engine/src/update/message-handlers/widgets/add-button.ts

import type { BaseMessage } from "elmish";
import type { NovelMessage } from "../../message";

export interface AddButtonMessage extends BaseMessage {
  type: "AddButton";
  id?: string;
  layoutId?: string;
  label: string;
  onClick: NovelMessage;
  style?: string;
}
```

### Helper Function

```typescript
// packages/engine/src/update/message-handlers/widgets/add-button.ts

export const addButton = (
  label: string,
  onClick: NovelMessage,
  layoutId?: string,
  id?: string,
  style?: string
): AddButtonMessage => {
  return {
    type: "AddButton",
    label,
    onClick,
    ...(layoutId !== undefined ? { layoutId } : {}),
    ...(id !== undefined ? { id } : {}),
    ...(style !== undefined ? { style } : {}),
  };
};
```

### Handler Implementation

```typescript
// packages/engine/src/update/message-handlers/widgets/add-button.ts

import type { NovelModel } from "../../../model";
import { addWidget, button } from "../../../ui";

export const handleAddButton = (
  model: NovelModel,
  msg: AddButtonMessage
): NovelModel => {
  const newButton = button({
    label: msg.label,
    onClick: msg.onClick,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
  });
  return {
    ...model,
    ui: addWidget(model.ui, newButton, msg.layoutId),
  };
};
```

### NovelMessage Type Union Update

```typescript
// packages/engine/src/update/message.ts

export type NovelMessage =
  // General
  | NextMessage
  | SwitchScenarioMessage
  | StartSelectingMessage
  | DelayMessage
  | DelayCompletedMessage
  | SequenceMessage<NovelMessage>
  | UpdateConfigMessage
  | ErrorMessage
  | RecoverErrorMessage
  // Widgets
  | AddLayoutMessage
  | ShowImageMessage
  | AddWidgetsMessage
  | AddButtonMessage // NEW
  | AddTextBoxMessage
  | ShowTextMessage
  | TextAnimationCompletedMessage
  | ClearTextBoxMessage
  | RemoveWidgetsMessage;
// ... Mixer messages
```

## React Driver Implementation

### Button Component

```typescript
// packages/driver/src/react/widgets/button.tsx

import type { ButtonWidget, NovelMessage } from "engine";

interface Props {
  widget: ButtonWidget;
  send: (msg: NovelMessage) => void;
}

export const Button = ({ widget, send }: Props) => {
  const handleClick = () => {
    send(widget.onClick);
  };

  return (
    <button
      id={widget.id}
      className={widget.style}
      onClick={handleClick}
      type="button"
    >
      {widget.label}
    </button>
  );
};
```

### NovelWidgetDriver Update

```typescript
// packages/driver/src/react/novel-widget-driver.tsx

import type { NovelModel, NovelWidget, NovelMessage } from "engine";
import { Button, Image, Layout, Text, TextBox } from "./widgets";

interface Props {
  widgets: NovelWidget[];
  model: NovelModel;
  send: (msg: NovelMessage) => void; // NEW
}

export const NovelWidgetDriver = ({ widgets, model, send }: Props) => {
  return (
    <>
      {widgets.map((widget, i) => {
        switch (widget.type) {
          case "Image":
            return (
              <Image key={`${widget.type}_${widget.id}_${i}`} widget={widget} />
            );
          case "Layout":
            return (
              <Layout
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                model={model}
                send={send} // Pass send to Layout
              />
            );
          case "TextBox":
            return (
              <TextBox
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                model={model}
                send={send} // Pass send to TextBox
              />
            );
          case "Text":
            return (
              <Text
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                isAnimating={model.animationTickets.some(
                  (ticket) => ticket.id === widget.id
                )}
                model={model}
              />
            );
          case "Button": // NEW
            return (
              <Button
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                send={send}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
```

### Layout Component Update

The Layout component needs to pass `send` to its children:

```typescript
// packages/driver/src/react/widgets/layout.tsx

interface Props {
  widget: LayoutWidget;
  model: NovelModel;
  send: (msg: NovelMessage) => void; // NEW
}

export const Layout = ({ widget, model, send }: Props) => {
  return (
    <div id={widget.id} className={widget.style}>
      <NovelWidgetDriver widgets={widget.children} model={model} send={send} />
    </div>
  );
};
```

### TextBox Component Update

Similarly, TextBox needs to pass `send` to its children:

```typescript
// packages/driver/src/react/widgets/text-box.tsx

interface Props {
  widget: TextBoxWidget;
  model: NovelModel;
  send: (msg: NovelMessage) => void; // NEW
}

export const TextBox = ({ widget, model, send }: Props) => {
  return (
    <div id={widget.id} className={widget.style}>
      <NovelWidgetDriver widgets={widget.children} model={model} send={send} />
    </div>
  );
};
```

## Usage Patterns

### Pattern 1: Simple Choice Buttons

```typescript
import { addButton, sequence, removeWidgets } from "engine";

const choiceMessages = [
  { type: "StartSelecting" },
  addButton(
    "Choice A", // label
    sequence([
      // onClick
      removeWidgets(["choice-a", "choice-b"]),
      { type: "SwitchScenario", scenario: "route_a" },
    ]),
    "dialog-layout", // layoutId (optional)
    "choice-a", // id
    "choice-button" // style
  ),
  addButton(
    "Choice B",
    sequence([
      removeWidgets(["choice-a", "choice-b"]),
      { type: "SwitchScenario", scenario: "route_b" },
    ]),
    "dialog-layout",
    "choice-b",
    "choice-button"
  ),
];
```

### Pattern 2: Buttons in Layout

```typescript
const choiceMessages = [
  { type: "StartSelecting" },
  addLayout("root", "choice-container", "choice-layout"),
  addButton("Yes", yesAction, "choice-container", "yes-btn"),
  addButton("No", noAction, "choice-container", "no-btn"),
];
```

### Pattern 3: Navigation Button

```typescript
const titleScreen = [
  addLayout("root", "menu", "title-menu"),
  addButton(
    "New Game",
    { type: "SwitchScenario", scenario: "prologue", resetState: true },
    "menu"
  ),
  addButton(
    "Load Game",
    { type: "SwitchScenario", scenario: "load-screen" },
    "menu"
  ),
];
```

## Serialization Considerations

### onClick Serialization

The `onClick` field contains a `NovelMessage`, which needs to be serializable for save/load functionality.

**Current Approach**: `NovelMessage` types are plain objects with no functions, so they serialize naturally with `JSON.stringify`.

**Verification**: Ensure all `NovelMessage` variants are serializable:

- ✅ `SwitchScenario` - plain object
- ✅ `Sequence` - array of messages
- ✅ `RemoveWidgets` - array of strings
- etc.

### Example Serialized Button

```json
{
  "id": "abc123",
  "type": "Button",
  "label": "Go to Chapter 2",
  "style": "choice-button",
  "onClick": {
    "type": "Sequence",
    "messages": [
      { "type": "RemoveWidgets", "ids": ["abc123", "def456"] },
      { "type": "SwitchScenario", "scenario": "chapter2" }
    ]
  }
}
```

## Edge Cases

### 1. Button Without onClick

**Problem**: What if a button has no `onClick` handler?

**Solution**: `onClick` is required in the type definition. TypeScript will enforce this at compile time.

### 2. Nested Buttons

**Problem**: Button inside a button?

**Solution**: This is a UI/HTML anti-pattern. The render layer (React) will produce invalid HTML. This should be avoided by scenario authors.

### 3. Rapid Clicks

**Problem**: User clicks button multiple times rapidly.

**Solution**: This is handled at the React component level or by scenario design. Options:

- Debounce clicks at the component level
- Let the game engine handle duplicate messages (idempotent operations)
- Design button onClick to immediately remove the button (preventing further clicks)

### 4. History Tracking

The `AddButton` message should be tracked in history:

```typescript
export interface NovelConfig {
  historyLength: {
    // ... other message types
    AddButton: number; // NEW
  };
}
```

## Benefits

1. **Flexible Actions**

   - Any `NovelMessage` can be triggered by button click
   - Supports complex action sequences

2. **Consistent Architecture**

   - Follows existing widget patterns
   - Uses existing message system

3. **Composable**

   - Can be placed in layouts
   - Can be styled with CSS classes
   - Can be removed with existing `RemoveWidgets` message

4. **Serializable**
   - Works with save/load system
   - Plain object structure

## Implementation Checklist

### Engine Package

- [ ] Create `ButtonWidget` interface in `packages/engine/src/ui/widgets/button.ts`
- [ ] Create `button` helper function in the same file
- [ ] Export from `packages/engine/src/ui/widgets/index.ts`
- [ ] Add `ButtonWidget` to `NovelWidget` union in `packages/engine/src/ui/widgets/core.ts`
- [ ] Create `AddButtonMessage` type in `packages/engine/src/update/message-handlers/widgets/add-button.ts`
- [ ] Create `handleAddButton` function in the same file
- [ ] Create `addButton` helper function in the same file
- [ ] Export from `packages/engine/src/update/message-handlers/widgets/index.ts`
- [ ] Export from `packages/engine/src/update/message-handlers/index.ts`
- [ ] Add `AddButtonMessage` to `NovelMessage` union in `packages/engine/src/update/message.ts`
- [ ] Add case for `'AddButton'` in `packages/engine/src/update/update.ts`
- [ ] Add `AddButton: number` to `NovelConfig.historyLength` default config
- [ ] Export `ButtonWidget` type from `packages/engine/src/index.ts`
- [ ] Add tests for `handleAddButton`

### Driver Package

- [ ] Create `Button` component in `packages/driver/src/react/widgets/button.tsx`
- [ ] Export from `packages/driver/src/react/widgets/index.ts`
- [ ] Add `send` prop to `NovelWidgetDriver` in `packages/driver/src/react/novel-widget-driver.tsx`
- [ ] Add `Button` case to widget switch in `NovelWidgetDriver`
- [ ] Update `Layout` component to accept and pass `send` prop
- [ ] Update `TextBox` component to accept and pass `send` prop
- [ ] Update any example code that uses `NovelWidgetDriver`

### Example App

- [ ] Update `GamePage.tsx` to pass `send` to `NovelWidgetDriver`
- [ ] Add example scenario with choice buttons
