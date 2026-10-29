import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { GameHub } from './components/GameHub';
import { AIPuzzleGenerator } from './components/AIPuzzleGenerator';
import { LeaderboardView } from './components/LeaderboardView';
import { DictionaryView } from './components/DictionaryView';
import { AdminPanel } from './components/AdminPanel';
import { Puzzle } from './data/puzzles';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState<'play' | 'ai-generator' | 'leaderboard' | 'dictionary' | 'admin'>('play');
  const [customPuzzleToPlay, setCustomPuzzleToPlay] = useState<Puzzle | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md text-amber-300 flex items-center justify-center shadow-2xl animate-bounce mb-4 border border-white/30">
          <span className="font-arabic text-3xl font-bold" style={{ fontFamily: 'Amiri, serif' }}>
            لغز
          </span>
        </div>
        <p className="text-white font-black text-lg tracking-wide">Menyiapkan Al-Arabiya Puzzle...</p>
        <p className="text-indigo-200 text-xs mt-1">Menghubungkan ke Cloud Firestore & Auth</p>
      </div>
    );
  }

  // Mandatory Login Gate: If no user is authenticated, render LoginView
  if (!user) {
    return <LoginView />;
  }

  const handlePlayGeneratedPuzzle = (puzzle: Puzzle) => {
    setCustomPuzzleToPlay(puzzle);
    setActiveView('play');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/60 text-slate-900">
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'play' && (
          <GameHub
            customPuzzle={customPuzzleToPlay}
            onClearCustomPuzzle={() => setCustomPuzzleToPlay(null)}
            onOpenAiGenerator={() => setActiveView('ai-generator')}
          />
        )}

        {activeView === 'dictionary' && (
          <DictionaryView />
        )}

        {activeView === 'ai-generator' && (
          <AIPuzzleGenerator onPlayGeneratedPuzzle={handlePlayGeneratedPuzzle} />
        )}

        {activeView === 'leaderboard' && (
          <LeaderboardView />
        )}

        {activeView === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Colorful Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-indigo-100 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-violet-700">Al-Arabiya Puzzle</span>
            <span>•</span>
            <span className="font-arabic font-black text-amber-500 text-sm" style={{ fontFamily: 'Amiri, serif' }}>
              لُغْزُ العَرَبِيَّةِ
            </span>
            <span className="text-xs text-slate-400 font-normal hidden sm:inline">(Edisi Bergambar Ceria 3D)</span>
          </div>
          <p className="text-slate-400">
            React + Vite • Firebase Auth & Firestore • Gemini AI Server-Side
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
