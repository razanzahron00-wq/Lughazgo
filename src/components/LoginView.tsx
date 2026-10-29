import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  BookOpen,
  Brain,
  ShieldCheck,
  Key,
  User,
  ArrowRight,
  Award,
  Volume2,
  Gamepad2,
  Image as ImageIcon
} from 'lucide-react';
import { speakArabic } from '../utils/audio';
import { imgBook, imgCat, imgCar, imgApple } from '../data/mufrodatImages';

export const LoginView: React.FC = () => {
  const { loginWithGoogle, loginAsAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'google' | 'admin'>('google');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('Razanpintar');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg(null);
      setLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk dengan Google. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      setLoading(true);
      const res = await loginAsAdmin(adminUsername, adminPassword);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Playful colorful blurred background orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-pink-500/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="max-w-4xl mx-auto w-full text-center pt-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-bold tracking-wide border border-white/20 shadow-md mb-3">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Game Belajar Bahasa Arab Bergambar & Penuh Warna</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-sm">
          Al-Arabiya Puzzle
        </h1>
        <p className="font-arabic text-2xl sm:text-4xl text-amber-300 font-bold mb-2 tracking-wide dir-rtl drop-shadow-xs" style={{ fontFamily: 'Amiri, serif' }}>
          لُغْزُ العَرَبِيَّةِ: رِحْلَةُ النَّحْوِ وَالْمُفْرَدَاتِ
        </p>
        <p className="text-indigo-100 max-w-xl mx-auto text-xs sm:text-sm">
          Petualangan seru teka-teki susun kata, tebak gambar mufrodat 3D, logika bahasa Arab, dan tantangan cerdas AI Gemini!
        </p>

        {/* Listen sample audio */}
        <div className="mt-2.5 inline-flex items-center gap-2">
          <button
            onClick={() => speakArabic('أَهْلًا وَسَهْلًا بِكُمْ فِي لُغْزِ الْعَرَبِيَّةِ')}
            type="button"
            className="text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-1.5 rounded-full border border-white/30 inline-flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-md"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Dengarkan Salam (Ahlan wa Sahlan)</span>
          </button>
        </div>

        {/* Floating preview of colorful illustrated cards */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 overflow-x-auto py-2">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/25 shadow-sm">
            <img src={imgCat} alt="Kucing" className="w-8 h-8 rounded-xl object-cover shadow-xs" />
            <div className="text-left">
              <span className="font-arabic text-sm font-bold text-amber-300" style={{ fontFamily: 'Amiri, serif' }}>قِطَّةٌ</span>
              <span className="text-[10px] text-white/80 block -mt-1">Kucing</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/25 shadow-sm">
            <img src={imgBook} alt="Buku" className="w-8 h-8 rounded-xl object-cover shadow-xs" />
            <div className="text-left">
              <span className="font-arabic text-sm font-bold text-amber-300" style={{ fontFamily: 'Amiri, serif' }}>كِتَابٌ</span>
              <span className="text-[10px] text-white/80 block -mt-1">Buku</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/25 shadow-sm">
            <img src={imgCar} alt="Mobil" className="w-8 h-8 rounded-xl object-cover shadow-xs" />
            <div className="text-left">
              <span className="font-arabic text-sm font-bold text-amber-300" style={{ fontFamily: 'Amiri, serif' }}>سَيَّارَةٌ</span>
              <span className="text-[10px] text-white/80 block -mt-1">Mobil</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/25 shadow-sm">
            <img src={imgApple} alt="Apel" className="w-8 h-8 rounded-xl object-cover shadow-xs" />
            <div className="text-left">
              <span className="font-arabic text-sm font-bold text-amber-300" style={{ fontFamily: 'Amiri, serif' }}>تُفَّاحَةٌ</span>
              <span className="text-[10px] text-white/80 block -mt-1">Apel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Card with colorful modern card style */}
      <div className="max-w-md w-full mx-auto my-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 text-slate-800 relative z-10">
        {/* Tab switchers */}
        <div className="flex rounded-2xl bg-indigo-50/80 p-1.5 mb-5 border border-indigo-100">
          <button
            type="button"
            onClick={() => { setActiveTab('google'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'google'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-indigo-900/70 hover:text-indigo-900'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Akun Google</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-indigo-900/70 hover:text-indigo-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login Admin</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
            <span className="font-bold">Perhatian:</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Google Login */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-gradient-to-tr from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-md shadow-indigo-300">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Masuk untuk Memulai Petualangan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Data skor, level, koin berkah, dan koleksi mufrodat Anda tersimpan di Cloud Firestore.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border-2 border-indigo-100 shadow-md transition-all hover:border-violet-400 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'Memproses Masuk...' : 'Masuk dengan Google'}</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              Gerbang wajib login sebelum mengakses arena Al-Arabiya Puzzle.
            </div>
          </div>
        )}

        {/* Tab 2: Admin Login */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Kredensial Khusus Admin:</span>
                <p className="mt-0.5">User: <code className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold text-slate-800">admin</code></p>
                <p className="mt-0.5">Password: <code className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold text-slate-800">Razanpintar</code></p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                  placeholder="Password admin"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span>{loading ? 'Memverifikasi...' : 'Masuk sebagai Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Feature Badges Grid with vibrant colorful cards */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 pb-2 relative z-10">
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-start gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Mufrodat Bergambar 3D</h4>
            <p className="text-[11px] text-white/80 mt-0.5">
              Visualisasi nyata kata benda, hewan, dan objek dengan audio lafal asli.
            </p>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-start gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Susun Nahwu & Shorof</h4>
            <p className="text-[11px] text-white/80 mt-0.5">
              Rangkai kata acak jadi kalimat sempurna dengan harakat & I'rob lengkap.
            </p>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-start gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Kecerdasan Gemini AI</h4>
            <p className="text-[11px] text-white/80 mt-0.5">
              Generator teka-teki tak terbatas dari Google Gemini di server Express.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
