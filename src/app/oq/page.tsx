'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { OqGameState } from '@/lib/types';
import { initializeOqGame, processOqClick } from '@/lib/oq-logic';
import SphereGrid from '@/components/SphereGrid';
import GameHeader from '@/components/GameHeader';
import RewardLog from '@/components/RewardLog';

export default function OrbQuestPage() {
  const [gameState, setGameState] = useState<OqGameState | null>(null);
  const [stockTotal, setStockTotal] = useState(0);

  // Initialize game
  const startNewGame = useCallback(() => {
    setGameState(initializeOqGame());
  }, []);

  // Start game on mount
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Timer countdown
  useEffect(() => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev || prev.timeRemaining <= 0) return prev;
        const newTime = prev.timeRemaining - 1;
        return {
          ...prev,
          timeRemaining: newTime,
          gameStatus: newTime <= 0 ? 'finished' : prev.gameStatus,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState?.gameStatus]);

  // Update stock when game finishes
  useEffect(() => {
    if (gameState?.gameStatus === 'finished') {
      setStockTotal(prev => prev + gameState.totalScore);
    }
  }, [gameState?.gameStatus, gameState?.totalScore]);

  // Handle sphere click
  const handleSphereClick = (sphereId: number) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    setGameState(processOqClick(gameState, sphereId));
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>

        {/* Game Header */}
        <GameHeader
          gameName="$oq - Orb Quest"
          clicksRemaining={gameState.clicksRemaining}
          maxClicks={gameState.maxClicks}
          totalScore={gameState.totalScore}
          timeRemaining={gameState.timeRemaining}
          gameStatus={gameState.gameStatus}
          extraInfo={
            <div className="space-y-2 text-left">
              <p>Voce pode clicar <span className="text-white font-bold">{gameState.maxClicks} vezes</span> nos botoes abaixo.</p>
              <p>
                Encontre <span className="text-purple-400 font-bold">3 esferas roxas</span> (de 4) para transformar a 4a roxa em uma{' '}
                <span className="text-red-400 font-bold">esfera vermelha</span> ou superior.
              </p>
              <p className="text-xs text-gray-400">
                As cores definem o numero de roxas adjacentes (8 casas ao redor):
              </p>
              <div className="text-xs grid grid-cols-5 gap-1 text-center">
                <span className="text-blue-400">Azul = 0</span>
                <span className="text-cyan-400">Ciano = 1</span>
                <span className="text-green-400">Verde = 2</span>
                <span className="text-yellow-400">Amarela = 3</span>
                <span className="text-orange-400">Laranja = 4</span>
              </div>
            </div>
          }
        />

        {/* Progress indicator */}
        <div className="mb-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full border-2 ${
                i < gameState.purplesFound
                  ? 'bg-purple-500 border-purple-400'
                  : 'bg-gray-700 border-gray-600'
              } transition-all duration-300`}
            />
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center">
            {gameState.purplesFound >= 3 ? (
              <div className="w-6 h-6 rounded-full bg-red-500 animate-pulse" />
            ) : (
              <span className="text-gray-500 text-xs">?</span>
            )}
          </div>
        </div>

        {/* Game Grid */}
        <SphereGrid
          spheres={gameState.grid}
          onSphereClick={handleSphereClick}
          disabled={gameState.gameStatus === 'finished'}
          revealAll={gameState.gameStatus === 'finished'}
        />

        {/* Reward Log */}
        <RewardLog rewards={gameState.rewardLog} />

        {/* Stock Display */}
        <div className="mt-4 text-center">
          <span className="text-gray-400">Estoque: </span>
          <span className="text-yellow-400 font-bold">{stockTotal}</span>
        </div>

        {/* Play Again Button */}
        {gameState.gameStatus === 'finished' && (
          <div className="mt-6 text-center">
            <button
              onClick={startNewGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
