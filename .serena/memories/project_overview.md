# Project Overview

## Purpose
This is a novel game engine mockup project that implements a visual novel/interactive story engine using the Elmish architecture pattern. The project consists of:

- **elmish**: A TypeScript implementation of the Elm architecture
- **engine**: The core novel game engine that uses elmish for state management
- **driver**: Driver layer providing React components, audio mixer, and model persistence
- **examples/react**: A React example application demonstrating the engine

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
- Workspace packages in `packages/*`
- Example applications in `examples/*`
- The engine uses an Elmish (Elm Architecture) pattern with:
  - Model: State representation
  - Update: Message handlers for state transitions
  - View: UI rendering
  - Commands: Side effects that return messages

## Package Details

### packages/elmish
TypeScript implementation of the Elm architecture providing:
- State management with Model-Update-View pattern
- Command system for side effects
- Type-safe message dispatching

### packages/engine
Core novel game engine with:
- **Model**: Game state including status, mixer, UI widgets, animations, history, and config
- **Messages**: Type-safe actions/events for state transitions
- **Update handlers**: Organized in subdirectories (mixer/, general/, widgets/)
- **UI Manager**: Widget hierarchy management (layouts, text boxes, images, text)
- **Mixer**: Audio channel and volume management
- **Middleware**: Message processing pipeline

### packages/driver
Driver layer providing platform-specific implementations:
- **mixer/**: Audio mixer implementation with fetching capabilities
- **persistence/**: Model serialization and persistence (localStorage, etc.)
- **react/**: React widget components and driver for rendering NovelModel

## Key Components
- **NovelModel**: State with status (Processed/Intercepted/Error), index, mixer, UI widgets, delays, animations, history, and config
- **Messages**: Type-safe actions/events in the game
- **Update handlers**: Process messages and update state (organized by category)
- **UI Manager**: Manages widget hierarchy (layouts, text boxes, images, text)
- **Mixer**: Audio system for managing channels and volume
- **Driver**: React components, audio mixer implementation, and persistence layer