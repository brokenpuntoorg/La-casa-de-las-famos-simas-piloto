import React from 'react';
import { ShieldCheck, Heart, Sparkles, Clock, AlertCircle } from 'lucide-react';

export const RulesSection: React.FC = () => {
  return (
    <section id="reglas" className="py-14 border-t border-slate-800 bg-slate-950/90 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1">
            Manual de Convivencia & Votación
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            ¿Cómo Funciona La Casa de las Famosísimas?
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Todo lo que necesitas saber para apoyar a tu miembro favorito de TWICE y salvar a las Lovelys en riesgo.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              1. Voto Positivo
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              En este reality los votos son para salvar o elegir a tu favorita, no para expulsar. Cada voto que emitas suma directamente al porcentaje de la habitante elegida.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              2. Cronograma Semanal
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Lunes:</strong> Prueba del Líder e Inmunidad. <strong>Miércoles:</strong> Gala de Nominación cara a cara. <strong>Viernes:</strong> Salvación del Líder. <strong>Domingo:</strong> Gran Gala de Eliminación y Podio.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              3. Poder de Voto del Fan
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cada usuario cuenta con un paquete base de 10 votos diarios. Puedes completar misiones de fandom en la cabina para recargar votos extra y multiplicar tu apoyo.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pink-400" />
            <span>Proyecto tributo fanmade a las Lovelys de TWICE y formato La Casa de los Famosos.</span>
          </div>
          <div>
            Actualizado en vivo · Temporada Lovelys 2026
          </div>
        </div>

      </div>
    </section>
  );
};
