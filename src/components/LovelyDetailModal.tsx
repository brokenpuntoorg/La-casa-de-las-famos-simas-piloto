import React from 'react';
import { Lovely } from '../types';
import { MascotAvatar } from './MascotAvatar';
import { X, Heart, ShieldAlert, Sparkles, Flame, Crown, Share2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LovelyDetailModalProps {
  lovely: Lovely | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (lovely: Lovely) => void;
}

export const LovelyDetailModal: React.FC<LovelyDetailModalProps> = ({
  lovely,
  isOpen,
  onClose,
  onVote,
}) => {
  if (!isOpen || !lovely) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl"
        style={{
          boxShadow: `0 25px 60px -15px ${lovely.colorHex}30`,
        }}
      >
        {/* Top Accent Strip */}
        <div
          className="h-2.5 w-full sticky top-0 z-10"
          style={{ backgroundColor: lovely.colorHex }}
        />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Hero Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-800 text-center sm:text-left">
            <div className="relative">
              <MascotAvatar lovely={lovely} size="xl" showStatusIndicator />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="font-bold text-pink-400 uppercase tracking-wider">
                  TWICE {lovely.member} · {lovely.hangul}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono-numbers">Puesto #{lovely.rank}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-amber-400 font-semibold">{lovely.fandomAlliance}</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {lovely.name}
              </h2>

              <p className="text-sm font-semibold text-slate-300">
                {lovely.roleInHouse}
              </p>

              {/* Status Badge */}
              <div className="pt-1">
                {lovely.status === 'LIDER_INMUNE' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-lime-400 bg-lime-500/10 border border-lime-500/30 rounded-lg">
                    <Crown className="w-3.5 h-3.5" /> Líder de la Semana (Inmunidad Total)
                  </span>
                )}
                {lovely.status === 'NOMINADA' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                    <ShieldAlert className="w-3.5 h-3.5" /> En Placa de Nominación (¡Necesita Votos!)
                  </span>
                )}
                {lovely.status === 'FAVORITA_TOP' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5" /> Favorita del Público
                  </span>
                )}
                {lovely.status === 'SALVA' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg">
                    Habitante Salva
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Reality Quote */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Perfil de Convivencia
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {lovely.bio}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">
                Frase Célebre en la Casa
              </div>
              <p className="text-sm italic text-slate-300">
                "{lovely.famousQuote}"
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Escándalo más Sonado de la Semana</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                {lovely.houseScandal}
              </p>
            </div>
          </div>

          {/* Reality TV Skills & Attributes */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Medidor de Realities (Atributos de Competencia)
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Carisma con el Público</span>
                  <span className="font-bold text-white">{lovely.stats.charisma}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${lovely.stats.charisma}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Generación de Drama</span>
                  <span className="font-bold text-white">{lovely.stats.drama}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${lovely.stats.drama}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Estrategia & Alianzas</span>
                  <span className="font-bold text-white">{lovely.stats.strategy}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${lovely.stats.strategy}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Popularidad Global</span>
                  <span className="font-bold text-white">{lovely.stats.popularity}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${lovely.stats.popularity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-mono-numbers">
              Acumula <strong className="text-white">{lovely.votes.toLocaleString('es-ES')}</strong> votos ({lovely.votePercentage.toFixed(1)}%)
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onVote(lovely);
              }}
              className="px-6 py-3 text-xs md:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Votar por {lovely.name}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
