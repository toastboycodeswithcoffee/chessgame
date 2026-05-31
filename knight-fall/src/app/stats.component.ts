import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChessService } from './chess.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page stats-page">
      <header class="page-header">
        <div>
          <h1>Statistics</h1>
          <p>Track your game record, streaks, and highest difficulty beaten.</p>
        </div>
        <a routerLink="/" class="secondary-link">Home</a>
      </header>

      <section class="stats-grid">
        <article class="stat-card">
          <span>Games played</span>
          <strong>{{ chessService.stats().gamesPlayed }}</strong>
        </article>
        <article class="stat-card">
          <span>Wins</span>
          <strong>{{ chessService.stats().wins }}</strong>
        </article>
        <article class="stat-card">
          <span>Losses</span>
          <strong>{{ chessService.stats().losses }}</strong>
        </article>
        <article class="stat-card">
          <span>Draws</span>
          <strong>{{ chessService.stats().draws }}</strong>
        </article>
        <article class="stat-card">
          <span>Win percentage</span>
          <strong>{{ chessService.winPercentage() }}%</strong>
        </article>
        <article class="stat-card">
          <span>Current win streak</span>
          <strong>{{ chessService.stats().currentWinStreak }}</strong>
        </article>
        <article class="stat-card">
          <span>Longest win streak</span>
          <strong>{{ chessService.stats().longestWinStreak }}</strong>
        </article>
        <article class="stat-card">
          <span>Highest difficulty beaten</span>
          <strong>{{ chessService.stats().highestDifficultyBeaten }}</strong>
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

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        background: #ffffff;
        border: 1px solid #d8e3ef;
        border-radius: 1rem;
        padding: 1.25rem;
        box-shadow: 0 16px 30px rgba(15, 23, 42, 0.05);
      }

      .stat-card span {
        display: block;
        margin-bottom: 0.8rem;
        color: #627d98;
      }

      .stat-card strong {
        font-size: 2rem;
        color: #102a43;
      }
    `
  ]
})
export class StatsComponent {
  constructor(public chessService: ChessService) {}
}
