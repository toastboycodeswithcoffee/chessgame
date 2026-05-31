# Chess Master - Project Plan

## Overview

Build a single-player chess web application using Angular and deploy it on Netlify.

The application will:

* Allow users to play chess against an AI opponent.
* Provide 5 difficulty levels.
* Track player statistics without requiring login.
* Store player data using a unique browser-generated identifier.
* Save game history and statistics in a database.
* Run the chess engine directly in the browser for fast gameplay.

---

# Tech Stack

## Frontend

* Angular (Latest Stable Version)
* TypeScript
* Angular Material (Optional)
* ngx-chess-board (or custom chess board)

## Chess Logic

* chess.js
* Stockfish.js

## Storage

### Browser Storage

Store:

* playerId (UUID)
* UI preferences
* Last played game state (optional)

### Database

Recommended:

* Turso (SQLite-compatible cloud database)

Alternative:

* Supabase
* Neon

---

# Hosting

Frontend:

* Netlify

Repository:

* GitHub

---

# User Identification

No login system.

On first visit:

1. Generate UUID
2. Store UUID in localStorage
3. Create player record in database

Example:

```typescript
const playerId = crypto.randomUUID();
localStorage.setItem('playerId', playerId);
```

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

# Features - Version 1

## Home Page

* Start Game
* Difficulty Selection
* Statistics Overview

## Game Page

* Chess Board
* Move History
* New Game
* Resign Game
* Difficulty Indicator

## Statistics Page

* Total Games Played
* Wins
* Losses
* Draws
* Win Percentage
* Highest Difficulty Beaten

---

# Database Design

## Players

```sql
CREATE TABLE players (
    player_id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    highest_level_beaten INTEGER DEFAULT 0
);
```

## Games

```sql
CREATE TABLE games (
    game_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    result TEXT NOT NULL,
    moves TEXT,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

# Project Structure

```text
src/
|
├── app/
│
├── pages/
│   ├── home/
│   ├── game/
│   └── stats/
│
├── components/
│   ├── chess-board/
│   ├── move-history/
│   └── difficulty-selector/
│
├── services/
│   ├── chess.service.ts
│   ├── stockfish.service.ts
│   ├── player.service.ts
│   └── stats.service.ts
│
├── models/
│   ├── player.model.ts
│   ├── game.model.ts
│   └── stats.model.ts
│
└── shared/
```

---

# Development Phases

## Phase 1 - Project Setup

### Tasks

* Create Angular project
* Push repository to GitHub
* Configure Netlify deployment
* Setup routing
* Create project structure

### Deliverables

* Angular application running
* GitHub repository created
* Netlify deployment successful

---

## Phase 2 - Chess Board

### Tasks

* Integrate chess.js
* Add chess board UI
* Allow legal moves
* Detect game over conditions

### Deliverables

* Playable local chess game

---

## Phase 3 - AI Integration

### Tasks

* Integrate Stockfish.js
* Create Web Worker
* Implement difficulty levels
* Connect AI to board

### Deliverables

* Human vs AI gameplay

---

## Phase 4 - Player Tracking

### Tasks

* Generate playerId
* Save player information
* Store game results
* Create statistics page

### Deliverables

* Persistent player statistics

---

## Phase 5 - UI Improvements

### Tasks

* Responsive layout
* Animations
* Loading indicators
* Theme improvements

### Deliverables

* Production-ready UI

---

# Future Enhancements

## Version 2

* Daily chess puzzles
* Save and resume games
* Opening explorer
* AI hints

## Version 3

* Multiplayer support
* Leaderboards
* User accounts
* Tournament mode

---

# MVP Success Criteria

The project is considered complete when:

* User can play against AI.
* Five difficulty levels work correctly.
* No login is required.
* Player statistics are stored.
* Game history is saved.
* Application is deployed on Netlify.
* Source code is available on GitHub.
