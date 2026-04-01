'use client';

import { RewardEntry, SphereColor } from '@/lib/types';
import { SPHERE_COLORS, COLOR_NAMES } from '@/lib/constants';

interface RewardLogProps {
  rewards: RewardEntry[];
  title?: string;
}

export default function RewardLog({ rewards, title = 'Recompensas' }: RewardLogProps) {
  if (rewards.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-4 bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-center text-sm">
          (As recompensas aparecem aqui)
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {rewards.map((reward, index) => (
          <RewardItem key={index} reward={reward} />
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total:</span>
          <span className="text-xl font-bold text-green-400">
            +{rewards.reduce((sum, r) => sum + r.value, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function RewardItem({ reward }: { reward: RewardEntry }) {
  const color = SPHERE_COLORS[reward.color];
  const colorName = COLOR_NAMES[reward.color];

  return (
    <div className="flex items-center gap-3">
      {/* Sphere indicator */}
      <div
        className="w-6 h-6 rounded-full border border-gray-600 flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      {/* Reward info */}
      <div className="flex-1 flex items-center justify-between">
        <span className="text-gray-300 text-sm">
          {reward.isFree && <span className="text-purple-400">(Free) </span>}
          {reward.message || colorName}
        </span>
        <span
          className="font-bold"
          style={{ color }}
        >
          +{reward.value}
        </span>
      </div>
    </div>
  );
}
