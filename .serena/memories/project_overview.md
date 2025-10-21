# Project Overview

## Purpose
This is a novel game engine mockup project that implements a visual novel/interactive story engine using the Elmish architecture pattern. The project consists of:

- **elmish**: A TypeScript implementation of the Elm architecture
- **engine**: The core novel game engine that uses elmish for state management
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

## Key Components
- **Model**: Represents the game state (mixer, UI widgets, flags)
- **Messages**: Define actions/events in the game
- **Update handlers**: Process messages and update state
- **UI Manager**: Manages widget hierarchy (layouts, text boxes, images, etc.)
- **Mixer**: Audio system for managing channels and volume