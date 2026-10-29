import React, { useState, useEffect } from 'react';
import { Puzzle, INITIAL_PUZZLES } from '../data/puzzles';
import { SentenceScrambleGame } from './SentenceScrambleGame';
import { WordGuessGame } from './WordGuessGame';
import { RiddleGame } from './RiddleGame';
import {
  Brain,
  MessageSquareQuote,
  Lightbulb,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Coins,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Props {
  customPuzzle?: Puzzle | null;
  onClearCustomPuzzle?: () => void;
  onOpenAiGenerator: () => void;
}

export const GameHub: React.FC<Props> = ({ customPuzzle, onClearCustomPuzzle, onOpenAiGenerator }) => {
  const [selectedGameType, setSelectedGameType] = useState<'guess' | 'scramble' | 'riddle'>('guess');
  const [puzzles, setPuzzles] = useState<Puzzle[]>(INITIAL_PUZZLES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);

  useEffect(() => {
    const fetchFirestorePuzzles = async () => {
      try {
        const snap = await getDocs(collection(db, 'puzzles'));
        const list: Puzzle[] = [];
        snap.forEach((docItem) => {
          const d = docItem.data();
          list.push({
            id: docItem.id,
            title: d.title || 'Teka-Teki',
            category: d.category || 'Umum',
            difficulty: d.difficulty || 'pemula',
            type: d.type || 'scramble',
            arabicText: d.arabicText,
            transliteration: d.transliteration || '',
            translation: d.translation,
            scrambledWords: d.scrambledWords || (d.arabicText ? d.arabicText.split(' ') : []),
            options: d.options,
            correctAnswer: d.correctAnswer || d.arabicText,
            hint: d.hint || '',
            explanation: d.explanation || '',
            imageUrl: d.imageUrl,
            colorTheme: d.colorTheme || 'violet'
          });
        });
        if (list.length > 0) {
          setPuzzles([...INITIAL_PUZZLES, ...list]);
        }
      } catch (err) {
        console.warn('Using local puzzles catalogue:', err);
      }
    };
    fetchFirestorePuzzles();
  }, []);

  const activePuzzles = puzzles.filter(p => p.type === selectedGameType);
  const currentPuzzle = customPuzzle || (activePuzzles[currentIndex] || activePuzzles[0] || INITIAL_PUZZLES[0]);

  const handleNext = () => {
    if (customPuzzle && onClearCustomPuzzle) {
      onClearCustomPuzzle();
    }
    if (currentIndex < activePuzzles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (customPuzzle && onClearCustomPuzzle) {
      onClearCustomPuzzle();
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(activePuzzles.length - 1);
    }
  };

  const handleSolveReward = (xp: number, coins: number) => {
    setSessionXp(prev => prev + xp);
    setSessionCoins(prev => prev + coins);
  };

  return (
    <div className="space-y-6">
      {/* Colorful Session Progress Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-white/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Petualangan Teka-Teki Bahasa Arab</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
              Tantangan Ceria Hari Ini!
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-md mt-1">
              Tebak gambar mufrodat 3D, susun tata bahasa Nahwu, dan selesaikan teka-teki logika Arab.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 text-center shadow-xs">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">Sesi XP</span>
              <div className="text-base sm:text-xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-300" />
                <span>+{sessionXp}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 text-center shadow-xs">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">Koin</span>
              <div className="text-base sm:text-xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 fill-amber-300" />
                <span>+{sessionCoins}</span>
              </div>
            </div>

            <button
              onClick={onOpenAiGenerator}
              className="px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-900 font-extrabold rounded-2xl text-xs flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-900" />
              <span>Buat Soal AI</span>
            </button>
          </div>
        </div>

        {/* Ambient background ornament */}
        <div className="absolute right-0 bottom-0 opacity-15 text-9xl font-arabic font-black pointer-events-none select-none pr-4 pb-2" style={{ fontFamily: 'Amiri, serif' }}>
          لُغْزٌ
        </div>
      </div>

      {/* Colorful Mode Selectors */}
      <div className="flex rounded-3xl bg-white p-2 shadow-md border border-indigo-100 gap-2">
        <button
          onClick={() => {
            setSelectedGameType('guess');
            setCurrentIndex(0);
            if (onClearCustomPuzzle) onClearCustomPuzzle();
          }}
          className={`flex-1 py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedGameType === 'guess' && !customPuzzle
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Tebak Gambar Mufrodat</span>
        </button>

        <button
          onClick={() => {
            setSelectedGameType('scramble');
            setCurrentIndex(0);
            if (onClearCustomPuzzle) onClearCustomPuzzle();
          }}
          className={`flex-1 py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedGameType === 'scramble' && !customPuzzle
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Susun Kalimat</span>
        </button>

        <button
          onClick={() => {
            setSelectedGameType('riddle');
            setCurrentIndex(0);
            if (onClearCustomPuzzle) onClearCustomPuzzle();
          }}
          className={`flex-1 py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedGameType === 'riddle' && !customPuzzle
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Fawazir / Logika</span>
        </button>
      </div>

      {/* Custom puzzle banner notice if playing generated puzzle */}
      {customPuzzle && (
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between shadow-xs">
          <span>Sedang memainkan teka-teki AI kustom: <strong>{customPuzzle.title}</strong></span>
          <button
            onClick={() => onClearCustomPuzzle && onClearCustomPuzzle()}
            className="text-amber-800 font-extrabold hover:underline"
          >
            Kembali ke Soal Standar
          </button>
        </div>
      )}

      {/* Puzzle Navigation Controls */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
        <span>
          Teka-Teki {currentIndex + 1} dari {activePuzzles.length || 1}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-violet-50 text-slate-700 shadow-2xs transition-colors"
            title="Soal Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-violet-50 text-slate-700 shadow-2xs transition-colors"
            title="Soal Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Active Game Board */}
      {currentPuzzle.type === 'guess' && (
        <WordGuessGame
          puzzle={currentPuzzle}
          onNext={handleNext}
          onSolve={handleSolveReward}
        />
      )}

      {currentPuzzle.type === 'scramble' && (
        <SentenceScrambleGame
          puzzle={currentPuzzle}
          onNext={handleNext}
          onSolve={handleSolveReward}
        />
      )}

      {currentPuzzle.type === 'riddle' && (
        <RiddleGame
          puzzle={currentPuzzle}
          onNext={handleNext}
          onSolve={handleSolveReward}
        />
      )}
    </div>
  );
};
