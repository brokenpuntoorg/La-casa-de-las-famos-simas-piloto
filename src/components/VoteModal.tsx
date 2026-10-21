import React, { useState } from 'react';
import { Lovely } from '../types';
import { MascotAvatar } from './MascotAvatar';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, Check, Gift, HelpCircle, Trophy } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface VoteModalProps {
  lovely: Lovely | null;
  isOpen: boolean;
  onClose: () => void;
  availableVotes: number;
  onCastVotes: (lovelyId: string, amount: number) => void;
  onEarnMoreVotes: (amount: number, reason: string) => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  lovely,
  isOpen,
  onClose,
  availableVotes,
  onCastVotes,
  onEarnMoreVotes,
}) => {
  const [voteAmount, setVoteAmount] = useState<number>(1);
  const [showMissions, setShowMissions] = useState<boolean>(false);
  const [missionDone, setMissionDone] = useState<{ [key: string]: boolean }>({});
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  if (!isOpen || !lovely) return null;

  const maxVotesToCast = Math.min(availableVotes, 20);

  const handleVoteSubmit = () => {
    if (availableVotes <= 0 || voteAmount <= 0) return;

    // Trigger celebration effects
    sounds.playVoteSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: [lovely.colorHex, '#ec4899', '#f59e0b', '#38bdf8', '#ffffff'],
      });
    } catch {
      // Confetti fallback
    }

    setSuccessAnimation(true);
    onCastVotes(lovely.id, voteAmount);

    setTimeout(() => {
      setSuccessAnimation(false);
      onClose();
    }, 1200);
  };

  const handleCompleteMission = (key: string, reward: number, title: string) => {
    if (missionDone[key]) return;
    sounds.playFanfare();
    setMissionDone((prev) => ({ ...prev, [key]: true }));
    onEarnMoreVotes(reward, title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 20px 50px -10px ${lovely.colorHex}25`,
        }}
      >
        {/* Top Accent bar */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: lovely.colorHex }}
        />

        {/* Modal Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h3 className="text-base font-bold text-white">
              Cabina de Votación Oficial
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {successAnimation ? (
            <div className="py-8 text-center space-y-3 animate-bounce">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white">
                ¡Voto Registrado con Éxito!
              </h4>
              <p className="text-xs text-slate-300">
                Sumaste <span className="font-bold text-pink-400">{voteAmount} votos</span> para {lovely.name}.
              </p>
            </div>
          ) : (
            <>
              {/* Lovely Info Highlight */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <MascotAvatar lovely={lovely} size="lg" showStatusIndicator />
                <div>
                  <div className="text-xs font-semibold text-pink-400">
                    TWICE {lovely.member} · {lovely.hangul}
                  </div>
                  <h4 className="text-2xl font-black text-white">
                    {lovely.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {lovely.roleInHouse}
                  </p>
                  <div className="text-xs text-slate-400 mt-1 font-mono-numbers">
                    Total actual: <strong className="text-white">{lovely.votes.toLocaleString('es-ES')}</strong> votos ({lovely.votePercentage.toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Voting Slider / Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Cantidad de votos a emitir:
                  </span>
                  <span className="font-mono-numbers text-lg font-black text-pink-400">
                    {voteAmount} {voteAmount === 1 ? 'voto' : 'votos'}
                  </span>
                </div>

                {availableVotes > 0 ? (
                  <>
                    <input
                      type="range"
                      min={1}
                      max={Math.max(1, Math.min(availableVotes, 20))}
                      value={voteAmount}
                      onChange={(e) => setVoteAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />

                    {/* Quick presets */}
                    <div className="flex items-center gap-2">
                      {[1, 3, 5, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          disabled={availableVotes < num}
                          onClick={() => {
                            sounds.playClick();
                            setVoteAmount(num);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                            voteAmount === num
                              ? 'bg-pink-600 text-white border-pink-500'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white disabled:opacity-30'
                          }`}
                        >
                          +{num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setVoteAmount(Math.min(availableVotes, 20));
                        }}
                        className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-slate-950 text-amber-400 border border-slate-800 hover:border-amber-400 transition-colors"
                      >
                        Máx ({Math.min(availableVotes, 20)})
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    Has agotado tus votos diarios. Completa misiones de fan a continuación para recargar votos gratis.
                  </div>
                )}
              </div>

              {/* Fan Missions Accordion / Toggle */}
              <div className="border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMissions(!showMissions)}
                  className="w-full flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4" />
                    <span>Misiones del Fandom Once (+ Votos Gratis)</span>
                  </span>
                  <span>{showMissions ? 'Ocultar' : 'Ver misiones'}</span>
                </button>

                {showMissions && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white">Porra de Apoyo Oficial</div>
                        <div className="text-[11px] text-slate-400">Escucha la ovación del público en vivo.</div>
                      </div>
                      <button
                        type="button"
                        disabled={missionDone['chant']}
                        onClick={() => handleCompleteMission('chant', 5, 'Porra Oficial')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                          missionDone['chant']
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {missionDone['chant'] ? 'Completado' : '+5 Votos'}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white">Grito de Batalla Lovely</div>
                        <div className="text-[11px] text-slate-400">Declara tu lealtad a la candidata en el reality.</div>
                      </div>
                      <button
                        type="button"
                        disabled={missionDone['shout']}
                        onClick={() => handleCompleteMission('shout', 10, 'Grito de Batalla')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                          missionDone['shout']
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {missionDone['shout'] ? 'Completado' : '+10 Votos'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={availableVotes <= 0}
                  onClick={handleVoteSubmit}
                  className="w-full py-3.5 px-4 text-sm font-extrabold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>
                    Confirmar {voteAmount} {voteAmount === 1 ? 'Voto' : 'Votos'} por {lovely.name}
                  </span>
                </button>
                <div className="text-center text-[11px] text-slate-400 mt-2">
                  Tienes <strong className="text-white">{availableVotes}</strong> votos disponibles hoy.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
