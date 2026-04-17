'use client';

import { ReactNode } from 'react';
import { RewardEntry, SphereColor } from '@/lib/types';
import { SPHERE_COLORS, SPHERE_GRADIENTS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

function SphereDot({ color }: { color: SphereColor }) {
  return (
    <span
      aria-label={color}
      className="inline-block w-6 h-6 rounded-full align-middle mx-0.5"
      style={{ background: SPHERE_GRADIENTS[color] }}
    />
  );
}

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
      <div className="space-y-2">
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

function renderMessage(message: string, t: ReturnType<typeof useI18n>['t']): ReactNode {
  if (message.startsWith('whiteSplit:')) {
    const colors = message.slice(11).split(' + ') as SphereColor[];
    const dots: ReactNode[] = [];
    colors.forEach((c, i) => {
      if (i > 0) dots.push(<span key={`plus-${i}`}> + </span>);
      dots.push(<SphereDot key={i} color={c} />);
    });
    return (
      <>
        {t.whiteSplit('').trimEnd()} {dots}
      </>
    );
  }
  if (message.startsWith('darkTransform:')) {
    const color = message.slice(14) as SphereColor;
    return (
      <>
        {t.darkTransform('').trimEnd()} <SphereDot color={color} />
      </>
    );
  }
  return message;
}

function RewardItem({ reward }: { reward: RewardEntry }) {
  const { t } = useI18n();
  const color = SPHERE_COLORS[reward.color];
  const colorName = t.colors[reward.color];
  const displayMessage: ReactNode = reward.message ? renderMessage(reward.message, t) : colorName;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-6 h-6 rounded-full flex-shrink-0"
        style={{ background: SPHERE_GRADIENTS[reward.color] }}
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
