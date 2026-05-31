import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ChessService } from './chess.service';
import { StockfishService } from './stockfish.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page game-page">
      <header class="page-header">
        <div>
          <h1>Game board</h1>
          <p *ngIf="chessService.isGameActive()">Difficulty: <strong>{{ chessService.getCurrentGameDifficultyName() }}</strong></p>
          <p *ngIf="!chessService.isGameActive()">Game over</p>
        </div>
        <a routerLink="/" class="secondary-link">Back to home</a>
      </header>

      <section class="board-panel">
        <div class="board-container">
          <div class="board-header">
            <span></span>
            <span *ngFor="let col of columns">{{ col }}</span>
          </div>
          <div class="board-grid">
            <div *ngFor="let row of rows" class="board-row">
              <span class="rank-label">{{ row }}</span>
              <span
                *ngFor="let col of columns; let i = index"
                class="square"
                [class.light]="(getRowIndex(row) + i) % 2 === 0"
                [class.dark]="(getRowIndex(row) + i) % 2 !== 0"
                [class.selected]="selectedSquare() === col + row"
                (click)="selectSquare(col + row)"
              >
                <span class="piece" *ngIf="getPiece(col + row) as piece">
                  {{ getPieceSymbol(piece) }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <aside class="game-controls">
          <div class="control-card">
            <h2>Game actions</h2>
            <button type="button" class="primary-button" [disabled]="!chessService.isGameActive()" (click)="startNewGame()">New game</button>
            <button type="button" class="danger-button" [disabled]="!chessService.isGameActive()" (click)="resignGame()">Resign</button>
            <button type="button" class="secondary-button" [disabled]="chessService.moves().length === 0" (click)="undoLastMove()">Undo move</button>
          </div>

          <div class="control-card">
            <h2>Game status</h2>
            <div class="status-info">
              <p>Turn: <strong>{{ chessService.getTurn() === 'w' ? 'White' : 'Black' }}</strong></p>
              <p *ngIf="chessService.isCheck()">⚠️ King in check!</p>
              <p>Moves: <strong>{{ chessService.moves().length }}</strong></p>
            </div>
          </div>

          <div class="control-card">
            <h2>Recent moves</h2>
            <div class="moves-list">
              <span *ngFor="let move of chessService.moves().slice(-6)" class="move-badge">{{ move }}</span>
              <p *ngIf="chessService.moves().length === 0">No moves yet</p>
            </div>
          </div>
        </aside>
      </section>
    </section>
  `,
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  readonly columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  readonly rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
  readonly selectedSquare = signal<string | null>(null);

  constructor(
    public chessService: ChessService,
    private stockfishService: StockfishService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chessService.newGame();
  }

  getRowIndex(row: string): number {
    return this.rows.indexOf(row);
  }

  getPiece(square: string): { type: string; color: 'w' | 'b' } | null {
    const board = this.chessService.getBoard();
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1]);
    
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
    return board[rank][file];
  }

  getPieceSymbol(piece: { type: string; color: 'w' | 'b' }): string {
    const symbols: Record<string, Record<'w' | 'b', string>> = {
      p: { w: '♙', b: '♟' },
      n: { w: '♘', b: '♞' },
      b: { w: '♗', b: '♝' },
      r: { w: '♖', b: '♜' },
      q: { w: '♕', b: '♛' },
      k: { w: '♔', b: '♚' }
    };

    return symbols[piece.type]?.[piece.color] ?? '';
  }

  selectSquare(square: string): void {
    if (!this.chessService.isGameActive()) return;

    const selected = this.selectedSquare();
    
    if (selected === null) {
      // Select a piece
      if (this.getPiece(square)?.color === 'w') {
        this.selectedSquare.set(square);
      }
    } else {
      // Try to move
      if (selected === square) {
        this.selectedSquare.set(null);
      } else {
        const moved = this.chessService.makeMove(selected, square);
        this.selectedSquare.set(null);

        if (moved && this.chessService.getTurn() === 'b') {
          // AI move
          this.makeAIMove();
        }
      }
    }
  }

  async makeAIMove(): Promise<void> {
    setTimeout(async () => {
      if (this.chessService.isGameActive()) {
        const fen = this.chessService.getFen();
        const depth = this.chessService.difficultyLevels.find(
          l => l.level === this.chessService.currentGameDifficulty()
        )?.depth ?? 5;

        const move = await this.stockfishService.getBestMove(fen, depth);
        if (move) {
          const from = move.substring(0, 2);
          const to = move.substring(2, 4);
          this.chessService.makeMove(from, to);
        }
      }
    }, 500);
  }

  startNewGame(): void {
    this.chessService.newGame();
    this.selectedSquare.set(null);
  }

  resignGame(): void {
    this.chessService.resign();
    this.router.navigate(['/']);
  }

  undoLastMove(): void {
    this.chessService.undoMove();
    this.selectedSquare.set(null);
  }
}
