import React, { useState } from 'react';
import { Lovely } from '../types';
import { MascotAvatar } from './MascotAvatar';
import { Heart, Search, Eye, AlertTriangle, Crown, Sparkles, Radio } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface VotingSectionProps {
  lovelys: Lovely[];
  totalVotes?: number;
  availableVotes?: number;
  userVotes?: Record<string, number>;
  onVoteForLovely: (lovely: Lovely) => void;
  onSelectLovely: (lovely: Lovely) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const VotingSection: React.FC<VotingSectionProps> = ({
  lovelys,
  userVotes = {},
  onVoteForLovely,
  onSelectLovely,
  isSimulating,
  onToggleSimulation,
}) => {
  const [filter, setFilter] = useState<'all' | 'nominadas' | 'top' | 'lider'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [squeezingId, setSqueezingId] = useState<string | null>(null);

  const filteredLovelys = lovelys.filter((item) => {
    // Search query match
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleInHouse.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'nominadas') return item.status === 'NOMINADA';
    if (filter === 'top') return item.rank <= 3;
    if (filter === 'lider') return item.status === 'LIDER_INMUNE';
    return true;
  });

  return (
    <section id="votacion" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1">
            Cabina de Votación Oficial
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Vota por las Habitantes de la Casa
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Votación a ciegas: el conteo global se mantiene secreto hasta la gala dominical. Aquí puedes ver exclusivamente los votos que tú has emitido por cada habitante.
          </p>
        </div>

        {/* Live Simulation Control Toggle */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Simulador de Votación Global:</span>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onToggleSimulation();
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              isSimulating
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isSimulating ? 'Activo (En vivo)' : 'Pausado'}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        
        {/* Interactive Segmented Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setFilter('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todas (9)
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playDramaticGong();
              setFilter('nominadas');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'nominadas'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-400 hover:text-rose-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>En Placa (2)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setFilter('top');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'top'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top 3 Favoritas</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setFilter('lider');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'lider'
                ? 'bg-lime-600 text-white shadow-sm'
                : 'text-lime-400 hover:text-lime-300 hover:bg-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Líder Inmune</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por Lovely o miembro..."
            className="w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Grid of Lovelys */}
      {filteredLovelys.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
          No se encontraron habitantes con ese criterio de búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLovelys.map((lovely) => {
            const isNominated = lovely.status === 'NOMINADA';
            const isLeader = lovely.status === 'LIDER_INMUNE';
            const isTop = lovely.status === 'FAVORITA_TOP';

            return (
              <div
                key={lovely.id}
                className={`relative rounded-2xl bg-slate-900/90 border transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-slate-600 ${
                  isNominated
                    ? 'border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : isLeader
                    ? 'border-lime-500/40 shadow-lg shadow-lime-950/20'
                    : isTop
                    ? 'border-amber-500/30 shadow-lg shadow-amber-950/20'
                    : 'border-slate-800'
                }`}
              >
                {/* Accent top edge subtle gradient */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: lovely.colorHex }}
                />

                <div className="p-5 flex-1 flex flex-col">
                  {/* Top row: Status & Rank */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-1.5 font-medium">
                      {isNominated && (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> En Placa de Nominadas
                        </span>
                      )}
                      {isLeader && (
                        <span className="text-lime-400 font-bold flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5" /> Líder de la Semana (Inmune)
                        </span>
                      )}
                      {isTop && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Top Favorita del Público
                        </span>
                      )}
                      {!isNominated && !isLeader && !isTop && (
                        <span className="text-slate-400">Habitante Salva</span>
                      )}
                    </div>
                    <div className="font-mono-numbers text-xs text-slate-400 font-semibold">
                      Puesto #{lovely.rank}
                    </div>
                  </div>

                  {/* Character presentation */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="cursor-pointer focus:outline-none">
                      <MascotAvatar
                        lovely={lovely}
                        size="md"
                        showStatusIndicator
                        isSqueezing={squeezingId === lovely.id}
                        onSqueeze={() => onSelectLovely(lovely)}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-xl font-bold text-white tracking-tight truncate">
                          {lovely.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {lovely.hangul}
                        </span>
                      </div>
                      <div className="text-xs text-pink-400 font-medium">
                        TWICE {lovely.member}
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                        {lovely.roleInHouse}
                      </div>
                    </div>
                  </div>

                  {/* Famous Quote */}
                  <blockquote className="text-xs italic text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-4 line-clamp-2">
                    "{lovely.famousQuote}"
                  </blockquote>

                  {/* Personal User Votes & Blind Global Count */}
                  <div className="space-y-2 mt-auto pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Tus votos emitidos:</span>
                      <span className="font-mono-numbers font-bold text-pink-400">
                        {(userVotes[lovely.id] || 0).toLocaleString('es-ES')} votos
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                      <span>Cómputo general:</span>
                      <span className="font-semibold">🔒 Secreto hasta la Gala</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom Strip */}
                <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSelectLovely(lovely);
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Ficha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSqueezingId(lovely.id);
                      sounds.playSquish();
                      setTimeout(() => {
                        sounds.playVoteSuccess();
                        onVoteForLovely(lovely);
                        setTimeout(() => setSqueezingId(null), 700);
                      }, 120);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow active:scale-95 ${
                      isNominated
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : isLeader
                        ? 'bg-lime-600 hover:bg-lime-500 text-white'
                        : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{isNominated ? '¡Votar para Salvar!' : 'Votar por Ella'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
