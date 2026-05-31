import { Injectable, computed, signal } from '@angular/core';
import { GameRecord, GameResult, Stats } from './models';
import { Chess } from 'chess.js';

export interface DifficultyLevel {
  level: number;
  name: string;
  depth: number;
}

const STORAGE_KEY = 'knight-fall-storage';
const PLAYER_KEY = 'knight-fall-player-id';

@Injectable({ providedIn: 'root' })
export class ChessService {
  readonly difficultyLevels: DifficultyLevel[] = [
    { level: 1, name: 'Beginner', depth: 1 },
    { level: 2, name: 'Easy', depth: 3 },
    { level: 3, name: 'Medium', depth: 5 },
    { level: 4, name: 'Hard', depth: 8 },
    { level: 5, name: 'Expert', depth: 12 }
  ];

  readonly playerId = signal('');
  readonly difficulty = signal(3);
  readonly stats = signal<Stats>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    highestDifficultyBeaten: 0
  });
  readonly history = signal<GameRecord[]>([]);
  readonly winPercentage = computed(() => {
    const played = this.stats().gamesPlayed;
    return played ? Math.round((this.stats().wins / played) * 100) : 0;
  });

  // Game state
  readonly game = signal<Chess | null>(null);
  readonly moves = signal<string[]>([]);
  readonly gameHistory = signal<string[]>([]);
  readonly isGameActive = signal(false);
  readonly currentGameDifficulty = signal(3);

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private get storage(): Storage | null {
    return this.isBrowser ? window.localStorage : null;
  }

  constructor() {
    this.initPlayer();
    this.load();
  }

  initPlayer(): void {
    const savedId = this.storage?.getItem(PLAYER_KEY);

    if (savedId) {
      this.playerId.set(savedId);
      return;
    }

    const newId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : this.generateFallbackId();
    this.storage?.setItem(PLAYER_KEY, newId);
    this.playerId.set(newId);
  }

  setDifficulty(level: number): void {
    if (level >= 1 && level <= 5) {
      this.difficulty.set(level);
      if (this.isGameActive()) {
        this.currentGameDifficulty.set(level);
      }
      this.save();
    }
  }

  newGame(): void {
    const chess = new Chess();
    this.game.set(chess);
    this.moves.set([]);
    this.gameHistory.set([]);
    this.isGameActive.set(true);
    this.currentGameDifficulty.set(this.difficulty());
  }

  makeMove(from: string, to: string, promotion?: string): boolean {
    const chess = this.game();
    if (!chess || !this.isGameActive()) return false;

    try {
      const move = chess.move({
        from,
        to,
        promotion: (promotion || 'q') as 'q' | 'r' | 'b' | 'n'
      });

      if (move) {
        this.moves.update(m => [...m, `${from}${to}`]);
        this.gameHistory.update(h => [...h, chess.fen()]);

        // Check game state
        if (chess.isCheckmate()) {
          const result: GameResult = chess.turn() === 'w' ? 'loss' : 'win';
          this.endGame(result);
          this.isGameActive.set(false);
        } else if (chess.isDraw()) {
          this.endGame('draw');
          this.isGameActive.set(false);
        }

        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  undoMove(): boolean {
    const chess = this.game();
    if (!chess || this.moves().length === 0) return false;

    const lastMove = chess.undo();
    if (lastMove) {
      this.moves.update(m => m.slice(0, -1));
      this.gameHistory.update(h => h.slice(0, -1));
      return true;
    }
    return false;
  }

  resign(): void {
    if (this.isGameActive()) {
      this.endGame('loss');
      this.isGameActive.set(false);
    }
  }

  getFen(): string {
    return this.game()?.fen() ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }

  getPgn(): string {
    return this.game()?.pgn() ?? '';
  }

  getLegalMoves(square?: string): string[] {
    const chess = this.game();
    if (!chess) return [];

    if (square) {
      const moves = chess.moves({ square: square as any, verbose: true });
      return moves.map(m => m.san);
    }

    return chess.moves();
  }

  getBoard() {
    const chess = this.game();
    if (!chess) {
      const newChess = new Chess();
      return newChess.board();
    }
    return chess.board();
  }

  isCheckmate(): boolean {
    return this.game()?.isCheckmate() ?? false;
  }

  isStalemate(): boolean {
    return this.game()?.isStalemate() ?? false;
  }

  isDraw(): boolean {
    return this.game()?.isDraw() ?? false;
  }

  isCheck(): boolean {
    return this.game()?.isCheck() ?? false;
  }

  isGameOver(): boolean {
    return this.game()?.isGameOver() ?? false;
  }

  getTurn(): 'w' | 'b' {
    return (this.game()?.turn() as 'w' | 'b') ?? 'w';
  }

  recordGame(result: GameResult): void {
    const difficulty = this.currentGameDifficulty();
    const stats = this.stats();
    const nextStats: Stats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      currentWinStreak: stats.currentWinStreak,
      longestWinStreak: stats.longestWinStreak,
      highestDifficultyBeaten: stats.highestDifficultyBeaten
    };

    if (result === 'win') {
      nextStats.wins += 1;
      nextStats.currentWinStreak += 1;
      nextStats.longestWinStreak = Math.max(nextStats.longestWinStreak, nextStats.currentWinStreak);
      nextStats.highestDifficultyBeaten = Math.max(nextStats.highestDifficultyBeaten, difficulty);
    } else if (result === 'loss') {
      nextStats.losses += 1;
      nextStats.currentWinStreak = 0;
    } else {
      nextStats.draws += 1;
      nextStats.currentWinStreak = 0;
    }

    this.stats.set(nextStats);
    const gameRecord: GameRecord = {
      id: this.generateFallbackId(),
      date: new Date().toISOString(),
      result,
      difficulty,
      moves: this.moves()
    };

    this.history.update((current) => [gameRecord, ...current].slice(0, 100));
    this.save();
  }

  private endGame(result: GameResult): void {
    this.recordGame(result);
  }

  get currentDifficultyName(): string {
    const level = this.difficulty();
    return this.difficultyLevels.find((item) => item.level === level)?.name ?? 'Medium';
  }

  getCurrentGameDifficultyName(): string {
    const level = this.currentGameDifficulty();
    return this.difficultyLevels.find((item) => item.level === level)?.name ?? 'Medium';
  }

  private load(): void {
    const raw = this.storage?.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { stats?: Stats; history?: GameRecord[]; difficulty?: number };

      if (parsed.stats) {
        this.stats.set(parsed.stats);
      }

      if (Array.isArray(parsed.history)) {
        this.history.set(parsed.history);
      }

      if (typeof parsed.difficulty === 'number') {
        this.difficulty.set(parsed.difficulty);
      }
    } catch {
      this.storage?.removeItem(STORAGE_KEY);
    }
  }

  private save(): void {
    this.storage?.setItem(
      STORAGE_KEY,
      JSON.stringify({
        stats: this.stats(),
        history: this.history(),
        difficulty: this.difficulty()
      })
    );
  }

  private generateFallbackId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
