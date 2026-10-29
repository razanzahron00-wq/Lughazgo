import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Puzzle } from '../data/puzzles';
import { useAuth } from '../context/AuthContext';
import { soundFX, speakArabic } from '../utils/audio';
import {
  Volume2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

interface Props {
  puzzle: Puzzle;
  onNext: () => void;
  onSolve: (xp: number, coins: number) => void;
}

export const RiddleGame: React.FC<Props> = ({ puzzle, onNext, onSolve }) => {
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
    'الْقَلَمُ (Pena)',
    'السَّاعَةُ (Jam)',
    'الْبَابُ (Pintu)'
  ];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    soundFX.playClick();
    const correct = opt.trim().toLowerCase().startsWith(puzzle.correctAnswer.split('(')[0].trim().toLowerCase()) ||
                    opt === puzzle.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      soundFX.playSuccess();
      speakArabic(puzzle.correctAnswer.split('(')[0]);
      confetti({
        particleCount: 100,
        spread: 70,
        colors: ['#a855f7', '#ec4899', '#f59e0b', '#06b6d4'],
        origin: { y: 0.6 }
      });
      const xpEarned = 50;
      const coinsEarned = 15;
      updateUserStats(xpEarned, coinsEarned, true);
      onSolve(xpEarned, coinsEarned);
    } else {
      soundFX.playError();
      updateUserStats(5, 0, false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-5 sm:p-7 transition-all">
      {/* Header banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>Fawazir • Teka-Teki Logika Arab</span>
          </span>
          <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            TANTANGAN KECERDASAN
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

      {/* Arabic Riddle Box with Illustrated Card */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-6 border border-purple-200 text-center mb-6 shadow-inner">
        {puzzle.imageUrl && (
          <div className="mx-auto mb-3 flex items-center justify-center">
            <img
              src={puzzle.imageUrl}
              alt={puzzle.title}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg border-2 border-white transform hover:scale-105 transition-transform"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={() => speakArabic(puzzle.arabicText)}
            className="px-3.5 py-1.5 bg-white hover:bg-purple-50 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-200 shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-purple-600" />
            <span>Dengarkan Pelafalan Teka-Teki</span>
          </button>
        </div>

        <div
          dir="rtl"
          className="font-arabic text-2xl sm:text-3xl font-black text-purple-950 leading-relaxed my-3"
          style={{ fontFamily: 'Amiri, serif' }}
        >
          {puzzle.arabicText}
        </div>

        <p className="text-xs text-slate-500 italic mt-1">
          {puzzle.transliteration}
        </p>

        <div className="mt-4 pt-3 border-t border-purple-200/60">
          <span className="text-xs font-black text-purple-700 uppercase tracking-wider block mb-1">
            Arti Teka-teki:
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-800">
            "{puzzle.translation}"
          </p>
        </div>
      </div>

      {showHint && (
        <div className="mb-5 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5 animate-fadeIn shadow-xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Petunjuk: </span>
            <span>{puzzle.hint}</span>
          </div>
        </div>
      )}

      {/* Options grid */}
      <div className="mb-6">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 text-center">
          Pilihlah Jawaban Logika yang Paling Tepat:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {options.map((opt, idx) => {
            let style = 'bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-slate-800 border-slate-200';
            if (isAnswered) {
              if (opt === puzzle.correctAnswer || opt.startsWith(puzzle.correctAnswer.split('(')[0])) {
                style = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent ring-4 ring-purple-200 font-extrabold shadow-md';
              } else if (opt === selectedOption && !isCorrect) {
                style = 'bg-rose-500 text-white border-rose-500 font-bold';
              } else {
                style = 'bg-slate-50 text-slate-300 opacity-50';
              }
            }

            return (
              <button
                key={`${opt}-${idx}`}
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left shadow-xs ${style} cursor-pointer`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-black font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold">{opt}</span>
                </div>
                <Sparkles className="w-4 h-4 opacity-50 shrink-0 text-amber-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback section */}
      {isAnswered && (
        <div className={`p-5 rounded-3xl border animate-fadeIn ${
          isCorrect ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-purple-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-2 mb-2 font-black text-sm sm:text-base">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span className="text-purple-950">Mumtaz! Jawaban Teka-Teki Logika Anda Tepat (+50 XP & +15 Koin)</span>
              </>
            ) : (
              <>
                <Info className="w-5 h-5 text-amber-600" />
                <span className="text-amber-900">Belum tepat! Jawaban yang benar adalah: {puzzle.correctAnswer}</span>
              </>
            )}
          </div>

          <div className="text-xs sm:text-sm text-slate-700 bg-white/80 p-3.5 rounded-2xl border border-slate-200 mb-4 shadow-xs">
            <div className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Penjelasan & Filosofi Bahasa Arab:</span>
            </div>
            <p className="leading-relaxed">{puzzle.explanation}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm transform hover:scale-105 active:scale-95"
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
