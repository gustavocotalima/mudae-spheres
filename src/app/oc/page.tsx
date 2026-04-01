'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { OcGameState } from '@/lib/types';
import { initializeOcGame, processOcClick } from '@/lib/oc-logic';
import SphereGrid from '@/components/SphereGrid';
import GameHeader from '@/components/GameHeader';
import RewardLog from '@/components/RewardLog';

export default function OrbChestPage() {
  const [gameState, setGameState] = useState<OcGameState | null>(null);
  const [stockTotal, setStockTotal] = useState(0);

  // Initialize game
  const startNewGame = useCallback(() => {
    setGameState(initializeOcGame());
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
    setGameState(processOcClick(gameState, sphereId));
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
          gameName="$oc - Orb Chest"
          clicksRemaining={gameState.clicksRemaining}
          maxClicks={gameState.maxClicks}
          totalScore={gameState.totalScore}
          timeRemaining={gameState.timeRemaining}
          gameStatus={gameState.gameStatus}
          extraInfo={
            <div className="space-y-2 text-left">
              <p>Voce pode clicar <span className="text-white font-bold">{gameState.maxClicks} vezes</span> nos botoes abaixo (2 minutos).</p>
              <p className="text-red-400 font-semibold">1 esfera vermelha</p>
              <p className="text-xs text-gray-400">
                <span className="text-orange-400">2 laranjas</span> (sempre adjacentes a vermelha), {' '}
                <span className="text-yellow-400">3 amarelas</span> (sempre na diagonal da vermelha), {' '}
                <span className="text-green-400">4 verdes</span> (na mesma linha ou coluna da vermelha), {' '}
                <span className="text-cyan-400">cianas</span> (na mesma linha, coluna ou diagonal) e {' '}
                <span className="text-blue-400">azuis</span> (NUNCA na mesma linha, coluna ou diagonal).
              </p>
            </div>
          }
        />

        {/* Found Red indicator */}
        {gameState.foundRed && (
          <div className="mb-4 text-center">
            <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
              Encontrou a Vermelha! +150
            </span>
          </div>
        )}

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
