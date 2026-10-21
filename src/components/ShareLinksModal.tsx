import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Users, Sparkles, Link2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ShareLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: 'votante' | 'admin';
  onSwitchMode: (mode: 'votante' | 'admin') => void;
}

export const ShareLinksModal: React.FC<ShareLinksModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSwitchMode,
}) => {
  const [copiedVoter, setCopiedVoter] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : '';

  const voterUrl = `${baseUrl}?mode=votante`;
  const adminUrl = `${baseUrl}?mode=admin`;

  const copyToClipboard = async (text: string, isVoter: boolean) => {
    sounds.playClick();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for iframe environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Link2 className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Enlaces para Compartir el Reality
              </h3>
              <p className="text-xs text-slate-400">
                Comparte el enlace de votación con el público y guarda el enlace de control para la producción.
              </p>
            </div>
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
          
          {/* 1. Voter Link Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-pink-500/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Enlace para Votantes (Público Once)</span>
                    <span className="text-[10px] font-semibold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                      Público
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Acceso para ver el podio, votar por las Lovelys, ver cámaras y el confesionario.
                  </div>
                </div>
              </div>

              {currentMode === 'votante' && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Modo Activo
                </span>
              )}
            </div>

            {/* URL Input with Copy Button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={voterUrl}
                className="w-full px-3 py-2 text-xs font-mono-numbers text-slate-200 bg-slate-900 border border-slate-800 rounded-lg select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(voterUrl, true)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow ${
                  copiedVoter
                    ? 'bg-emerald-600 text-white'
                    : 'bg-pink-600 hover:bg-pink-500 text-white'
                }`}
              >
                {copiedVoter ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>

            {currentMode !== 'votante' && (
              <button
                type="button"
                onClick={() => {
                  onSwitchMode('votante');
                  onClose();
                }}
                className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver aplicación como Votante</span>
              </button>
            )}
          </div>

          {/* 2. Admin Link Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Enlace para el Administrador (Producción / La Jefa)</span>
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      Privado
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Control de nominadas, designación de líder inmune, reinicio de votos y galas.
                  </div>
                </div>
              </div>

              {currentMode === 'admin' && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Modo Activo
                </span>
              )}
            </div>

            {/* URL Input with Copy Button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={adminUrl}
                className="w-full px-3 py-2 text-xs font-mono-numbers text-amber-200/90 bg-slate-900 border border-slate-800 rounded-lg select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(adminUrl, false)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow ${
                  copiedAdmin
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold'
                }`}
              >
                {copiedAdmin ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>

            {currentMode !== 'admin' && (
              <button
                type="button"
                onClick={() => {
                  onSwitchMode('admin');
                  onClose();
                }}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Entrar al Panel de Control de La Jefa</span>
              </button>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 text-slate-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Cualquiera que abra el primer enlace verá la interfaz limpia de votación. Quien abra el segundo enlace accederá al panel maestro de administración.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
