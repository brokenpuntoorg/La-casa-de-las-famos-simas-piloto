import React from 'react';
import { Lovely } from '../types';

interface MascotAvatarProps {
  lovely: Lovely;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusIndicator?: boolean;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  lovely,
  size = 'md',
  showStatusIndicator = false,
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  // Ear rendering details based on lovely id & earType
  const renderEars = () => {
    switch (lovely.earType) {
      case 'bunny':
        return (
          <>
            {/* Left bunny ear */}
            <path
              d="M32 30 C20 10 18 -6 30 2 C40 10 38 24 38 32"
              fill={lovely.colorHex}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <path
              d="M28 24 C22 10 21 0 28 4 C34 9 33 18 33 25"
              fill="rgba(255,255,255,0.4)"
            />
            {/* Right bunny ear */}
            <path
              d="M68 30 C80 10 82 -6 70 2 C60 10 62 24 62 32"
              fill={lovely.colorHex}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <path
              d="M72 24 C78 10 79 0 72 4 C66 9 67 18 67 25"
              fill="rgba(255,255,255,0.4)"
            />
          </>
        );
      case 'bear':
        return (
          <>
            {/* Left bear ear */}
            <circle cx="28" cy="24" r="14" fill={lovely.colorHex} stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="28" cy="24" r="7" fill="rgba(255,255,255,0.35)" />
            {/* Right bear ear */}
            <circle cx="72" cy="24" r="14" fill={lovely.colorHex} stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="72" cy="24" r="7" fill="rgba(255,255,255,0.35)" />
          </>
        );
      case 'cat':
        return (
          <>
            {/* Left cat/tiger ear */}
            <polygon points="20,38 28,12 42,32" fill={lovely.colorHex} stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="24,34 29,18 38,30" fill="rgba(255,255,255,0.4)" />
            {/* Right cat/tiger ear */}
            <polygon points="80,38 72,12 58,32" fill={lovely.colorHex} stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="76,34 71,18 62,30" fill="rgba(255,255,255,0.4)" />
          </>
        );
      case 'puppy':
        return (
          <>
            {/* Left floppy puppy ear */}
            <path
              d="M26 30 C12 34 8 56 18 64 C24 70 30 54 28 36"
              fill={lovely.colorHex}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Right floppy puppy ear */}
            <path
              d="M74 30 C88 34 92 56 82 64 C76 70 70 54 72 36"
              fill={lovely.colorHex}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
          </>
        );
      default:
        return (
          <>
            {/* Soft round bulb ears */}
            <circle cx="26" cy="26" r="12" fill={lovely.colorHex} stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="74" cy="26" r="12" fill={lovely.colorHex} stroke="#0f172a" strokeWidth="2.5" />
          </>
        );
    }
  };

  const getBowtieColor = () => {
    switch (lovely.id) {
      case 'movely': return '#FFD166';
      case 'savely': return '#4ADE80';
      case 'jeongvely': return '#F43F5E';
      case 'tzuvely': return '#F59E0B';
      case 'navely': return '#FBBF24';
      case 'jively': return '#38BDF8';
      case 'mively': return '#E11D48';
      case 'davely': return '#FB7185';
      case 'chaengvely': return '#38BDF8';
      default: return '#FCD34D';
    }
  };

  return (
    <div className={`relative ${sizeMap[size]} shrink-0 select-none group`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`glow-${lovely.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={lovely.colorHex} floodOpacity="0.4" />
          </filter>
          <linearGradient id={`bodyGrad-${lovely.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lovely.colorHex} />
            <stop offset="100%" stopColor={lovely.colorHex} stopOpacity="0.88" />
          </linearGradient>
        </defs>

        {/* Ears */}
        {renderEars()}

        {/* Mascot Round Chubby Body */}
        <ellipse
          cx="50"
          cy="60"
          rx="38"
          ry="34"
          fill={`url(#bodyGrad-${lovely.id})`}
          stroke="#0f172a"
          strokeWidth="2.8"
        />

        {/* Soft Tummy Patch */}
        <ellipse
          cx="50"
          cy="68"
          rx="24"
          ry="19"
          fill="rgba(255, 255, 255, 0.45)"
        />

        {/* Rosy Blush Cheeks */}
        <circle cx="30" cy="62" r="5" fill="#f43f5e" fillOpacity="0.45" />
        <circle cx="70" cy="62" r="5" fill="#f43f5e" fillOpacity="0.45" />

        {/* Big Sparkling Twice Anime Eyes */}
        <ellipse cx="37" cy="54" rx="4.5" ry="6" fill="#0f172a" />
        <circle cx="35.5" cy="52" r="2.2" fill="#ffffff" />
        <circle cx="38" cy="56" r="1.1" fill="#ffffff" />

        <ellipse cx="63" cy="54" rx="4.5" ry="6" fill="#0f172a" />
        <circle cx="61.5" cy="52" r="2.2" fill="#ffffff" />
        <circle cx="64" cy="56" r="1.1" fill="#ffffff" />

        {/* Sweet Smile */}
        {lovely.id === 'savely' || lovely.id === 'navely' ? (
          // Playful open mouth smile
          <path
            d="M44 60 Q50 67 56 60 Z"
            fill="#e11d48"
            stroke="#0f172a"
            strokeWidth="1.8"
          />
        ) : lovely.id === 'tzuvely' ? (
          // Subtle smirk / serene smile
          <path
            d="M45 61 Q50 64 55 60"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Happy arc smile
          <path
            d="M44 60 Q50 65 56 60"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Tiny Cute Nose */}
        <ellipse cx="50" cy="57" rx="1.5" ry="1.2" fill="#0f172a" />

        {/* Reality Show Glam Bowtie or Star Accessory */}
        <g transform="translate(42, 75)">
          <path
            d="M0 4 L16 12 L16 -4 Z M16 4 L0 12 L0 -4 Z"
            fill={getBowtieColor()}
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <circle cx="8" cy="4" r="2.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
        </g>
      </svg>

      {/* Status indicator on avatar if requested */}
      {showStatusIndicator && (
        <div className="absolute -bottom-1 -right-1 z-10">
          {lovely.status === 'LIDER_INMUNE' && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-xs ring-2 ring-slate-950 shadow" title="Líder Inmune">
              👑
            </span>
          )}
          {lovely.status === 'NOMINADA' && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-[10px] ring-2 ring-slate-950 shadow animate-pulse" title="Nominada en riesgo">
              ⚠️
            </span>
          )}
          {lovely.status === 'FAVORITA_TOP' && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white font-bold text-xs ring-2 ring-slate-950 shadow" title="Favorita del Público">
              ⭐
            </span>
          )}
        </div>
      )}
    </div>
  );
};
