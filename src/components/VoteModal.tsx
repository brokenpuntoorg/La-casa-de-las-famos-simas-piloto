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
  onCastVotes: (lovelyId: string, amount: number) => void;
  onEarnMoreVotes?: (amount: number, reason: string) => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  lovely,
  isOpen,
  onClose,
  onCastVotes,
}) => {
  const [voteAmount, setVoteAmount] = useState<number>(10);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  if (!isOpen || !lovely) return null;

  const handleVoteSubmit = () => {
    if (voteAmount <= 0) return;

    // Trigger celebration effects
    sounds.playVoteSuccess();
    try {
      confetti({
        particleCount: 90,
        spread: 65,
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
    }, 1100);
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
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-1">
              ∞ Ilimitada
            </span>
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
                ¡Votos Registrados con Éxito!
              </h4>
              <p className="text-xs text-slate-300">
                Sumaste <span className="font-bold text-pink-400 font-mono-numbers">+{voteAmount} votos</span> para {lovely.name}.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">
                ¡Recuerda que tus votos son ilimitados y puedes seguir votando!
              </div>
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
                    Cantidad de votos a emitir en esta tanda:
                  </span>
                  <span className="font-mono-numbers text-xl font-black text-pink-400">
                    +{voteAmount} {voteAmount === 1 ? 'voto' : 'votos'}
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={100}
                  value={voteAmount}
                  onChange={(e) => setVoteAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />

                {/* Quick presets */}
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 5, 10, 25, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setVoteAmount(num);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                        voteAmount === num
                          ? 'bg-pink-600 text-white border-pink-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unlimited reassurance notice */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Líneas 100% Abiertas:</strong> Puedes emitir votos tantas veces como desees sin restricciones ni límites diarios.
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleVoteSubmit}
                  className="w-full py-3.5 px-4 text-sm font-extrabold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>
                    Emitir +{voteAmount} {voteAmount === 1 ? 'Voto' : 'Votos'} por {lovely.name}
                  </span>
                </button>
                <div className="text-center text-[11px] text-slate-400 mt-2">
                  Votación libre e ilimitada para todos los fans del reality.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
