import React, { useState } from 'react';
import { GalaWeek, Lovely } from '../types';
import { MascotAvatar } from './MascotAvatar';
import { Calendar, Crown, AlertTriangle, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface GalaTimelineSectionProps {
  weeks: GalaWeek[];
  lovelys: Lovely[];
  userVotes?: Record<string, number>;
  onVoteForLovely: (lovely: Lovely) => void;
  onSelectLovely: (lovely: Lovely) => void;
}

export const GalaTimelineSection: React.FC<GalaTimelineSectionProps> = ({
  weeks,
  lovelys,
  userVotes = {},
  onVoteForLovely,
  onSelectLovely,
}) => {
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(4);

  const activeWeek = weeks.find((w) => w.weekNumber === selectedWeekNumber) || weeks[3];
  const nominatedLovelys = lovelys.filter((l) => activeWeek.nominatedIds.includes(l.id));
  const leaderLovely = lovelys.find((l) => l.id === activeWeek.leaderId);

  return (
    <section id="galas" className="py-14 border-b border-slate-800 bg-slate-950/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Gala Semanal & Mecánica de Expulsión</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              La Placa de Nominadas & El Líder
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Cada semana las habitantes votan cara a cara en el salón y la audiencia decide el desenlace.
            </p>
          </div>

          {/* Week Selector Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shrink-0">
            {weeks.map((w) => (
              <button
                key={w.weekNumber}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedWeekNumber(w.weekNumber);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  w.weekNumber === selectedWeekNumber
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Semana {w.weekNumber} {w.isCurrent ? '· (Actual)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Week Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: The Nominees on the Hot Plate (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Placa Oficial de Expulsión</span>
                </div>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {activeWeek.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                  {activeWeek.eliminationDate}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              {activeWeek.theme}. Los votos del público son positivos: vota por quién quieres que permanezca en la casa.
            </p>

            {/* Nominated Lovelys Cards */}
            {nominatedLovelys.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Esta semana no hay placa de expulsión o ya concluyó la votación.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nominatedLovelys.map((nom) => (
                  <div
                    key={nom.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onSelectLovely(nom);
                          }}
                          className="cursor-pointer"
                        >
                          <MascotAvatar lovely={nom} size="md" showStatusIndicator />
                        </button>
                        <div>
                          <div className="text-base font-bold text-white">
                            {nom.name}
                          </div>
                          <div className="text-xs text-rose-400 font-semibold">
                            TWICE {nom.member}
                          </div>
                          <div className="text-xs text-pink-300 font-medium mt-0.5">
                            Tus votos: <strong className="text-white font-mono">{(userVotes[nom.id] || 0).toLocaleString('es-ES')}</strong>
                          </div>
                          <div className="text-[10px] text-amber-300/90 font-medium">
                            🔒 Cómputo secreto de gala
                          </div>
                        </div>
                      </div>

                      {nom.nominatedReason && (
                        <p className="text-xs text-slate-300 italic bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 mb-3">
                          "{nom.nominatedReason}"
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playVoteSuccess();
                        onVoteForLovely(nom);
                      }}
                      className="w-full py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>¡Votar para Salvar!</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: The Leader of the Week (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-lime-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-lime-400" />
                <span>Líder Supremo de la Semana</span>
              </div>
              <span className="text-xs font-semibold text-lime-400 bg-lime-500/10 border border-lime-500/30 px-2.5 py-0.5 rounded-full">
                Inmune
              </span>
            </div>

            {leaderLovely && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSelectLovely(leaderLovely);
                    }}
                    className="cursor-pointer"
                  >
                    <MascotAvatar lovely={leaderLovely} size="lg" showStatusIndicator />
                  </button>
                  <div>
                    <h4 className="text-xl font-extrabold text-white">
                      {leaderLovely.name}
                    </h4>
                    <div className="text-xs font-bold text-lime-400">
                      TWICE {leaderLovely.member} · {leaderLovely.hangul}
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {leaderLovely.roleInHouse}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-lime-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-lime-400" />
                    <span>Beneficios de la Suite Presidencial</span>
                  </div>
                  <ul className="space-y-1 text-slate-400 list-disc list-inside">
                    <li>Inmunidad total frente a la placa de expulsión.</li>
                    <li>Poder de salvación directa en el careo del viernes.</li>
                    <li>Cama matrimonial privada con jacuzzi y café ilimitado.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectLovely(leaderLovely);
                  }}
                  className="w-full py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center"
                >
                  Ver Perfil y Estrategia del Líder
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
