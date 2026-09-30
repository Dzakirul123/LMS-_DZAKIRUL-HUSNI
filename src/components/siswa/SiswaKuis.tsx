import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  RotateCcw,
  Sparkles,
  Trophy,
  Check,
  X,
  Heart,
  HeartCrack,
  Skull,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import {
  KuisInteraktif,
  HasilKuis,
  PesertaDidik,
  MadrasahSettings,
} from '../../types/lms';
import { CopasButton } from '../common/CopasButton';
import { formatKuisCopas, formatHasilKuisSiswaCopas } from '../../utils/copas';
import { useToast } from '../common/Toast';

interface SiswaKuisProps {
  settings: MadrasahSettings;
  siswa: PesertaDidik;
  kuisList: KuisInteraktif[];
  hasilKuisList: HasilKuis[];
  onSaveHasilKuis: (list: HasilKuis[]) => void;
  initialSelectedKuis?: KuisInteraktif | null;
}

export const SiswaKuis: React.FC<SiswaKuisProps> = ({
  settings,
  siswa,
  kuisList,
  hasilKuisList,
  onSaveHasilKuis,
  initialSelectedKuis,
}) => {
  const { showToast } = useToast();

  const [activeKuis, setActiveKuis] = useState<KuisInteraktif | null>(initialSelectedKuis || null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Student answer tracking
  const [studentAnswers, setStudentAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [confirmedAnswers, setConfirmedAnswers] = useState<
    Record<string, { answer: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>
  >({});
  
  // Selected option for CURRENT question before locking in
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  
  // 3-Strikes / Lives System
  const [wrongCount, setWrongCount] = useState(0);
  const [isEliminated, setIsEliminated] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentResult, setCurrentResult] = useState<HasilKuis | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const classKuis = kuisList.filter((k) => k.kelas === siswa.kelas && k.aktif);

  // Set initial selected quiz if provided
  useEffect(() => {
    if (initialSelectedKuis) {
      handleStartQuiz(initialSelectedKuis);
    }
  }, [initialSelectedKuis]);

  // Sync selectedOption when moving between questions
  useEffect(() => {
    if (!activeKuis) return;
    const currentSoal = activeKuis.soal[currentQuestionIndex];
    if (currentSoal && confirmedAnswers[currentSoal.id]) {
      setSelectedOption(confirmedAnswers[currentSoal.id].answer);
    } else if (currentSoal && studentAnswers[currentSoal.id]) {
      setSelectedOption(studentAnswers[currentSoal.id]);
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, activeKuis]);

  // Timer countdown
  useEffect(() => {
    if (!activeKuis || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(false); // Submit because of timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeKuis, isSubmitted, studentAnswers, confirmedAnswers]);

  const handleStartQuiz = (kuis: KuisInteraktif) => {
    setActiveKuis(kuis);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setConfirmedAnswers({});
    setSelectedOption(null);
    setWrongCount(0);
    setIsEliminated(false);
    setIsSubmitted(false);
    setCurrentResult(null);
    setTimeLeft(kuis.durasiMenit * 60);
  };

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted || isEliminated) return;
    if (!activeKuis) return;
    const currentSoal = activeKuis.soal[currentQuestionIndex];
    if (!currentSoal) return;

    // If current question is already confirmed, do not allow changing
    if (confirmedAnswers[currentSoal.id]) return;

    setSelectedOption(option);
  };

  // Lock and evaluate the current question
  const handleLockAnswer = () => {
    if (!activeKuis || !selectedOption || isSubmitted || isEliminated) return;
    const currentSoal = activeKuis.soal[currentQuestionIndex];
    if (!currentSoal) return;

    // Already locked?
    if (confirmedAnswers[currentSoal.id]) return;

    const isCorrect = selectedOption === currentSoal.kunciJawaban;
    const updatedAnswers = {
      ...studentAnswers,
      [currentSoal.id]: selectedOption,
    };
    const updatedConfirmed = {
      ...confirmedAnswers,
      [currentSoal.id]: { answer: selectedOption, isCorrect },
    };

    setStudentAnswers(updatedAnswers);
    setConfirmedAnswers(updatedConfirmed);

    if (isCorrect) {
      // Correct answer!
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
      showToast(`Hebat! Jawabanmu Benar! (+${currentSoal.bobot} Poin)`, 'success');
    } else {
      // Wrong answer!
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);

      if (newWrong >= 3) {
        // AUTOMATIC ELIMINATION (3 MISTAKES)
        setIsEliminated(true);
        showToast('💀 INNALILLAHI! Kamu telah menjawab salah 3 kali dan otomatis GUGUR!', 'error');
        handleElimination(updatedAnswers, newWrong);
        return;
      } else {
        const sisaNyawa = 3 - newWrong;
        if (sisaNyawa === 1) {
          showToast(`❌ Salah! Sisa 1 Nyawa lagi! Hati-hati, 1 kesalahan lagi kamu GUGUR!`, 'error');
        } else {
          showToast(`❌ Salah! Kunci: ${currentSoal.kunciJawaban}. Nyawa tersisa: ${sisaNyawa} ❤️`, 'error');
        }
      }
    }
  };

  // Triggered when student answers incorrectly 3 times
  const handleElimination = (
    finalAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>,
    finalWrongCount: number
  ) => {
    if (!activeKuis) return;

    let benar = 0;
    let totalPoinDapat = 0;
    let totalPoinMaks = 0;

    activeKuis.soal.forEach((s) => {
      totalPoinMaks += s.bobot;
      if (finalAnswers[s.id] === s.kunciJawaban) {
        benar++;
        totalPoinDapat += s.bobot;
      }
    });

    const nilaiAkhir =
      totalPoinMaks > 0 ? Math.round((totalPoinDapat / totalPoinMaks) * 100) : 0;

    const newResult: HasilKuis = {
      id: `hk-${Date.now()}`,
      kuisId: activeKuis.id,
      siswaId: siswa.id,
      tanggalSelesai: new Date().toISOString(),
      jawabanSiswa: finalAnswers,
      totalSkor: totalPoinDapat,
      nilaiAkhir,
      jumlahBenar: benar,
      jumlahSalah: finalWrongCount,
      isGugur: true,
      alasanGugur: 'Gugur karena menjawab salah 3 kali (Batas eliminasi tercapai)',
    };

    setCurrentResult(newResult);
    setIsSubmitted(true);

    // Save to storage
    const updated = [
      newResult,
      ...hasilKuisList.filter(
        (h) => !(h.kuisId === activeKuis.id && h.siswaId === siswa.id)
      ),
    ];
    onSaveHasilKuis(updated);
  };

  // Normal submission when quiz is completed with < 3 mistakes or time expires
  const handleSubmitQuiz = (isEliminatedSubmission = false) => {
    if (!activeKuis) return;

    let benar = 0;
    let totalPoinDapat = 0;
    let totalPoinMaks = 0;

    activeKuis.soal.forEach((s) => {
      totalPoinMaks += s.bobot;
      if (studentAnswers[s.id] === s.kunciJawaban) {
        benar++;
        totalPoinDapat += s.bobot;
      }
    });

    const totalSalah = isEliminatedSubmission ? 3 : wrongCount;
    const nilaiAkhir =
      totalPoinMaks > 0 ? Math.round((totalPoinDapat / totalPoinMaks) * 100) : 0;

    const newResult: HasilKuis = {
      id: `hk-${Date.now()}`,
      kuisId: activeKuis.id,
      siswaId: siswa.id,
      tanggalSelesai: new Date().toISOString(),
      jawabanSiswa: studentAnswers,
      totalSkor: totalPoinDapat,
      nilaiAkhir,
      jumlahBenar: benar,
      jumlahSalah: totalSalah,
      isGugur: isEliminatedSubmission,
      alasanGugur: isEliminatedSubmission
        ? 'Gugur karena menjawab salah 3 kali'
        : undefined,
    };

    setCurrentResult(newResult);
    setIsSubmitted(true);

    // Save to storage
    const updated = [
      newResult,
      ...hasilKuisList.filter(
        (h) => !(h.kuisId === activeKuis.id && h.siswaId === siswa.id)
      ),
    ];
    onSaveHasilKuis(updated);

    // Celebration confetti if passed successfully
    if (!isEliminatedSubmission) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
      showToast(`Alhamdulillah! Kamu berhasil menyelesaikan kuis dengan nilai: ${nilaiAkhir}!`, 'success');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // IF ACTIVE QUIZ IS IN PROGRESS OR FINISHED
  if (activeKuis) {
    const totalSoal = activeKuis.soal.length;
    const currentSoal = activeKuis.soal[currentQuestionIndex];
    const isCurrentConfirmed = !!(currentSoal && confirmedAnswers[currentSoal.id]);
    const currentConfirmedData = currentSoal ? confirmedAnswers[currentSoal.id] : null;
    const answeredCount = Object.keys(confirmedAnswers).length;
    const livesRemaining = Math.max(0, 3 - wrongCount);

    return (
      <div className="space-y-5 max-w-4xl mx-auto">
        {/* QUIZ HEADER BAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800">
                {activeKuis.mapel}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Kelas {activeKuis.kelas} ({activeKuis.fase})
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-600" />
                Mode Bertahan (3x Salah = Gugur)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {activeKuis.judul}
            </h2>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-3">
              {/* LIVES (NYAWA) COUNTER */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  livesRemaining === 1
                    ? 'bg-rose-100 border-rose-400 text-rose-800 animate-pulse ring-2 ring-rose-400/40'
                    : livesRemaining === 2
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
                title="Aturan Kuis: Salah 3 kali otomatis gugur"
              >
                <div className="flex items-center gap-1 text-sm">
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const isAlive = idx < livesRemaining;
                    return isAlive ? (
                      <Heart
                        key={idx}
                        className="w-4 h-4 text-rose-500 fill-rose-500 drop-shadow-xs"
                      />
                    ) : (
                      <HeartCrack
                        key={idx}
                        className="w-4 h-4 text-slate-300 opacity-60"
                      />
                    );
                  })}
                </div>
                <span className="font-mono text-xs ml-0.5">
                  Nyawa: {livesRemaining}/3
                </span>
              </div>

              {/* TIMER */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                  timeLeft < 180
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{formatTimer(timeLeft)}</span>
              </div>

              <button
                onClick={() => {
                  if (confirm('Yakin ingin membatalkan dan keluar dari kuis?')) {
                    setActiveKuis(null);
                  }
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
            </div>
          )}
        </div>

        {/* RESULTS SCREEN (EITHER ELIMINATED OR PASSED) */}
        {isSubmitted && currentResult ? (
          <div
            className={`rounded-3xl border shadow-md p-6 sm:p-8 space-y-6 animate-in zoom-in-95 ${
              currentResult.isGugur
                ? 'bg-gradient-to-b from-rose-50/70 via-white to-slate-50 border-rose-300'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* ELIMINATED HERO OR VICTORY HERO */}
            {currentResult.isGugur ? (
              <div className="text-center max-w-lg mx-auto space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center mx-auto shadow-lg ring-8 ring-rose-100 animate-bounce">
                  <Skull className="w-10 h-10" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wider">
                  <HeartCrack className="w-3.5 h-3.5 text-rose-600" />
                  <span>Otomatis Gugur • Game Over</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-rose-950">
                  Kamu Telah Gugur!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sesuai aturan pengerjaan kuis, kamu telah melakukan <strong>3 kali kesalahan</strong>{' '}
                  sehingga otomatis gugur dan <strong>tidak dapat melanjutkan permainan</strong> ke soal berikutnya.
                </p>

                {/* Score & Lives stats card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Sisa Nyawa</div>
                    <div className="text-lg font-black text-rose-600 mt-0.5">0 / 3 ❤️</div>
                    <div className="text-[10px] text-rose-500 font-semibold">Habis</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Salah</div>
                    <div className="text-lg font-black text-rose-600 mt-0.5">3 Kali</div>
                    <div className="text-[10px] text-rose-500 font-semibold">Batas Tercapai</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Benar</div>
                    <div className="text-lg font-black text-emerald-700 mt-0.5">
                      {currentResult.jumlahBenar} Soal
                    </div>
                    <div className="text-[10px] text-slate-500">Tercatat</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Skor Sementara</div>
                    <div className="text-lg font-black text-slate-800 mt-0.5 font-mono">
                      {currentResult.nilaiAkhir}
                    </div>
                    <div className="text-[10px] text-slate-500">Poin</div>
                  </div>
                </div>
              </div>
            ) : (
              /* SUCCESSFUL COMPLETION HERO */
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50">
                  <Trophy className="w-10 h-10" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Berhasil Lolos & Selesai!</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentResult.nilaiAkhir >= 80
                    ? 'Masya Allah, Mumtaz Sekali!'
                    : 'Kuis Selesai! Kamu Berhasil Bertahan!'}
                </h3>
                <p className="text-xs text-slate-500">
                  Selamat, kamu berhasil menyelesaikan seluruh soal tanpa gugur 3 kali kesalahan!
                </p>

                <div className="py-3 px-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block mt-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nilai Akhir
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-700 font-mono mt-1">
                    {currentResult.nilaiAkhir}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-2">
                    <span>
                      Benar: <strong className="text-emerald-700">{currentResult.jumlahBenar}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Salah: <strong className="text-rose-600">{currentResult.jumlahSalah}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      Nyawa Tersisa: {Math.max(0, 3 - currentResult.jumlahSalah)} ❤️
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Answer Breakdown with Explanations */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {currentResult.isGugur
                    ? 'Pembahasan Soal yang Sempat Dikerjakan Sebelum Gugur'
                    : 'Pembahasan Soal & Kunci Jawaban Lengkap'}
                </span>
              </h4>

              <div className="space-y-4">
                {activeKuis.soal.map((soal, idx) => {
                  const studentAns = currentResult.jawabanSiswa[soal.id];
                  if (!studentAns && currentResult.isGugur) {
                    // Question was not reached due to elimination
                    return (
                      <div
                        key={soal.id}
                        className="p-3.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-slate-400 text-xs flex items-center justify-between opacity-70"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400">Soal #{idx + 1}:</span>
                          <span className="line-clamp-1">{soal.pertanyaan}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Terkunci (Gugur)
                        </span>
                      </div>
                    );
                  }

                  const isCorrect = studentAns === soal.kunciJawaban;

                  return (
                    <div
                      key={soal.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs sm:text-sm font-bold text-slate-900">
                          <span className="text-slate-500">Soal #{idx + 1}: </span>
                          {soal.pertanyaan}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          {isCorrect ? `Benar (+${soal.bobot})` : 'Salah (-1 Nyawa)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                        {[
                          { key: 'A', text: soal.opsiA },
                          { key: 'B', text: soal.opsiB },
                          { key: 'C', text: soal.opsiC },
                          { key: 'D', text: soal.opsiD },
                        ].map((opt) => {
                          const isKey = soal.kunciJawaban === opt.key;
                          const isStudent = studentAns === opt.key;

                          let style = 'bg-white border-slate-200 text-slate-600';
                          if (isKey) {
                            style = 'bg-emerald-100/80 border-emerald-400 font-bold text-emerald-950 ring-1 ring-emerald-400';
                          } else if (isStudent) {
                            style = 'bg-rose-100/80 border-rose-300 font-bold text-rose-900 line-through';
                          }

                          return (
                            <div key={opt.key} className={`p-2 rounded-lg border ${style}`}>
                              <strong>{opt.key}.</strong> {opt.text}
                              {isKey && <span className="ml-1 text-[10px] text-emerald-800 font-bold">(Kunci)</span>}
                              {isStudent && !isKey && (
                                <span className="ml-1 text-[10px] text-rose-800 font-bold">(Jawabanmu)</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {soal.pembahasan && (
                        <div className="mt-2.5 p-3 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-emerald-800">💡 Penjelasan Guru: </span>
                          {soal.pembahasan}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <CopasButton
                  textToCopy={formatHasilKuisSiswaCopas(activeKuis, currentResult, siswa, settings)}
                  label={currentResult.isGugur ? 'COPAS Rekap Gugur' : 'COPAS Hasil & Nilai'}
                  size="md"
                  variant="secondary"
                />

                <CopasButton
                  textToCopy={formatKuisCopas(activeKuis, settings, true)}
                  label="COPAS Soal Lengkap"
                  size="md"
                  variant="outline"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartQuiz(activeKuis)}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Kuis (3 Nyawa Baru)</span>
                </button>

                <button
                  onClick={() => setActiveKuis(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs"
                >
                  Kembali ke Daftar Kuis
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTION CARD (GAMEPLAY) */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-6">
            {/* Survival Rule Banner */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Aturan Permainan:</strong> Setiap siswa memiliki 3 kesempatan (nyawa). Menjawab salah 3 kali = Otomatis Gugur!
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 font-bold text-rose-700 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200">
                <span>Nyawa:</span>
                <span className="font-mono text-sm">{livesRemaining} / 3</span>
              </div>
            </div>

            {/* Question Progress Numbering */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Pertanyaan #{currentQuestionIndex + 1} dari {totalSoal}</span>
                <span className="text-[11px] text-slate-400">
                  ({answeredCount} dijawab)
                </span>
              </span>

              {/* Number buttons for jump - only allow answered or current question */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {activeKuis.soal.map((s, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = !!confirmedAnswers[s.id];
                  const answerData = confirmedAnswers[s.id];

                  let btnStyle = 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60';
                  if (isCurrent) {
                    btnStyle = 'bg-emerald-700 text-white ring-2 ring-emerald-300 font-black shadow-xs';
                  } else if (isAnswered) {
                    if (answerData?.isCorrect) {
                      btnStyle = 'bg-emerald-100 text-emerald-900 font-bold hover:bg-emerald-200';
                    } else {
                      btnStyle = 'bg-rose-100 text-rose-900 font-bold hover:bg-rose-200';
                    }
                  }

                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!isAnswered && !isCurrent}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      title={!isAnswered && !isCurrent ? 'Harus dijawab berurutan' : `Soal #${idx + 1}`}
                      className={`w-7 h-7 rounded-lg text-xs transition-all flex items-center justify-center ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Prompt */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Bobot Soal: {currentSoal.bobot} Poin</span>
                {isCurrentConfirmed && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentConfirmedData?.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {currentConfirmedData?.isCorrect ? '✅ Terjawab Benar' : '❌ Terjawab Salah'}
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentSoal.pertanyaan}
              </h3>
            </div>

            {/* Options list A, B, C, D */}
            <div className="space-y-3">
              {[
                { key: 'A', text: currentSoal.opsiA },
                { key: 'B', text: currentSoal.opsiB },
                { key: 'C', text: currentSoal.opsiC },
                { key: 'D', text: currentSoal.opsiD },
              ].map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isKey = currentSoal.kunciJawaban === opt.key;

                let optClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                let badgeClass = 'bg-slate-100 text-slate-600';

                if (isCurrentConfirmed) {
                  // After locking
                  if (isKey) {
                    optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    badgeClass = 'bg-emerald-700 text-white';
                  } else if (isSelected && !isKey) {
                    optClass = 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-400/20';
                    badgeClass = 'bg-rose-600 text-white';
                  } else {
                    optClass = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                    badgeClass = 'bg-slate-200 text-slate-500';
                  }
                } else if (isSelected) {
                  // Selected prior to locking
                  optClass = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-bold shadow-xs';
                  badgeClass = 'bg-emerald-700 text-white';
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={isCurrentConfirmed}
                    onClick={() => handleSelectOption(opt.key as 'A' | 'B' | 'C' | 'D')}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${badgeClass}`}
                      >
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCurrentConfirmed && isKey && (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <Check className="w-3.5 h-3.5" /> Kunci Benar
                        </span>
                      )}
                      {isCurrentConfirmed && isSelected && !isKey && (
                        <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-md">
                          <X className="w-3.5 h-3.5" /> Jawabanmu (Salah)
                        </span>
                      )}
                      {!isCurrentConfirmed && isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* FEEDBACK ALERT AFTER LOCKING */}
            {isCurrentConfirmed && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in slide-in-from-top-2 ${
                  currentConfirmedData?.isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50/70 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    {currentConfirmedData?.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jawaban Kamu Benar! (+{currentSoal.bobot} Poin)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Jawaban Kurang Tepat! (-1 Nyawa)</span>
                      </>
                    )}
                  </div>

                  <span className="text-xs font-semibold">
                    Kunci Jawaban: <strong>{currentSoal.kunciJawaban}</strong>
                  </span>
                </div>

                {currentSoal.pembahasan && (
                  <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    <strong>💡 Penjelasan:</strong> {currentSoal.pembahasan}
                  </p>
                )}
              </div>
            )}

            {/* ACTION & NAVIGATION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-2">
                {/* If answer not yet confirmed: Lock in button */}
                {!isCurrentConfirmed ? (
                  <button
                    type="button"
                    disabled={!selectedOption}
                    onClick={handleLockAnswer}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Kunci & Cek Jawaban</span>
                  </button>
                ) : (
                  /* If answer is already confirmed: Next button or Finish */
                  currentQuestionIndex < totalSoal - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <span>Lanjut ke Soal Berikutnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubmitQuiz(false)}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Selesaikan Kuis & Lihat Hasil</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // QUIZ SELECTION LIST (WHEN NO ACTIVE QUIZ)
  return (
    <div className="space-y-5">
      {/* Banner Intro */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <span>Kuis Interaktif CBT Kelas {siswa.kelas}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Uji pemahaman materi secara menyenangkan dengan mode bertahan hidup dan evaluasi instan
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Aturan Gugur: 3x Salah = Otomatis Gugur</span>
          </div>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classKuis.length === 0 ? (
          <div className="md:col-span-2 p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Belum ada kuis yang tersedia untuk Kelas {siswa.kelas}.
          </div>
        ) : (
          classKuis.map((kuis) => {
            const completed = hasilKuisList.find(
              (h) => h.kuisId === kuis.id && h.siswaId === siswa.id
            );
            const copasText = formatKuisCopas(kuis, settings, true);

            return (
              <div
                key={kuis.id}
                className={`bg-white rounded-2xl border shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between ${
                  completed?.isGugur ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800">
                      {kuis.mapel}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {kuis.durasiMenit} Menit
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{kuis.judul}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{kuis.babTopik}</div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {kuis.tujuanPembelajaran}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 font-semibold">
                      <span>Jumlah: {kuis.soal.length} Butir Soal</span>
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        3 Kesempatan (Nyawa)
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                      {completed ? (
                        completed.isGugur ? (
                          <span className="font-bold text-rose-700 flex items-center gap-1">
                            <Skull className="w-3.5 h-3.5 text-rose-600" />
                            Gugur (3x Salah) • Skor: {completed.nilaiAkhir}
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Lolos • Nilai: {completed.nilaiAkhir}
                          </span>
                        )
                      ) : (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          Belum Dikerjakan
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <CopasButton
                    textToCopy={copasText}
                    label="COPAS Soal"
                    size="sm"
                    variant="outline"
                  />

                  <button
                    onClick={() => handleStartQuiz(kuis)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors text-white ${
                      completed?.isGugur
                        ? 'bg-rose-700 hover:bg-rose-800'
                        : completed
                        ? 'bg-teal-700 hover:bg-teal-800'
                        : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    <span>
                      {completed?.isGugur
                        ? 'Coba Lagi (Tantangan 3 Nyawa)'
                        : completed
                        ? 'Kerjakan Lagi'
                        : 'Mulai Kuis'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
