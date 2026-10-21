/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Lovely, Confession, LovelyId } from './types';
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
import { sounds } from './utils/soundEffects';

const STORAGE_KEY_LOVELYS = 'lcdf_lovelys_v1';
const STORAGE_KEY_VOTES = 'lcdf_available_votes_v1';
const STORAGE_KEY_CONFESSIONS = 'lcdf_confessions_v1';

export default function App() {
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
    // Sort to determine new ranks
    const sorted = [...currentList].sort((a, b) => b.votes - a.votes);
    
    return currentList.map((item) => {
      const rankIndex = sorted.findIndex((s) => s.id === item.id) + 1;
      const pct = (item.votes / total) * 100;

      // Update status if they are top 3 and not nominated or leader
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

  // Simulated live background votes (like a real live reality broadcast)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick random lovely and add between 10 and 45 votes
      const randomIndex = Math.floor(Math.random() * INITIAL_LOVELYS.length);
      const randomLovelyId = INITIAL_LOVELYS[randomIndex].id;
      const randomBump = Math.floor(Math.random() * 35) + 10;

      setLovelys((prev) => {
        const next = prev.map((l) =>
          l.id === randomLovelyId ? { ...l, votes: l.votes + randomBump } : l
        );
        return recalculateStats(next);
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isSimulating, recalculateStats]);

  const handleScrollToNominadas = () => {
    const el = document.getElementById('galas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Top Bar */}
      <TopBar
        onQuickVoteClick={() => {
          // Open voting for current leader or top favorite
          const target = lovelys.find((l) => l.rank === 1) || lovelys[0];
          setVoteModalLovely(target);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        availableVotes={availableVotes}
      />

      {/* Main Content */}
      <main className="flex-1">
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

        {/* Gala Semanal & Placa de Nominadas */}
        <GalaTimelineSection
          weeks={GALA_WEEKS}
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

    </div>
  );
}
