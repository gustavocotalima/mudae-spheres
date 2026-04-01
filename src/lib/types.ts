// Sphere Colors
export type SphereColor =
  | 'cyan'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'purple'
  | 'white'
  | 'darkblue'
  | 'hidden';

// Sphere state in the grid
export interface Sphere {
  id: number;
  color: SphereColor;
  value: number;
  revealed: boolean;       // Color is visible
  clicked: boolean;        // User has collected this sphere
  row: number;
  col: number;
  // Special properties
  isFree?: boolean;        // Purple - doesn't consume click
  revealsCount?: number;   // How many adjacent to reveal (blue=3, cyan=1)
  splits?: boolean;        // White - splits into 4 random
  transforms?: boolean;    // Dark blue - transforms to another color
}

// Game state
export interface GameState {
  grid: Sphere[];
  clicksRemaining: number;
  maxClicks: number;
  totalScore: number;
  timeRemaining: number;
  gameStatus: 'idle' | 'playing' | 'finished';
  rewardLog: RewardEntry[];
}

// Reward log entry
export interface RewardEntry {
  color: SphereColor;
  value: number;
  isFree?: boolean;
  message?: string;
}

// $oc specific - Pattern game state
export interface OcGameState extends GameState {
  redPosition: { row: number; col: number };
  foundRed: boolean;
}

// $oq specific - Minesweeper game state
export interface OqGameState extends GameState {
  purplePositions: { row: number; col: number }[];
  purplesFound: number;
  targetPurples: number;
}

// Grid position
export interface Position {
  row: number;
  col: number;
}

// Game configuration
export interface GameConfig {
  gridSize: number;
  maxClicks: number;
  timeLimit: number; // in seconds
}
