'use client';

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
  gameStatus,
  extraInfo,
}: GameHeaderProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      {/* Game Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
        {gameName}
      </h1>

      {/* Stats Bar */}
      <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3 gap-4">
        {/* Clicks */}
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Cliques</span>
          <span className={`text-xl font-bold ${clicksRemaining <= 1 ? 'text-red-400' : 'text-white'}`}>
            {clicksRemaining}/{maxClicks}
          </span>
        </div>

        {/* Timer */}
        {timeRemaining !== undefined && (
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Tempo</span>
            <span className={`text-xl font-bold ${timeRemaining <= 30 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        {/* Score */}
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Esferas</span>
          <span className="text-xl font-bold text-green-400">
            +{totalScore}
          </span>
        </div>
      </div>

      {/* Game Status */}
      {gameStatus === 'finished' && (
        <div className="mt-3 text-center">
          <span className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold">
            Jogo Finalizado!
          </span>
        </div>
      )}

      {/* Extra Info */}
      {extraInfo && (
        <div className="mt-3 text-center text-gray-300 text-sm">
          {extraInfo}
        </div>
      )}
    </div>
  );
}
