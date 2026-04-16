'use client';

import { SphereColor } from '@/lib/types';
import { SPHERE_GRADIENTS } from '@/lib/constants';

interface SphereButtonProps {
  color: SphereColor;
  revealed: boolean;
  clicked?: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
}

export default function SphereButton({
  color,
  revealed,
  clicked = false,
  onClick,
  disabled = false,
  size = 'md',
  showGlow = true,
}: SphereButtonProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 md:w-14 md:h-14',
    lg: 'w-16 h-16',
  };

  const displayColor = revealed ? color : 'hidden';
  const gradient = SPHERE_GRADIENTS[displayColor];

  const glowColors: Record<SphereColor, string> = {
    cyan: 'shadow-[0_0_15px_rgba(0,212,170,0.6)]',
    blue: 'shadow-[0_0_15px_rgba(88,101,242,0.6)]',
    green: 'shadow-[0_0_15px_rgba(87,242,135,0.6)]',
    yellow: 'shadow-[0_0_15px_rgba(254,231,92,0.6)]',
    orange: 'shadow-[0_0_15px_rgba(247,148,84,0.6)]',
    red: 'shadow-[0_0_20px_rgba(237,66,69,0.8)]',
    purple: 'shadow-[0_0_15px_rgba(155,89,182,0.6)]',
    white: 'shadow-[0_0_20px_rgba(255,255,255,0.8)]',
    black: 'shadow-[0_0_20px_rgba(0,0,0,0.8)]',
    darkblue: 'shadow-[0_0_15px_rgba(59,72,116,0.6)]',
    hidden: '',
  };

  const isClickable = !disabled && !clicked;

  return (
    <button
      onClick={onClick}
      disabled={disabled || clicked}
      className={`
        ${sizeClasses[size]}
        rounded-full
        border-2
        border-gray-600
        transition-all
        duration-300
        transform
        ${isClickable ? 'hover:scale-110 hover:border-gray-400 cursor-pointer' : ''}
        ${revealed && showGlow ? glowColors[color] : ''}
        ${disabled && !clicked ? 'opacity-50 cursor-not-allowed' : ''}
        ${clicked ? 'opacity-70' : 'hover:brightness-110'}
      `}
      style={{
        background: gradient,
      }}
    >
      {revealed && (
        <span className="sr-only">{color}</span>
      )}
    </button>
  );
}
