/// <reference lib="webworker" />

import { Chess } from 'chess.js';

interface StockfishMessage {
  type: 'init' | 'setDifficulty' | 'getBestMove';
  depth?: number;
  fen?: string;
}

let currentDepth = 5;

addEventListener('message', ({ data }: { data: StockfishMessage }) => {
  if (data.type === 'init') {
    postMessage({ type: 'ready' });
  } else if (data.type === 'setDifficulty') {
    currentDepth = data.depth || 5;
  } else if (data.type === 'getBestMove' && data.fen) {
    const bestMove = findBestMove(data.fen, currentDepth);
    postMessage({ type: 'bestMove', move: bestMove });
  }
});

function findBestMove(fen: string, depth: number): string {
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true });

  if (moves.length === 0) return '';

  // Simple minimax implementation with a stronger evaluation function.
  let bestScore = -Infinity;
  let bestMoveStr = `${moves[0].from}${moves[0].to}`;

  for (const move of moves) {
    chess.move(move);
    const score = -minimax(chess, depth - 1, -Infinity, Infinity);
    chess.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMoveStr = `${move.from}${move.to}`;
    }
  }

  return bestMoveStr;
}

function minimax(chess: typeof Chess.prototype, depth: number, alpha: number, beta: number): number {
  if (depth === 0) {
    return evaluatePosition(chess);
  }

  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? 1000 : -1000;
    }
    return 0; // Draw
  }

  const moves = chess.moves({ verbose: true });

  if (chess.turn() === 'w') {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const eval_ = minimax(chess, depth - 1, alpha, beta);
      chess.undo();
      maxEval = Math.max(eval_, maxEval);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const eval_ = minimax(chess, depth - 1, alpha, beta);
      chess.undo();
      minEval = Math.min(eval_, minEval);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

const pieceSquareTables: Record<string, number[][]> = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  r: [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ]
};

function evaluatePosition(chess: typeof Chess.prototype): number {
  const board = chess.board();
  let score = 0;

  const pieceValues: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
  };

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const piece = board[i][j];
      if (piece) {
        const material = pieceValues[piece.type] || 0;
        const table = pieceSquareTables[piece.type] ?? Array(8).fill(Array(8).fill(0));
        const tableRow = piece.color === 'w' ? 7 - i : i;
        const tableValue = table[tableRow][j] || 0;
        const value = material * 100 + tableValue;
        score += piece.color === 'w' ? value : -value;
      }
    }
  }

  const moves = chess.moves();
  const mobility = moves.length * 10;
  score += chess.turn() === 'w' ? mobility : -mobility;

  return score;
}
