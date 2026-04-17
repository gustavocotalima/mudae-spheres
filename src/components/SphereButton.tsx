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
}

export default function SphereButton({
  color,
  revealed,
  clicked = false,
  onClick,
  disabled = false,
  size = 'md',
}: SphereButtonProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 md:w-14 md:h-14',
    lg: 'w-16 h-16',
  };

  const displayColor = revealed ? color : 'hidden';
  const gradient = SPHERE_GRADIENTS[displayColor];

  const isClickable = !disabled && !clicked;

  return (
    <button
      onClick={onClick}
      disabled={disabled || clicked}
      className={`
        ${sizeClasses[size]}
        rounded-full
        transition-all
        duration-300
        transform
        ${isClickable ? 'hover:scale-110 cursor-pointer' : ''}
        ${disabled && !clicked ? 'opacity-50 cursor-not-allowed' : ''}
        ${clicked ? '' : 'brightness-75 hover:brightness-100'}
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
