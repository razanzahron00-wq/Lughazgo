import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Puzzle } from '../data/puzzles';
import { useAuth } from '../context/AuthContext';
import { soundFX, speakArabic } from '../utils/audio';
import {
  Volume2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Info,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  puzzle: Puzzle;
  onNext: () => void;
  onSolve: (xp: number, coins: number) => void;
}

export const WordGuessGame: React.FC<Props> = ({ puzzle, onNext, onSolve }) => {
  const { updateUserStats } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [puzzle]);

  const options = puzzle.options || [
    puzzle.correctAnswer,
    'مَدْرَسَةٌ',
    'قَلَمٌ',
    'كِتَابٌ'
  ];

  const handleChoose = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    soundFX.playClick();

    // Check match
    const correct = opt === puzzle.correctAnswer || opt.startsWith(puzzle.correctAnswer.split('(')[0]);
    setIsCorrect(correct);

    if (correct) {
      soundFX.playSuccess();
      speakArabic(puzzle.arabicText.split(' ')[0] || puzzle.arabicText);
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6'],
        origin: { y: 0.6 }
      });
      const xpEarned = puzzle.difficulty === 'mahir' ? 40 : 25;
      const coinsEarned = 10;
      updateUserStats(xpEarned, coinsEarned, true);
      onSolve(xpEarned, coinsEarned);
    } else {
      soundFX.playError();
      updateUserStats(5, 0, false);
    }
  };

  const choiceColors = [
    'hover:border-violet-400 hover:bg-violet-50/60',
    'hover:border-pink-400 hover:bg-pink-50/60',
    'hover:border-sky-400 hover:bg-sky-50/60',
    'hover:border-amber-400 hover:bg-amber-50/60',
  ];

  const letterBadgeColors = [
    'bg-violet-100 text-violet-800',
    'bg-pink-100 text-pink-800',
    'bg-sky-100 text-sky-800',
    'bg-amber-100 text-amber-800',
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-5 sm:p-7 transition-all">
      {/* Top bar with category and difficulty */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Tebak Gambar Mufrodat • {puzzle.category}</span>
          </span>
          <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-violet-100 text-violet-800 border border-violet-200">
            {puzzle.difficulty.toUpperCase()}
          </span>
        </div>

        <button
          onClick={() => setShowHint(!showHint)}
          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors text-xs font-bold inline-flex items-center gap-1"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Petunjuk</span>
        </button>
      </div>

      {/* Illustrated Picture Card & Question Banner */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-br from-violet-50/80 via-pink-50/50 to-amber-50/60 rounded-3xl p-5 border border-indigo-100/80 mb-6 shadow-inner">
        {puzzle.imageUrl ? (
          <div className="relative group shrink-0">
            <img
              src={puzzle.imageUrl}
              alt={puzzle.translation}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-lg border-4 border-white transform transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-2 rounded-xl shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center text-white text-4xl shadow-md shrink-0">
            🎨
          </div>
        )}

        <div className="text-center sm:text-left flex-1 space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600 bg-violet-100 px-2.5 py-0.5 rounded-full inline-block">
            Tebak Kosakata Bahasa Arab:
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            "{puzzle.translation}"
          </h3>
          <p className="text-xs text-slate-500 italic">
            Perhatikan gambar ilustrasi di samping, manakah kata Arab yang tepat?
          </p>

          <button
            onClick={() => speakArabic(puzzle.arabicText)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white hover:bg-violet-50 text-violet-700 rounded-xl border border-violet-200 shadow-xs transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Dengarkan Petunjuk Lafal</span>
          </button>
        </div>
      </div>

      {showHint && (
        <div className="mb-5 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5 animate-fadeIn shadow-xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Petunjuk Mufrodat: </span>
            <span>{puzzle.hint}</span>
          </div>
        </div>
      )}

      {/* 4 Choices Grid with Colorful Interactive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {options.map((opt, idx) => {
          let btnStyle = `bg-slate-50/80 text-slate-800 border-slate-200 shadow-xs ${choiceColors[idx % choiceColors.length]}`;

          if (isAnswered) {
            if (opt === puzzle.correctAnswer || opt.startsWith(puzzle.correctAnswer.split('(')[0])) {
              btnStyle = 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent ring-4 ring-violet-200 font-extrabold shadow-lg';
            } else if (opt === selectedOption && !isCorrect) {
              btnStyle = 'bg-rose-500 text-white border-rose-500 font-extrabold';
            } else {
              btnStyle = 'bg-slate-50 text-slate-300 border-slate-200 opacity-50';
            }
          }

          return (
            <button
              key={`${opt}-${idx}`}
              onClick={() => handleChoose(opt)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between shadow-xs ${btnStyle} transform active:scale-98 cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono shadow-xs ${letterBadgeColors[idx % letterBadgeColors.length]}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm font-bold">
                  {opt.includes('(') ? opt.split('(')[1]?.replace(')', '') : 'Pilihan'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl font-black"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  {opt.split('(')[0].trim()}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    speakArabic(opt.split('(')[0].trim());
                  }}
                  className="p-1.5 hover:bg-black/10 rounded-xl cursor-pointer"
                  title="Dengarkan lafal"
                >
                  <Volume2 className="w-4 h-4 opacity-75" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Review & Explanation */}
      {isAnswered && (
        <div className={`p-4 sm:p-5 rounded-3xl border animate-fadeIn ${
          isCorrect
            ? 'bg-gradient-to-r from-violet-50 via-pink-50 to-amber-50 border-violet-200'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-2 mb-2 font-black text-sm sm:text-base">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-violet-600" />
                <span className="text-violet-900">Mumtaz! Jawaban Mufrodat Anda Benar Sekali (+25 XP & +10 Koin)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span className="text-rose-900">Belum tepat! Jawaban yang benar adalah: {puzzle.correctAnswer}</span>
              </>
            )}
          </div>

          <div className="text-xs sm:text-sm text-slate-700 bg-white/80 p-3.5 rounded-2xl border border-slate-200 mb-4 shadow-xs">
            <div className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>Wawasan Bahasa & Mufrodat:</span>
            </div>
            <p className="leading-relaxed">{puzzle.explanation}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm transform hover:scale-105 active:scale-95"
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
