import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Clock, Flame, ShieldCheck } from 'lucide-react';
import heroBannerImg from '../assets/images/hero_casa_famosisimas_1792610881794.jpg';
import lovelysGlamImg from '../assets/images/lovelys_mascots_glam_1792610882886.jpg';
import { sounds } from '../utils/soundEffects';

interface HeroSectionProps {
  totalVotes: number;
  availableVotes?: number;
  onOpenVoting: () => void;
  onScrollToNominadas: () => void;
  currentLeaderName: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalVotes,
  onOpenVoting,
  onScrollToNominadas,
  currentLeaderName,
}) => {
  // Live countdown to Sunday Gala (e.g. 2 days, 07 hrs, 34 min, 12s)
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 23, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-slate-800">
      {/* Background with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBannerImg}
          alt="Escenario de La Casa de las Famosísimas"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-60 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Clean unboxed metadata kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
              <span>Temporada 1</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Semana 4: La Placa del Destino</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400">Líder: {currentLeaderName} (Inmune)</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              ¿Quién es tu <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">Lovely Favorita</span> esta semana?
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              La Casa de las Famosísimas abre sus líneas de votación. Salva a tus habitantes nominadas de la eliminación y corona al miembro más querido de la casa con tus votos ilimitados.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playFanfare();
                  onOpenVoting();
                }}
                className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-xl shadow-pink-600/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Votar Ahora (¡Votos Ilimitados!)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playDramaticGong();
                  onScrollToNominadas();
                }}
                className="px-5 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Ver Placa de Nominadas</span>
              </button>
            </div>

            {/* Reality Show Gala Countdown strip */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <span>Cierre de votación para la Gala:</span>
                <span className="font-mono-numbers font-bold text-white text-sm">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Voto Seguro & Auditado</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Reality Presentation Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={lovelysGlamImg}
                  alt="Las 9 Lovelys de TWICE en el escenario"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* On-air Live badge */}
                <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1.5 shadow">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>En Directo · 24/7</span>
                </div>
              </div>

              {/* Quick stats strip below image */}
              <div className="p-4 grid grid-cols-2 gap-3 divide-x divide-slate-800 text-center">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Votos Totales Emitidos</div>
                  <div className="text-xl font-bold font-mono-numbers text-white mt-0.5">
                    {totalVotes.toLocaleString('es-ES')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Habitantes en Competencia</div>
                  <div className="text-xl font-bold font-mono-numbers text-pink-400 mt-0.5">
                    9 Lovelys
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
