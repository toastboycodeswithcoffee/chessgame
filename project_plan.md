# KnightFall - Chess Game Specification

## Project Overview

KnightFall is a single-player chess application built with Angular.

Players can play against an AI opponent with five difficulty levels, track their performance, and review previous games.

The application will be fully hosted on Netlify and will not require:

* User accounts
* Login or registration
* Backend services
* Databases

All player data will be stored locally in the browser.

---

# Objectives

## Primary Goals

* Play chess against an AI opponent
* Support 5 difficulty levels
* Track player statistics
* Save game history
* Deploy entirely on Netlify
* Work on desktop and mobile devices

## Non-Goals (Version 1)

* Multiplayer gameplay
* User authentication
* Cloud synchronization
* Online leaderboards
* Social features

---

# Technology Stack

## Frontend

* Angular (Latest Stable Version)
* TypeScript
* Angular Standalone Components
* Angular Router

## Chess Libraries

### Game Rules

* chess.js

Responsibilities:

* Legal move validation
* Check detection
* Checkmate detection
* Stalemate detection
* PGN generation
* FEN generation

### AI Engine

* Stockfish.js

Responsibilities:

* AI move calculation
* Difficulty management

### Chess Board UI

Options:

* ngx-chess-board
* Custom board implementation

Recommended:

* Start with ngx-chess-board
* Move to custom board later if needed

---

# Application Architecture

```text
Angular Application
│
├── Chess Board UI
├── chess.js
├── Stockfish.js
├── Local Storage
│
└── Netlify Hosting
```

No backend required.

No database required.

No API required.

---

# Player Identification

The application identifies players using a browser-generated UUID.

Generated on first visit:

```typescript
const playerId = crypto.randomUUID();

localStorage.setItem(
  'playerId',
  playerId
);
```

This identifier remains available until browser storage is cleared.

---

# Difficulty Levels

| Level | Name     | Stockfish Depth |
| ----- | -------- | --------------- |
| 1     | Beginner | 1               |
| 2     | Easy     | 3               |
| 3     | Medium   | 5               |
| 4     | Hard     | 8               |
| 5     | Expert   | 12              |

---

# Features

## Home Screen

### Display

* Application title
* Start New Game
* Statistics
* Game History

### Actions

* Select difficulty
* Start game
* View statistics
* View previous games

---

## Game Screen

### Display

* Chess board
* Captured pieces
* Move history
* Current difficulty

### Actions

* Make move
* Start new game
* Resign game

### Rules

* Legal move validation
* Check detection
* Checkmate detection
* Draw detection

---

## Statistics Screen

Display:

* Games played
* Wins
* Losses
* Draws
* Win percentage
* Current win streak
* Longest win streak
* Highest difficulty beaten

---

## History Screen

Display:

* Previous games
* Difficulty played
* Result
* Date played

Future Enhancement:

* Replay game using PGN

---

# Local Storage Design

## Player Information

Storage Key

```text
knightfall-player
```

Structure

```json
{
  "playerId": "uuid",
  "createdAt": "2026-05-31T10:00:00Z"
}
```

---

## Statistics

Storage Key

```text
knightfall-stats
```

Structure

```json
{
  "gamesPlayed": 0,
  "wins": 0,
  "losses": 0,
  "draws": 0,
  "currentStreak": 0,
  "longestStreak": 0,
  "highestDifficultyBeaten": 0
}
```

---

## Game History

Storage Key

```text
knightfall-games
```

Structure

```json
[
  {
    "gameId": "uuid",
    "difficulty": 3,
    "result": "WIN",
    "moveCount": 42,
    "durationSeconds": 820,
    "playedAt": "2026-05-31T10:15:00Z",
    "pgn": "1.e4 e5 2.Nf3 ..."
  }
]
```

Store only the most recent 100 games.

---

# Angular Project Structure

```text
src/app
│
├── core
│   ├── models
│   └── services
│
├── features
│   ├── home
│   ├── game
│   ├── stats
│   └── history
│
├── shared
│   └── components
│
└── layout
```

---

# Services

## ChessService

Responsibilities:

* Create game
* Make move
* Undo move
* Check game state
* Generate PGN

Methods:

```typescript
newGame()

makeMove()

undoMove()

getFen()

getPgn()

isGameOver()
```

---

## StockfishService

Responsibilities:

* Initialize worker
* Configure difficulty
* Request best move

Methods:

```typescript
initialize()

setDifficulty()

getBestMove()

terminate()
```

---

## StorageService

Responsibilities:

* Read localStorage
* Write localStorage
* Manage player data
* Manage statistics
* Manage game history

Methods:

```typescript
getPlayer()

savePlayer()

getStats()

saveStats()

getGames()

saveGame()
```

---

# Data Flow

```text
Player Move
      │
      ▼
Chess Board
      │
      ▼
ChessService
      │
      ▼
chess.js Validation
      │
      ▼
Generate FEN
      │
      ▼
Stockfish Worker
      │
      ▼
Best Move
      │
      ▼
Board Update
      │
      ▼
Game Finished?
      │
      ├── No → Continue
      │
      └── Yes
             │
             ▼
      Update Statistics
             │
             ▼
      Save Game History
```

---

# Development Roadmap

## Phase 1 - Setup

Tasks:

* Create Angular project
* Configure routing
* Configure GitHub repository
* Configure Netlify deployment

Deliverable:

* Angular application deployed

---

## Phase 2 - Chess Board

Tasks:

* Install chess.js
* Add chess board UI
* Implement legal moves

Deliverable:

* Local chess game

---

## Phase 3 - AI Opponent

Tasks:

* Integrate Stockfish
* Configure Web Worker
* Add difficulty levels

Deliverable:

* Human vs AI gameplay

---

## Phase 4 - Statistics

Tasks:

* Create StorageService
* Track wins/losses
* Track streaks

Deliverable:

* Persistent player statistics

---

## Phase 5 - Game History

Tasks:

* Save PGN
* Save completed games
* Build history page

Deliverable:

* Previous game tracking

---

## Phase 6 - Polish

Tasks:

* Mobile responsiveness
* Loading indicators
* Animations
* Error handling

Deliverable:

* Production-ready release

---

# MVP Success Criteria

The MVP is complete when:

* Chess board functions correctly
* AI opponent is working
* Five difficulty levels are available
* Statistics are stored locally
* Game history is stored locally
* Application is mobile responsive
* Application is deployed on Netlify
* Source code is available on GitHub
* No login is required
* No backend is required
