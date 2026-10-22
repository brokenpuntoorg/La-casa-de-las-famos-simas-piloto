import React from 'react';
import { Lovely } from '../types';
import { MascotAvatar } from './MascotAvatar';
import goldenTrophyImg from '../assets/images/reality_golden_trophy_1792610882972.jpg';
import { Trophy, TrendingUp, TrendingDown, Minus, Heart } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LeaderboardPodiumProps {
  lovelys: Lovely[];
  userVotes?: Record<string, number>;
  onVoteForLovely: (lovely: Lovely) => void;
  onSelectLovely: (lovely: Lovely) => void;
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({
  lovelys,
  userVotes = {},
  onVoteForLovely,
  onSelectLovely,
}) => {
  // Sort lovelys by votes descending
  const sorted = [...lovelys].sort((a, b) => b.votes - a.votes);
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  const renderTrend = (current: number, prev: number) => {
    if (current < prev) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" /> Subió #{prev - current}
        </span>
      );
    } else if (current > prev) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-semibold text-rose-400">
          <TrendingDown className="w-3.5 h-3.5" /> Bajó #{current - prev}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-xs text-slate-400">
        <Minus className="w-3.5 h-3.5" /> Mantiene
      </span>
    );
  };

  return (
    <section id="podio" className="py-14 border-b border-slate-800 bg-slate-950/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              Clasificación Oficial del Público
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Podio de las 3 Famosísimas Favoritas
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <span>🔒 Voto a ciegas: Cómputo global en secreto</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Semana 4</span>
          </div>
        </div>

        {/* Podium Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          {/* Trophy Showcase Sidecard (Col 1-4) */}
          <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl shadow-amber-500/10 mb-4">
              <img
                src={goldenTrophyImg}
                alt="Trofeo Oficial de La Casa de las Famosísimas"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 justify-center mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Trofeo Estrella Dorada</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Premio a la Famosísima del Año
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              La Lovely que acumule mayor porcentaje de votos del público durante la temporada ganará la suite presidencial y el trofeo estelar.
            </p>
          </div>

          {/* 3-Step Podium Grid (Col 5-12) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* 2nd Place (Left) */}
            {second && (
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectLovely(second);
                  }}
                  className="w-full text-center group cursor-pointer"
                >
                  <div className="flex justify-center mb-2">
                    <MascotAvatar lovely={second} size="lg" />
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mb-0.5">
                    {second.member}
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">
                    {second.name}
                  </div>
                </button>

                <div className="w-full mt-3 rounded-t-2xl bg-slate-900 border-t-2 border-x border-slate-700 p-4 text-center h-48 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-xl font-black text-slate-400 font-display">
                      #2
                    </div>
                    <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
                      <span>🔒 Cómputo Secreto</span>
                    </div>
                    <div className="text-[11px] text-pink-300 font-medium">
                      Tus votos: <strong className="text-white font-mono-numbers">{(userVotes[second.id] || 0).toLocaleString('es-ES')}</strong>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-center">
                      {renderTrend(2, second.previousRank)}
                    </div>
                    <button
                      type="button"
                      onClick={() => onVoteForLovely(second)}
                      className="w-full py-1.5 px-3 text-xs font-bold text-white bg-slate-800 hover:bg-pink-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>Votar +</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place (Center - Elevated) */}
            {first && (
              <div className="flex flex-col items-center md:-translate-y-4">
                <div className="text-center mb-1">
                  <span className="inline-block text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full mb-1">
                    👑 Favorita Actual
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectLovely(first);
                  }}
                  className="w-full text-center group cursor-pointer"
                >
                  <div className="flex justify-center mb-2 relative">
                    <div className="absolute -top-3 w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-lg shadow-amber-400/30">
                      1
                    </div>
                    <MascotAvatar lovely={first} size="xl" />
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mb-0.5">
                    {first.member}
                  </div>
                  <div className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                    {first.name}
                  </div>
                </button>

                <div className="w-full mt-3 rounded-t-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-t-4 border-amber-400 border-x border-slate-700 p-5 text-center h-60 flex flex-col justify-between shadow-xl shadow-amber-500/10">
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-amber-400 font-display">
                      #1
                    </div>
                    <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
                      <span>🔒 Cómputo Secreto</span>
                    </div>
                    <div className="text-xs text-amber-200 font-medium">
                      Tus votos: <strong className="text-white font-mono-numbers">{(userVotes[first.id] || 0).toLocaleString('es-ES')}</strong>
                    </div>
                  </div>
                  
                  <div className="space-y-2.5 pt-2 border-t border-slate-800">
                    <div className="flex justify-center">
                      {renderTrend(1, first.previousRank)}
                    </div>
                    <button
                      type="button"
                      onClick={() => onVoteForLovely(first)}
                      className="w-full py-2 px-4 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>¡Votar por la Líder!</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place (Right) */}
            {third && (
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectLovely(third);
                  }}
                  className="w-full text-center group cursor-pointer"
                >
                  <div className="flex justify-center mb-2">
                    <MascotAvatar lovely={third} size="lg" />
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mb-0.5">
                    {third.member}
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">
                    {third.name}
                  </div>
                </button>

                <div className="w-full mt-3 rounded-t-2xl bg-slate-900 border-t-2 border-x border-slate-700 p-4 text-center h-44 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-xl font-black text-amber-600/80 font-display">
                      #3
                    </div>
                    <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
                      <span>🔒 Cómputo Secreto</span>
                    </div>
                    <div className="text-[11px] text-pink-300 font-medium">
                      Tus votos: <strong className="text-white font-mono-numbers">{(userVotes[third.id] || 0).toLocaleString('es-ES')}</strong>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-center">
                      {renderTrend(3, third.previousRank)}
                    </div>
                    <button
                      type="button"
                      onClick={() => onVoteForLovely(third)}
                      className="w-full py-1.5 px-3 text-xs font-bold text-white bg-slate-800 hover:bg-pink-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>Votar +</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
