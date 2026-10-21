import React, { useState } from 'react';
import { RealityCam, Lovely } from '../types';
import { MascotAvatar } from './MascotAvatar';
import { Video, Radio, Flame, Sparkles, Volume2, Eye } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LiveCamsSectionProps {
  cams: RealityCam[];
  lovelys: Lovely[];
  onSelectLovely: (lovely: Lovely) => void;
}

export const LiveCamsSection: React.FC<LiveCamsSectionProps> = ({
  cams,
  lovelys,
  onSelectLovely,
}) => {
  const [activeCamId, setActiveCamId] = useState<string>(cams[0]?.id || 'cam-1');

  const activeCam = cams.find((c) => c.id === activeCamId) || cams[0];
  const activeOccupants = lovelys.filter((l) => activeCam.occupants.includes(l.id));

  return (
    <section id="camaras" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Circuito Cerrado de Transmisión Continua</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Cámaras 24/7 en Vivo
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Monitorea la convivencia en tiempo real entre las 9 Lovelys sin cortes comerciales.
          </p>
        </div>

        {/* Live indicator tag */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-white font-bold">5 Señales Activas</span>
          <span aria-hidden="true">·</span>
          <span>Feed HD 1080p</span>
        </div>
      </div>

      {/* Main Multi-Cam Viewport Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Active Cam Screen (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* Virtual CCTV Screen */}
          <div className="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
            
            {/* Ambient Room Gradient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30" />
            
            {/* Grid Scanlines Effect */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)',
              }}
            />

            {/* In-Room Lovelys Animated Representation */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 p-6">
              {activeOccupants.length > 0 ? (
                activeOccupants.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSelectLovely(occ);
                    }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-lg group-hover:border-pink-500 transition-all">
                      <MascotAvatar lovely={occ} size="lg" />
                    </div>
                    <div className="mt-2 text-xs font-bold text-white group-hover:text-pink-400 transition-colors">
                      {occ.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      TWICE {occ.member}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-slate-500 text-sm">
                  Habitación vacía momentáneamente. Las Lovelys están en otra zona.
                </div>
              )}
            </div>

            {/* Screen Top Overlay: Camera details & REC */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono-numbers">
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <span className="font-bold tracking-wider">REC</span>
                <span className="text-slate-400">|</span>
                <span className="text-pink-400 font-semibold">{activeCam.name}</span>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-slate-300">
                CAM_ID: {activeCam.id.toUpperCase()} · 60 FPS
              </div>
            </div>

            {/* Screen Bottom Overlay: Location and Live Audio */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
              <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200 flex items-center gap-2">
                <span className="font-semibold text-white">{activeCam.location}:</span>
                <span className="text-slate-300">{activeCam.currentActivity}</span>
              </div>
            </div>
          </div>

          {/* Cam Meta Strip */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Habitantes presentes en escena:</span>
              <span className="font-bold text-white">
                {activeOccupants.map((o) => o.name).join(', ') || 'Ninguna'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Eye className="w-3.5 h-3.5 text-pink-400" />
              <span>18,420 espectadores viendo esta señal</span>
            </div>
          </div>

        </div>

        {/* Cam Switcher Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Canales Disponibles (Clic para cambiar)
          </div>

          <div className="space-y-2.5">
            {cams.map((cam) => {
              const isActive = cam.id === activeCamId;
              const occNames = cam.occupants
                .map((id) => lovelys.find((l) => l.id === id)?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveCamId(cam.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isActive
                      ? 'bg-slate-900 border-pink-500 shadow-md shadow-pink-950/20 ring-1 ring-pink-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-pink-500' : 'bg-slate-600'}`} />
                      <span className="text-xs font-bold text-white truncate">
                        {cam.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {cam.currentActivity}
                    </div>
                    <div className="text-[10px] text-pink-400/80 font-medium truncate">
                      En cámara: {occNames || 'Nadie por ahora'}
                    </div>
                  </div>

                  {cam.isHotSpot && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      Hot
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
};
