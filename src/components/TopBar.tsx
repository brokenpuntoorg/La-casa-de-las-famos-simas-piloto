import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TopBarProps {
  onQuickVoteClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  availableVotes: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onQuickVoteClick,
  soundEnabled,
  onToggleSound,
  availableVotes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg md:text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
          onClick={() => sounds.playClick()}
        >
          <span className="text-pink-500 font-display transition-transform group-hover:scale-105 inline-block">
            ★
          </span>
          <span className="font-display tracking-wider uppercase bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
            La Casa de las Famosísimas
          </span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#votacion"
            onClick={() => sounds.playClick()}
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            Votación en Vivo
          </a>
          <a
            href="#podio"
            onClick={() => sounds.playClick()}
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            Podio Semanal
          </a>
          <a
            href="#confesionario"
            onClick={() => sounds.playClick()}
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            El Confesionario
          </a>
          <a
            href="#camaras"
            onClick={() => sounds.playClick()}
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            Cámaras 24/7
          </a>
          <a
            href="#galas"
            onClick={() => sounds.playClick()}
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0"
          >
            Galas & Placa
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos'}
            aria-label="Alternar sonido"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onQuickVoteClick();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-lg shadow-lg shadow-pink-600/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Emitir Votos ({availableVotes})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
