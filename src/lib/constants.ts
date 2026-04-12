import { SphereColor, GameConfig } from './types';

// Sphere color hex values (Discord-style)
export const SPHERE_COLORS: Record<SphereColor, string> = {
  cyan: '#00d4aa',
  blue: '#5865f2',
  green: '#57f287',
  yellow: '#fee75c',
  orange: '#f79454',
  red: '#ed4245',
  purple: '#9b59b6',
  white: '#ffffff',
  darkblue: '#3b4874',
  hidden: '#4f545c',
};

// Sphere background gradients for better visual
export const SPHERE_GRADIENTS: Record<SphereColor, string> = {
  cyan: 'radial-gradient(circle at 30% 30%, #4dffd4, #00d4aa, #00a884)',
  blue: 'radial-gradient(circle at 30% 30%, #8b94f7, #5865f2, #4752c4)',
  green: 'radial-gradient(circle at 30% 30%, #8bfab3, #57f287, #3ba55c)',
  yellow: 'radial-gradient(circle at 30% 30%, #fff89a, #fee75c, #d4b943)',
  orange: 'radial-gradient(circle at 30% 30%, #ffb88a, #f79454, #d47b3f)',
  red: 'radial-gradient(circle at 30% 30%, #ff7a7a, #ed4245, #c43033)',
  purple: 'radial-gradient(circle at 30% 30%, #c49ae8, #9b59b6, #7d4790)',
  white: 'radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0, #c0c0c0)',
  darkblue: 'radial-gradient(circle at 30% 30%, #5a6896, #3b4874, #2d3758)',
  hidden: 'radial-gradient(circle at 30% 30%, #6b6f78, #4f545c, #36393f)',
};

// $oh - Orb Harvest sphere values (fixed values matching $oc)
export const OH_SPHERE_VALUES: Record<SphereColor, { min: number; max: number }> = {
  blue: { min: 10, max: 10 },
  cyan: { min: 20, max: 20 },
  green: { min: 35, max: 35 },
  yellow: { min: 55, max: 55 },
  orange: { min: 90, max: 90 },
  red: { min: 150, max: 150 },
  purple: { min: 0, max: 0 },
  white: { min: 0, max: 0 },
  darkblue: { min: 0, max: 0 },
  hidden: { min: 0, max: 0 },
};

// $oh - Sphere distribution weights (based on Mudae kakera probabilities, adjusted)
// Source: https://mudae.fandom.com/wiki/Kakera/Reactions
export const OH_SPHERE_WEIGHTS: Record<SphereColor, number> = {
  blue: 50,      // ~50%
  cyan: 20,      // ~20%
  green: 10,     // ~10%
  purple: 5,     // ~5% (free click)
  yellow: 5,     // ~5%
  orange: 3,     // ~3%
  red: 2,        // ~2% (rare)
  white: 3,      // Rare special (splits)
  darkblue: 2,   // Rare special (transforms)
  hidden: 0,
};

// $oc - Orb Chest sphere values
export const OC_SPHERE_VALUES: Record<SphereColor, number> = {
  cyan: 20,
  blue: 10,
  green: 35,
  yellow: 55,
  orange: 90,
  red: 150,
  purple: 0,
  white: 0,
  darkblue: 0,
  hidden: 0,
};

// $oq - Orb Quest sphere values (matching $oc)
export const OQ_SPHERE_VALUES: Record<SphereColor, number> = {
  blue: 10,
  cyan: 20,
  green: 35,
  yellow: 55,
  orange: 90,
  red: 150,
  purple: 0,
  white: 0,
  darkblue: 0,
  hidden: 0,
};

// $ot - Orb Trace sphere values
export const OT_SPHERE_VALUES: Record<SphereColor, number> = {
  cyan: 20,
  blue: 10,
  green: 35,
  yellow: 55,
  orange: 90,
  red: 150,
  purple: 0,
  white: 0,
  darkblue: 0,
  hidden: 0,
};

// $ot - Non-blue color groups (placed as contiguous runs)
export const OT_COLOR_GROUPS: { color: SphereColor; count: number }[] = [
  { color: 'cyan', count: 4 },
  { color: 'green', count: 3 },
  { color: 'yellow', count: 3 },
  { color: 'orange', count: 2 },
  { color: 'red', count: 2 },
  { color: 'white', count: 2 },
];

// Game configurations
export const GAME_CONFIGS: Record<'oh' | 'oc' | 'oq' | 'ot', GameConfig> = {
  oh: {
    gridSize: 5,
    maxClicks: 5,
    timeLimit: 120, // 2 minutes
  },
  oc: {
    gridSize: 5,
    maxClicks: 5,
    timeLimit: 120,
  },
  oq: {
    gridSize: 5,
    maxClicks: 7,
    timeLimit: 120,
  },
  ot: {
    gridSize: 5,
    maxClicks: 4,
    timeLimit: 120,
  },
};

// Grid size
export const GRID_SIZE = 5;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

// Special sphere properties
export const REVEAL_COUNTS: Partial<Record<SphereColor, number>> = {
  blue: 3,   // Blue reveals 3 adjacent
  cyan: 1,   // Cyan reveals 1 adjacent
};

// Color display names (Portuguese)
export const COLOR_NAMES: Record<SphereColor, string> = {
  cyan: 'Ciano',
  blue: 'Azul',
  green: 'Verde',
  yellow: 'Amarela',
  orange: 'Laranja',
  red: 'Vermelha',
  purple: 'Roxa',
  white: 'Branca',
  darkblue: 'Azul Escuro',
  hidden: 'Oculta',
};
