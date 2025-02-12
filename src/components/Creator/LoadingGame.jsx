import React, { useState, useEffect } from 'react';

const SIZE = 3;

const LoadingGame = ({ status, message, progress }) => {
  const [board, setBoard] = useState(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('player');
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [scores, setScores] = useState({ player: 0, bot: 0 });

  const checkWinner = (board) => {
    // Check horizontal
    for (let row = 0; row < SIZE; row++) {
      if (
        board[row][0] &&
        board[row][0] === board[row][1] &&
        board[row][0] === board[row][2]
      ) {
        return {
          winner: board[row][0],
          cells: [[row, 0], [row, 1], [row, 2]]
        };
      }
    }

    // Check vertical
    for (let col = 0; col < SIZE; col++) {
      if (
        board[0][col] &&
        board[0][col] === board[1][col] &&
        board[0][col] === board[2][col]
      ) {
        return {
          winner: board[0][col],
          cells: [[0, col], [1, col], [2, col]]
        };
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      return {
        winner: board[0][0],
        cells: [[0, 0], [1, 1], [2, 2]]
      };
    }

    // Check diagonal (top-right to bottom-left)
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      return {
        winner: board[0][2],
        cells: [[0, 2], [1, 1], [2, 0]]
      };
    }

    // Check for draw
    if (board.every(row => row.every(cell => cell !== null))) {
      return { winner: 'draw', cells: [] };
    }

    return null;
  };

  const evaluatePosition = (board, player) => {
    let score = 0;
    const opponent = player === 'bot' ? 'player' : 'bot';

    const evaluateLine = (line, player) => {
      const playerCount = line.filter(cell => cell === player).length;
      const opponentCount = line.filter(cell => cell === opponent).length;
      const emptyCount = line.filter(cell => cell === null).length;

      if (playerCount === 3) return 100;
      if (playerCount === 2 && emptyCount === 1) return 10;
      if (playerCount === 1 && emptyCount === 2) return 1;
      if (opponentCount === 2 && emptyCount === 1) return -10;
      if (opponentCount === 1 && emptyCount === 2) return -1;

      return 0;
    };

    // Check all lines
    const lines = [
      // Rows
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      // Columns
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      // Diagonals
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]]
    ];

    lines.forEach(line => {
      score += evaluateLine(line, player);
    });

    return score;
  };

  const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
    const result = checkWinner(board);
    if (result) {
      if (result.winner === 'bot') return [null, 1000];
      if (result.winner === 'player') return [null, -1000];
      return [null, 0];
    }

    if (depth === 0) {
      return [null, evaluatePosition(board, 'bot')];
    }

    const validMoves = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === null) {
          validMoves.push([row, col]);
        }
      }
    }

    if (maximizingPlayer) {
      let value = -Infinity;
      let bestMove = validMoves[0];

      for (const [row, col] of validMoves) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = 'bot';
        const newScore = minimax(newBoard, depth - 1, alpha, beta, false)[1];

        if (newScore > value) {
          value = newScore;
          bestMove = [row, col];
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
      return [bestMove, value];
    } else {
      let value = Infinity;
      let bestMove = validMoves[0];

      for (const [row, col] of validMoves) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = 'player';
        const newScore = minimax(newBoard, depth - 1, alpha, beta, true)[1];

        if (newScore < value) {
          value = newScore;
          bestMove = [row, col];
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
      return [bestMove, value];
    }
  };

  const makeBotMove = (currentBoard) => {
    const [move] = minimax(currentBoard, 6, -Infinity, Infinity, true);
    return move;
  };

  useEffect(() => {
    if (currentPlayer === 'bot' && !winner) {
      const timer = setTimeout(() => {
        const move = makeBotMove(board);
        if (move) {
          handleCellClick(move[0], move[1], true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, board]);

  const handleCellClick = (row, col, isBotMove = false) => {
    if (winner || board[row][col] !== null || (currentPlayer === 'bot' && !isBotMove)) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningCells(result.cells);
      if (result.winner !== 'draw') {
        setScores(prev => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1
        }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'player' ? 'bot' : 'player');
    }
  };

  const resetGame = () => {
    setBoard(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)));
    setCurrentPlayer('player');
    setWinner(null);
    setWinningCells([]);
  };

  const isWinningCell = (row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-2xl w-full mx-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {message || 'While we generate your content...'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Tic Tac Toe - Beat the Bot!
          </p>
          {progress !== undefined && (
            <div className="mb-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {progress}% Complete
              </p>
            </div>
          )}
          <div className="flex justify-center gap-8 text-lg font-semibold mb-2">
            <div className="text-yellow-600 dark:text-yellow-400">
              You: {scores.player}
            </div>
            <div className="text-red-600 dark:text-red-400">
              Bot: {scores.bot}
            </div>
          </div>
          {!winner && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentPlayer === 'player' ? 'Your turn (X)' : 'Bot is thinking...'}
            </p>
          )}
        </div>

        <div className="bg-blue-600 dark:bg-blue-700 p-6 rounded-xl inline-block mx-auto" style={{ display: 'block', width: 'fit-content', margin: '0 auto' }}>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => setHoveredCell(`${rowIndex}-${colIndex}`)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-16 h-16 bg-white dark:bg-gray-200 rounded-lg flex items-center justify-center transition-all border-2 ${
                    currentPlayer === 'player' && !winner && !cell ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-300' : ''
                  } ${hoveredCell === `${rowIndex}-${colIndex}` && currentPlayer === 'player' && !winner && !cell ? 'transform scale-105 shadow-lg' : ''} ${
                    isWinningCell(rowIndex, colIndex) ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                  }`}
                >
                  {cell === 'player' && (
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-700">X</span>
                  )}
                  {cell === 'bot' && (
                    <span className="text-2xl font-bold text-red-600 dark:text-red-700">O</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {winner && (
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {winner === 'draw' ? "It's a Draw!" : winner === 'player' ? 'You Win! 🎉' : 'Bot Wins!'}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingGame;