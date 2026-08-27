import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../../types/classroom';

interface QuizSectionProps {
  moduleId: string;
  questions: QuizQuestion[];
  completed: boolean;
  onComplete: (moduleId: string) => void;
  xpReward?: number;
}

export function QuizSection({
  moduleId,
  questions,
  completed,
  onComplete,
  xpReward = 100
}: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isChecked) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleCheckQuiz = () => {
    let correctCount = 0;
    questions.forEach(q => {
      const selectedIndex = answers[q.id];
      if (selectedIndex !== undefined && q.options[selectedIndex]?.isCorrect) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsChecked(true);

    if (correctCount === questions.length) {
      onComplete(moduleId);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setIsChecked(false);
    setScore(0);
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          Uji Pemahaman Materi (Kuis Interaktif)
        </h4>
        {completed && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Selesai
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q, qIndex) => {
          const selectedOptionIndex = answers[q.id];
          return (
            <div 
              key={q.id} 
              className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-900/20 space-y-3.5"
            >
              <h5 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed flex gap-2">
                <span className="text-teal-600 dark:text-teal-400 font-black">{qIndex + 1}.</span> {q.q}
              </h5>

              <div className="space-y-2">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedOptionIndex === optIndex;
                  let btnStyle = 'border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-300';
                  
                  if (isChecked) {
                    if (opt.isCorrect) {
                      btnStyle = 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300 font-extrabold';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-300';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:border-teal-500 dark:text-teal-200 font-bold';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3.5 text-xs rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="leading-relaxed">{opt.text}</span>
                      {isChecked && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {isChecked && isSelected && !opt.isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isChecked && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-700/50">
                  <strong className="font-bold text-slate-800 dark:text-slate-100">Penjelasan: </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Actions */}
      <div className="flex items-center justify-between pt-2">
        {!isChecked ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleCheckQuiz}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              allAnswered 
                ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-md shadow-teal-600/20 cursor-pointer' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Cek Jawaban Kuis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between flex-wrap">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Skor: <span className="font-extrabold text-teal-600 dark:text-teal-400">{score}</span> dari {questions.length} Benar
              {score === questions.length && (
                <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-black">🎉 Sempurna! (+{xpReward} XP)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi Kuis
              </button>

              {!completed && (
                <button
                  type="button"
                  onClick={() => onComplete(moduleId)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-extrabold hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Klaim +{xpReward} XP
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
