import Link from 'next/link';
import { SPHERE_GRADIENTS } from '@/lib/constants';

const games = [
  {
    id: 'oh',
    name: '$oh - Orb Harvest',
    description: 'Clique em esferas aleatorias para colher recompensas. Esferas azuis revelam 3 botoes, cianas revelam 1!',
    clicks: 5,
    color: 'blue',
    gradient: SPHERE_GRADIENTS.blue,
  },
  {
    id: 'oc',
    name: '$oc - Orb Chest',
    description: 'Encontre a esfera vermelha usando pistas das cores! Laranjas sao adjacentes, amarelas sao diagonais.',
    clicks: 5,
    color: 'red',
    gradient: SPHERE_GRADIENTS.red,
  },
  {
    id: 'oq',
    name: '$oq - Orb Quest',
    description: 'Campo minado! Encontre 3 das 4 esferas roxas para transformar a 4a em vermelha. Use as cores como dicas!',
    clicks: 7,
    color: 'purple',
    gradient: SPHERE_GRADIENTS.purple,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mudae Spheres
          </h1>
          <p className="text-gray-400 text-lg">
            Pratique os minigames de esferas do Mudae!
          </p>
        </div>

        {/* Sphere Animation */}
        <div className="flex justify-center gap-4 mb-12">
          {['cyan', 'blue', 'green', 'yellow', 'red', 'purple'].map((color, i) => (
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

        {/* Game Cards */}
        <div className="space-y-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/${game.id}`}
              className="block group"
            >
              <div className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  {/* Sphere Icon */}
                  <div
                    className="w-16 h-16 rounded-full flex-shrink-0 border-2 border-gray-600 group-hover:scale-110 transition-transform"
                    style={{ background: game.gradient }}
                  />

                  {/* Game Info */}
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {game.name}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mb-3">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-gray-700 px-3 py-1 rounded-full text-gray-300">
                        {game.clicks} cliques
                      </span>
                      <span className="text-gray-500">
                        2 minutos
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
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

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Inspirado no sistema de esferas do Mudae Bot</p>
          <p className="mt-2">
            Criado para pratica - nao afiliado ao Mudae oficial
          </p>
        </div>
      </div>
    </main>
  );
}
