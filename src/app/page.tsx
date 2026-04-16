'use client';

import Link from 'next/link';
import { SPHERE_GRADIENTS } from '@/lib/constants';
import { useI18n, LanguageToggle } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();

  const games = [
    {
      id: 'oh',
      name: '$oh - Orb Harvest',
      description: t.ohDesc,
      clicks: 5,
      color: 'blue',
      gradient: SPHERE_GRADIENTS.blue,
    },
    {
      id: 'oc',
      name: '$oc - Orb Chest',
      description: t.ocDesc,
      clicks: 5,
      color: 'red',
      gradient: SPHERE_GRADIENTS.red,
    },
    {
      id: 'oq',
      name: '$oq - Orb Quest',
      description: t.oqDesc,
      clicks: 7,
      color: 'purple',
      gradient: SPHERE_GRADIENTS.purple,
    },
    {
      id: 'ot',
      name: '$ot - Orb Trace',
      description: t.otDesc,
      clicks: 4,
      color: 'white',
      gradient: SPHERE_GRADIENTS.white,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-gray-400 text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {['blue', 'cyan', 'green', 'yellow', 'red', 'purple', 'dark', 'rainbow'].map((color, i) => (
            <div
              key={color}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full animate-bounce border-2 border-gray-600"
              style={{
                background: SPHERE_GRADIENTS[color as keyof typeof SPHERE_GRADIENTS],
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <div className="space-y-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/${game.id}`}
              className="block group"
            >
              <div className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex-shrink-0 border-2 border-gray-600 group-hover:scale-110 transition-transform"
                    style={{ background: game.gradient }}
                  />
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {game.name}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mb-3">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-gray-700 px-3 py-1 rounded-full text-gray-300">
                        {game.clicks} {t.clicks}
                      </span>
                      <span className="text-gray-500">
                        {t.minutes}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>{t.footer1}</p>
          <p className="mt-2">{t.footer2}</p>
        </div>
      </div>
    </main>
  );
}
