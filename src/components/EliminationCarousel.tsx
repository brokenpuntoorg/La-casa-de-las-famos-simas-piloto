import React, { useState, useEffect, useRef } from 'react';
import { Lovely } from '../types';
import { MascotAvatar } from './MascotAvatar';
import stageCarouselImg from '../assets/images/stage_elimination_carousel_1792612827028.jpg';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Play,
  Pause,
  AlertTriangle,
  RotateCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface EliminationCarouselProps {
  lovelys: Lovely[];
  onVoteForLovely: (lovely: Lovely) => void;
  onSelectLovely: (lovely: Lovely) => void;
}

export const EliminationCarousel: React.FC<EliminationCarouselProps> = ({
  lovelys,
  onVoteForLovely,
  onSelectLovely,
}) => {
  // Candidate pool: Nominated contestants first, plus bottom ranks in danger
  const nominated = lovelys.filter((l) => l.status === 'NOMINADA');
  const pool = nominated.length >= 2 ? nominated : [...lovelys].sort((a, b) => a.votes - b.votes).slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isVerdictSpinning, setIsVerdictSpinning] = useState(false);
  const [verdictOutcome, setVerdictOutcome] = useState<{
    savedName: string;
    dangerName: string;
  } | null>(null);

  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep index within bounds
  const validIndex = currentIndex >= pool.length ? 0 : currentIndex;
  const currentLovely = pool[validIndex] || pool[0];

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      sounds.playCarouselTick();
      setCurrentIndex((prev) => (prev + 1) % pool.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoSpinning, pool.length]);

  const handlePrev = () => {
    sounds.playCarouselTick();
    setCurrentIndex((prev) => (prev - 1 + pool.length) % pool.length);
  };

  const handleNext = () => {
    sounds.playCarouselTick();
    setCurrentIndex((prev) => (prev + 1) % pool.length);
  };

  // Dramatic Gala Elimination Roulette Simulation
  const handleTriggerVerdictSpin = () => {
    if (isVerdictSpinning) return;
    setIsVerdictSpinning(true);
    setVerdictOutcome(null);
    sounds.playDramaticGong();

    let step = 0;
    const maxSteps = 16;
    let delay = 90;

    const spinStep = () => {
      step++;
      sounds.playHeartbeat();
      setCurrentIndex((prev) => (prev + 1) % pool.length);

      if (step < maxSteps) {
        delay += 25; // slow down gradually
        setTimeout(spinStep, delay);
      } else {
        // Stop on the candidate with highest votes among the nominees as "SAVED FIRST"
        const sortedByVotes = [...pool].sort((a, b) => b.votes - a.votes);
        const saved = sortedByVotes[0];
        const inDanger = sortedByVotes[sortedByVotes.length - 1];

        const targetIndex = pool.findIndex((p) => p.id === saved.id);
        if (targetIndex !== -1) {
          setCurrentIndex(targetIndex);
        }

        setIsVerdictSpinning(false);
        sounds.playFanfare();
        setVerdictOutcome({
          savedName: saved.name,
          dangerName: inDanger.name,
        });

        try {
          confetti({
            particleCount: 70,
            spread: 55,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#ec4899', '#f59e0b', '#ffffff'],
          });
        } catch {
          // ignore
        }
      }
    };

    setTimeout(spinStep, delay);
  };

  return (
    <section id="carrusel-eliminacion" className="py-14 border-b border-slate-800 bg-slate-950/90 scroll-mt-20 relative overflow-hidden">
      
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <img
          src={stageCarouselImg}
          alt="Escenario del Carrusel de Eliminación"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Gala de Expulsión en Directo</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Carrusel de Eliminación de las Nominadas
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Gira el carrusel de la placa para revisar los porcentajes de salvación, el alegato de cada nominada y emitir votos de emergencia antes del cierre del veredicto.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsAutoSpinning(!isAutoSpinning);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                isAutoSpinning
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoSpinning ? 'Pausar Carrusel' : 'Giro Automático'}</span>
            </button>

            <button
              type="button"
              disabled={isVerdictSpinning}
              onClick={handleTriggerVerdictSpin}
              className="px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center gap-2 active:scale-95"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isVerdictSpinning ? 'animate-spin' : ''}`} />
              <span>{isVerdictSpinning ? '¡Girando Placa...' : '¡Girar Veredicto en Vivo!'}</span>
            </button>
          </div>
        </div>

        {/* Verdict Live Banner Announcement */}
        {verdictOutcome && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-slate-900 border border-rose-500/40 text-center animate-fade-in shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-0.5">
              ★ Veredicto de la Audiencia ★
            </div>
            <div className="text-base sm:text-lg font-black text-white">
              ¡<span className="text-pink-400">{verdictOutcome.savedName}</span> encabeza los votos y regresa a la casa como salvada!
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Atención: <strong className="text-rose-400">{verdictOutcome.dangerName}</strong> se encuentra en la posición más vulnerable del carrusel.
            </p>
          </div>
        )}

        {/* Main Carousel Display Box */}
        <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-2xl">
          
          {/* Subtle Stage Lighting Flare */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none opacity-25"
            style={{ backgroundColor: currentLovely.colorHex }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Zone: Lovely Mascot Avatar on Podium (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              
              {/* Rotating Spotlight Ring */}
              <div className="relative p-6 rounded-full bg-slate-950/80 border-2 border-slate-800 shadow-2xl transition-all duration-500 group">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-35 transition-colors duration-500"
                  style={{ backgroundColor: currentLovely.colorHex }}
                />

                <div className="relative z-10">
                  <MascotAvatar lovely={currentLovely} size="xl" showStatusIndicator />
                </div>

                {/* Nomination Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow border border-slate-950 flex items-center gap-1 whitespace-nowrap">
                  <AlertTriangle className="w-3 h-3 text-amber-300" />
                  <span>En Placa de Eliminación</span>
                </div>
              </div>

              {/* Identity */}
              <div className="mt-5 space-y-1">
                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  TWICE {currentLovely.member} · {currentLovely.hangul}
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {currentLovely.name}
                </h3>
                <div className="text-xs text-slate-300 font-semibold">
                  {currentLovely.roleInHouse}
                </div>
              </div>

              {/* Fandom Badge */}
              <div className="mt-3 text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                Fandom: {currentLovely.fandomAlliance}
              </div>

            </div>

            {/* Right Zone: Elimination Metrics, Speech & Emergency Vote (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Status Header */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Porcentaje de apoyo para salvarse:
                  </span>
                  <span className="font-mono-numbers text-xl font-black text-rose-400">
                    {currentLovely.votePercentage.toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-rose-500 to-pink-500 shadow-md"
                    style={{ width: `${Math.max(6, currentLovely.votePercentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono-numbers">
                    {currentLovely.votes.toLocaleString('es-ES')} votos acumulados
                  </span>
                  <span className="text-amber-400 font-semibold">
                    Lugar en la tabla: #{currentLovely.rank}
                  </span>
                </div>
              </div>

              {/* Last Defense Speech (Alegato) */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Último Alegato ante el Público:</span>
                </div>
                <blockquote className="text-sm italic text-slate-200 leading-relaxed">
                  "{currentLovely.defenseSpeech || currentLovely.famousQuote}"
                </blockquote>
                {currentLovely.nominatedReason && (
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-rose-900/40">
                    <strong>Motivo de la placa:</strong> {currentLovely.nominatedReason}
                  </div>
                )}
              </div>

              {/* Emergency Save Action */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white">
                    ¡Vota ahora para salvar a {currentLovely.name}!
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Los votos positivos la alejan del peligro de la eliminación del domingo.
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playVoteSuccess();
                      onVoteForLovely(currentLovely);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Salvar a {currentLovely.name}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSelectLovely(currentLovely);
                    }}
                    className="px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Ver Ficha
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Carousel Navigation Bottom Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                title="Candidata anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                title="Candidata siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-400 pl-2">
                Habitante <strong className="text-white">{validIndex + 1}</strong> de <strong className="text-white">{pool.length}</strong> en el carrusel
              </span>
            </div>

            {/* Thumbnail dots selector */}
            <div className="flex items-center gap-2">
              {pool.map((cand, idx) => {
                const isActive = idx === validIndex;
                return (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => {
                      sounds.playCarouselTick();
                      setCurrentIndex(idx);
                    }}
                    className={`relative p-1 rounded-xl border transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-rose-950/60 border-rose-500 scale-105 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/50'
                        : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <MascotAvatar lovely={cand} size="sm" />
                    <span className="text-[11px] font-bold text-white hidden md:inline px-1">
                      {cand.name}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
