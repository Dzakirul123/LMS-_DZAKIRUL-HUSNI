import React, { useState } from 'react';
import {
  HelpCircle,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Award,
  BookOpen,
  Copy,
  Printer,
  Download,
  ListPlus,
  Play,
  Bot,
  Sparkles,
  Sliders,
} from 'lucide-react';
import {
  KuisInteraktif,
  SoalKuis,
  MataPelajaran,
  KelasNumber,
  DAFTAR_MAPEL,
  getFaseByKelas,
  MadrasahSettings,
  HasilKuis,
  PesertaDidik,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { formatKuisCopas } from '../../utils/copas';
import { AIQuizGeneratorModal } from './AIQuizGeneratorModal';

interface KuisManagerProps {
  settings: MadrasahSettings;
  kuisList: KuisInteraktif[];
  onSaveKuis: (list: KuisInteraktif[]) => void;
  hasilKuisList: HasilKuis[];
  siswaList: PesertaDidik[];
  onPreviewQuizAsStudent?: (kuis: KuisInteraktif) => void;
}

export const KuisManager: React.FC<KuisManagerProps> = ({
  settings,
  kuisList,
  onSaveKuis,
  hasilKuisList,
  siswaList,
  onPreviewQuizAsStudent,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapelFilter, setSelectedMapelFilter] = useState<string>('all');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('all');

  // Quiz Form Modal State
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizFormData, setQuizFormData] = useState<{
    judul: string;
    mapel: MataPelajaran;
    kelas: KelasNumber;
    babTopik: string;
    tujuanPembelajaran: string;
    durasiMenit: number;
    aktif: boolean;
  }>({
    judul: '',
    mapel: 'Fikih',
    kelas: 6,
    babTopik: 'Bab 1',
    tujuanPembelajaran: 'Peserta didik dapat mengevaluasi pemahaman konsep.',
    durasiMenit: 15,
    aktif: true,
  });

  // Question Editor Modal State
  const [editingQuizQuestions, setEditingQuizQuestions] = useState<KuisInteraktif | null>(null);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionFormData, setQuestionFormData] = useState<Omit<SoalKuis, 'id'>>({
    pertanyaan: '',
    opsiA: '',
    opsiB: '',
    opsiC: '',
    opsiD: '',
    kunciJawaban: 'A',
    bobot: 20,
    pembahasan: '',
  });

  // Results Modal State
  const [viewingResultsQuiz, setViewingResultsQuiz] = useState<KuisInteraktif | null>(null);

  // AI Quiz Generator Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiTargetQuiz, setAiTargetQuiz] = useState<KuisInteraktif | null>(null);

  const handleOpenAIForNewQuiz = () => {
    setAiTargetQuiz(null);
    setIsAIModalOpen(true);
  };

  const handleOpenAIForExistingQuiz = (quiz: KuisInteraktif) => {
    setAiTargetQuiz(quiz);
    setIsAIModalOpen(true);
  };

  const handleQuestionsGeneratedFromAI = (
    newQuestions: SoalKuis[],
    quizMeta?: { judul: string; mapel: MataPelajaran; kelas: KelasNumber; babTopik: string }
  ) => {
    if (aiTargetQuiz) {
      // Append generated questions to existing quiz
      const updatedQuiz: KuisInteraktif = {
        ...aiTargetQuiz,
        soal: [...aiTargetQuiz.soal, ...newQuestions],
      };
      setEditingQuizQuestions(updatedQuiz);
      onSaveKuis(kuisList.map((k) => (k.id === updatedQuiz.id ? updatedQuiz : k)));
      showToast(`Berhasil menambahkan ${newQuestions.length} butir soal AI ke "${aiTargetQuiz.judul}"!`, 'success');
    } else if (quizMeta) {
      // Create a brand new quiz with the AI generated questions
      const newKuis: KuisInteraktif = {
        id: `kuis-ai-${Date.now()}`,
        judul: quizMeta.judul,
        mapel: quizMeta.mapel,
        kelas: quizMeta.kelas,
        fase: getFaseByKelas(quizMeta.kelas),
        babTopik: quizMeta.babTopik,
        tujuanPembelajaran: `Asesmen Kurikulum Merdeka ${quizMeta.mapel} Kelas ${quizMeta.kelas}`,
        durasiMenit: Math.max(15, Math.ceil(newQuestions.length * 1.5)),
        soal: newQuestions,
        tanggalDibuat: new Date().toISOString().split('T')[0],
        aktif: true,
      };

      onSaveKuis([newKuis, ...kuisList]);
      showToast(`Berhasil membuat kuis baru "${newKuis.judul}" dengan ${newQuestions.length} soal AI!`, 'success');
    }
  };

  const filteredKuis = kuisList.filter((k) => {
    const matchSearch =
      k.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.babTopik.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMapel = selectedMapelFilter === 'all' || k.mapel === selectedMapelFilter;
    const matchKelas = selectedKelasFilter === 'all' || k.kelas.toString() === selectedKelasFilter;

    return matchSearch && matchMapel && matchKelas;
  });

  const handleOpenAddQuiz = () => {
    setEditingQuizId(null);
    setQuizFormData({
      judul: '',
      mapel: 'Fikih',
      kelas: 4,
      babTopik: 'Bab 1: Fikih Ibadah',
      tujuanPembelajaran: 'Mengukur penguasaan materi peserta didik dengan objektif.',
      durasiMenit: 15,
      aktif: true,
    });
    setIsQuizFormOpen(true);
  };

  const handleOpenEditQuiz = (k: KuisInteraktif) => {
    setEditingQuizId(k.id);
    setQuizFormData({
      judul: k.judul,
      mapel: k.mapel,
      kelas: k.kelas,
      babTopik: k.babTopik,
      tujuanPembelajaran: k.tujuanPembelajaran,
      durasiMenit: k.durasiMenit,
      aktif: k.aktif,
    });
    setIsQuizFormOpen(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizFormData.judul.trim()) {
      showToast('Judul kuis tidak boleh kosong!', 'error');
      return;
    }

    const fase = getFaseByKelas(quizFormData.kelas);

    if (editingQuizId) {
      const updated = kuisList.map((k) =>
        k.id === editingQuizId
          ? {
              ...k,
              ...quizFormData,
              fase,
            }
          : k
      );
      onSaveKuis(updated);
      showToast('Kuis berhasil diperbarui!', 'success');
    } else {
      const newKuis: KuisInteraktif = {
        id: `kuis-${Date.now()}`,
        ...quizFormData,
        fase,
        soal: [
          {
            id: `soal-${Date.now()}-1`,
            pertanyaan: 'Berapakah jumlah rukun iman dalam ajaran Islam?',
            opsiA: '4 Rukun',
            opsiB: '5 Rukun',
            opsiC: '6 Rukun',
            opsiD: '7 Rukun',
            kunciJawaban: 'C',
            bobot: 20,
            pembahasan: 'Rukun Iman ada 6 perkara: Iman kepada Allah, Malaikat, Kitab, Rasul, Hari Kiamat, dan Qadha & Qadar.',
          },
        ],
        tanggalDibuat: new Date().toISOString().split('T')[0],
      };
      onSaveKuis([newKuis, ...kuisList]);
      showToast('Kuis baru berhasil dibuat! Silakan kelola butir soalnya.', 'success');
    }

    setIsQuizFormOpen(false);
  };

  const handleDeleteQuiz = (id: string, judul: string) => {
    if (confirm(`Hapus kuis "${judul}" beserta seluruh butir soalnya?`)) {
      onSaveKuis(kuisList.filter((k) => k.id !== id));
      showToast('Kuis berhasil dihapus.', 'info');
    }
  };

  // Open Question Manager
  const handleOpenQuestions = (quiz: KuisInteraktif) => {
    setEditingQuizQuestions(quiz);
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQuestionFormData({
      pertanyaan: '',
      opsiA: '',
      opsiB: '',
      opsiC: '',
      opsiD: '',
      kunciJawaban: 'A',
      bobot: 20,
      pembahasan: '',
    });
    setIsQuestionFormOpen(true);
  };

  const handleOpenEditQuestion = (s: SoalKuis) => {
    setEditingQuestionId(s.id);
    setQuestionFormData({
      pertanyaan: s.pertanyaan,
      opsiA: s.opsiA,
      opsiB: s.opsiB,
      opsiC: s.opsiC,
      opsiD: s.opsiD,
      kunciJawaban: s.kunciJawaban,
      bobot: s.bobot,
      pembahasan: s.pembahasan,
    });
    setIsQuestionFormOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuizQuestions) return;

    if (
      !questionFormData.pertanyaan.trim() ||
      !questionFormData.opsiA.trim() ||
      !questionFormData.opsiB.trim()
    ) {
      showToast('Pertanyaan dan minimal opsi A dan B wajib diisi!', 'error');
      return;
    }

    let updatedSoal: SoalKuis[];
    if (editingQuestionId) {
      updatedSoal = editingQuizQuestions.soal.map((s) =>
        s.id === editingQuestionId ? { id: s.id, ...questionFormData } : s
      );
    } else {
      const newSoal: SoalKuis = {
        id: `soal-${Date.now()}`,
        ...questionFormData,
      };
      updatedSoal = [...editingQuizQuestions.soal, newSoal];
    }

    const updatedQuiz = { ...editingQuizQuestions, soal: updatedSoal };
    setEditingQuizQuestions(updatedQuiz);

    const updatedList = kuisList.map((k) => (k.id === updatedQuiz.id ? updatedQuiz : k));
    onSaveKuis(updatedList);

    showToast('Butir soal berhasil disimpan!', 'success');
    setIsQuestionFormOpen(false);
  };

  const handleDeleteQuestion = (soalId: string) => {
    if (!editingQuizQuestions) return;
    if (confirm('Hapus butir soal ini?')) {
      const updatedSoal = editingQuizQuestions.soal.filter((s) => s.id !== soalId);
      const updatedQuiz = { ...editingQuizQuestions, soal: updatedSoal };
      setEditingQuizQuestions(updatedQuiz);
      onSaveKuis(kuisList.map((k) => (k.id === updatedQuiz.id ? updatedQuiz : k)));
      showToast('Soal dihapus.', 'info');
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <span>Kuis Interaktif & Bank Soal CBT Madrasah</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Penyusunan butir soal pilihan ganda, kunci jawaban, pembahasan, dan penilaian otomatis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Tombol Buat Soal dengan AI */}
          <button
            onClick={handleOpenAIForNewQuiz}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all ring-2 ring-emerald-400/20"
            title="Buat kuis dan bank soal otomatis dengan bantuan AI (hingga 100 soal)"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Buat Soal dengan AI</span>
          </button>

          <button
            onClick={handleOpenAddQuiz}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>Buat Kuis Manual</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul kuis, bab/topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedMapelFilter}
            onChange={(e) => setSelectedMapelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Mapel</option>
            {DAFTAR_MAPEL.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={selectedKelasFilter}
            onChange={(e) => setSelectedKelasFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Kelas</option>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <option key={k} value={k}>
                Kelas {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredKuis.length === 0 ? (
          <div className="md:col-span-2 p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Belum ada kuis yang sesuai pencarian.
          </div>
        ) : (
          filteredKuis.map((kuis) => {
            const results = hasilKuisList.filter((h) => h.kuisId === kuis.id);
            const copasText = formatKuisCopas(kuis, settings, true);

            return (
              <div
                key={kuis.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800">
                        {kuis.mapel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        Kelas {kuis.kelas} ({kuis.fase})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{kuis.durasiMenit} Menit</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{kuis.judul}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">Topik: {kuis.babTopik}</div>
                  </div>

                  {/* Summary info */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-800">{kuis.soal.length} Butir Soal</span>
                      <span className="text-slate-400"> (Pilihan Ganda)</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">{results.length} Siswa</span>
                      <span className="text-slate-400"> Mengerjakan</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Mandatory COPAS, Soal Manager, and Results */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* WAJIB TOMBOL COPAS */}
                    <CopasButton
                      textToCopy={copasText}
                      label="COPAS Bank Soal"
                      size="sm"
                      variant="primary"
                      filename={`soal-kuis-${kuis.judul.toLowerCase().replace(/\s+/g, '-')}.txt`}
                      title={`Bank Soal: ${kuis.judul}`}
                    />

                    <button
                      onClick={() => handleOpenQuestions(kuis)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Kelola Butir Soal"
                    >
                      <ListPlus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Soal ({kuis.soal.length})</span>
                    </button>

                    <button
                      onClick={() => setViewingResultsQuiz(kuis)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Lihat Nilai & Hasil Siswa"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Hasil ({results.length})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditQuiz(kuis)}
                      className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Kuis"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(kuis.id, kuis.judul)}
                      className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      title="Hapus Kuis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Quiz Modal */}
      {isQuizFormOpen && (
        <Modal
          isOpen={isQuizFormOpen}
          onClose={() => setIsQuizFormOpen(false)}
          title={editingQuizId ? 'Edit Kuis' : 'Buat Kuis Baru'}
          subtitle={`MIN 1 Paser • Guru: ${settings.namaGuru}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveQuiz} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kuis *</label>
              <input
                type="text"
                required
                value={quizFormData.judul}
                onChange={(e) => setQuizFormData({ ...quizFormData, judul: e.target.value })}
                placeholder="Contoh: Asesmen Formatif: Salat Berjamaah & Ketentuan Saf"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran *
                </label>
                <select
                  value={quizFormData.mapel}
                  onChange={(e) =>
                    setQuizFormData({ ...quizFormData, mapel: e.target.value as MataPelajaran })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  {DAFTAR_MAPEL.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelas *</label>
                <select
                  value={quizFormData.kelas}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      kelas: parseInt(e.target.value) as KelasNumber,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value={1}>Kelas 1 (Fase A)</option>
                  <option value={2}>Kelas 2 (Fase A)</option>
                  <option value={3}>Kelas 3 (Fase B)</option>
                  <option value={4}>Kelas 4 (Fase B)</option>
                  <option value={5}>Kelas 5 (Fase C)</option>
                  <option value={6}>Kelas 6 (Fase C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Durasi (Menit) *
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  required
                  value={quizFormData.durasiMenit}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      durasiMenit: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bab / Topik Materi
              </label>
              <input
                type="text"
                value={quizFormData.babTopik}
                onChange={(e) => setQuizFormData({ ...quizFormData, babTopik: e.target.value })}
                placeholder="Contoh: Bab 2: Salat Berjamaah"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tujuan Pembelajaran (TP)
              </label>
              <textarea
                rows={2}
                value={quizFormData.tujuanPembelajaran}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, tujuanPembelajaran: e.target.value })
                }
                placeholder="Indikator pencapaian kuis ini..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsQuizFormOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                {editingQuizId ? 'Simpan Perubahan' : 'Lanjutkan Buat Soal'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Question Editor / Bank Soal Manager Modal */}
      {editingQuizQuestions && (
        <Modal
          isOpen={!!editingQuizQuestions}
          onClose={() => setEditingQuizQuestions(null)}
          title={`Kelola Butir Soal: ${editingQuizQuestions.judul}`}
          subtitle={`Total: ${editingQuizQuestions.soal.length} Butir Soal Pilihan Ganda • Kelas ${editingQuizQuestions.kelas}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">
                Kelola butir soal, kunci jawaban (A/B/C/D), dan bobot nilai:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAIForExistingQuiz(editingQuizQuestions)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  title="Generate butir soal baru menggunakan AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tambah Soal AI</span>
                </button>

                <button
                  onClick={handleOpenAddQuestion}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Manual</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {editingQuizQuestions.soal.map((soal, idx) => (
                <div
                  key={soal.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      <span className="text-emerald-700">Soal #{idx + 1}: </span>
                      {soal.pertanyaan}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditQuestion(soal)}
                        className="p-1 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit Soal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(soal.id)}
                        className="p-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      className={`p-2 rounded-lg border ${
                        soal.kunciJawaban === 'A'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      A. {soal.opsiA} {soal.kunciJawaban === 'A' && '✓ (Kunci)'}
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        soal.kunciJawaban === 'B'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      B. {soal.opsiB} {soal.kunciJawaban === 'B' && '✓ (Kunci)'}
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        soal.kunciJawaban === 'C'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      C. {soal.opsiC} {soal.kunciJawaban === 'C' && '✓ (Kunci)'}
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        soal.kunciJawaban === 'D'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      D. {soal.opsiD} {soal.kunciJawaban === 'D' && '✓ (Kunci)'}
                    </div>
                  </div>

                  {/* Pembahasan */}
                  {soal.pembahasan && (
                    <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 leading-relaxed">
                      <span className="font-bold">💡 Pembahasan: </span>
                      {soal.pembahasan}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <CopasButton
                textToCopy={formatKuisCopas(editingQuizQuestions, settings, true)}
                label="COPAS Soal & Kunci"
                size="sm"
                variant="secondary"
              />
              <button
                type="button"
                onClick={() => setEditingQuizQuestions(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Selesai
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Single Question Modal */}
      {isQuestionFormOpen && (
        <Modal
          isOpen={isQuestionFormOpen}
          onClose={() => setIsQuestionFormOpen(false)}
          title={editingQuestionId ? 'Edit Butir Soal' : 'Tambah Butir Soal Baru'}
          subtitle="Pilihan ganda A, B, C, D dengan kunci & pembahasan"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveQuestion} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Pertanyaan *
              </label>
              <textarea
                required
                rows={3}
                value={questionFormData.pertanyaan}
                onChange={(e) =>
                  setQuestionFormData({ ...questionFormData, pertanyaan: e.target.value })
                }
                placeholder="Tuliskan pertanyaan dengan jelas dan lugas..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 font-bold text-xs text-slate-700">A.</span>
                <input
                  type="text"
                  required
                  placeholder="Pilihan A"
                  value={questionFormData.opsiA}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, opsiA: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-6 font-bold text-xs text-slate-700">B.</span>
                <input
                  type="text"
                  required
                  placeholder="Pilihan B"
                  value={questionFormData.opsiB}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, opsiB: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-6 font-bold text-xs text-slate-700">C.</span>
                <input
                  type="text"
                  required
                  placeholder="Pilihan C"
                  value={questionFormData.opsiC}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, opsiC: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-6 font-bold text-xs text-slate-700">D.</span>
                <input
                  type="text"
                  required
                  placeholder="Pilihan D"
                  value={questionFormData.opsiD}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, opsiD: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kunci Jawaban Benar *
                </label>
                <select
                  value={questionFormData.kunciJawaban}
                  onChange={(e) =>
                    setQuestionFormData({
                      ...questionFormData,
                      kunciJawaban: e.target.value as 'A' | 'B' | 'C' | 'D',
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 rounded-lg focus:outline-hidden"
                >
                  <option value="A">Pilihan A</option>
                  <option value="B">Pilihan B</option>
                  <option value="C">Pilihan C</option>
                  <option value="D">Pilihan D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bobot Poin Soal *
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={questionFormData.bobot}
                  onChange={(e) =>
                    setQuestionFormData({
                      ...questionFormData,
                      bobot: parseInt(e.target.value) || 20,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pembahasan Jawaban
              </label>
              <textarea
                rows={3}
                value={questionFormData.pembahasan}
                onChange={(e) =>
                  setQuestionFormData({ ...questionFormData, pembahasan: e.target.value })
                }
                placeholder="Jelaskan alasan mengapa kunci tersebut benar agar siswa paham saat melihat hasil kuis..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsQuestionFormOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
              >
                Simpan Butir Soal
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Quiz Results Viewer Modal */}
      {viewingResultsQuiz && (
        <Modal
          isOpen={!!viewingResultsQuiz}
          onClose={() => setViewingResultsQuiz(null)}
          title={`Hasil Pengerjaan CBT: ${viewingResultsQuiz.judul}`}
          subtitle={`Kelas ${viewingResultsQuiz.kelas} • Total Soal: ${viewingResultsQuiz.soal.length}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {(() => {
              const results = hasilKuisList.filter((h) => h.kuisId === viewingResultsQuiz.id);
              if (results.length === 0) {
                return (
                  <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs">
                    Belum ada peserta didik yang menyelesaikan kuis ini.
                  </div>
                );
              }
              return (
                <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
                  {results.map((res) => {
                    const siswa = siswaList.find((s) => s.id === res.siswaId);
                    return (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {siswa?.nama || 'Siswa'} (Absen #{siswa?.noAbsen})
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Selesai: {new Date(res.tanggalSelesai).toLocaleString('id-ID')}
                          </div>
                          <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                            <span>
                              Benar: <span className="font-bold text-emerald-700">{res.jumlahBenar}</span> | Salah: <span className="font-bold text-rose-600">{res.jumlahSalah}</span>
                            </span>
                            {res.isGugur && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                💀 Gugur (3x Salah)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-xl font-black ${
                              res.isGugur
                                ? 'text-rose-600'
                                : res.nilaiAkhir >= 80
                                ? 'text-emerald-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {res.nilaiAkhir}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {res.isGugur ? 'Skor Saat Gugur' : 'Skor Akhir / 100'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingResultsQuiz(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Quiz Generator Modal */}
      {isAIModalOpen && (
        <AIQuizGeneratorModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          defaultMapel={aiTargetQuiz ? aiTargetQuiz.mapel : 'Fikih'}
          defaultKelas={aiTargetQuiz ? aiTargetQuiz.kelas : 6}
          defaultBab={aiTargetQuiz ? aiTargetQuiz.babTopik : 'Bab 1: Kurikulum Merdeka'}
          defaultTujuan={aiTargetQuiz ? aiTargetQuiz.tujuanPembelajaran : ''}
          isCreatingNewQuiz={!aiTargetQuiz}
          onQuestionsGenerated={handleQuestionsGeneratedFromAI}
        />
      )}
    </div>
  );
};
