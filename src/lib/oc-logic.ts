import { Sphere, SphereColor, OcGameState, RewardEntry, Position } from './types';
import { GRID_SIZE, OC_SPHERE_VALUES, GAME_CONFIGS, maybeRainbow } from './constants';

// Position helpers
function posToIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

function indexToPos(index: number): Position {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

// Check if position is valid
function isValidPos(row: number, col: number): boolean {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}

// Check if position is center
function isCenter(row: number, col: number): boolean {
  const center = Math.floor(GRID_SIZE / 2);
  return row === center && col === center;
}

// Get adjacent positions (4 cardinal + 4 diagonal = 8 total)
function getAdjacentPositions(row: number, col: number): Position[] {
  const positions: Position[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValidPos(newRow, newCol)) {
        positions.push({ row: newRow, col: newCol });
      }
    }
  }
  return positions;
}

// Get cardinal adjacent positions (only up, down, left, right)
function getCardinalAdjacent(row: number, col: number): Position[] {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  return directions
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter(p => isValidPos(p.row, p.col));
}

// Get adjacent diagonal positions (only the 4 corners around the position)
function getAdjacentDiagonals(row: number, col: number): Position[] {
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return directions
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter(p => isValidPos(p.row, p.col));
}

// Get ALL positions on the same diagonal lines (extending in all directions)
function getDiagonalLinePositions(row: number, col: number): Position[] {
  const positions: Position[] = [];
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  for (const [dr, dc] of directions) {
    for (let i = 1; i < GRID_SIZE; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;
      if (isValidPos(newRow, newCol)) {
        positions.push({ row: newRow, col: newCol });
      }
    }
  }

  return positions;
}

// Get positions in same row or column
function getSameRowOrColumn(row: number, col: number): Position[] {
  const positions: Position[] = [];

  // Same row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col) positions.push({ row, col: c });
  }

  // Same column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row) positions.push({ row: r, col });
  }

  return positions;
}

// Get all positions in row, column, or diagonal (for teal)
function getLinePositions(row: number, col: number): Position[] {
  const positions = new Set<string>();

  // Same row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col) positions.add(`${row},${c}`);
  }

  // Same column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row) positions.add(`${r},${col}`);
  }

  // Diagonals
  for (let i = 1; i < GRID_SIZE; i++) {
    const diags = [
      [row - i, col - i],
      [row - i, col + i],
      [row + i, col - i],
      [row + i, col + i],
    ];
    for (const [r, c] of diags) {
      if (isValidPos(r, c)) positions.add(`${r},${c}`);
    }
  }

  return Array.from(positions).map(s => {
    const [r, c] = s.split(',').map(Number);
    return { row: r, col: c };
  });
}

// Initialize $oc game
export function initializeOcGame(): OcGameState {
  // Step 1: Place red sphere (not in center)
  let redRow: number, redCol: number;
  do {
    redRow = Math.floor(Math.random() * GRID_SIZE);
    redCol = Math.floor(Math.random() * GRID_SIZE);
  } while (isCenter(redRow, redCol));

  const redPosition = { row: redRow, col: redCol };

  // Create grid with colors based on pattern
  const grid: Sphere[] = [];
  const usedPositions = new Set<string>();
  usedPositions.add(`${redRow},${redCol}`);

  // Step 2: Place 2 orange (adjacent to red)
  const cardinalAdjacent = getCardinalAdjacent(redRow, redCol);
  const orangePositions: Position[] = [];
  const shuffledCardinal = [...cardinalAdjacent].sort(() => Math.random() - 0.5);

  for (const pos of shuffledCardinal) {
    if (orangePositions.length < 2 && !usedPositions.has(`${pos.row},${pos.col}`)) {
      orangePositions.push(pos);
      usedPositions.add(`${pos.row},${pos.col}`);
    }
  }

  // Step 3: Place 3 yellow (on same diagonal LINES as red - not just adjacent)
  const diagonalLines = getDiagonalLinePositions(redRow, redCol);
  const yellowPositions: Position[] = [];
  const shuffledDiagonal = [...diagonalLines].sort(() => Math.random() - 0.5);

  for (const pos of shuffledDiagonal) {
    if (yellowPositions.length < 3 && !usedPositions.has(`${pos.row},${pos.col}`)) {
      yellowPositions.push(pos);
      usedPositions.add(`${pos.row},${pos.col}`);
    }
  }

  // Step 4: Place 4 green (same row or column as red)
  const rowColPositions = getSameRowOrColumn(redRow, redCol);
  const greenPositions: Position[] = [];
  const shuffledRowCol = [...rowColPositions].sort(() => Math.random() - 0.5);

  for (const pos of shuffledRowCol) {
    if (greenPositions.length < 4 && !usedPositions.has(`${pos.row},${pos.col}`)) {
      greenPositions.push(pos);
      usedPositions.add(`${pos.row},${pos.col}`);
    }
  }

  // Step 5: Get positions on red's lines (for teal) and safe positions (for blue)
  const linePositions = getLinePositions(redRow, redCol);
  const lineSet = new Set(linePositions.map(p => `${p.row},${p.col}`));
  lineSet.add(`${redRow},${redCol}`); // Red is also on its own lines

  // Build the grid
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const id = posToIndex(row, col);
      const posKey = `${row},${col}`;
      let color: SphereColor = 'blue'; // Default: safe zone

      if (row === redRow && col === redCol) {
        color = maybeRainbow('red');
      } else if (orangePositions.some(p => p.row === row && p.col === col)) {
        color = 'orange';
      } else if (yellowPositions.some(p => p.row === row && p.col === col)) {
        color = 'yellow';
      } else if (greenPositions.some(p => p.row === row && p.col === col)) {
        color = 'green';
      } else if (lineSet.has(posKey)) {
        color = 'teal';
      }
      // else blue (safe zone - not on any line)

      grid.push({
        id,
        color,
        value: OC_SPHERE_VALUES[color],
        revealed: false,
        clicked: false,
        row,
        col,
      });
    }
  }

  return {
    grid,
    clicksRemaining: GAME_CONFIGS.oc.maxClicks,
    maxClicks: GAME_CONFIGS.oc.maxClicks,
    totalScore: 0,
    timeRemaining: GAME_CONFIGS.oc.timeLimit,
    gameStatus: 'playing',
    rewardLog: [],
    redPosition,
    foundRed: false,
  };
}

// Process click on sphere
export function processOcClick(state: OcGameState, sphereId: number): OcGameState {
  const sphere = state.grid.find(s => s.id === sphereId);

  if (!sphere || sphere.clicked || state.gameStatus !== 'playing') {
    return state;
  }

  const newGrid = state.grid.map(s =>
    s.id === sphereId ? { ...s, revealed: true, clicked: true } : s
  );

  const reward: RewardEntry = {
    color: sphere.color,
    value: sphere.value,
  };

  const newClicksRemaining = state.clicksRemaining - 1;
  const foundRed = sphere.color === 'red' || state.foundRed;
  const newStatus = newClicksRemaining <= 0 ? 'finished' : 'playing';

  return {
    ...state,
    grid: newGrid,
    clicksRemaining: newClicksRemaining,
    totalScore: state.totalScore + sphere.value,
    gameStatus: newStatus,
    rewardLog: [...state.rewardLog, reward],
    foundRed,
  };
}

// Check if game is over
export function isOcGameOver(state: OcGameState): boolean {
  return state.clicksRemaining <= 0 || state.timeRemaining <= 0 || state.foundRed;
}
