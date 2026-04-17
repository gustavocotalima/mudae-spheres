'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Locale = 'pt' | 'en';

const translations = {
  pt: {
    // Landing
    title: 'Mudae Spheres',
    subtitle: 'Pratique os minigames de esferas do Mudae!',
    footer1: 'Inspirado no sistema de esferas do Mudae Bot',
    footer2: 'Criado para pratica - nao afiliado ao Mudae oficial',
    clicks: 'cliques',
    minutes: '2 minutos',

    // Game descriptions
    ohDesc: 'Clique em esferas aleatorias para colher recompensas. Esferas azuis revelam 3 botoes, cianas revelam 1!',
    ocDesc: 'Encontre a esfera vermelha usando pistas das cores! Laranjas sao adjacentes, amarelas sao diagonais.',
    oqDesc: 'Campo minado! Encontre 3 das 4 esferas roxas para transformar a 4a em vermelha. Use as cores como dicas!',
    otDesc: 'Evite as esferas azuis! Cores iguais ficam em sequencia na mesma linha ou coluna.',

    // Common game UI
    back: 'Voltar',
    loading: 'Carregando...',
    stock: 'Estoque:',
    playAgain: 'Jogar Novamente',
    rewards: 'Recompensas',
    rewardsPlaceholder: '(As recompensas aparecem aqui)',
    total: 'Total:',
    free: '(Gratis)',

    // Header stats
    clicksStat: 'Cliques',
    timeStat: 'Tempo',
    spheresStat: 'Esferas',

    // $oh
    ohClicks: (n: number) => `Voce pode clicar ${n} vezes nos botoes abaixo (por 2 minutos).`,
    ohHint: 'Esferas azuis revelam 3 botoes; esferas cianas revelam 1.',

    // $oc
    ocClicks: (n: number) => `Voce pode clicar ${n} vezes nos botoes abaixo (2 minutos).`,
    ocRedSphere: '1 esfera vermelha',
    ocHint: (parts: { orange: string; yellow: string; green: string; teal: string; blue: string }) =>
      `${parts.orange} (sempre adjacentes a vermelha), ${parts.yellow} (sempre na diagonal da vermelha), ${parts.green} (na mesma linha ou coluna da vermelha), ${parts.teal} (na mesma linha, coluna ou diagonal) e ${parts.blue} (NUNCA na mesma linha, coluna ou diagonal).`,
    ocOrange: '2 laranjas',
    ocYellow: '3 amarelas',
    ocGreen: '4 verdes',
    ocTeal: 'cianas',
    ocBlue: 'azuis',

    // $oq
    oqClicks: (n: number) => `Voce pode clicar ${n} vezes nos botoes abaixo.`,
    oqGoal: 'Encontre {purple} (de 4) para transformar a 4a roxa em uma {red} ou superior.',
    oqPurple: '3 esferas roxas',
    oqRed: 'esfera vermelha',
    oqHint: 'As cores definem o numero de roxas adjacentes (8 casas ao redor):',

    // $ot
    otClicks: (n: number) => `Voce pode clicar ${n} vezes (por 2 minutos).`,
    otFreeHint: 'Todas as cores sao gratis, exceto as esferas azuis.',
    otTraceHint: 'Cores iguais ficam em sequencia na mesma linha ou coluna.',
    otFind: (list: string) => `Esferas para encontrar: ${list}.`,
    otRare: 'esferas mais raras',
    otColorCount: (n: number) => `Numero de cores diferentes: ${n}`,

    // Logic messages
    whiteSplit: (colors: string) => `se divide em ${colors}`,
    darkTransform: (color: string) => `Sombria virou ${color}`,

    // Color names
    colors: {
      teal: 'Ciano',
      blue: 'Azul',
      green: 'Verde',
      yellow: 'Amarela',
      orange: 'Laranja',
      red: 'Vermelha',
      purple: 'Roxa',
      white: 'Branca',
      dark: 'Sombria',
      rainbow: 'Arco-iris',
      hidden: 'Oculta',
    } as Record<string, string>,

    // Color legend ($oq)
    colorLegend: {
      blue: 'Azul = 0',
      teal: 'Ciano = 1',
      green: 'Verde = 2',
      yellow: 'Amarela = 3',
      orange: 'Laranja = 4',
    },
  },
  en: {
    title: 'Mudae Spheres',
    subtitle: 'Practice the Mudae sphere minigames!',
    footer1: 'Inspired by the Mudae Bot sphere system',
    footer2: 'Made for practice - not affiliated with official Mudae',
    clicks: 'clicks',
    minutes: '2 minutes',

    ohDesc: 'Click random spheres to harvest rewards. Blue spheres reveal 3 buttons, teal reveals 1!',
    ocDesc: 'Find the red sphere using color clues! Oranges are adjacent, yellows are diagonal.',
    oqDesc: 'Minesweeper! Find 3 of 4 purple spheres to transform the 4th into red. Use colors as clues!',
    otDesc: 'Avoid blue spheres! Same colors appear in sequence on the same row or column.',

    back: 'Back',
    loading: 'Loading...',
    stock: 'Stock:',
    playAgain: 'Play Again',
    rewards: 'Rewards',
    rewardsPlaceholder: '(Rewards appear here)',
    total: 'Total:',
    free: '(Free)',

    clicksStat: 'Clicks',
    timeStat: 'Time',
    spheresStat: 'Spheres',

    ohClicks: (n: number) => `You can click ${n} times on the buttons below (2 minutes).`,
    ohHint: 'Blue spheres reveal 3 buttons; teal spheres reveal 1.',

    ocClicks: (n: number) => `You can click ${n} times on the buttons below (2 minutes).`,
    ocRedSphere: '1 red sphere',
    ocHint: (parts: { orange: string; yellow: string; green: string; teal: string; blue: string }) =>
      `${parts.orange} (always adjacent to red), ${parts.yellow} (always diagonal to red), ${parts.green} (same row or column as red), ${parts.teal} (same row, column or diagonal) and ${parts.blue} (NEVER on same row, column or diagonal).`,
    ocOrange: '2 oranges',
    ocYellow: '3 yellows',
    ocGreen: '4 greens',
    ocTeal: 'teals',
    ocBlue: 'blues',

    oqClicks: (n: number) => `You can click ${n} times on the buttons below.`,
    oqGoal: 'Find {purple} (of 4) to transform the 4th purple into a {red} or higher.',
    oqPurple: '3 purple spheres',
    oqRed: 'red sphere',
    oqHint: 'Colors indicate the number of adjacent purples (8 surrounding cells):',

    otClicks: (n: number) => `You can click ${n} times (2 minutes).`,
    otFreeHint: 'All colors are free, except blue spheres.',
    otTraceHint: 'Same colors appear in sequence on the same row or column.',
    otFind: (list: string) => `Spheres to find: ${list}.`,
    otRare: 'rarer spheres',
    otColorCount: (n: number) => `Number of different colors: ${n}`,

    whiteSplit: (colors: string) => `splits into ${colors}`,
    darkTransform: (color: string) => `Dark became ${color}`,

    colors: {
      teal: 'Teal',
      blue: 'Blue',
      green: 'Green',
      yellow: 'Yellow',
      orange: 'Orange',
      red: 'Red',
      purple: 'Purple',
      white: 'White',
      dark: 'Dark',
      rainbow: 'Rainbow',
      hidden: 'Hidden',
    } as Record<string, string>,

    colorLegend: {
      blue: 'Blue = 0',
      teal: 'Teal = 1',
      green: 'Green = 2',
      yellow: 'Yellow = 3',
      orange: 'Orange = 4',
    },
  },
} satisfies Record<Locale, Translations>;

export type Translations = {
  title: string;
  subtitle: string;
  footer1: string;
  footer2: string;
  clicks: string;
  minutes: string;
  ohDesc: string;
  ocDesc: string;
  oqDesc: string;
  otDesc: string;
  back: string;
  loading: string;
  stock: string;
  playAgain: string;
  rewards: string;
  rewardsPlaceholder: string;
  total: string;
  free: string;
  clicksStat: string;
  timeStat: string;
  spheresStat: string;
  ohClicks: (n: number) => string;
  ohHint: string;
  ocClicks: (n: number) => string;
  ocRedSphere: string;
  ocHint: (parts: { orange: string; yellow: string; green: string; teal: string; blue: string }) => string;
  ocOrange: string;
  ocYellow: string;
  ocGreen: string;
  ocTeal: string;
  ocBlue: string;
  oqClicks: (n: number) => string;
  oqGoal: string;
  oqPurple: string;
  oqRed: string;
  oqHint: string;
  otClicks: (n: number) => string;
  otFreeHint: string;
  otTraceHint: string;
  otFind: (list: string) => string;
  otRare: string;
  otColorCount: (n: number) => string;
  whiteSplit: (colors: string) => string;
  darkTransform: (color: string) => string;
  colors: Record<string, string>;
  colorLegend: { blue: string; teal: string; green: string; yellow: string; orange: string };
};

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'pt',
  t: translations.pt,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('locale') as Locale) || 'pt';
    }
    return 'pt';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', l);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale] as Translations, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <button
      onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}
      className="text-gray-400 hover:text-white text-sm border border-gray-600 hover:border-gray-400 px-3 py-1 rounded-full transition-colors"
    >
      {locale === 'pt' ? '🇬🇧 EN' : '🇧🇷 PT'}
    </button>
  );
}
