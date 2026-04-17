'use client';

import { useI18n } from '@/lib/i18n';

interface GameHeaderProps {
  gameName: string;
  clicksRemaining: number;
  maxClicks: number;
  totalScore: number;
  timeRemaining?: number;
  gameStatus: 'idle' | 'playing' | 'finished';
  extraInfo?: React.ReactNode;
}

export default function GameHeader({
  gameName,
  clicksRemaining,
  maxClicks,
  totalScore,
  timeRemaining,
  extraInfo,
}: GameHeaderProps) {
  const { t } = useI18n();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
        {gameName}
      </h1>

      <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3 gap-4">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs uppercase tracking-wide">{t.clicksStat}</span>
          <span className={`text-xl font-bold ${clicksRemaining <= 1 ? 'text-red-400' : 'text-white'}`}>
            {clicksRemaining}/{maxClicks}
          </span>
        </div>

        {timeRemaining !== undefined && (
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-xs uppercase tracking-wide">{t.timeStat}</span>
            <span className={`text-xl font-bold ${timeRemaining <= 30 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs uppercase tracking-wide">{t.spheresStat}</span>
          <span className="text-xl font-bold text-green-400">
            +{totalScore}
          </span>
        </div>
      </div>

      {extraInfo && (
        <div className="mt-3 text-center text-gray-300 text-sm">
          {extraInfo}
        </div>
      )}
    </div>
  );
}
