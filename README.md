# Mudae Spheres

Practice simulator for the [Mudae](https://mudae.net/) Discord bot sphere minigames. Built with Next.js, React, and Tailwind CSS.

Supports English and Portuguese (PT-BR).

## Minigames

- **$oh - Orb Harvest**: Click random spheres to harvest rewards. Blue spheres reveal 3 random buttons, cyan reveals 1.
- **$oc - Orb Chest**: Find the hidden red sphere using color-distance clues (orange = adjacent, yellow = diagonal, green = same row/col).
- **$oq - Orb Quest**: Minesweeper variant. Find 3 of 4 purple spheres to transform the 4th into red. Colors indicate adjacent purple count.
- **$ot - Orb Trace**: Avoid blue spheres (they cost clicks). Non-blue clicks are free. Same-colored spheres form contiguous runs along a row or column.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- TypeScript

## Disclaimer

Not affiliated with the official Mudae bot. Made for practice only.
