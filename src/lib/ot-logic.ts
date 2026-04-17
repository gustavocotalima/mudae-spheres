import { Sphere, SphereColor, OtGameState, RewardEntry, Position } from './types';
import {
  GRID_SIZE,
  OT_SPHERE_VALUES,
  OT_FIXED_GROUPS,
  OT_RARE_POOL,
  OT_RARE_MIN,
  OT_RARE_MAX,
  OT_RARE_SPHERE_COUNT,
  GAME_CONFIGS,
  maybeRainbow,
} from './constants';

const SPLIT_COLORS: SphereColor[] = ['teal', 'blue', 'green', 'yellow', 'orange', 'red'];

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

function generateOtGrid(
  groups: { color: SphereColor; count: number }[],
): Sphere[] {
  const occupied = new Set<string>();
  const colorMap = new Map<string, SphereColor>();

  for (const group of groups) {
    const runs = findAllContiguousRuns(group.count, occupied);
    if (runs.length === 0) return [];
    const chosen = runs[Math.floor(Math.random() * runs.length)];
    // Rare red→rainbow upgrade: roll once per red group so all reds in the run upgrade together
    const groupColor = group.color === 'red' ? maybeRainbow('red') : group.color;
    for (const pos of chosen) {
      const key = `${pos.row},${pos.col}`;
      occupied.add(key);
      colorMap.set(key, groupColor);
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

function pickColorGroups(): { color: SphereColor; count: number }[] {
  const range = OT_RARE_MAX - OT_RARE_MIN + 1;
  const rareN = OT_RARE_MIN + Math.floor(Math.random() * range);
  const shuffled = [...OT_RARE_POOL].sort(() => Math.random() - 0.5);
  const rareGroups = shuffled
    .slice(0, rareN)
    .map(color => ({ color, count: OT_RARE_SPHERE_COUNT }));
  return [...OT_FIXED_GROUPS, ...rareGroups];
}

export function initializeOtGame(): OtGameState {
  let grid: Sphere[] = [];
  let groups: { color: SphereColor; count: number }[] = [];
  for (let attempt = 0; attempt < 50; attempt++) {
    groups = pickColorGroups();
    grid = generateOtGrid(groups);
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
    colorGroups: groups,
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
      maybeRainbow(SPLIT_COLORS[Math.floor(Math.random() * SPLIT_COLORS.length)])
    );
    const splitTotal = splitColors.reduce((sum, c) => sum + OT_SPHERE_VALUES[c], 0);
    scoreGain = splitTotal;
    newRewards.push({
      color: 'white',
      value: splitTotal,
      isFree: true,
      message: `whiteSplit:${splitColors.join(' + ')}`,
    });
  } else if (sphere.color === 'dark') {
    const transformPool = SPLIT_COLORS.filter(c => c !== 'blue');
    const transformed = maybeRainbow(transformPool[Math.floor(Math.random() * transformPool.length)]);
    const transformedValue = OT_SPHERE_VALUES[transformed];
    scoreGain = transformedValue;
    newRewards.push({
      color: 'dark',
      value: transformedValue,
      isFree: true,
      message: `darkTransform:${transformed}`,
    });
  } else if (isBlue) {
    scoreGain = sphere.value;
    newRewards.push({
      color: 'blue',
      value: sphere.value,
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
