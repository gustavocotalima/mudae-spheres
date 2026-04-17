import { SphereColor, GameConfig } from './types';

// Sphere color hex values (Discord-style)
export const SPHERE_COLORS: Record<SphereColor, string> = {
  teal: '#00d4aa',
  blue: '#5865f2',
  green: '#57f287',
  yellow: '#fee75c',
  orange: '#f79454',
  red: '#ed4245',
  purple: '#9b59b6',
  white: '#ffffff',
  dark: '#1a1a1a',
  rainbow: '#ff0080',
  hidden: '#4f545c',
};

// Sphere images (public/*.webp)
export const SPHERE_GRADIENTS: Record<SphereColor, string> = {
  teal: 'url(/teal.webp) center/cover no-repeat',
  blue: 'url(/blue.webp) center/cover no-repeat',
  green: 'url(/green.webp) center/cover no-repeat',
  yellow: 'url(/yellow.webp) center/cover no-repeat',
  orange: 'url(/orange.webp) center/cover no-repeat',
  red: 'url(/red.webp) center/cover no-repeat',
  purple: 'url(/purple.webp) center/cover no-repeat',
  white: 'url(/light.webp) center/cover no-repeat',
  dark: 'url(/dark.webp) center/cover no-repeat',
  rainbow: 'url(/rainbow.webp) center/cover no-repeat',
  hidden: 'url(/hidden.webp) center/cover no-repeat',
};

// $oh - Orb Harvest sphere values (fixed values matching $oc)
export const OH_SPHERE_VALUES: Record<SphereColor, { min: number; max: number }> = {
  blue: { min: 10, max: 10 },
  teal: { min: 20, max: 20 },
  green: { min: 35, max: 35 },
  yellow: { min: 55, max: 55 },
  orange: { min: 90, max: 90 },
  red: { min: 150, max: 150 },
  purple: { min: 5, max: 5 },
  white: { min: 0, max: 0 },
  dark: { min: 0, max: 0 },
  rainbow: { min: 500, max: 500 },
  hidden: { min: 0, max: 0 },
};

// $oh - Sphere distribution weights (based on Mudae kakera probabilities, adjusted)
// Source: https://mudae.fandom.com/wiki/Kakera/Reactions
export const OH_SPHERE_WEIGHTS: Record<SphereColor, number> = {
  blue: 50,      // ~50%
  teal: 20,      // ~20%
  green: 10,     // ~10%
  purple: 5,     // ~5% (free click)
  yellow: 5,     // ~5%
  orange: 3,     // ~3%
  red: 2,        // ~2% (rare)
  white: 3,      // Rare special (splits)
  dark: 2,       // Rare special (transforms into another sphere)
  rainbow: 0,    // Never spawned directly; only via red upgrade
  hidden: 0,
};

// $oc - Orb Chest sphere values
export const OC_SPHERE_VALUES: Record<SphereColor, number> = {
  teal: 20,
  blue: 10,
  green: 35,
  yellow: 55,
  orange: 90,
  red: 150,
  purple: 5,
  white: 0,
  dark: 0,
  rainbow: 500,
  hidden: 0,
};

// $oq - Orb Quest sphere values (matching $oc)
export const OQ_SPHERE_VALUES: Record<SphereColor, number> = {
  blue: 10,
  teal: 20,
  green: 35,
  yellow: 55,
  orange: 90,
  red: 150,
  purple: 5,
  white: 0,
  dark: 0,
  rainbow: 500,
  hidden: 0,
};

// $ot - Orb Trace sphere values
export const OT_SPHERE_VALUES: Record<SphereColor, number> = {
  teal: 20,
  blue: 10,
  green: 35,
  yellow: 55,
  orange: 90,
  red: 150,
  purple: 5,
  white: 0,
  dark: 0,
  rainbow: 500,
  hidden: 0,
};

// $ot - Fixed non-blue groups always present (teal=4, green=3, yellow=3).
export const OT_FIXED_GROUPS: { color: SphereColor; count: number }[] = [
  { color: 'teal', count: 4 },
  { color: 'green', count: 3 },
  { color: 'yellow', count: 3 },
];

// $ot - Rare color pool. Each game picks OT_RARE_MIN..OT_RARE_MAX at count 2.
// White splits into 4 random; Black transforms into one of the other colors.
export const OT_RARE_POOL: SphereColor[] = ['orange', 'red', 'white', 'dark'];
export const OT_RARE_MIN = 2;
export const OT_RARE_MAX = OT_RARE_POOL.length;
export const OT_RARE_SPHERE_COUNT = 2;

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
  teal: 1,   // Teal reveals 1 adjacent
};

// Color display names (Portuguese)
export const COLOR_NAMES: Record<SphereColor, string> = {
  teal: 'Ciano',
  blue: 'Azul',
  green: 'Verde',
  yellow: 'Amarela',
  orange: 'Laranja',
  red: 'Vermelha',
  purple: 'Roxa',
  white: 'Branca',
  dark: 'Sombria',
  rainbow: 'Arco-iris',
  hidden: 'Oculta',
};

// Rare upgrade: any red sphere has a small chance to become rainbow (+500)
export const RAINBOW_FROM_RED_CHANCE = 0.03;
export function maybeRainbow(color: SphereColor): SphereColor {
  return color === 'red' && Math.random() < RAINBOW_FROM_RED_CHANCE
    ? 'rainbow'
    : color;
}
