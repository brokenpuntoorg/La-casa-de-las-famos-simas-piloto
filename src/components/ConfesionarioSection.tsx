import React, { useState } from 'react';
import { Confession, Lovely } from '../types';
import confesionarioImg from '../assets/images/confesionario_room_1792610882252.jpg';
import { MascotAvatar } from './MascotAvatar';
import { MessageSquare, Heart, Send, Sparkles, User, ShieldAlert } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ConfesionarioSectionProps {
  confessions: Confession[];
  lovelys: Lovely[];
  onAddConfession: (newConfession: Omit<Confession, 'id' | 'timestamp' | 'likes'>) => void;
  onLikeConfession: (id: string) => void;
}

export const ConfesionarioSection: React.FC<ConfesionarioSectionProps> = ({
  confessions,
  lovelys,
  onAddConfession,
  onLikeConfession,
}) => {
  const [filter, setFilter] = useState<'all' | 'housemates' | 'fans'>('all');
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState('Apoyo a mi Favorita');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sounds.playVoteSuccess();
    onAddConfession({
      authorName: authorName.trim() || 'Once Fan Anónimo',
      isHousemate: false,
      message: message.trim(),
      tag: selectedTag,
    });

    setMessage('');
    setAuthorName('');
  };

  const filteredConfessions = confessions.filter((c) => {
    if (filter === 'housemates') return c.isHousemate;
    if (filter === 'fans') return !c.isHousemate;
    return true;
  });

  const getLovely = (id?: string) => {
    if (!id) return undefined;
    return lovelys.find((l) => l.id === id);
  };

  return (
    <section id="confesionario" className="py-14 border-b border-slate-800 bg-slate-950 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Zona de Desahogo & Secretos</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              El Confesionario de las Famosísimas
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Donde las Lovelys revelan sus verdaderos complots a solas con La Jefa y donde la audiencia deja sus mensajes directos a la casa.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({confessions.length})
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setFilter('housemates');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === 'housemates' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Habitantes
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setFilter('fans');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === 'fans' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tribuna del Público
            </button>
          </div>
        </div>

        {/* 2-Column Split: Visual Stage & Interactive Wall */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Atmospheric Room & Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Themed Room Visual Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group shadow-xl">
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={confesionarioImg}
                  alt="Interior del Confesionario"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Sillón de Confesiones
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    "Adelante, entra al Confesionario..."
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Cámara oculta y audio bidireccional en alta fidelidad.
                  </div>
                </div>
              </div>
            </div>

            {/* Leave a message form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Enviar Mensaje a la Casa</span>
              </div>

              <div>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Tu apodo o FanClub (ej. Team Sana CDMX)"
                  maxLength={40}
                  className="w-full px-3.5 py-2 text-xs text-white bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu confesión, reclamo o porra para las Lovelys..."
                  maxLength={240}
                  className="w-full px-3.5 py-2 text-xs text-white bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-2.5 py-1.5 text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none"
                >
                  <option value="Apoyo a mi Favorita">Apoyo a mi Favorita</option>
                  <option value="Alerta de Complot">Alerta de Complot</option>
                  <option value="Voto Masivo">Voto Masivo</option>
                  <option value="Pregunta a La Jefa">Pregunta a La Jefa</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmitir</span>
                </button>
              </div>
            </form>

          </div>

          {/* Right Column: Confession Feed (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {filteredConfessions.map((item) => {
              const lovely = getLovely(item.lovelyId);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    item.isHousemate
                      ? 'bg-slate-900/90 border-purple-500/30'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      {item.isHousemate && lovely ? (
                        <MascotAvatar lovely={lovely} size="sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {item.authorName}
                          </span>
                          {item.isHousemate && (
                            <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wide">
                              Habitante Oficial
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.timestamp} · {item.tag}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onLikeConfession(item.id);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors p-1"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span className="font-mono-numbers">{item.likes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1">
                    "{item.message}"
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
