
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const GRID_SIZE = 4;

const generateEmptyGrid = () => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

const addRandomTile = (grid) => {
  let emptyTiles = [];
  grid.forEach((row, r) => row.forEach((cell, c) => {
    if (cell === 0) emptyTiles.push({ r, c });
  }));

  if (emptyTiles.length === 0) return grid;

  let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  grid[r][c] = Math.random() > 0.1 ? 2 : 4;
  return grid;
};

const shiftRow = (row) => {
  let filtered = row.filter(n => n); 
  let merged = [];

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < GRID_SIZE) merged.push(0);
  return merged;
};

const rotateGrid = (grid, times = 1) => {
  let newGrid = JSON.parse(JSON.stringify(grid)); 

  for (let i = 0; i < times; i++) {
    newGrid = newGrid[0].map((_, c) => newGrid.map(row => row[c])).reverse();
  }

  return newGrid;
};

const move = (grid, direction) => {
  let rotatedGrid;
  if (direction === "left") rotatedGrid = grid;
  if (direction === "right") rotatedGrid = grid.map(row => row.reverse());
  if (direction === "up") rotatedGrid = rotateGrid(grid, 1);
  if (direction === "down") rotatedGrid = rotateGrid(grid, 3);

  let newGrid = rotatedGrid.map(shiftRow);

  if (direction === "left") return newGrid;
  if (direction === "right") return newGrid.map(row => row.reverse());
  if (direction === "up") return rotateGrid(newGrid, 3);
  if (direction === "down") return rotateGrid(newGrid, 1);
};

export default function Game2048() {
  const [grid, setGrid] = useState(() => addRandomTile(addRandomTile(generateEmptyGrid())));

  const resetGame = () => {
    setGrid(addRandomTile(addRandomTile(generateEmptyGrid())));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };

      if (keyMap[e.key]) {
        let newGrid = move([...grid.map(row => [...row])], keyMap[e.key]);

        if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
          setGrid(addRandomTile(newGrid));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid]);

  return (
    <div className="bg-green-400 w-full h-screen">
      <div className="flex flex-col items-center pt-10">
        <h1 className="text-3xl font-bold mb-4">2048 Game</h1>
        <button
          onClick={resetGame}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Reset Game
        </button>
        <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-lg">
          {grid.map((row, r) =>
            row.map((num, c) => (
              <motion.div
                key={`${r}-${c}-${num}`}
                className={`w-20 h-20 flex items-center justify-center text-xl font-bold rounded-lg transition-all duration-100 ${num ? "bg-yellow-500 text-white" : "bg-gray-700"
                  }`}
                animate={{ scale: num ? 1.1 : 1 }} 
                transition={{ duration: 0.1 }}
              >
                {num || ""}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
