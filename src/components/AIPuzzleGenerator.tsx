import React, { useState } from 'react';
import { Sparkles, Wand2, Play, PlusCircle, Check, Loader2, Volume2 } from 'lucide-react';
import { Puzzle } from '../data/puzzles';
import { speakArabic } from '../utils/audio';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { imgBook, imgCat, imgCar, imgApple } from '../data/mufrodatImages';

interface Props {
  onPlayGeneratedPuzzle: (puzzle: Puzzle) => void;
}

export const AIPuzzleGenerator: React.FC<Props> = ({ onPlayGeneratedPuzzle }) => {
  const { user } = useAuth();
  const [category, setCategory] = useState('Hewan Lucu');
  const [difficulty, setDifficulty] = useState<'pemula' | 'menengah' | 'mahir'>('pemula');
  const [type, setType] = useState<'guess' | 'scramble' | 'riddle'>('guess');
  const [loading, setLoading] = useState(false);
  const [generatedPuzzle, setGeneratedPuzzle] = useState<Puzzle | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    'Hewan Lucu & Peliharaan',
    'Buah & Makanan Lezat',
    'Transportasi & Kendaraan',
    'Di Sekolah & Kampus',
    'Di Rumah & Keluarga',
    'Di Pasar & Perbelanjaan',
    'Nahwu: Jumlah Ismiyyah',
    'Nahwu: Jumlah Fi\'liyyah',
    'Logika & Fawazir Klasik'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSavedToDb(false);
    setGeneratedPuzzle(null);

    try {
      const res = await fetch('/api/gemini/generate-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, type }),
      });

      const data = await res.json();
      if (!res.ok || !data.puzzle) {
        throw new Error(data.message || 'Gagal memproses teka-teki AI');
      }

      // Assign matching image based on category if relevant
      let defaultImg = imgBook;
      if (category.toLowerCase().includes('hewan') || data.puzzle.arabicText.includes('قِطَّة')) defaultImg = imgCat;
      else if (category.toLowerCase().includes('buah') || category.toLowerCase().includes('makanan')) defaultImg = imgApple;
      else if (category.toLowerCase().includes('kendaraan') || category.toLowerCase().includes('transportasi')) defaultImg = imgCar;

      const puz: Puzzle = {
        id: 'ai-' + Date.now(),
        title: data.puzzle.title || `Teka-Teki ${category}`,
        category: data.puzzle.category || category,
        difficulty: data.puzzle.difficulty || difficulty,
        type: data.puzzle.type || type,
        arabicText: data.puzzle.arabicText,
        transliteration: data.puzzle.transliteration || '',
        translation: data.puzzle.translation || '',
        scrambledWords: data.puzzle.scrambledWords || data.puzzle.arabicText.split(' '),
        options: data.puzzle.options,
        correctAnswer: data.puzzle.correctAnswer || data.puzzle.arabicText,
        hint: data.puzzle.hint || 'Perhatikan pola kata bahasa Arab.',
        explanation: data.puzzle.explanation || 'Penjelasan kaidah bahasa Arab.',
        imageUrl: defaultImg,
        colorTheme: 'violet'
      };

      setGeneratedPuzzle(puz);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghubungkan ke generator Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToFirestore = async () => {
    if (!generatedPuzzle) return;
    try {
      await addDoc(collection(db, 'puzzles'), {
        title: generatedPuzzle.title,
        category: generatedPuzzle.category,
        difficulty: generatedPuzzle.difficulty,
        type: generatedPuzzle.type,
        arabicText: generatedPuzzle.arabicText,
        transliteration: generatedPuzzle.transliteration,
        translation: generatedPuzzle.translation,
        hint: generatedPuzzle.hint,
        explanation: generatedPuzzle.explanation,
        createdBy: user?.uid || 'ai-generator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSavedToDb(true);
    } catch (err) {
      console.warn('Could not save to Firestore, playing locally instead:', err);
      setSavedToDb(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Generator Teka-Teki Gemini AI Studio
          </h2>
          <p className="text-xs text-slate-500">
            Ciptakan teka-teki bahasa Arab bergambar dan berharakat otomatis dalam hitungan detik
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Topik & Tema Teka-Teki
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs sm:text-sm bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 font-semibold focus:ring-2 focus:ring-violet-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tingkat Kesulitan
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="w-full text-xs sm:text-sm bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 font-semibold focus:ring-2 focus:ring-violet-500"
          >
            <option value="pemula">Pemula (Mubtadi')</option>
            <option value="menengah">Menengah (Mutawassith)</option>
            <option value="mahir">Mahir (Mutaqaddim)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Format Permainan
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full text-xs sm:text-sm bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 font-semibold focus:ring-2 focus:ring-violet-500"
          >
            <option value="guess">Tebak Gambar Mufrodat</option>
            <option value="scramble">Susun Kalimat Nahwu</option>
            <option value="riddle">Teka-Teki Logika (Fawazir)</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini Sedang Meramu Teka-Teki Ceria...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Buat Teka-Teki AI Sekarang</span>
              </>
            )}
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl mb-4 font-bold">
          {errorMsg}
        </div>
      )}

      {/* Generated Result Preview */}
      {generatedPuzzle && (
        <div className="bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 rounded-3xl p-5 sm:p-6 border border-violet-200 animate-fadeIn shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-violet-800 bg-violet-100 px-3 py-1 rounded-full">
              Karya AI Gemini: {generatedPuzzle.title}
            </span>
            <button
              onClick={() => speakArabic(generatedPuzzle.arabicText)}
              className="p-2 bg-white text-violet-700 border border-violet-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-violet-600" />
              <span>Dengarkan</span>
            </button>
          </div>

          <div
            dir="rtl"
            className="font-arabic text-3xl sm:text-4xl font-black text-slate-900 my-3 text-center"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            {generatedPuzzle.arabicText}
          </div>

          <p className="text-xs text-violet-700 text-center italic mb-1 font-semibold">
            {generatedPuzzle.transliteration}
          </p>

          <p className="text-base font-extrabold text-slate-800 text-center mb-4">
            "{generatedPuzzle.translation}"
          </p>

          <div className="bg-white/90 p-4 rounded-2xl border border-violet-100 text-xs text-slate-700 mb-4 shadow-xs">
            <span className="font-bold text-violet-700 block mb-1">Kaidah & I'rob:</span>
            {generatedPuzzle.explanation}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleSaveToFirestore}
              disabled={savedToDb}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {savedToDb ? (
                <>
                  <Check className="w-4 h-4 text-violet-600" />
                  <span>Tersimpan di Cloud Firestore</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-violet-600" />
                  <span>Simpan ke Bank Soal</span>
                </>
              )}
            </button>

            <button
              onClick={() => onPlayGeneratedPuzzle(generatedPuzzle)}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mainkan Teka-Teki Ini Sekarang!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
