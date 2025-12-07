# Tutorial Novel Game Development Plan

## Overview

This document outlines the implementation plan for the tutorial novel game located in `examples/tutorial`. The game is an interactive tutorial explaining the "tsuzuri" novel game engine using characters Zundamon and Metan.

## Project Context

- **Base Project**: `novel-game-engine-mockup`
- **Target Directory**: `examples/tutorial`
- **Reference Implementation**: `examples/shopping` (existing example game)
- **Engine Packages**: `packages/engine`, `packages/driver`, `packages/elmish`

## Scenario Overview

The tutorial game consists of three main chapters based on `scenario.md`:

1. **Intro (イントロ)**: Zundamon declares wanting to create a novel game, leading to the engine reveal
2. **What is tsuzuri (tsuzuriとは)**: Technical explanation of the engine architecture using Elm Architecture concepts
3. **Ending (おわり)**: Meta conclusion revealing the tutorial itself is a novel game

### Key Features Required

- **Save/Load System**: Slot-based save/load with date/time and text preview
- **Log Display**: History viewer showing up to 50 past dialogues
- **Settings**: BGM volume, SE volume, text speed adjustment with localStorage persistence
- **Skip Button**: UI placeholder only (functionality deferred to future development)
- **Credits Screen**: Display credits after ending

## Assets Status

### Available Assets

Located in `examples/tutorial/src/assets/`:

- **Character Sprites**:
  - Zundamon: `images/zundamon/` (default, smile, thinking, difficulty, sad, surprise, smug, joke)
  - Metan: `images/metan/` (default, smile, thinking, difficulty, speechless, surprise, angry)
- **BGM**: `bgm/` (暴竜ニードルード.mp3, 平氏.mp3, 進軍.mp3, 解説しましょ.mp3)
- **SE**: `se/` (various sound effects from 効果音ラボ)
- **Voices**:
  - Zundamon: `voices/zundamon/001_zundamon.mp3` ~ `023_zundamon.mp3`
  - Metan: `voices/metan/001_metan.mp3` ~ `015_metan.mp3`
- **Elm Images**: `images/elm/` (elm.webp, elm_architecture.webp)

### Missing Assets (Use Placeholders)

The following images are referenced in `scenario.md` but not yet provided. Create placeholder images with text labels:

1. **Living Room Background** ("おうちのリビング"): Home interior background
2. **Source Code Image** ("ソースコード"): Code snippet screenshot
3. **Game Screen Examples** ("ゲーム画面の例1/2/3"): Mock game screenshots
4. **KAG Tag Example** ("KAGタグの例"): Script tag example screenshot
5. **Scenario Management Code** ("シナリオ管理のソースコード"): TypeScript code example
6. **Tutorial Game Screen** ("チュートリアルのゲーム画面"): Self-referential screenshot

## Design & Layout Strategy

### 1. Design Direction

**Target Audience**: Engineers and developers interested in novel game development

**Design Principles**:
- **Playful but Professional**: Balance Zundamon/Metan's comedic energy with technical credibility
- **High Readability**: Technical explanations must be clearly legible
- **Visual Hierarchy**: Distinguish between dialogue modes (speech bubbles vs text box)

**Color Palette**:
- **Primary**: Soft pastels matching character designs (green for Zundamon, pink for Metan)
- **Accent**: Blue/purple for technical UI elements
- **Background**: Light gradients for non-distracting readability
- **Text**: High contrast dark text on light backgrounds

**Typography**:
- **Dialogue Font**: Japanese-friendly sans-serif (e.g., Noto Sans JP)
- **UI Font**: Clean modern font for buttons/labels
- **Code Font**: Monospace for code snippets (e.g., JetBrains Mono)

### 2. Chapter-Specific Layouts

#### Chapter 1: Intro (Speech Bubble Mode)

```
┌─────────────────────────────────────────┐
│  [Background: Living Room]              │
│                                         │
│     [Zundamon]      [Metan]             │
│        ╱￣￣￣╲                          │
│       │ Speech │                        │
│       │ Bubble │                        │
│        ╲______╱                         │
│                                         │
│                    [UI Controls]        │
│                    [Save][Load][Skip]   │
│                    [Log][Config]        │
└─────────────────────────────────────────┘
```

**Characteristics**:
- Minimal UI, focus on characters
- Speech bubbles positioned near characters
- Transparent UI buttons in bottom-right corner
- Animations: Character hop (反復横跳び), fade in/out

#### Chapter 2: What is tsuzuri (Text Box Mode)

```
┌─────────────────────────────────────────┐
│  [Background: Neutral/Diagrams]         │
│                                         │
│  [Dynamic Image Layer]                  │
│  (Elm logo, architecture diagram, etc.) │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ┌─────────┐                       │  │
│  │ │ Speaker │  Dialogue text here   │  │
│  │ │  Name   │  ...                  │  │
│  │ └─────────┘                       │  │
│  │              [Controls]           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Characteristics**:
- Traditional text box at bottom
- Character name label on left side of text box
- Image layer above text box for diagrams/screenshots
- Same UI controls embedded in text box corner
- Clean, diagram-friendly design

#### Chapter 3: Ending (Speech Bubble Mode)

Same layout as Chapter 1, returning to comedic presentation.

### 3. UI Component Specifications

#### Control Panel (All Chapters)

Position: Bottom-right corner, overlaying content
Buttons: Semi-transparent (opacity: 0.5), full opacity on hover
Icons: Simple, recognizable symbols
- Save: Floppy disk icon
- Load: Folder icon
- Skip: Fast-forward icon (disabled state for now)
- Log: Document/list icon
- Config: Gear icon

#### Text Box (Chapter 2)

- Background: Semi-transparent white/light gray (rgba(255, 255, 255, 0.9))
- Border: Subtle rounded corners (8px)
- Padding: Comfortable spacing (16px)
- Character Name Box: Colored accent based on speaker
- Font Size: Readable (16-18px body text)

#### Speech Bubbles (Chapters 1 & 3)

- Tail pointing toward character
- Character-themed colors (Zundamon: light green, Metan: light pink)
- Rounded, friendly shapes
- Text centered or left-aligned based on length

#### Modal Screens (Save/Load/Log/Config)

- Semi-transparent overlay background
- Centered modal with clean white card design
- "Back" button clearly visible
- List items (save slots, log entries) with hover states

## Directory Structure

```
examples/tutorial/
├── src/
│   ├── assets/
│   │   ├── bgm/           # Background music files
│   │   ├── se/            # Sound effects
│   │   ├── voices/        # Character voice files
│   │   │   ├── zundamon/
│   │   │   └── metan/
│   │   └── images/        # Image assets
│   │       ├── zundamon/  # Character sprites
│   │       ├── metan/
│   │       ├── elm/       # Technical diagrams
│   │       ├── backgrounds/  # Background images (to create)
│   │       └── placeholders/ # Placeholder images (to create)
│   ├── components/        # Reusable UI components
│   │   ├── FadeTransition.tsx
│   │   ├── SpeechBubble.tsx       # To create
│   │   ├── ControlPanel.tsx       # To create
│   │   └── CharacterSprite.tsx    # To create
│   ├── pages/             # Page components
│   │   ├── AudioConfirmPage.tsx   # Audio permission request
│   │   ├── TitlePage.tsx          # Title screen
│   │   ├── GamePage.tsx           # Main game view
│   │   ├── SavePage.tsx           # Save slot selection
│   │   ├── LoadPage.tsx           # Load slot selection
│   │   ├── LogPage.tsx            # Dialogue history (to create)
│   │   ├── ConfigPage.tsx         # Settings screen (to create)
│   │   └── CreditsPage.tsx        # Credits screen (to create)
│   ├── game/              # Game logic
│   │   ├── scenario.ts            # Scenario definitions (to create)
│   │   ├── helpers.ts             # Helper functions (to create)
│   │   └── assets.ts              # Asset imports (to create)
│   ├── hooks/             # Custom React hooks
│   │   ├── useSaveSlots.ts        # Save/load management
│   │   └── useConfig.ts           # Settings persistence (to create)
│   ├── types/             # TypeScript types
│   │   └── router.ts              # Routing types
│   ├── libs/              # Library wrappers
│   │   └── mixer-driver.ts        # Audio driver
│   ├── App.tsx            # Main app with routing
│   ├── frontend.tsx       # React root
│   ├── index.ts           # Entry point
│   ├── index.html         # HTML template
│   └── index.css          # Global styles
├── build.ts               # Build script
├── package.json
├── tsconfig.json
└── bunfig.toml
```

## Implementation Steps

### Phase 1: Project Setup

1. **Review Existing Structure**
   - Examine `examples/shopping` implementation
   - Identify reusable patterns and components
   - Check `packages/engine` and `packages/driver` APIs

2. **Create Missing Directories**
   ```bash
   mkdir -p src/pages
   mkdir -p src/components
   mkdir -p src/game
   mkdir -p src/hooks
   mkdir -p src/types
   mkdir -p src/assets/images/backgrounds
   mkdir -p src/assets/images/placeholders
   ```

3. **Generate Placeholder Assets**
   Create simple placeholder images for missing assets using canvas or image generation:
   - Living room background (1920x1080)
   - Source code screenshot
   - Game screen examples (3 variations)
   - KAG tag example
   - Scenario code example
   - Tutorial game screenshot

### Phase 2: Core Infrastructure

1. **Routing Setup** (`src/types/router.ts`, `src/App.tsx`)
   - Define router state types for all pages
   - Implement state-based navigation
   - Add fade transition support

2. **Asset Management** (`src/game/assets.ts`)
   ```typescript
   // Import all assets with proper typing
   export const bgm = {
     bouryuu: require('./assets/bgm/暴竜ニードルード.mp3'),
     heishi: require('./assets/bgm/平氏.mp3'),
     // ... etc
   };
   
   export const sprites = {
     zundamon: {
       default: require('./assets/images/zundamon/default.webp'),
       // ... etc
     },
     metan: {
       default: require('./assets/images/metan/default.webp'),
       // ... etc
     }
   };
   ```

3. **Configuration Hook** (`src/hooks/useConfig.ts`)
   ```typescript
   interface GameConfig {
     bgmVolume: number;      // 0-1
     seVolume: number;       // 0-1
     textSpeed: number;      // ms per character
   }
   
   export function useConfig() {
     // Load from localStorage on mount
     // Provide update function that persists to localStorage
     // Return config state and setter
   }
   ```

### Phase 3: UI Components

#### 3.1 Layout Components

1. **SpeechBubble** (`src/components/SpeechBubble.tsx`)
   - Props: character, text, position
   - Styled with character-specific colors
   - Tail pointing logic

2. **ControlPanel** (`src/components/ControlPanel.tsx`)
   - Props: onSave, onLoad, onSkip, onLog, onConfig
   - Semi-transparent floating panel
   - Icon buttons with tooltips

3. **CharacterSprite** (`src/components/CharacterSprite.tsx`)
   - Props: character, expression, position, animation
   - CSS animation support
   - Fade in/out transitions

#### 3.2 Page Components

1. **TitlePage** (`src/pages/TitlePage.tsx`)
   - Background with title graphic
   - "Start", "Continue", "Credits" buttons
   - BGM playback on mount

2. **GamePage** (`src/pages/GamePage.tsx`)
   - Integrate `NovelWidgetDriver` from `@packages/driver`
   - Render based on current scenario state
   - Handle user clicks to advance dialogue
   - Control panel integration

3. **LogPage** (`src/pages/LogPage.tsx`)
   - Extract text messages from `model.history`
   - Display in reverse chronological order
   - Limit to 50 entries
   - Scrollable list with character names

4. **ConfigPage** (`src/pages/ConfigPage.tsx`)
   - Sliders for BGM volume, SE volume
   - Slider/buttons for text speed
   - Preview functionality
   - Save to localStorage on change

5. **CreditsPage** (`src/pages/CreditsPage.tsx`)
   - Display credits from `scenario.md`
   - Scrolling or paginated format
   - Links to external resources

### Phase 4: Game Logic

1. **Helper Functions** (`src/game/helpers.ts`)
   Reference `examples/shopping/src/game/helpers.ts`:
   ```typescript
   // Character layout management
   export const CHARACTER_LAYOUT_ID = 'character-layer';
   export const TEXTBOX_ID = 'textbox';
   
   // Helper for showing dialogue
   export const showDialog = (text: string): NovelMessage => { ... };
   
   // Helper for showing speech bubble
   export const showSpeechBubble = (
     character: 'zundamon' | 'metan',
     text: string,
     voice?: string
   ): NovelMessage => { ... };
   
   // Background change helper
   export const changeBackground = (imageId: string, src: string): NovelMessage => { ... };
   
   // Character sprite helper
   export const showCharacter = (
     character: 'zundamon' | 'metan',
     expression: string,
     position?: 'left' | 'right'
   ): NovelMessage => { ... };
   ```

2. **Scenario Definition** (`src/game/scenario.ts`)
   
   Structure:
   ```typescript
   import { NovelMessage, sequence, addTrack, playChannel, ... } from 'engine';
   import { showSpeechBubble, showDialog, ... } from './helpers';
   import * as assets from './assets';
   
   export const SCENARIOS = {
     intro: 'intro',
     explanation: 'explanation',
     ending: 'ending',
     credits: 'credits',
   } as const;
   
   const createIntroScenario = (): NovelMessage[] => {
     return [
       // Setup: background, BGM, characters
       sequence([
         addWidgets([/* root layout */]),
         addTrack({ id: 'bgm-bouryuu', src: assets.bgm.bouryuu, ... }),
         playChannel({ channelId: 'bgm-bouryuu' }),
       ]),
       
       // Dialogue sequence
       showSpeechBubble('zundamon', 'うおーーーーーー！！！', assets.voices.zundamon['001']),
       awaitAction(),
       showSpeechBubble('zundamon', 'ノベルゲームが、作りたいのだ！！！', assets.voices.zundamon['002']),
       awaitAction(),
       // ... continue based on scenario.md
     ];
   };
   
   const createExplanationScenario = (): NovelMessage[] => { ... };
   const createEndingScenario = (): NovelMessage[] => { ... };
   const createCreditsScenario = (): NovelMessage[] => { ... };
   
   export const createScenarios = (): Record<string, NovelMessage[]> => ({
     [SCENARIOS.intro]: createIntroScenario(),
     [SCENARIOS.explanation]: createExplanationScenario(),
     [SCENARIOS.ending]: createEndingScenario(),
     [SCENARIOS.credits]: createCreditsScenario(),
   });
   ```

### Phase 5: Integration & Testing

1. **App Integration** (`src/App.tsx`)
   - Wire up all page components
   - Implement navigation handlers
   - Initialize game with config from localStorage
   - Handle save/load flow

2. **Build & Test**
   ```bash
   cd examples/tutorial
   bun install
   bun run build
   bun run dev  # Test in browser
   ```

3. **Verify Features**
   - [ ] All three chapters display correctly
   - [ ] Speech bubbles work in Intro/Ending
   - [ ] Text box works in Explanation chapter
   - [ ] Save/Load preserves game state
   - [ ] Log shows dialogue history
   - [ ] Config persists to localStorage
   - [ ] BGM/SE playback works
   - [ ] Voice playback syncs with text
   - [ ] Animations trigger appropriately
   - [ ] Credits display correctly

## Technical Specifications

### Engine API Usage

Reference `packages/engine/src/index.ts` for available messages:

**Core Messages**:
- `sequence([...])`: Execute messages in order
- `awaitAction()`: Wait for user click
- `delay(ms)`: Wait for specified time

**UI Messages**:
- `addWidgets([...])`: Add widgets to scene
- `removeWidgets([...])`: Remove widgets by ID
- `addTextBox({ id, style, ... })`: Create text container
- `addText({ textBoxId, text, ... })`: Add text to box
- `clearTextBox({ id })`: Clear text box content

**Audio Messages**:
- `addTrack({ id, src, volume, loop, ... })`: Register audio track
- `playChannel({ channelId, ... })`: Start playback
- `stopChannel({ channelId, ... })`: Stop playback
- `fadeOutChannel({ channelId, duration })`: Fade out audio

**Scenario Messages**:
- `switchScenario({ scenario, index })`: Change scenario

**Widget Builders** (`w.`):
- `w.layout({ id, style, className })(children)`: Container
- `w.img({ id, src, style, className })`: Image
- `w.button({ id, text, onClick, style })`: Button

### Styling Approach

Use Tailwind CSS classes (already configured in shopping example):
- Layout: `flex`, `absolute`, `relative`, `inset-0`
- Sizing: `w-screen`, `h-screen`, `w-full`, `h-full`
- Spacing: `p-4`, `m-2`, `gap-4`
- Colors: `bg-white`, `text-black`, `bg-opacity-90`
- Effects: `opacity-50`, `hover:opacity-100`, `transition-opacity`

### Animation Implementation

Use CSS classes and `AnimationTicket` system:
- Define animations in `index.css`
- Apply via widget `className` or `style`
- For complex animations, use `addAnimationTicket()` from engine

Example bounce animation:
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-bounce {
  animation: bounce 0.5s ease-in-out;
}
```

## Layout Confirmation Checklist

Before proceeding with full implementation, confirm the following layouts with mockups or wireframes:

### Chapter 1: Intro
- [ ] Living room background fits well
- [ ] Character sprite positions (Zundamon left, Metan right)
- [ ] Speech bubble styling and tail direction
- [ ] Control panel placement and opacity
- [ ] Character animation effects (hop, fade)

### Chapter 2: Explanation
- [ ] Text box design and positioning
- [ ] Character name label styling
- [ ] Image layer for diagrams (Elm logo, architecture)
- [ ] Diagram fade in/out transitions
- [ ] Control panel integration in text box

### Chapter 3: Ending
- [ ] Consistent with Intro layout
- [ ] Meta game screen display (tutorial screenshot)
- [ ] Credits screen design
- [ ] Final fade out to title

### Modal Screens
- [ ] Save slot UI (grid/list layout)
- [ ] Load slot UI with preview text
- [ ] Log display (scrollable list)
- [ ] Config screen (sliders and labels)
- [ ] Credits screen (scrolling text or links)

## Voice & Audio Mapping

### Voice Files

**Zundamon** (Intro chapter):
- 001: "うおーーーーーー！！！"
- 002: "ノベルゲームが、作りたいのだ！！！"
- 003: "めたん、聞いてほしいのだ！"
- ... (continue sequentially through dialogue)
- Skip 023 in this chapter

**Metan** (Intro chapter):
- 001: "はぁ……いつにもましてうるさいですね。今日はどうしたんですか？"
- 002: "ノベルゲーム？　なんでまたノベルゲームなの？..."
- ... (continue sequentially)
- Skip 015 in this chapter

**Ending chapter**:
- Use only 015_metan.mp3 and 023_zundamon.mp3

### BGM & SE Timing

Reference `scenario.md` for exact timing:
- BGM changes (暴竜ニードルード, 平氏, 進軍, 解説しましょ)
- SE triggers (爆発, 和太鼓, etc.)
- Loop start/stop for SE (e.g., 刀の素振り2)

## Development Timeline Estimate

- **Phase 1** (Setup): 2-3 hours
- **Phase 2** (Infrastructure): 3-4 hours
- **Phase 3** (UI Components): 8-10 hours
- **Phase 4** (Scenario): 10-12 hours
- **Phase 5** (Integration & Testing): 4-6 hours

**Total**: ~30-35 hours

## Known Limitations & Future Work

1. **Skip Functionality**: UI placeholder only, no fast-forward logic
2. **Placeholder Images**: Replace with actual graphics when available
3. **Animation Complexity**: Some advanced animations may need engine updates
4. **Voice Sync**: Manual timing required, no automatic lip-sync
5. **Mobile Support**: Layout may need responsive adjustments

## Reference Documentation

- Engine API: `packages/engine/README.md`, `packages/engine/CLAUDE.md`
- Driver API: `packages/driver/README.md`, `packages/driver/CLAUDE.md`
- Shopping Example: `examples/shopping/` (complete reference implementation)
- Scenario Spec: `examples/tutorial/scenario.md`

## Success Criteria

The implementation is complete when:

1. All three chapters play from start to finish
2. Save/Load works correctly at any point
3. Log displays past dialogue accurately
4. Settings persist across browser sessions
5. All voice lines play in sync with text
6. BGM and SE trigger at correct moments
7. Character sprites and backgrounds display properly
8. Credits screen shows all attributions
9. No critical errors in browser console
10. Game matches the tone and flow of `scenario.md`
