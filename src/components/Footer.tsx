import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
        
        {/* Brand Lockup */}
        <div className="space-y-1 text-center md:text-left">
          <div className="font-bold text-slate-300 flex items-center justify-center md:justify-start gap-1.5 font-display tracking-wider uppercase">
            <span>La Casa de las Famosísimas</span>
            <span aria-hidden="true" className="text-pink-500">·</span>
            <span className="text-pink-400">Lovelys TWYCE</span>
          </div>
          <p className="text-slate-400">
            Plataforma dinámica de votaciones y seguimiento semanal de habitantes.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <a href="#votacion" className="hover:text-slate-200 transition-colors">Votación</a>
          <a href="#podio" className="hover:text-slate-200 transition-colors">Podio Semanal</a>
          <a href="#confesionario" className="hover:text-slate-200 transition-colors">Confesionario</a>
          <a href="#camaras" className="hover:text-slate-200 transition-colors">Cámaras 24/7</a>
          <a href="#reglas" className="hover:text-slate-200 transition-colors">Reglamento</a>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right text-slate-400">
          © 2026 La Casa de las Famosísimas. Tributo a TWICE & Once Fandom.
        </div>
      </div>
    </footer>
  );
};
