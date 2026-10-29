import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  Sparkles,
  Trash2,
  CheckCircle,
  Database,
  Layers,
  BookOpen,
  Loader2,
  Users
} from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Puzzle, INITIAL_PUZZLES } from '../data/puzzles';
import { useAuth } from '../context/AuthContext';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'batch-ai'>('manage');
  const [puzzles, setPuzzles] = useState<Puzzle[]>(INITIAL_PUZZLES);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Puzzle Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Di Sekolah');
  const [difficulty, setDifficulty] = useState<'pemula' | 'menengah' | 'mahir'>('pemula');
  const [type, setType] = useState<'scramble' | 'guess' | 'riddle'>('scramble');
  const [arabicText, setArabicText] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [translation, setTranslation] = useState('');
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');

  // AI batch generator state
  const [batchCategory, setBatchCategory] = useState('Kehidupan Santri & Pesantren');
  const [batchCount, setBatchCount] = useState(3);
  const [batchGenerating, setBatchGenerating] = useState(false);

  useEffect(() => {
    fetchCloudPuzzles();
  }, []);

  const fetchCloudPuzzles = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'puzzles'));
      const fetched: Puzzle[] = [];
      snapshot.forEach((docItem) => {
        const d = docItem.data();
        fetched.push({
          id: docItem.id,
          title: d.title || 'Teka-Teki',
          category: d.category || 'Umum',
          difficulty: d.difficulty || 'pemula',
          type: d.type || 'scramble',
          arabicText: d.arabicText || '',
          transliteration: d.transliteration || '',
          translation: d.translation || '',
          scrambledWords: d.scrambledWords || (d.arabicText ? d.arabicText.split(' ') : []),
          options: d.options,
          correctAnswer: d.correctAnswer || d.arabicText,
          hint: d.hint || '',
          explanation: d.explanation || '',
        });
      });

      if (fetched.length > 0) {
        // Merge cloud with initial
        setPuzzles([...fetched, ...INITIAL_PUZZLES]);
      }
    } catch (err) {
      console.warn('Could not fetch cloud puzzles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePuzzle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabicText || !translation) {
      setStatusMsg({ type: 'error', text: 'Teks bahasa Arab dan terjemahan wajib diisi!' });
      return;
    }

    try {
      const scrambledWords = arabicText.trim().split(/\s+/);
      const newPuzzleData = {
        title: title || `Teka-Teki: ${translation.substring(0, 30)}`,
        category,
        difficulty,
        type,
        arabicText,
        transliteration,
        translation,
        scrambledWords,
        options: [arabicText, 'مَدْرَسَةٌ', 'مَسْجِدٌ', 'كِتَابٌ'],
        correctAnswer: arabicText,
        hint,
        explanation,
        createdBy: user?.uid || 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'puzzles'), newPuzzleData);
      setPuzzles([{ id: docRef.id, ...newPuzzleData }, ...puzzles]);

      setStatusMsg({ type: 'success', text: 'Teka-teki baru berhasil diterbitkan ke Firestore!' });
      // Reset form
      setTitle('');
      setArabicText('');
      setTransliteration('');
      setTranslation('');
      setHint('');
      setExplanation('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal menyimpan ke Firestore' });
    }
  };

  const handleBatchGenerateAi = async () => {
    setBatchGenerating(true);
    setStatusMsg(null);

    let createdCount = 0;
    try {
      for (let i = 0; i < batchCount; i++) {
        const res = await fetch('/api/gemini/generate-puzzle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: batchCategory,
            difficulty: i % 2 === 0 ? 'pemula' : 'menengah',
            type: i % 3 === 0 ? 'guess' : i % 3 === 1 ? 'riddle' : 'scramble',
          }),
        });

        const data = await res.json();
        if (data.success && data.puzzle) {
          const p = data.puzzle;
          await addDoc(collection(db, 'puzzles'), {
            title: p.title,
            category: p.category || batchCategory,
            difficulty: p.difficulty || 'pemula',
            type: p.type || 'scramble',
            arabicText: p.arabicText,
            transliteration: p.transliteration || '',
            translation: p.translation,
            scrambledWords: p.scrambledWords || p.arabicText.split(' '),
            options: p.options || [p.arabicText],
            correctAnswer: p.correctAnswer || p.arabicText,
            hint: p.hint || '',
            explanation: p.explanation || '',
            createdBy: 'gemini-batch-admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          createdCount++;
        }
      }

      await fetchCloudPuzzles();
      setStatusMsg({
        type: 'success',
        text: `Alhamdulillah! Berhasil membuat & menerbitkan ${createdCount} teka-teki baru dari Gemini AI!`
      });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal membuat batch teka-teki' });
    } finally {
      setBatchGenerating(false);
    }
  };

  const handleDeletePuzzle = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus teka-teki ini?')) return;
    try {
      if (id.startsWith('puz-') || id.startsWith('ai-')) {
        setPuzzles(puzzles.filter(p => p.id !== id));
      } else {
        await deleteDoc(doc(db, 'puzzles', id));
        setPuzzles(puzzles.filter(p => p.id !== id));
      }
      setStatusMsg({ type: 'success', text: 'Teka-teki berhasil dihapus.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal menghapus teka-teki' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5 sm:p-7">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>Panel Pengelola (Admin Dashboard)</span>
              <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                {user?.displayName || 'Administrator'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Kelola kurikulum, terbitkan teka-teki baru ke Firestore, dan kontrol generator Gemini
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'manage' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bank Soal ({puzzles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'add' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Manual</span>
          </button>
          <button
            onClick={() => setActiveTab('batch-ai')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'batch-ai' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Batch</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`mb-5 p-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Tab 1: Bank Soal / Manage */}
      {activeTab === 'manage' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">
              Daftar Koleksi Teka-Teki Aktif
            </h3>
            <button
              onClick={fetchCloudPuzzles}
              disabled={loading}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Sinkronkan Firestore</span>
            </button>
          </div>

          <div className="space-y-3">
            {puzzles.map((puz, idx) => (
              <div
                key={puz.id + idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {puz.category}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      {puz.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      Level: {puz.difficulty}
                    </span>
                  </div>

                  <div
                    dir="rtl"
                    className="font-arabic text-xl font-bold text-slate-900 mt-1"
                    style={{ fontFamily: 'Amiri, serif' }}
                  >
                    {puz.arabicText}
                  </div>

                  <p className="text-xs font-medium text-slate-700">
                    "{puz.translation}"
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    {puz.transliteration}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDeletePuzzle(puz.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Teka-Teki"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tambah Manual */}
      {activeTab === 'add' && (
        <form onSubmit={handleCreatePuzzle} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                placeholder="Misal: Sekolah, Rumah"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
              >
                <option value="pemula">Pemula</option>
                <option value="menengah">Menengah</option>
                <option value="mahir">Mahir</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipe Permainan
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
              >
                <option value="scramble">Susun Kata</option>
                <option value="guess">Tebak Kosakata</option>
                <option value="riddle">Teka-Teki Logika</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kalimat / Kata Arab (Lengkap dengan Harakat)
            </label>
            <input
              type="text"
              dir="rtl"
              required
              value={arabicText}
              onChange={(e) => setArabicText(e.target.value)}
              className="w-full text-lg sm:text-xl font-arabic bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
              placeholder="يَكْتُبُ الطَّالِبُ الدَّرْسَ"
              style={{ fontFamily: 'Amiri, serif' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transliterasi Latin
              </label>
              <input
                type="text"
                value={transliteration}
                onChange={(e) => setTransliteration(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                placeholder="Yaktubu ath-thaalibu ad-darsa"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Arti Bahasa Indonesia
              </label>
              <input
                type="text"
                required
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                placeholder="Murid itu sedang menulis pelajaran"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Petunjuk (Hint)
            </label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
              placeholder="Awali dengan kata kerja (fi'il)..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Penjelasan Kaidah Nahwu / Shorof
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
              placeholder="يَكْتُبُ (Fi'il mudhari'), الطَّالِبُ (Fa'il), الدَّرْسَ (Maf'ul bih)..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Terbitkan Teka-Teki ke Firestore</span>
          </button>
        </form>
      )}

      {/* Tab 3: AI Batch Generator */}
      {activeTab === 'batch-ai' && (
        <div className="max-w-xl space-y-4">
          <div className="p-4 bg-purple-50/80 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-900">
            <span className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Otomasi Kurikulum dengan Gemini:</span>
            </span>
            <p>
              Gemini akan merancang serangkaian teka-teki baru secara instan, memverifikasi harakat, menyusun petunjuk Nahwu, dan langsung menyimpannya ke koleksi database Firestore.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tema Batch Teka-Teki
            </label>
            <input
              type="text"
              value={batchCategory}
              onChange={(e) => setBatchCategory(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
              placeholder="Contoh: Tata Bahasa Nahwu, Mufrodat Bandara, dll."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah Teka-Teki yang Dibuat Sekaligus
            </label>
            <div className="flex gap-3">
              {[2, 3, 5].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setBatchCount(cnt)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    batchCount === cnt
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cnt} Teka-Teki
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBatchGenerateAi}
            disabled={batchGenerating}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
          >
            {batchGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sedang Merilis Teka-Teki via Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Mulai Batch Generation ({batchCount} Teka-Teki)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
