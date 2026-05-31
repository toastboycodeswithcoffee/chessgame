export type GameResult = 'win' | 'loss' | 'draw';

export interface GameRecord {
  id: string;
  date: string;
  result: GameResult;
  difficulty: number;
  moves: string[];
}

export interface Stats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  currentWinStreak: number;
  longestWinStreak: number;
  highestDifficultyBeaten: number;
}
