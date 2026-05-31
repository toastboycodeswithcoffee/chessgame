import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChessService } from './chess.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page history-page">
      <header class="page-header">
        <div>
          <h1>Game history</h1>
          <p>Review your last games and difficulty settings.</p>
        </div>
        <a routerLink="/" class="secondary-link">Home</a>
      </header>

      <section class="history-list">
        <div *ngIf="chessService.history().length === 0" class="empty-state">
          <p>No game history yet. Start a new game to begin tracking progress.</p>
        </div>

        <article *ngFor="let item of chessService.history()" class="history-card">
          <div>
            <span class="history-result">{{ item.result | titlecase }}</span>
            <strong>Difficulty {{ item.difficulty }}</strong>
          </div>
          <small>{{ item.date | date:'medium' }}</small>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .page-header h1 {
        margin: 0;
        font-size: 2rem;
      }

      .secondary-link {
        text-decoration: none;
        color: #276eff;
        font-weight: 600;
      }

      .history-list {
        display: grid;
        gap: 1rem;
      }

      .history-card {
        background: #ffffff;
        border: 1px solid #d8e3ef;
        border-radius: 1rem;
        padding: 1.25rem;
        box-shadow: 0 16px 30px rgba(15, 23, 42, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .history-result {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.75rem;
        border-radius: 999px;
        background: #eef7ff;
        color: #12517a;
        font-weight: 600;
      }

      .empty-state {
        padding: 1.5rem;
        border-radius: 1rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #334e68;
      }
    `
  ]
})
export class HistoryComponent {
  constructor(public chessService: ChessService) {}
}
