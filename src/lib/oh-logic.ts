import { Sphere, SphereColor, GameState, RewardEntry, Position } from './types';
import {
  GRID_SIZE,
  TOTAL_CELLS,
  OH_SPHERE_VALUES,
  OH_SPHERE_WEIGHTS,
  REVEAL_COUNTS,
  GAME_CONFIGS
} from './constants';

// Get random value in range
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Weighted random selection
function weightedRandomColor(): SphereColor {
  const colors = Object.keys(OH_SPHERE_WEIGHTS) as SphereColor[];
  const weights = colors.map(c => OH_SPHERE_WEIGHTS[c]);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let random = Math.random() * totalWeight;

  for (let i = 0; i < colors.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return colors[i];
    }
  }

  return 'cyan'; // fallback
}

// Generate random sphere
function generateSphere(id: number, row: number, col: number): Sphere {
  const color = weightedRandomColor();
  const valueRange = OH_SPHERE_VALUES[color];
  const value = randomInRange(valueRange.min, valueRange.max);

  return {
    id,
    color,
    value,
    revealed: false,
    clicked: false,
    row,
    col,
    isFree: color === 'purple',
    revealsCount: REVEAL_COUNTS[color],
    splits: color === 'white',
    transforms: color === 'darkblue',
  };
}

// Initialize game grid
export function initializeOhGame(): GameState {
  const grid: Sphere[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const id = row * GRID_SIZE + col;
      grid.push(generateSphere(id, row, col));
    }
  }

  // Reveal a random sphere at start
  const randomIndex = Math.floor(Math.random() * grid.length);
  grid[randomIndex].revealed = true;

  return {
    grid,
    clicksRemaining: GAME_CONFIGS.oh.maxClicks,
    maxClicks: GAME_CONFIGS.oh.maxClicks,
    totalScore: 0,
    timeRemaining: GAME_CONFIGS.oh.timeLimit,
    gameStatus: 'playing',
    rewardLog: [],
  };
}


// Handle white sphere split
function handleWhiteSplit(): RewardEntry[] {
  const rewards: RewardEntry[] = [];
  const splitColors: SphereColor[] = ['cyan', 'blue', 'green', 'yellow'];

  for (let i = 0; i < 4; i++) {
    const color = splitColors[Math.floor(Math.random() * splitColors.length)];
    const valueRange = OH_SPHERE_VALUES[color];
    const value = randomInRange(valueRange.min, valueRange.max);
    rewards.push({ color, value });
  }

  return rewards;
}

// Handle dark blue transform
function handleDarkBlueTransform(): { color: SphereColor; value: number } {
  const transformColors: SphereColor[] = ['cyan', 'blue', 'green', 'yellow'];
  const color = transformColors[Math.floor(Math.random() * transformColors.length)];
  const valueRange = OH_SPHERE_VALUES[color];
  const value = randomInRange(valueRange.min, valueRange.max);
  return { color, value };
}

// Process click on sphere
export function processOhClick(state: GameState, sphereId: number): GameState {
  const sphere = state.grid.find(s => s.id === sphereId);

  // Can't click if already clicked (collected) or game over
  if (!sphere || sphere.clicked || state.gameStatus !== 'playing') {
    return state;
  }

  const newGrid = [...state.grid];
  const clickedSphere = newGrid.find(s => s.id === sphereId)!;
  clickedSphere.revealed = true;
  clickedSphere.clicked = true;

  const newRewards: RewardEntry[] = [];
  let totalReward = 0;
  let clickCost = sphere.isFree ? 0 : 1;

  // Handle special spheres
  if (sphere.splits) {
    // White sphere splits into 4 random
    const splitRewards = handleWhiteSplit();
    const splitTotal = splitRewards.reduce((sum, r) => sum + r.value, 0);
    totalReward = splitTotal;
    // Show single entry with split info and total value
    const colorNames = splitRewards.map(r => r.color).join(' + ');
    newRewards.push({
      color: 'white',
      value: splitTotal,
      message: `whiteSplit:${colorNames}`,
    });
  } else if (sphere.transforms) {
    // Dark blue transforms into another color
    const transformed = handleDarkBlueTransform();
    totalReward = transformed.value;
    newRewards.push({
      color: transformed.color, // Show the transformed color
      value: transformed.value,
      message: `darkBlueTransform`,
    });
  } else {
    // Normal sphere
    totalReward = sphere.value;
    newRewards.push({
      color: sphere.color,
      value: sphere.value,
      isFree: sphere.isFree,
    });
  }

  if (sphere.revealsCount && sphere.revealsCount > 0) {
    const hidden = newGrid.filter(s => !s.revealed);
    const toReveal = hidden
      .sort(() => Math.random() - 0.5)
      .slice(0, sphere.revealsCount);

    for (const revealSphere of toReveal) {
      const gridSphere = newGrid.find(s => s.id === revealSphere.id)!;
      gridSphere.revealed = true;
    }
  }

  const newClicksRemaining = state.clicksRemaining - clickCost;
  const newStatus = newClicksRemaining <= 0 ? 'finished' : 'playing';

  return {
    ...state,
    grid: newGrid,
    clicksRemaining: newClicksRemaining,
    totalScore: state.totalScore + totalReward,
    gameStatus: newStatus,
    rewardLog: [...state.rewardLog, ...newRewards],
  };
}

// Check if game is over
export function isOhGameOver(state: GameState): boolean {
  return state.clicksRemaining <= 0 || state.timeRemaining <= 0;
}
