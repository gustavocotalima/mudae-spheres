'use client';

import { Sphere } from '@/lib/types';
import SphereButton from './SphereButton';

interface SphereGridProps {
  spheres: Sphere[];
  onSphereClick: (id: number) => void;
  disabled?: boolean;
  gridSize?: number;
  revealAll?: boolean;
}

export default function SphereGrid({
  spheres,
  onSphereClick,
  disabled = false,
  gridSize = 5,
  revealAll = false,
}: SphereGridProps) {
  return (
    <div
      className="grid gap-2 p-4 bg-gray-800 rounded-xl"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {spheres.map((sphere) => (
        <SphereButton
          key={sphere.id}
          color={sphere.color}
          revealed={revealAll || sphere.revealed}
          clicked={sphere.clicked}
          onClick={() => onSphereClick(sphere.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
