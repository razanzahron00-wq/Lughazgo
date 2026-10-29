import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Sparkles,
  Gamepad2,
  Trophy,
  ShieldAlert,
  Coins,
  Star,
  BookMarked,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  activeView: 'play' | 'ai-generator' | 'leaderboard' | 'dictionary' | 'admin';
  setActiveView: (view: 'play' | 'ai-generator' | 'leaderboard' | 'dictionary' | 'admin') => void;
}

export const Navbar: React.FC<Props> = ({ activeView, setActiveView }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-indigo-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveView('play')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 text-white flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform">
              <span className="font-arabic text-xl font-bold" style={{ fontFamily: 'Amiri, serif' }}>
                لغز
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  Al-Arabiya Puzzle
                </span>
                <span className="font-arabic text-xs font-bold text-violet-700 hidden sm:inline" style={{ fontFamily: 'Amiri, serif' }}>
                  لُغْزُ العَرَبِيَّةِ
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span className="text-violet-600 font-semibold">Teka-Teki Bergambar 3D</span>
                {isAdmin && (
                  <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center Navigation Links with Colorful Pill Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveView('play')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeView === 'play'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Arena Bermain</span>
            </button>

            <button
              onClick={() => setActiveView('dictionary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeView === 'dictionary'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-pink-500" />
              <span>Mufrodat Bergambar</span>
            </button>

            <button
              onClick={() => setActiveView('ai-generator')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeView === 'ai-generator'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Gemini AI Studio</span>
            </button>

            <button
              onClick={() => setActiveView('leaderboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeView === 'leaderboard'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Papan Skor</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveView('admin')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeView === 'admin'
                    ? 'bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white shadow-sm'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Panel Admin</span>
              </button>
            )}
          </nav>

          {/* User Profile & Logout Button */}
          <div className="flex items-center gap-3">
            {/* Gamification Stats */}
            <div className="hidden lg:flex items-center gap-2.5 bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 rounded-2xl px-3 py-1.5 text-xs">
              <div className="flex items-center gap-1 text-violet-800 font-extrabold" title="Level Anda">
                <span className="w-5 h-5 rounded-lg bg-violet-600 text-white flex items-center justify-center text-[10px] font-black">
                  Lv
                </span>
                <span>{user?.level || 1}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-700 font-extrabold" title="Total XP">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{user?.xp || 0} XP</span>
              </div>

              <div className="flex items-center gap-1 text-rose-700 font-extrabold" title="Koin Berkah">
                <Coins className="w-3.5 h-3.5 text-rose-500 fill-rose-300" />
                <span>{user?.coins || 0}</span>
              </div>
            </div>

            {/* User Avatar & Name */}
            <div className="flex items-center gap-2">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-2xl border-2 border-violet-300 object-cover shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'U'}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[110px] truncate">
                {user?.displayName}
              </span>
            </div>

            {/* Logout Button (Mandatory Requirement) */}
            <button
              onClick={() => logout()}
              title="Keluar dari Akun"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-indigo-100 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveView('play')}
            className={`px-3 py-1 text-xs font-extrabold rounded-xl flex items-center gap-1 shrink-0 ${
              activeView === 'play' ? 'bg-violet-600 text-white' : 'text-slate-600'
            }`}
          >
            <Gamepad2 className="w-3 h-3" />
            <span>Bermain</span>
          </button>

          <button
            onClick={() => setActiveView('dictionary')}
            className={`px-3 py-1 text-xs font-extrabold rounded-xl flex items-center gap-1 shrink-0 ${
              activeView === 'dictionary' ? 'bg-pink-600 text-white' : 'text-slate-600'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Gambar</span>
          </button>

          <button
            onClick={() => setActiveView('ai-generator')}
            className={`px-3 py-1 text-xs font-extrabold rounded-xl flex items-center gap-1 shrink-0 ${
              activeView === 'ai-generator' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Studio</span>
          </button>

          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-3 py-1 text-xs font-extrabold rounded-xl flex items-center gap-1 shrink-0 ${
              activeView === 'leaderboard' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            <Trophy className="w-3 h-3" />
            <span>Skor</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-1 text-xs font-extrabold rounded-xl flex items-center gap-1 shrink-0 ${
                activeView === 'admin' ? 'bg-purple-700 text-white' : 'text-purple-700'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
