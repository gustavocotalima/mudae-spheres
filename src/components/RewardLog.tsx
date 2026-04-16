'use client';

import { RewardEntry } from '@/lib/types';
import { SPHERE_COLORS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

interface RewardLogProps {
  rewards: RewardEntry[];
  title?: string;
}

export default function RewardLog({ rewards, title }: RewardLogProps) {
  const { t } = useI18n();
  const displayTitle = title ?? t.rewards;

  if (rewards.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-4 bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-center text-sm">
          {t.rewardsPlaceholder}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">{displayTitle}</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {rewards.map((reward, index) => (
          <RewardItem key={index} reward={reward} />
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">{t.total}</span>
          <span className="text-xl font-bold text-green-400">
            +{rewards.reduce((sum, r) => sum + r.value, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function translateMessage(message: string, t: ReturnType<typeof useI18n>['t']): string {
  if (message === 'blueHit') return t.blueHit;
  if (message === 'darkBlueTransform') return t.darkBlueTransform;
  if (message.startsWith('whiteSplit:')) return t.whiteSplit(message.slice(11));
  if (message.startsWith('blackTransform:')) {
    const color = message.slice(15);
    const colorName = t.colors[color] ?? color;
    return t.blackTransform(colorName);
  }
  return message;
}

function RewardItem({ reward }: { reward: RewardEntry }) {
  const { t } = useI18n();
  const color = SPHERE_COLORS[reward.color];
  const colorName = t.colors[reward.color];
  const displayMessage = reward.message ? translateMessage(reward.message, t) : colorName;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-6 h-6 rounded-full border border-gray-600 flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-gray-300 text-sm">
          {reward.isFree && <span className="text-purple-400">{t.free} </span>}
          {displayMessage}
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
