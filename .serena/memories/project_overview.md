# Project Overview

## Purpose

This is **tsuzuri**, a novel game engine project that implements a visual novel/interactive story engine using the Elmish architecture pattern. The project consists of:

- **@ichi-h/tsuzuri-core**: The core novel game engine that uses `@ichi-h/elmish` for state management
- **@ichi-h/tsuzuri-driver**: Driver layer providing React components, audio mixer, and model persistence
- **examples/shopping**: A shopping-themed example application
- **examples/tutorial**: A tutorial example application featuring character dialogues

The project uses `@ichi-h/elmish` (external dependency) for Elm architecture implementation.

## Tech Stack

- **Runtime**: Bun (v1.3.0)
- **Language**: TypeScript (strict mode)
- **Testing**: Bun test framework with coverage support
- **Linting/Formatting**: Biome
- **Build**: Turbo (monorepo build system)
- **Package Management**: Bun workspaces
- **Git Hooks**: Lefthook

## Architecture

The project follows a monorepo structure with:

- Workspace packages in `packages/*` (`core`, `driver`)
- Example applications in `examples/*` (`shopping`, `tutorial`)
- The engine uses an Elmish (Elm Architecture) pattern provided by `@ichi-h/elmish`:
  - Model: State representation
  - Update: Message handlers for state transitions
  - View: UI rendering
  - Commands: Side effects that return messages

## Dependencies

- **@ichi-h/elmish**: External dependency providing TypeScript implementation of the Elm architecture with Model-Update-View pattern, command system for side effects, and type-safe message dispatching

## Package Details

### packages/core (@ichi-h/tsuzuri-core)

Core novel game engine with:

- **Model**: Game state with NovelStatus (Processed/Merged/Inserted/Delaying/Error), mixer object containing value and isApplying flag, UI widgets, animationTickets, message history, and config
- **Messages**: Type-safe actions/events for state transitions
- **Update handlers**: Organized in subdirectories (mixer/, general/, widgets/)
- **UI Manager**: Widget hierarchy management (layouts, text boxes, images, text)
- **Mixer**: Audio channel and volume management
- **Middleware**: Message processing pipeline

### packages/driver (@ichi-h/tsuzuri-driver)

Driver layer providing platform-specific implementations:

- **mixer/**: Audio mixer implementation with fetching capabilities
- **persistence/**: Model serialization and persistence (localStorage, etc.)
- **react/**: React widget components and driver for rendering NovelModel

## Key Components

- **NovelModel**: State with status (Processed/Merged/Inserted/Delaying/Error), index, mixer (with value and isApplying flag), UI widgets, animationTickets, history, and config
- **Messages**: Type-safe actions/events in the game
- **Update handlers**: Process messages and update state (organized by category)
- **UI Manager**: Manages widget hierarchy (layouts, text boxes, images, text)
- **Mixer**: Audio system for managing channels and volume
- **Driver**: React components, audio mixer implementation, and persistence layer

## Example Applications

### examples/shopping

A shopping-themed example application demonstrating the engine capabilities:
- Uses `@ichi-h/tsuzuri-core` and `@ichi-h/tsuzuri-driver`
- React 19 with Tailwind CSS 4
- Features save/load functionality
- Development: `bun dev`, Production: `bun start`

### examples/tutorial

A tutorial example application featuring character dialogues:
- Uses `@ichi-h/tsuzuri-core` and `@ichi-h/tsuzuri-driver`
- React 19 with Tailwind CSS 4
- Includes character voices and assets (zundamon, metan)
- Development: `bun dev`, Production: `bun start`
