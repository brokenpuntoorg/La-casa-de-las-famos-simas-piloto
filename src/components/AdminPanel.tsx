import React, { useState } from 'react';
import { Lovely, Confession, GalaWeek, LovelyId, HouseStatus } from '../types';
import { MascotAvatar } from './MascotAvatar';
import {
  ShieldAlert,
  Crown,
  Sparkles,
  Users,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  Radio,
  ExternalLink,
  Copy,
  Check,
  Megaphone,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AdminPanelProps {
  lovelys: Lovely[];
  onUpdateLovelys: (updated: Lovely[]) => void;
  weeks: GalaWeek[];
  onUpdateWeeks: (updated: GalaWeek[]) => void;
  confessions: Confession[];
  onAddConfession: (newConf: Omit<Confession, 'id' | 'timestamp' | 'likes'>) => void;
  onDeleteConfession: (id: string) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onSwitchToVoterView: () => void;
  onOpenShareModal: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  lovelys,
  onUpdateLovelys,
  weeks,
  onUpdateWeeks,
  confessions,
  onAddConfession,
  onDeleteConfession,
  isSimulating,
  onToggleSimulation,
  onSwitchToVoterView,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<'nominaciones' | 'lider' | 'votos' | 'galas' | 'anuncios'>('nominaciones');
  const [jefaAnnouncement, setJefaAnnouncement] = useState('');
  const [copiedVoter, setCopiedVoter] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : '';
  const voterUrl = `${baseUrl}?mode=votante`;
  const adminUrl = `${baseUrl}?mode=admin`;

  const copyUrl = async (url: string, isVoter: boolean) => {
    sounds.playClick();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const t = document.createElement('textarea');
        t.value = url;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        t.remove();
      }
      if (isVoter) {
        setCopiedVoter(true);
        setTimeout(() => setCopiedVoter(false), 2000);
      } else {
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  // Toggle Nominated status for a Lovely
  const handleToggleNomination = (id: LovelyId) => {
    sounds.playDramaticGong();
    const updated: Lovely[] = lovelys.map((l) => {
      if (l.id === id) {
        const newStatus: HouseStatus = l.status === 'NOMINADA' ? 'SALVA' : 'NOMINADA';
        return {
          ...l,
          status: newStatus,
          nominatedReason: newStatus === 'NOMINADA' ? l.nominatedReason || 'Nominada en la gala cara a cara.' : undefined,
        };
      }
      return l;
    });
    onUpdateLovelys(updated);
    showToast('Placa de nominadas actualizada.');
  };

  // Set Leader of the Week
  const handleSetLeader = (id: LovelyId) => {
    sounds.playFanfare();
    const updated = lovelys.map((l) => {
      if (l.id === id) {
        return { ...l, status: 'LIDER_INMUNE' as const };
      }
      // If someone else was leader, revert to SALVA or FAVORITA
      if (l.status === 'LIDER_INMUNE') {
        return { ...l, status: 'SALVA' as const };
      }
      return l;
    });
    onUpdateLovelys(updated);
    showToast('Líder de la Semana designada con éxito.');
  };

  // Add votes in bulk to a Lovely
  const handleAddVotes = (id: LovelyId, amount: number) => {
    sounds.playClick();
    const updated = lovelys.map((l) => {
      if (l.id === id) {
        return { ...l, votes: Math.max(0, l.votes + amount) };
      }
      return l;
    });
    onUpdateLovelys(updated);
    showToast(`Se sumaron ${amount.toLocaleString('es-ES')} votos.`);
  };

  // Reset all votes
  const handleResetAllVotes = () => {
    if (!window.confirm('¿Estás seguro de que deseas reiniciar todos los votos a cero para comenzar una nueva gala?')) {
      return;
    }
    sounds.playClick();
    const updated = lovelys.map((l) => ({
      ...l,
      votes: 100,
      votePercentage: 11.1,
    }));
    onUpdateLovelys(updated);
    showToast('Todos los votos han sido reiniciados.');
  };

  // Publish announcement from La Jefa
  const handlePublishJefaAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jefaAnnouncement.trim()) return;
    sounds.playVoteSuccess();
    onAddConfession({
      authorName: 'La Jefa (Producción Oficial)',
      isHousemate: true,
      message: jefaAnnouncement.trim(),
      tag: 'Comunicado Oficial',
    });
    setJefaAnnouncement('');
    showToast('Comunicado oficial de La Jefa publicado en el confesionario.');
  };

  // Set active week
  const handleSetActiveWeek = (weekNum: number) => {
    sounds.playClick();
    const updated = weeks.map((w) => ({
      ...w,
      isCurrent: w.weekNumber === weekNum,
    }));
    onUpdateWeeks(updated);
    showToast(`Semana ${weekNum} fijada como gala en vivo.`);
  };

  const currentLeader = lovelys.find((l) => l.status === 'LIDER_INMUNE');
  const nominatedCount = lovelys.filter((l) => l.status === 'NOMINADA').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Admin Top Header Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-amber-400">
              Modo Administrador Activo
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">
              Panel Maestro de Control de La Jefa / Producción
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenShareModal}
              className="px-3 py-1 font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-pink-400" />
              <span>Ver Enlaces</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToVoterView}
              className="px-3 py-1 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              <span>Probar Vista de Votante</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Toast Alert */}
        {successToast && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Quick Links Showcase Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-bold text-white">
                Enlaces Oficiales del Reality
              </h2>
            </div>
            <span className="text-xs text-slate-400">Listos para compartir</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Voter link */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-pink-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Enlace para Votantes (Público Once)</span>
                </span>
                <span className="text-[10px] bg-pink-500/10 px-2 py-0.5 rounded text-pink-300">Público</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={voterUrl}
                  className="w-full px-3 py-1.5 text-xs font-mono-numbers text-slate-300 bg-slate-900 border border-slate-800 rounded select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyUrl(voterUrl, true)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    copiedVoter ? 'bg-emerald-600 text-white' : 'bg-pink-600 hover:bg-pink-500 text-white'
                  }`}
                >
                  {copiedVoter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVoter ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Admin link */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Enlace para Administrador (La Jefa)</span>
                </span>
                <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded text-amber-300">Privado</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={adminUrl}
                  className="w-full px-3 py-1.5 text-xs font-mono-numbers text-amber-200 bg-slate-900 border border-slate-800 rounded select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyUrl(adminUrl, false)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    copiedAdmin ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {copiedAdmin ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAdmin ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('nominaciones');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'nominaciones'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Placa de Nominadas ({nominatedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('lider');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'lider'
                ? 'bg-lime-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Líder de la Semana ({currentLeader ? currentLeader.name : 'Sin asignar'})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('votos');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'votos'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Gestión de Votos & Simulador</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('galas');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'galas'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galas Semanales</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('anuncios');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'anuncios'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Comunicados de La Jefa ({confessions.length})</span>
          </button>
        </div>

        {/* Tab 1: Nominaciones */}
        {activeTab === 'nominaciones' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span>Armado de la Placa de Nominadas</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Haz clic en cualquier habitante para ponerla en riesgo de expulsión o removerla de la placa. Los votantes verán inmediatamente la actualización en su pantalla.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lovelys.map((lovely) => {
                const isNom = lovely.status === 'NOMINADA';
                const isLeader = lovely.status === 'LIDER_INMUNE';

                return (
                  <div
                    key={lovely.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isNom
                        ? 'bg-rose-950/30 border-rose-500 shadow-md shadow-rose-950/30'
                        : isLeader
                        ? 'bg-lime-950/20 border-lime-500/30 opacity-75'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <MascotAvatar lovely={lovely} size="sm" showStatusIndicator />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">
                          {lovely.name}
                        </div>
                        <div className="text-xs text-pink-400 font-medium">
                          TWICE {lovely.member}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isLeader ? '👑 Líder (Inmune)' : isNom ? '⚠️ En Riesgo' : 'Salva'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isLeader}
                      onClick={() => handleToggleNomination(lovely.id)}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                        isLeader
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : isNom
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      {isLeader ? 'Inmune (Es Líder)' : isNom ? 'Quitar de la Placa' : '+ Poner en Placa'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Designar Líder */}
        {activeTab === 'lider' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-lime-400" />
                <span>Designar Líder de la Semana</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                La líder obtiene inmunidad frente a la nominación semanal, acceso a la suite presidencial y poder de salvación.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lovelys.map((lovely) => {
                const isLeader = lovely.status === 'LIDER_INMUNE';

                return (
                  <div
                    key={lovely.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isLeader
                        ? 'bg-lime-950/40 border-lime-500 shadow-md shadow-lime-950/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MascotAvatar lovely={lovely} size="sm" showStatusIndicator />
                      <div>
                        <div className="text-sm font-bold text-white">
                          {lovely.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {lovely.member}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isLeader}
                      onClick={() => handleSetLeader(lovely.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        isLeader
                          ? 'bg-lime-500 text-slate-950 font-extrabold cursor-default'
                          : 'bg-slate-800 hover:bg-lime-600 hover:text-white text-slate-300'
                      }`}
                    >
                      {isLeader ? '👑 Es Líder' : 'Coronar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Gestión de Votos & Simulador */}
        {activeTab === 'votos' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <span>Auditoría & Simulación de Votos</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Añade votos masivos para pruebas, controla el motor de votación global o reinicia el recuento.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onToggleSimulation();
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    isSimulating
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'animate-pulse text-emerald-400' : ''}`} />
                  <span>Simulador: {isSimulating ? 'Activo' : 'Pausado'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAllVotes}
                  className="px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar Todos los Votos</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {lovelys.map((lovely) => (
                <div
                  key={lovely.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <MascotAvatar lovely={lovely} size="sm" />
                    <div>
                      <div className="font-bold text-white">
                        {lovely.name} (TWICE {lovely.member})
                      </div>
                      <div className="text-slate-400 font-mono-numbers">
                        {lovely.votes.toLocaleString('es-ES')} votos ({lovely.votePercentage.toFixed(1)}%) · Puesto #{lovely.rank}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddVotes(lovely.id, 500)}
                      className="px-2.5 py-1 font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      +500
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddVotes(lovely.id, 2000)}
                      className="px-2.5 py-1 font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      +2.000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddVotes(lovely.id, 10000)}
                      className="px-2.5 py-1 font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors"
                    >
                      +10.000
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Galas Semanales */}
        {activeTab === 'galas' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Control de Galas y Semanas</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Selecciona cuál es la gala semanal en curso para que el cronómetro y la información de la página principal sincronicen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    week.isCurrent
                      ? 'bg-amber-950/20 border-amber-500 shadow-md'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Semana {week.weekNumber}
                      </span>
                      {week.isCurrent && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                          En Vivo Ahora
                        </span>
                      )}
                    </div>
                    <div className="text-base font-bold text-white">
                      {week.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {week.theme}
                    </div>
                    <div className="text-xs text-slate-500 pt-1">
                      Fecha límite: {week.eliminationDate}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={week.isCurrent}
                    onClick={() => handleSetActiveWeek(week.weekNumber)}
                    className={`w-full py-2 text-xs font-bold rounded-lg transition-all ${
                      week.isCurrent
                        ? 'bg-amber-500 text-slate-950 font-extrabold cursor-default'
                        : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300'
                    }`}
                  >
                    {week.isCurrent ? 'Semana Activa en la App' : 'Establecer como Semana Activa'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Anuncios de La Jefa */}
        {activeTab === 'anuncios' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-pink-500" />
                <span>Comunicados Oficiales & Moderación</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Publica mensajes con la autoridad de "La Jefa" para que aparezcan destacados en el confesionario o elimina mensajes inapropiados.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handlePublishJefaAnnouncement} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300">
                Nuevo Comunicado Oficial de La Jefa:
              </label>
              <textarea
                rows={3}
                value={jefaAnnouncement}
                onChange={(e) => setJefaAnnouncement(e.target.value)}
                placeholder="Ejemplo: ¡Atención habitantes! Por decisión de la audiencia, la gala de salvación se adelanta a esta noche..."
                className="w-full px-3.5 py-2 text-xs text-white bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 resize-none"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Transmitir a Toda la Casa</span>
                </button>
              </div>
            </form>

            {/* List */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mensajes Actuales en el Muro ({confessions.length}):
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {confessions.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{c.authorName}</span>
                        <span className="text-[10px] text-pink-400">· {c.tag}</span>
                        <span className="text-slate-500 font-mono-numbers">({c.likes} likes)</span>
                      </div>
                      <p className="text-slate-300">"{c.message}"</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onDeleteConfession(c.id);
                        showToast('Mensaje eliminado.');
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors"
                      title="Eliminar mensaje"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
