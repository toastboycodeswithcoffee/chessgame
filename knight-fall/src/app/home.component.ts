import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChessService } from './chess.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page home-page">
      <header class="hero">
        <span class="eyebrow">Single-player chess</span>
        <h1>KnightFall</h1>
        <p>Play against an AI opponent, choose from five difficulty levels, and keep your stats locally in the browser.</p>
      </header>

      <div class="split-panel">
        <section class="panel">
          <h2>Pick difficulty</h2>
          <div class="difficulty-grid">
            <button
              type="button"
              *ngFor="let level of chessService.difficultyLevels"
              (click)="chessService.setDifficulty(level.level)"
              [class.active]="chessService.difficulty() === level.level"
            >
              <span>{{ level.name }}</span>
              <small>Depth {{ level.depth }}</small>
            </button>
          </div>
          <p class="panel-meta">Selected: <strong>{{ chessService.currentDifficultyName }}</strong></p>
          <a routerLink="/game" class="primary-button">Start New Game</a>
        </section>

        <section class="panel stats-panel">
          <h2>Quick stats</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <span class="label">Games</span>
              <strong>{{ chessService.stats().gamesPlayed }}</strong>
            </div>
            <div class="stat-card">
              <span class="label">Wins</span>
              <strong>{{ chessService.stats().wins }}</strong>
            </div>
            <div class="stat-card">
              <span class="label">Losses</span>
              <strong>{{ chessService.stats().losses }}</strong>
            </div>
            <div class="stat-card">
              <span class="label">Win %</span>
              <strong>{{ chessService.winPercentage() }}%</strong>
            </div>
          </div>
          <div class="summary-row">
            <span>Current streak</span>
            <strong>{{ chessService.stats().currentWinStreak }}</strong>
          </div>
          <div class="summary-row">
            <span>Best difficulty</span>
            <strong>{{ chessService.stats().highestDifficultyBeaten }}</strong>
          </div>
        </section>
      </div>

      <nav class="home-nav">
        <a routerLink="/stats">View full statistics</a>
        <a routerLink="/history">Review game history</a>
      </nav>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 1rem;
      }

      .hero {
        max-width: 720px;
        margin: 0 auto 2rem;
        text-align: center;
      }

      .hero .eyebrow {
        display: inline-block;
        margin-bottom: 0.75rem;
        padding: 0.25rem 0.75rem;
        background: rgba(38, 72, 103, 0.08);
        border-radius: 999px;
        font-size: 0.85rem;
        color: #12517a;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .hero h1 {
        font-size: clamp(2rem, 4vw, 3.5rem);
        margin: 0 0 1rem;
        color: #0b1f38;
      }

      .hero p {
        max-width: 680px;
        margin: 0 auto;
        color: #334e68;
        line-height: 1.75;
      }

      .split-panel {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .panel {
        background: #ffffff;
        border: 1px solid #d8e3ef;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 24px 40px rgba(15, 23, 42, 0.05);
      }

      .panel h2 {
        margin: 0 0 1rem;
        font-size: 1.25rem;
      }

      .difficulty-grid {
        display: grid;
        gap: 0.75rem;
      }

      .difficulty-grid button {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
        border-radius: 0.85rem;
        border: 1px solid #d8e3ef;
        background: #f7fafc;
        color: #102a43;
        cursor: pointer;
        transition: background 0.2s ease, border-color 0.2s ease;
      }

      .difficulty-grid button.active,
      .difficulty-grid button:hover {
        background: #eef7ff;
        border-color: #7fb4ff;
      }

      .difficulty-grid small {
        display: block;
        margin-top: 0.45rem;
        color: #627d98;
      }

      .panel-meta {
        margin: 1rem 0 1.5rem;
        color: #334e68;
      }

      .primary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.95rem 1.35rem;
        border-radius: 999px;
        border: none;
        text-decoration: none;
        color: #fff;
        background: linear-gradient(90deg, #276eff 0%, #5a76ff 100%);
        font-weight: 600;
        transition: transform 0.2s ease;
      }

      .primary-button:hover {
        transform: translateY(-1px);
      }

      .stats-panel .stat-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
      }

      .stat-card {
        background: #f7fafc;
        padding: 1rem;
        border-radius: 1rem;
        border: 1px solid #e8eff7;
      }

      .stat-card .label {
        display: block;
        color: #627d98;
        font-size: 0.85rem;
        margin-bottom: 0.45rem;
      }

      .stat-card strong {
        font-size: 1.5rem;
        color: #102a43;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 0.95rem 1rem;
        margin-top: 0.85rem;
        border-radius: 0.85rem;
        background: #f7fafc;
        border: 1px solid #e8eff7;
        color: #102a43;
      }

      .home-nav {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .home-nav a {
        color: #276eff;
        text-decoration: none;
        font-weight: 600;
      }
    `
  ]
})
export class HomeComponent {
  constructor(public chessService: ChessService) {}
}
