import { Sphere, SphereColor, OtGameState, RewardEntry, Position } from './types';
import { GRID_SIZE, OT_SPHERE_VALUES, OT_COLOR_GROUPS, GAME_CONFIGS } from './constants';

const SPLIT_COLORS: SphereColor[] = ['cyan', 'blue', 'green', 'yellow', 'orange', 'red', 'purple'];

function posToIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

function findAllContiguousRuns(
  length: number,
  occupied: Set<string>,
): Position[][] {
  const runs: Position[][] = [];

  // Horizontal runs
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let startCol = 0; startCol <= GRID_SIZE - length; startCol++) {
      const run: Position[] = [];
      let valid = true;
      for (let i = 0; i < length; i++) {
        const col = startCol + i;
        if (occupied.has(`${row},${col}`)) {
          valid = false;
          break;
        }
        run.push({ row, col });
      }
      if (valid) runs.push(run);
    }
  }

  // Vertical runs
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let startRow = 0; startRow <= GRID_SIZE - length; startRow++) {
      const run: Position[] = [];
      let valid = true;
      for (let i = 0; i < length; i++) {
        const row = startRow + i;
        if (occupied.has(`${row},${col}`)) {
          valid = false;
          break;
        }
        run.push({ row, col });
      }
      if (valid) runs.push(run);
    }
  }

  return runs;
}

function generateOtGrid(): Sphere[] {
  const occupied = new Set<string>();
  const colorMap = new Map<string, SphereColor>();

  for (const group of OT_COLOR_GROUPS) {
    const runs = findAllContiguousRuns(group.count, occupied);
    if (runs.length === 0) return [];
    const chosen = runs[Math.floor(Math.random() * runs.length)];
    for (const pos of chosen) {
      const key = `${pos.row},${pos.col}`;
      occupied.add(key);
      colorMap.set(key, group.color);
    }
  }

  const grid: Sphere[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const key = `${row},${col}`;
      const color: SphereColor = colorMap.get(key) ?? 'blue';
      grid.push({
        id: posToIndex(row, col),
        color,
        value: OT_SPHERE_VALUES[color],
        revealed: false,
        clicked: false,
        row,
        col,
      });
    }
  }

  return grid;
}

export function initializeOtGame(): OtGameState {
  let grid: Sphere[] = [];
  for (let attempt = 0; attempt < 50; attempt++) {
    grid = generateOtGrid();
    if (grid.length > 0) break;
  }

  return {
    grid,
    clicksRemaining: GAME_CONFIGS.ot.maxClicks,
    maxClicks: GAME_CONFIGS.ot.maxClicks,
    totalScore: 0,
    timeRemaining: GAME_CONFIGS.ot.timeLimit,
    gameStatus: 'playing',
    rewardLog: [],
  };
}

export function processOtClick(state: OtGameState, sphereId: number): OtGameState {
  const sphere = state.grid.find(s => s.id === sphereId);

  if (!sphere || sphere.clicked || state.gameStatus !== 'playing') {
    return state;
  }

  const newGrid = state.grid.map(s =>
    s.id === sphereId ? { ...s, revealed: true, clicked: true } : s
  );

  const isBlue = sphere.color === 'blue';
  const newClicksRemaining = isBlue
    ? state.clicksRemaining - 1
    : state.clicksRemaining;
  const newStatus = newClicksRemaining <= 0 ? 'finished' : 'playing';

  let scoreGain = 0;
  const newRewards: RewardEntry[] = [];

  if (sphere.color === 'white') {
    const splitColors = Array.from({ length: 4 }, () =>
      SPLIT_COLORS[Math.floor(Math.random() * SPLIT_COLORS.length)]
    );
    const splitTotal = splitColors.reduce((sum, c) => sum + OT_SPHERE_VALUES[c], 0);
    scoreGain = splitTotal;
    newRewards.push({
      color: 'white',
      value: splitTotal,
      isFree: true,
      message: `se divide em ${splitColors.join(' + ')}`,
    });
  } else if (isBlue) {
    newRewards.push({
      color: 'blue',
      value: 0,
      message: 'Esfera azul! -1 clique.',
    });
  } else {
    scoreGain = sphere.value;
    newRewards.push({
      color: sphere.color,
      value: sphere.value,
      isFree: true,
    });
  }

  return {
    ...state,
    grid: newGrid,
    clicksRemaining: newClicksRemaining,
    totalScore: state.totalScore + scoreGain,
    gameStatus: newStatus,
    rewardLog: [...state.rewardLog, ...newRewards],
  };
}

export function isOtGameOver(state: OtGameState): boolean {
  return state.clicksRemaining <= 0 || state.timeRemaining <= 0;
}
