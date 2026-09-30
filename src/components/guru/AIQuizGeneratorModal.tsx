import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { MataPelajaran, KelasNumber, DAFTAR_MAPEL, SoalKuis } from '../../types/lms';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface AIQuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMapel: MataPelajaran;
  defaultKelas: KelasNumber;
  defaultBab?: string;
  defaultTujuan?: string;
  onQuestionsGenerated: (
    soal: SoalKuis[],
    quizMeta?: { judul: string; mapel: MataPelajaran; kelas: KelasNumber; babTopik: string }
  ) => void;
  isCreatingNewQuiz?: boolean;
}

export const AIQuizGeneratorModal: React.FC<AIQuizGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultMapel,
  defaultKelas,
  defaultBab = '',
  defaultTujuan = '',
  onQuestionsGenerated,
  isCreatingNewQuiz = false,
}) => {
  const { showToast } = useToast();

  const [mapel, setMapel] = useState<MataPelajaran>(defaultMapel || 'Fikih');
  const [kelas, setKelas] = useState<KelasNumber>(defaultKelas || 6);
  const [judulKuis, setJudulKuis] = useState(
    isCreatingNewQuiz ? `Asesmen Formatif AI ${mapel} Kelas ${kelas}` : ''
  );
  const [babTopik, setBabTopik] = useState(defaultBab);
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState(defaultTujuan);
  
  // Slider untuk jumlah soal (1 s/d 100)
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  const [tingkatKesulitan, setTingkatKesulitan] = useState<'Mudah' | 'Sedang' | 'HOTS / Sulit'>('Sedang');
  const [catatanTambahan, setCatatanTambahan] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');

  // Quick preset counts
  const presetCounts = [5, 10, 15, 20, 25, 50, 75, 100];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mapel) {
      showToast('Pilih mata pelajaran terlebih dahulu.', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(`Menghubungi AI Gemini untuk menyusun ${jumlahSoal} butir soal Kurikulum Merdeka...`);

    try {
      const response = await fetch('/api/generate-soal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapel,
          kelas,
          babTopik: babTopik || `Bab 1 ${mapel}`,
          tujuanPembelajaran: tujuanPembelajaran || `Menguji penguasaan materi ${mapel} Kelas ${kelas}`,
          jumlahSoal,
          tingkatKesulitan,
          catatanTambahan,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server generator AI');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.soal) && data.soal.length > 0) {
        showToast(
          `Alhamdulillah! Berhasil membuat ${data.soal.length} soal pilihan ganda ${data.usedAI ? 'dengan AI Gemini' : 'berstandar Kemenag'}.`,
          'success'
        );

        onQuestionsGenerated(data.soal, {
          judul: judulKuis || `Asesmen AI ${mapel} Kelas ${kelas}: ${babTopik || 'Kurikulum Merdeka'}`,
          mapel,
          kelas,
          babTopik: babTopik || `Topik ${mapel} Kelas ${kelas}`,
        });

        onClose();
      } else {
        throw new Error(data.message || 'Tidak ada soal yang dihasilkan.');
      }
    } catch (err: any) {
      console.error('Error generating quiz:', err);
      showToast(err.message || 'Gagal membuat soal dengan AI.', 'error');
    } finally {
      setIsLoading(false);
      setLoadingProgress('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generator Soal Otomatis Berbasis AI (Hingga 100 Soal)"
      subtitle={`Asisten Cerdas Guru Madrasah • Khusus Kelas ${kelas} (Fase C) MIN 1 Paser`}
      maxWidth="2xl"
    >
      <form onSubmit={handleGenerate} className="space-y-5">
        {/* Banner Info */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-xs text-emerald-950 space-y-1">
            <h4 className="font-extrabold flex items-center gap-1.5 text-emerald-900">
              <span>Pembuatan Soal Pilihan Ganda Instan dengan AI</span>
              <span className="bg-emerald-200 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                Maksimal 100 Soal
              </span>
            </h4>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              AI akan menyusun soal pilihan ganda (opsi A, B, C, D) lengkap dengan kunci jawaban dan pembahasan mendalam sesuai Capaian Pembelajaran Kurikulum Merdeka Kemenag RI.
            </p>
          </div>
        </div>

        {/* Input Mapel & Kelas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mata Pelajaran *
            </label>
            <select
              value={mapel}
              onChange={(e) => {
                const newM = e.target.value as MataPelajaran;
                setMapel(newM);
                if (isCreatingNewQuiz) {
                  setJudulKuis(`Asesmen Formatif AI ${newM} Kelas ${kelas}`);
                }
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {DAFTAR_MAPEL.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.kategori})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tingkat Kelas *
            </label>
            <select
              value={kelas}
              onChange={(e) => setKelas(parseInt(e.target.value) as KelasNumber)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value={6}>Kelas 6 (Fase C) - Prioritas</option>
              <option value={5}>Kelas 5 (Fase C)</option>
              <option value={4}>Kelas 4 (Fase B)</option>
              <option value={3}>Kelas 3 (Fase B)</option>
              <option value={2}>Kelas 2 (Fase A)</option>
              <option value={1}>Kelas 1 (Fase A)</option>
            </select>
          </div>
        </div>

        {isCreatingNewQuiz && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Kuis Baru *
            </label>
            <input
              type="text"
              required
              value={judulKuis}
              onChange={(e) => setJudulKuis(e.target.value)}
              placeholder="Contoh: Try Out Asesmen Madrasah CBT Fikih Kelas 6"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bab / Topik Materi
            </label>
            <input
              type="text"
              value={babTopik}
              onChange={(e) => setBabTopik(e.target.value)}
              placeholder="Contoh: Makanan Halal & Haram / Bilangan Bulat"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tingkat Kesulitan Soal
            </label>
            <select
              value={tingkatKesulitan}
              onChange={(e) => setTingkatKesulitan(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="Mudah">Mudah (Pemahaman Dasar / Ingatan C1-C2)</option>
              <option value="Sedang">Sedang (Penerapan Konsep C3)</option>
              <option value="HOTS / Sulit">HOTS (Analisis Logika & Evaluasi C4-C5)</option>
            </select>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SLIDER / GARIS PENGATUR JUMLAH SOAL (SUPPORT S/D 100 SOAL) */}
        {/* ======================================================== */}
        <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Garis Penentu Jumlah Soal yang Dibuat:</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
                {jumlahSoal}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase">Soal</span>
            </div>
          </div>

          {/* Garis Range Slider Input */}
          <div className="space-y-1">
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={jumlahSoal}
              onChange={(e) => setJumlahSoal(parseInt(e.target.value) || 1)}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-hidden"
            />
            {/* Indikator Garis Skala (1 s/d 100) */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
              <span>1 Soal</span>
              <span>25</span>
              <span>50 Soal</span>
              <span>75</span>
              <span className="font-bold text-emerald-800">100 Soal</span>
            </div>
          </div>

          {/* Tombol Preset Cepat */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Pilihan Cepat:</span>
            {presetCounts.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setJumlahSoal(count)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  jumlahSoal === count
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Tujuan & Catatan Tambahan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Indikator / Tujuan Pembelajaran (Opsional)
          </label>
          <input
            type="text"
            value={tujuanPembelajaran}
            onChange={(e) => setTujuanPembelajaran(e.target.value)}
            placeholder="Contoh: Peserta didik mampu membedakan bangkai halal dan haram"
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Instruksi / Catatan Tambahan untuk AI (Opsional)
          </label>
          <input
            type="text"
            value={catatanTambahan}
            onChange={(e) => setCatatanTambahan(e.target.value)}
            placeholder="Contoh: Sisipkan dalil ayat Al-Qur'an dan studi kasus sehari-hari di madrasah"
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 text-emerald-700 animate-spin shrink-0" />
            <div className="text-xs text-emerald-900">
              <div className="font-bold">Sedang memproses {jumlahSoal} butir soal...</div>
              <div className="text-[11px] text-emerald-700">{loadingProgress}</div>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membuat {jumlahSoal} Soal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buat {jumlahSoal} Soal Sekarang</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
