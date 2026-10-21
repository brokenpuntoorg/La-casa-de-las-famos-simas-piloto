/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Lovely, Confession, GalaWeek, LovelyId } from './types';
import { INITIAL_LOVELYS, GALA_WEEKS, INITIAL_CONFESSIONS, REALITY_CAMS } from './data/lovelysData';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { LeaderboardPodium } from './components/LeaderboardPodium';
import { VotingSection } from './components/VotingSection';
import { ConfesionarioSection } from './components/ConfesionarioSection';
import { LiveCamsSection } from './components/LiveCamsSection';
import { GalaTimelineSection } from './components/GalaTimelineSection';
import { RulesSection } from './components/RulesSection';
import { Footer } from './components/Footer';
import { VoteModal } from './components/VoteModal';
import { LovelyDetailModal } from './components/LovelyDetailModal';
import { EliminationCarousel } from './components/EliminationCarousel';
import { AdminPanel } from './components/AdminPanel';
import { ShareLinksModal } from './components/ShareLinksModal';
import { sounds } from './utils/soundEffects';

const STORAGE_KEY_LOVELYS = 'lcdf_lovelys_v2';
const STORAGE_KEY_VOTES = 'lcdf_available_votes_v2';
const STORAGE_KEY_CONFESSIONS = 'lcdf_confessions_v2';
const STORAGE_KEY_WEEKS = 'lcdf_weeks_v2';

export default function App() {
  // Check URL query parameter on initial load (?mode=admin or ?mode=votante)
  const [currentMode, setCurrentMode] = useState<'votante' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'admin' || params.get('admin') === 'true') {
        return 'admin';
      }
    }
    return 'votante';
  });

  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  // Sync mode with browser history and URL
  const handleSwitchMode = useCallback((newMode: 'votante' | 'admin') => {
    sounds.playClick();
    setCurrentMode(newMode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', newMode);
      window.history.pushState({}, '', url.toString());
    }
  }, []);

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const modeInUrl = params.get('mode') === 'admin' ? 'admin' : 'votante';
      setCurrentMode(modeInUrl);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Load saved state or default
  const [lovelys, setLovelys] = useState<Lovely[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOVELYS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LOVELYS;
  });

  const [weeks, setWeeks] = useState<GalaWeek[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEEKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return GALA_WEEKS;
  });

  const [availableVotes, setAvailableVotes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOTES);
      if (saved !== null) return Number(saved);
    } catch {
      // ignore
    }
    return 10;
  });

  const [confessions, setConfessions] = useState<Confession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFESSIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CONFESSIONS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Modals state
  const [voteModalLovely, setVoteModalLovely] = useState<Lovely | null>(null);
  const [detailModalLovely, setDetailModalLovely] = useState<Lovely | null>(null);

  // Recalculate percentages & ranks whenever votes change
  const recalculateStats = useCallback((currentList: Lovely[]): Lovely[] => {
    const total = currentList.reduce((acc, curr) => acc + curr.votes, 0) || 1;
    const sorted = [...currentList].sort((a, b) => b.votes - a.votes);
    
    return currentList.map((item) => {
      const rankIndex = sorted.findIndex((s) => s.id === item.id) + 1;
      const pct = (item.votes / total) * 100;

      let updatedStatus = item.status;
      if (item.status !== 'NOMINADA' && item.status !== 'LIDER_INMUNE') {
        updatedStatus = rankIndex <= 2 ? 'FAVORITA_TOP' : 'SALVA';
      }

      return {
        ...item,
        votePercentage: Number(pct.toFixed(1)),
        previousRank: item.rank !== rankIndex ? item.rank : item.previousRank,
        rank: rankIndex,
        status: updatedStatus,
      };
    });
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOVELYS, JSON.stringify(lovelys));
    } catch {
      // ignore
    }
  }, [lovelys]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WEEKS, JSON.stringify(weeks));
    } catch {
      // ignore
    }
  }, [weeks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VOTES, String(availableVotes));
    } catch {
      // ignore
    }
  }, [availableVotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFESSIONS, JSON.stringify(confessions));
    } catch {
      // ignore
    }
  }, [confessions]);

  // Audio mute toggle
  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.enabled = newState;
    if (newState) sounds.playClick();
  };

  // Cast votes handler
  const handleCastVotes = (lovelyId: string, amount: number) => {
    setAvailableVotes((prev) => Math.max(0, prev - amount));
    setLovelys((prev) => {
      const updated = prev.map((item) => {
        if (item.id === lovelyId) {
          return {
            ...item,
            votes: item.votes + amount,
          };
        }
        return item;
      });
      return recalculateStats(updated);
    });
  };

  // Earn more votes
  const handleEarnMoreVotes = (amount: number, reason: string) => {
    setAvailableVotes((prev) => prev + amount);
  };

  // Add confession
  const handleAddConfession = (newConf: Omit<Confession, 'id' | 'timestamp' | 'likes'>) => {
    const created: Confession = {
      ...newConf,
      id: `conf-${Date.now()}`,
      timestamp: 'Justo ahora',
      likes: 1,
    };
    setConfessions((prev) => [created, ...prev]);
  };

  // Delete confession (admin)
  const handleDeleteConfession = (id: string) => {
    setConfessions((prev) => prev.filter((c) => c.id !== id));
  };

  // Like confession
  const handleLikeConfession = (id: string) => {
    setConfessions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Total votes tally
  const totalVotes = useMemo(() => {
    return lovelys.reduce((acc, curr) => acc + curr.votes, 0);
  }, [lovelys]);

  // Leader of the week
  const currentLeader = useMemo(() => {
    return lovelys.find((l) => l.status === 'LIDER_INMUNE') || lovelys[1];
  }, [lovelys]);

  // Simulated live background votes
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * lovelys.length);
      const randomLovelyId = lovelys[randomIndex]?.id;
      if (!randomLovelyId) return;
      const randomBump = Math.floor(Math.random() * 35) + 10;

      setLovelys((prev) => {
        const next = prev.map((l) =>
          l.id === randomLovelyId ? { ...l, votes: l.votes + randomBump } : l
        );
        return recalculateStats(next);
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isSimulating, recalculateStats, lovelys.length]);

  const handleScrollToNominadas = () => {
    const el = document.getElementById('carrusel-eliminacion') || document.getElementById('galas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Top Bar with mode toggle & share links */}
      <TopBar
        onQuickVoteClick={() => {
          const target = lovelys.find((l) => l.rank === 1) || lovelys[0];
          setVoteModalLovely(target);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        availableVotes={availableVotes}
        currentMode={currentMode}
        onToggleMode={() => handleSwitchMode(currentMode === 'admin' ? 'votante' : 'admin')}
        onOpenShareModal={() => setShareModalOpen(true)}
      />

      {/* Main View Router: Admin vs Voter */}
      <main className="flex-1">
        {currentMode === 'admin' ? (
          /* ================= ADMIN VIEW ================= */
          <AdminPanel
            lovelys={lovelys}
            onUpdateLovelys={(updated) => setLovelys(recalculateStats(updated))}
            weeks={weeks}
            onUpdateWeeks={setWeeks}
            confessions={confessions}
            onAddConfession={handleAddConfession}
            onDeleteConfession={handleDeleteConfession}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onSwitchToVoterView={() => handleSwitchMode('votante')}
            onOpenShareModal={() => setShareModalOpen(true)}
          />
        ) : (
          /* ================= VOTER / PUBLIC VIEW ================= */
          <>
            {/* Hero Section with Reality Stage & Countdown */}
            <HeroSection
              totalVotes={totalVotes}
              availableVotes={availableVotes}
              onOpenVoting={() => {
                const target = lovelys.find((l) => l.rank === 1) || lovelys[0];
                setVoteModalLovely(target);
              }}
              onScrollToNominadas={handleScrollToNominadas}
              currentLeaderName={currentLeader.name}
            />

            {/* Podio de Favoritas */}
            <LeaderboardPodium
              lovelys={lovelys}
              onVoteForLovely={(lovely) => setVoteModalLovely(lovely)}
              onSelectLovely={(lovely) => setDetailModalLovely(lovely)}
            />

            {/* Cabina y Lista Completa de Votación */}
            <VotingSection
              lovelys={lovelys}
              totalVotes={totalVotes}
              availableVotes={availableVotes}
              onVoteForLovely={(lovely) => setVoteModalLovely(lovely)}
              onSelectLovely={(lovely) => setDetailModalLovely(lovely)}
              isSimulating={isSimulating}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
            />

            {/* Carrusel de Eliminación de las Nominadas */}
            <EliminationCarousel
              lovelys={lovelys}
              onVoteForLovely={(lovely) => setVoteModalLovely(lovely)}
              onSelectLovely={(lovely) => setDetailModalLovely(lovely)}
            />

            {/* Gala Semanal & Placa de Nominadas */}
            <GalaTimelineSection
              weeks={weeks}
              lovelys={lovelys}
              onVoteForLovely={(lovely) => setVoteModalLovely(lovely)}
              onSelectLovely={(lovely) => setDetailModalLovely(lovely)}
            />

            {/* El Confesionario Íntimo */}
            <ConfesionarioSection
              confessions={confessions}
              lovelys={lovelys}
              onAddConfession={handleAddConfession}
              onLikeConfession={handleLikeConfession}
            />

            {/* Cámaras 24/7 en Vivo */}
            <LiveCamsSection
              cams={REALITY_CAMS}
              lovelys={lovelys}
              onSelectLovely={(lovely) => setDetailModalLovely(lovely)}
            />

            {/* Reglamento y Mecánica */}
            <RulesSection />
          </>
        )}
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Modals */}
      <VoteModal
        lovely={voteModalLovely}
        isOpen={Boolean(voteModalLovely)}
        onClose={() => setVoteModalLovely(null)}
        availableVotes={availableVotes}
        onCastVotes={handleCastVotes}
        onEarnMoreVotes={handleEarnMoreVotes}
      />

      <LovelyDetailModal
        lovely={detailModalLovely}
        isOpen={Boolean(detailModalLovely)}
        onClose={() => setDetailModalLovely(null)}
        onVote={(lovely) => setVoteModalLovely(lovely)}
      />

      {/* Share Links Modal */}
      <ShareLinksModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        currentMode={currentMode}
        onSwitchMode={handleSwitchMode}
      />

    </div>
  );
}
