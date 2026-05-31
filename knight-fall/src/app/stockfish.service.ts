import { Injectable, signal } from '@angular/core';
import { Chess } from 'chess.js';

@Injectable({ providedIn: 'root' })
export class StockfishService {
  private worker: Worker | null = null;
  readonly isReady = signal(false);
  readonly isThinking = signal(false);

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof Worker !== 'undefined';
  }

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      // Create a worker that will run Stockfish
      this.worker = new Worker(new URL('./stockfish.worker.ts', import.meta.url), { type: 'module' });
      
      this.worker.onmessage = (event) => {
        if (event.data.type === 'ready') {
          this.isReady.set(true);
        }
      };

      this.worker.postMessage({ type: 'init' });
    } catch (error) {
      console.error('Failed to initialize Stockfish worker:', error);
    }
  }

  setDifficulty(depth: number): void {
    if (this.worker) {
      this.worker.postMessage({ type: 'setDifficulty', depth });
    }
  }

  async getBestMove(fen: string, depth: number = 5): Promise<string> {
    return new Promise((resolve) => {
      if (!this.worker) {
        // Fallback: return a random legal move
        const chess = new Chess(fen);
        const moves = chess.moves();
        resolve(moves[Math.floor(Math.random() * moves.length)]);
        return;
      }

      this.isThinking.set(true);

      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'bestMove') {
          this.worker?.removeEventListener('message', messageHandler);
          this.isThinking.set(false);
          resolve(event.data.move || this.getRandomMove(fen));
        }
      };

      this.worker.addEventListener('message', messageHandler);
      this.worker.postMessage({ type: 'getBestMove', fen, depth });

      // Timeout fallback after 10 seconds
      setTimeout(() => {
        this.worker?.removeEventListener('message', messageHandler);
        this.isThinking.set(false);
        resolve(this.getRandomMove(fen));
      }, 10000);
    });
  }

  private getRandomMove(fen: string): string {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return '';
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return `${randomMove.from}${randomMove.to}`;
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady.set(false);
    }
  }
}
