'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { OtGameState } from '@/lib/types';
import { initializeOtGame, processOtClick } from '@/lib/ot-logic';
import SphereGrid from '@/components/SphereGrid';
import GameHeader from '@/components/GameHeader';
import RewardLog from '@/components/RewardLog';

export default function OrbTracePage() {
  const [gameState, setGameState] = useState<OtGameState | null>(null);
  const [stockTotal, setStockTotal] = useState(0);

  const startNewGame = useCallback(() => {
    setGameState(initializeOtGame());
  }, []);

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

  const handleSphereClick = (sphereId: number) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    setGameState(processOtClick(gameState, sphereId));
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
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>

        <GameHeader
          gameName="$ot - Orb Trace"
          clicksRemaining={gameState.clicksRemaining}
          maxClicks={gameState.maxClicks}
          totalScore={gameState.totalScore}
          timeRemaining={gameState.timeRemaining}
          gameStatus={gameState.gameStatus}
          extraInfo={
            <div className="space-y-1">
              <p>Voce pode clicar <span className="text-white font-bold">{gameState.maxClicks} vezes</span> (por 2 minutos).</p>
              <p className="text-xs text-gray-400">
                Todas as cores sao gratis, exceto as esferas azuis.
              </p>
              <p className="text-xs text-gray-400">
                Cores iguais ficam em sequencia na mesma linha ou coluna.
              </p>
            </div>
          }
        />

        <SphereGrid
          spheres={gameState.grid}
          onSphereClick={handleSphereClick}
          disabled={gameState.gameStatus === 'finished'}
          revealAll={gameState.gameStatus === 'finished'}
        />

        <RewardLog rewards={gameState.rewardLog} />

        <div className="mt-4 text-center">
          <span className="text-gray-400">Estoque: </span>
          <span className="text-yellow-400 font-bold">{stockTotal}</span>
        </div>

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
