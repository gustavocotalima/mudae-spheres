import { Sphere, SphereColor, OqGameState, RewardEntry, Position } from './types';
import { GRID_SIZE, OQ_SPHERE_VALUES, GAME_CONFIGS, maybeRainbow } from './constants';

// Position helpers
function posToIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

function isValidPos(row: number, col: number): boolean {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}

// Get all 8 adjacent positions
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

// Count adjacent purples for a position
function countAdjacentPurples(
  row: number,
  col: number,
  purpleSet: Set<string>
): number {
  const adjacent = getAdjacentPositions(row, col);
  return adjacent.filter(p => purpleSet.has(`${p.row},${p.col}`)).length;
}

// Get color based on adjacent purple count (minesweeper style)
function getColorForCount(count: number): SphereColor {
  switch (count) {
    case 0: return 'blue';
    case 1: return 'cyan';
    case 2: return 'green';
    case 3: return 'yellow';
    case 4:
    default: return 'orange';
  }
}

// Generate random unique positions
function generateRandomPositions(count: number, gridSize: number): Position[] {
  const positions: Position[] = [];
  const used = new Set<string>();

  while (positions.length < count) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    const key = `${row},${col}`;

    if (!used.has(key)) {
      used.add(key);
      positions.push({ row, col });
    }
  }

  return positions;
}

// Initialize $oq game (Minesweeper)
export function initializeOqGame(): OqGameState {
  // Step 1: Place 4 purple spheres randomly
  const purplePositions = generateRandomPositions(4, GRID_SIZE);
  const purpleSet = new Set(purplePositions.map(p => `${p.row},${p.col}`));

  // Step 2: Create grid with colors based on adjacent purple count
  const grid: Sphere[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const id = posToIndex(row, col);
      const posKey = `${row},${col}`;

      let color: SphereColor;
      let value: number;

      if (purpleSet.has(posKey)) {
        // This is a purple sphere (target to find)
        color = 'purple';
        value = OQ_SPHERE_VALUES.purple;
      } else {
        // Calculate adjacent purple count and assign color
        const adjacentCount = countAdjacentPurples(row, col, purpleSet);
        color = getColorForCount(adjacentCount);
        value = OQ_SPHERE_VALUES[color];
      }

      grid.push({
        id,
        color,
        value,
        revealed: false,
        clicked: false,
        row,
        col,
      });
    }
  }

  return {
    grid,
    clicksRemaining: GAME_CONFIGS.oq.maxClicks,
    maxClicks: GAME_CONFIGS.oq.maxClicks,
    totalScore: 0,
    timeRemaining: GAME_CONFIGS.oq.timeLimit,
    gameStatus: 'playing',
    rewardLog: [],
    purplePositions,
    purplesFound: 0,
    targetPurples: 3, // Need to find 3 of 4 purples
  };
}

// Process click on sphere
export function processOqClick(state: OqGameState, sphereId: number): OqGameState {
  const sphere = state.grid.find(s => s.id === sphereId);

  if (!sphere || sphere.clicked || state.gameStatus !== 'playing') {
    return state;
  }

  const newGrid = state.grid.map(s =>
    s.id === sphereId ? { ...s, revealed: true, clicked: true } : s
  );

  let reward: RewardEntry = {
    color: sphere.color,
    value: sphere.value,
    isFree: sphere.color === 'purple',
  };

  let newPurplesFound = state.purplesFound;
  let totalReward = sphere.value;

  // Check if found a purple
  if (sphere.color === 'purple') {
    newPurplesFound++;

    // Check if found 3 purples - transform 4th to red and reveal it!
    if (newPurplesFound >= state.targetPurples) {
      // Find the remaining hidden purple and transform it to red
      const remainingPurple = newGrid.find(
        s => s.color === 'purple' && !s.clicked
      );

      if (remainingPurple) {
        remainingPurple.color = maybeRainbow('red');
        remainingPurple.value = OQ_SPHERE_VALUES[remainingPurple.color];
        remainingPurple.revealed = true; // Reveal the transformed red/rainbow sphere
      }

      reward.message = `Encontrou ${newPurplesFound} roxas! A 4a vira vermelha!`;
    }
  }

  // Purple clicks are FREE (don't consume a click)
  const clickCost = sphere.color === 'purple' ? 0 : 1;
  const newClicksRemaining = state.clicksRemaining - clickCost;

  // Check if found all 3 purples and clicked the transformed red
  const allPurplesFound = newPurplesFound >= state.targetPurples;
  const newStatus = newClicksRemaining <= 0 ? 'finished' : 'playing';

  return {
    ...state,
    grid: newGrid,
    clicksRemaining: newClicksRemaining,
    totalScore: state.totalScore + totalReward,
    gameStatus: newStatus,
    rewardLog: [...state.rewardLog, reward],
    purplesFound: newPurplesFound,
  };
}

// Check if game is over
export function isOqGameOver(state: OqGameState): boolean {
  return state.clicksRemaining <= 0 || state.timeRemaining <= 0;
}

// Get hint for minesweeper (for debugging/display)
export function getOqHint(state: OqGameState): string {
  const revealedColors = state.grid
    .filter(s => s.revealed && s.color !== 'purple')
    .map(s => ({
      color: s.color,
      row: s.row,
      col: s.col,
    }));

  if (revealedColors.length === 0) {
    return 'Clique em qualquer botao para comecar!';
  }

  const highCount = revealedColors.find(s =>
    ['yellow', 'orange'].includes(s.color)
  );

  if (highCount) {
    return `${highCount.color === 'yellow' ? 'Amarelo' : 'Laranja'} = ${highCount.color === 'yellow' ? 3 : 4} roxas adjacentes!`;
  }

  return 'Continue procurando as esferas roxas!';
}
