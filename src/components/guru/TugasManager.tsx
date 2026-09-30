import React, { useState } from 'react';
import {
  FileCheck2,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  Award,
  AlertCircle,
  User,
  ExternalLink,
} from 'lucide-react';
import {
  Tugas,
  JenisTugas,
  MataPelajaran,
  KelasNumber,
  DAFTAR_MAPEL,
  getFaseByKelas,
  MadrasahSettings,
  PengumpulanTugas,
  PesertaDidik,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { formatTugasCopas } from '../../utils/copas';

interface TugasManagerProps {
  settings: MadrasahSettings;
  tugasList: Tugas[];
  onSaveTugas: (list: Tugas[]) => void;
  pengumpulanList: PengumpulanTugas[];
  onSavePengumpulan: (list: PengumpulanTugas[]) => void;
  siswaList: PesertaDidik[];
}

export const TugasManager: React.FC<TugasManagerProps> = ({
  settings,
  tugasList,
  onSaveTugas,
  pengumpulanList,
  onSavePengumpulan,
  siswaList,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapelFilter, setSelectedMapelFilter] = useState<string>('all');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('all');
  const [selectedJenisFilter, setSelectedJenisFilter] = useState<string>('all');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    judul: string;
    mapel: MataPelajaran;
    kelas: KelasNumber;
    materiTerkait: string;
    instruksi: string;
    batasWaktu: string;
    jenis: JenisTugas;
    bobotNilai: number;
  }>({
    judul: '',
    mapel: 'Fikih',
    kelas: 6,
    materiTerkait: '',
    instruksi: '',
    batasWaktu: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    jenis: 'Uraian',
    bobotNilai: 100,
  });

  // Submissions Modal State
  const [selectedTugasForSubmissions, setSelectedTugasForSubmissions] = useState<Tugas | null>(null);

  // Grading Modal State
  const [gradingSubmission, setGradingSubmission] = useState<PengumpulanTugas | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const filteredTugas = tugasList.filter((t) => {
    const matchSearch =
      t.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.instruksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.materiTerkait.toLowerCase().includes(searchQuery.toLowerCase());

    const matchMapel = selectedMapelFilter === 'all' || t.mapel === selectedMapelFilter;
    const matchKelas = selectedKelasFilter === 'all' || t.kelas.toString() === selectedKelasFilter;
    const matchJenis = selectedJenisFilter === 'all' || t.jenis === selectedJenisFilter;

    return matchSearch && matchMapel && matchKelas && matchJenis;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      mapel: 'Fikih',
      kelas: 4,
      materiTerkait: 'Bab 2: Salat Berjamaah',
      instruksi: 'Kerjakan soal atau instruksi berikut secara mandiri dan cermat.',
      batasWaktu: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      jenis: 'Uraian',
      bobotNilai: 100,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t: Tugas) => {
    setEditingId(t.id);
    setFormData({
      judul: t.judul,
      mapel: t.mapel,
      kelas: t.kelas,
      materiTerkait: t.materiTerkait,
      instruksi: t.instruksi,
      batasWaktu: t.batasWaktu,
      jenis: t.jenis,
      bobotNilai: t.bobotNilai,
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.instruksi.trim()) {
      showToast('Judul dan instruksi tugas wajib diisi!', 'error');
      return;
    }

    const fase = getFaseByKelas(formData.kelas);

    if (editingId) {
      const updated = tugasList.map((t) =>
        t.id === editingId
          ? {
              ...t,
              ...formData,
              fase,
            }
          : t
      );
      onSaveTugas(updated);
      showToast('Tugas berhasil diperbarui!', 'success');
    } else {
      const newTugas: Tugas = {
        id: `tgs-${Date.now()}`,
        ...formData,
        fase,
        tanggalDibuat: new Date().toISOString().split('T')[0],
      };
      onSaveTugas([newTugas, ...tugasList]);
      showToast('Tugas baru berhasil diterbitkan!', 'success');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Hapus tugas "${judul}"? Semua data pengumpulan terkait juga akan dihapus.`)) {
      onSaveTugas(tugasList.filter((t) => t.id !== id));
      onSavePengumpulan(pengumpulanList.filter((p) => p.tugasId !== id));
      showToast('Tugas berhasil dihapus.', 'info');
    }
  };

  const handleOpenGrading = (sub: PengumpulanTugas) => {
    setGradingSubmission(sub);
    setGradeInput(sub.nilai ?? 90);
    setFeedbackInput(sub.catatanGuru ?? 'Bagus sekali, terus tingkatkan belajarnya!');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = pengumpulanList.map((p) =>
      p.id === gradingSubmission.id
        ? {
            ...p,
            nilai: Number(gradeInput),
            catatanGuru: feedbackInput,
            status: 'Sudah Dinilai' as const,
          }
        : p
    );

    onSavePengumpulan(updated);
    showToast('Nilai dan catatan guru berhasil disimpan!', 'success');
    setGradingSubmission(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-700" />
            <span>Manajemen Tugas & Asesmen Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilihan ganda, isian, uraian, proyek, praktik ibadah, dan portofolio dengan penilaian guru interaktif
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Tugas Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul tugas, materi terkait, instruksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Mapel */}
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

          {/* Kelas */}
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

          {/* Jenis */}
          <select
            value={selectedJenisFilter}
            onChange={(e) => setSelectedJenisFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Jenis Tugas</option>
            <option value="Pilihan Ganda">Pilihan Ganda</option>
            <option value="Isian">Isian Singkat</option>
            <option value="Uraian">Uraian / Esai</option>
            <option value="Proyek">Proyek</option>
            <option value="Praktik">Praktik</option>
            <option value="Portofolio">Portofolio</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTugas.length === 0 ? (
          <div className="md:col-span-2 p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Tidak ada tugas yang sesuai kriteria pencarian.
          </div>
        ) : (
          filteredTugas.map((tugas) => {
            const submissions = pengumpulanList.filter((p) => p.tugasId === tugas.id);
            const gradedCount = submissions.filter((p) => p.status === 'Sudah Dinilai').length;
            const copasText = formatTugasCopas(tugas, settings);

            return (
              <div
                key={tugas.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
                        {tugas.mapel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        Kelas {tugas.kelas} ({tugas.fase})
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                        {tugas.jenis}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Deadline: {new Date(tugas.batasWaktu).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {tugas.judul}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Terkait: {tugas.materiTerkait} • Bobot: {tugas.bobotNilai} Poin
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {tugas.instruksi}
                  </div>

                  {/* Submission Statistics Bar */}
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs">
                    <span className="font-semibold text-emerald-900">
                      Pengumpulan: {submissions.length} Siswa
                    </span>
                    <span className="text-emerald-700 font-bold">
                      {gradedCount} / {submissions.length} Telah Dinilai
                    </span>
                  </div>
                </div>

                {/* Footer with Mandatory COPAS and Submissions viewer */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* WAJIB TOMBOL COPAS */}
                    <CopasButton
                      textToCopy={copasText}
                      label="COPAS Tugas"
                      size="sm"
                      variant="primary"
                      filename={`tugas-${tugas.judul.toLowerCase().replace(/\s+/g, '-')}.txt`}
                      title={`Tugas: ${tugas.judul}`}
                    />

                    <button
                      onClick={() => setSelectedTugasForSubmissions(tugas)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lihat Pengumpulan ({submissions.length})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(tugas)}
                      className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Tugas"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tugas.id, tugas.judul)}
                      className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      title="Hapus Tugas"
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

      {/* Add / Edit Tugas Modal */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingId ? 'Edit Tugas Asesmen' : 'Buat Tugas Baru'}
          subtitle={`MIN 1 Paser • Dikelola oleh ${settings.namaGuru}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveForm} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Tugas *
              </label>
              <input
                type="text"
                required
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Praktik Hafalan Doa Qunut & Rukun Salat Subuh"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran *
                </label>
                <select
                  value={formData.mapel}
                  onChange={(e) =>
                    setFormData({ ...formData, mapel: e.target.value as MataPelajaran })
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
                  value={formData.kelas}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
                  Jenis Tugas *
                </label>
                <select
                  value={formData.jenis}
                  onChange={(e) =>
                    setFormData({ ...formData, jenis: e.target.value as JenisTugas })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="Pilihan Ganda">Pilihan Ganda</option>
                  <option value="Isian">Isian Singkat</option>
                  <option value="Uraian">Uraian / Esai</option>
                  <option value="Proyek">Proyek Mandiri / Kelompok</option>
                  <option value="Praktik">Praktik Ibadah / Keterampilan</option>
                  <option value="Portofolio">Portofolio Karya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materi Terkait
                </label>
                <input
                  type="text"
                  value={formData.materiTerkait}
                  onChange={(e) => setFormData({ ...formData, materiTerkait: e.target.value })}
                  placeholder="Contoh: Bab 2: Salat Berjamaah"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Batas Waktu (Deadline) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.batasWaktu}
                  onChange={(e) => setFormData({ ...formData, batasWaktu: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instruksi Lengkap Pengerjaan Tugas *
              </label>
              <textarea
                required
                rows={5}
                value={formData.instruksi}
                onChange={(e) => setFormData({ ...formData, instruksi: e.target.value })}
                placeholder="Tuliskan petunjuk pengerjaan langkah demi langkah..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                {editingId ? 'Simpan Perubahan' : 'Terbitkan Tugas'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Submissions Viewer Modal */}
      {selectedTugasForSubmissions && (
        <Modal
          isOpen={!!selectedTugasForSubmissions}
          onClose={() => setSelectedTugasForSubmissions(null)}
          title={`Pengumpulan Tugas: ${selectedTugasForSubmissions.judul}`}
          subtitle={`Kelas ${selectedTugasForSubmissions.kelas} • Bobot: ${selectedTugasForSubmissions.bobotNilai} Poin`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {(() => {
              const subs = pengumpulanList.filter(
                (p) => p.tugasId === selectedTugasForSubmissions.id
              );
              if (subs.length === 0) {
                return (
                  <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs">
                    Belum ada siswa yang mengumpulkan tugas ini.
                  </div>
                );
              }
              return (
                <div className="space-y-3">
                  {subs.map((s) => {
                    const siswa = siswaList.find((x) => x.id === s.siswaId);
                    return (
                      <div
                        key={s.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                              {siswa?.nama.charAt(0) || 'S'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                                {siswa?.nama} (Absen #{siswa?.noAbsen})
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Dikumpulkan: {new Date(s.tanggalKumpul).toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {s.status === 'Sudah Dinilai' ? (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                                Nilai: {s.nilai}
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
                                Belum Dinilai
                              </span>
                            )}

                            <button
                              onClick={() => handleOpenGrading(s)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                            >
                              {s.status === 'Sudah Dinilai' ? 'Ubah Nilai' : 'Beri Nilai'}
                            </button>
                          </div>
                        </div>

                        {/* Jawaban Siswa */}
                        <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 whitespace-pre-line border border-slate-100">
                          <span className="font-bold text-slate-900 block mb-1">
                            Jawaban Siswa:
                          </span>
                          {s.isiJawaban}
                        </div>

                        {s.linkTugas && (
                          <div className="text-xs">
                            <span className="font-semibold text-slate-600">Lampiran: </span>
                            <a
                              href={s.linkTugas}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 font-semibold underline inline-flex items-center gap-1"
                            >
                              Buka Dokumen / Link Siswa <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {s.catatanGuru && (
                          <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-800 border border-emerald-200/60 italic">
                            <span className="font-bold not-italic">Catatan Guru: </span>
                            "{s.catatanGuru}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTugasForSubmissions(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Grading Form Modal */}
      {gradingSubmission && (
        <Modal
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          title="Penilaian & Umpan Balik Guru"
          subtitle={`Peserta Didik: ${
            siswaList.find((s) => s.id === gradingSubmission.siswaId)?.nama
          }`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nilai Tugas (Skala 0 - 100) *
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={gradeInput}
                onChange={(e) => setGradeInput(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-bold text-emerald-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Guru / Umpan Balik Motivatif *
              </label>
              <textarea
                required
                rows={4}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Berikan apresiasi dan saran perbaikan..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Simpan Penilaian
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
