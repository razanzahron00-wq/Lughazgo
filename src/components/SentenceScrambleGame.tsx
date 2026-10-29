import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Puzzle } from '../data/puzzles';
import { useAuth } from '../context/AuthContext';
import { soundFX, speakArabic } from '../utils/audio';
import {
  Volume2,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info
} from 'lucide-react';

interface Props {
  puzzle: Puzzle;
  onNext: () => void;
  onSolve: (xp: number, coins: number) => void;
}

export const SentenceScrambleGame: React.FC<Props> = ({ puzzle, onNext, onSolve }) => {
  const { updateUserStats } = useAuth();
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [grammarExplanation, setGrammarExplanation] = useState<string | null>(null);
  const [loadingAiExplain, setLoadingAiExplain] = useState<boolean>(false);

  useEffect(() => {
    resetPuzzle();
  }, [puzzle]);

  const resetPuzzle = () => {
    const words = [...puzzle.scrambledWords];
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    setAvailableWords(words);
    setSelectedWords([]);
    setIsSolved(false);
    setIsError(false);
    setShowHint(false);
    setGrammarExplanation(null);
  };

  const handleSelectWord = (word: string, index: number) => {
    if (isSolved) return;
    soundFX.playClick();
    speakArabic(word);

    const newAvail = [...availableWords];
    newAvail.splice(index, 1);
    setAvailableWords(newAvail);

    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    if (newAvail.length === 0) {
      checkAnswer(newSelected);
    }
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isSolved) return;
    soundFX.playClick();

    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);

    setAvailableWords([...availableWords, word]);
    setIsError(false);
  };

  const checkAnswer = (words: string[]) => {
    const assembledSentence = words.join(' ').trim();
    const isCorrect = assembledSentence === puzzle.correctAnswer.trim();

    if (isCorrect) {
      setIsSolved(true);
      setIsError(false);
      soundFX.playSuccess();
      speakArabic(puzzle.arabicText);

      confetti({
        particleCount: 100,
        spread: 70,
        colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#3b82f6'],
        origin: { y: 0.6 }
      });

      const xpEarned = puzzle.difficulty === 'mahir' ? 50 : puzzle.difficulty === 'menengah' ? 35 : 25;
      const coinsEarned = 10;
      updateUserStats(xpEarned, coinsEarned, true);
      onSolve(xpEarned, coinsEarned);
    } else {
      setIsError(true);
      soundFX.playError();
    }
  };

  const askAiExplanation = async () => {
    if (grammarExplanation) return;
    setLoadingAiExplain(true);
    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arabicText: puzzle.arabicText }),
      });
      const data = await res.json();
      setGrammarExplanation(data.explanation || puzzle.explanation);
    } catch {
      setGrammarExplanation(puzzle.explanation);
    } finally {
      setLoadingAiExplain(false);
    }
  };

  // Colorful word bubble palettes
  const wordColors = [
    'hover:border-violet-500 hover:bg-violet-50 text-violet-950',
    'hover:border-pink-500 hover:bg-pink-50 text-pink-950',
    'hover:border-sky-500 hover:bg-sky-50 text-sky-950',
    'hover:border-amber-500 hover:bg-amber-50 text-amber-950',
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-5 sm:p-7 transition-all">
      {/* Top bar with category and difficulty */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-xs">
            {puzzle.category}
          </span>
          <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            LEVEL {puzzle.difficulty.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHint(!showHint)}
            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors text-xs font-bold inline-flex items-center gap-1"
            title="Lihat Petunjuk"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Petunjuk</span>
          </button>
          <button
            onClick={resetPuzzle}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Acak Ulang Kata"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Question / Meaning with picture card preview */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/60 rounded-3xl p-5 border border-indigo-100/70 text-center mb-6 relative overflow-hidden shadow-inner">
        {puzzle.imageUrl && (
          <div className="mx-auto mb-3 flex items-center justify-center">
            <img
              src={puzzle.imageUrl}
              alt={puzzle.title}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-2 border-white transform hover:scale-105 transition-transform"
            />
          </div>
        )}

        <h3 className="text-xs font-extrabold uppercase tracking-wider text-violet-700 mb-1">
          Susunlah Kata Bahasa Arab Untuk Kalimat:
        </h3>
        <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          "{puzzle.translation}"
        </p>
        <p className="text-xs text-slate-500 mt-1 italic">
          Target Pelafalan: {puzzle.transliteration}
        </p>
      </div>

      {/* Hint Alert Box */}
      {showHint && (
        <div className="mb-5 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5 animate-fadeIn shadow-xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Petunjuk Nahwu / Susunan: </span>
            <span>{puzzle.hint}</span>
          </div>
        </div>
      )}

      {/* Selected Words Area (Slot Penempatan Kalimat) */}
      <div className="mb-6">
        <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
          <span>Susunan Kalimat Anda (Dari Kanan ke Kiri):</span>
          {selectedWords.length > 0 && !isSolved && (
            <span className="text-violet-600 text-[11px] font-semibold">(Klik kata untuk membatalkan)</span>
          )}
        </div>

        <div
          dir="rtl"
          className={`min-h-[92px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center justify-center gap-3 transition-all ${
            isSolved
              ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-400 ring-4 ring-violet-100 shadow-md'
              : isError
              ? 'bg-rose-50/80 border-rose-300'
              : 'bg-slate-50/80 border-slate-200 hover:border-violet-300'
          }`}
        >
          {selectedWords.length === 0 ? (
            <span className="text-slate-400 text-xs sm:text-sm italic select-none" dir="ltr">
              Pilih potongan kata di bawah ini untuk menyusun kalimat...
            </span>
          ) : (
            selectedWords.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                onClick={() => handleRemoveWord(word, idx)}
                className={`font-arabic text-xl sm:text-3xl px-5 py-2.5 rounded-2xl shadow-sm transition-transform transform active:scale-95 font-bold cursor-pointer ${
                  isSolved
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-indigo-200'
                    : 'bg-white text-slate-800 border border-violet-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                }`}
                style={{ fontFamily: 'Amiri, serif' }}
              >
                {word}
              </button>
            ))
          )}
        </div>

        {isError && (
          <p className="text-xs font-bold text-rose-600 text-center mt-2 animate-shake">
            Susunan kata belum tepat. Coba periksa urutan Fi'il dan Fa'il atau Harf Jar!
          </p>
        )}
      </div>

      {/* Available Word Pool (Pilihan Kata) */}
      <div className="mb-6">
        <div className="text-xs font-bold text-slate-600 mb-2">
          Pilihan Potongan Kata Tersedia:
        </div>
        <div
          dir="rtl"
          className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-100"
        >
          {availableWords.length === 0 ? (
            <span className="text-xs text-slate-400 italic py-2" dir="ltr">
              Semua kata telah dimasukkan ke dalam slot susunan.
            </span>
          ) : (
            availableWords.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                onClick={() => handleSelectWord(word, idx)}
                className={`font-arabic text-xl sm:text-2xl px-5 py-2.5 bg-white font-bold rounded-2xl border-2 border-slate-200 shadow-sm transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer ${
                  wordColors[idx % wordColors.length]
                }`}
                style={{ fontFamily: 'Amiri, serif' }}
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Solved Victory Section */}
      {isSolved && (
        <div className="p-5 bg-gradient-to-r from-violet-50 via-pink-50 to-amber-50 rounded-3xl border border-violet-200 animate-fadeIn mb-5 shadow-sm">
          <div className="flex items-center gap-2 text-violet-900 font-black text-base sm:text-lg mb-2">
            <CheckCircle2 className="w-5 h-5 text-violet-600" />
            <span>Maa Syaa Allah! Susunan Kalimat Sangat Sempurna!</span>
          </div>

          <div className="flex items-center justify-between bg-white/90 p-4 rounded-2xl border border-violet-100 mb-3 shadow-xs">
            <div dir="rtl" className="font-arabic text-2xl sm:text-3xl font-black text-violet-950" style={{ fontFamily: 'Amiri, serif' }}>
              {puzzle.arabicText}
            </div>
            <button
              onClick={() => speakArabic(puzzle.arabicText)}
              className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan</span>
            </button>
          </div>

          <div className="text-xs text-slate-700 bg-white/80 p-3.5 rounded-2xl border border-slate-200 mb-3">
            <div className="font-extrabold text-violet-800 mb-1 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Kaidah Nahwu & Shorof:</span>
            </div>
            <p className="leading-relaxed">{puzzle.explanation}</p>

            {grammarExplanation && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-slate-800">
                <span className="font-bold text-violet-700">Wawasan I'rob Gemini AI:</span>
                <p className="mt-1 leading-relaxed">{grammarExplanation}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {!grammarExplanation && (
              <button
                onClick={askAiExplanation}
                disabled={loadingAiExplain}
                className="text-xs px-3.5 py-2 bg-white hover:bg-violet-50 text-violet-700 font-bold rounded-xl border border-violet-200 inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{loadingAiExplain ? 'Membedah I\'rob...' : 'Tanya I\'rob Lengkap ke AI'}</span>
              </button>
            )}

            <button
              onClick={onNext}
              className="ml-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm transform hover:scale-105 active:scale-95"
            >
              <span>Lanjut Teka-Teki Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
