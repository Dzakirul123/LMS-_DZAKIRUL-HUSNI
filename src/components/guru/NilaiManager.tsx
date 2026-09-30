import React, { useState } from 'react';
import {
  Award,
  Save,
  Search,
  Filter,
  Sliders,
  Printer,
  Download,
  FileSpreadsheet,
  Edit2,
  TrendingUp,
  Percent,
} from 'lucide-react';
import {
  NilaiSiswa,
  PesertaDidik,
  MataPelajaran,
  KelasNumber,
  DAFTAR_MAPEL,
  MadrasahSettings,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { formatNilaiCopas, downloadTextFile, printContent } from '../../utils/copas';

interface NilaiManagerProps {
  settings: MadrasahSettings;
  onUpdateSettings: (settings: MadrasahSettings) => void;
  siswaList: PesertaDidik[];
  nilaiList: NilaiSiswa[];
  onSaveNilai: (list: NilaiSiswa[]) => void;
}

export const NilaiManager: React.FC<NilaiManagerProps> = ({
  settings,
  onUpdateSettings,
  siswaList,
  nilaiList,
  onSaveNilai,
}) => {
  const { showToast } = useToast();

  const [selectedKelas, setSelectedKelas] = useState<KelasNumber>(6);
  const [selectedMapel, setSelectedMapel] = useState<MataPelajaran>('Fikih');

  // Weights modal state
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [weights, setWeights] = useState({ ...settings.bobotNilai });

  // Single Student Grade Edit Modal
  const [editingSiswa, setEditingSiswa] = useState<PesertaDidik | null>(null);
  const [editGradeValues, setEditGradeValues] = useState<{
    tugas: number;
    kuis: number;
    praktik: number;
    proyek: number;
    ujian: number;
    catatan: string;
  }>({
    tugas: 85,
    kuis: 85,
    praktik: 85,
    proyek: 85,
    ujian: 85,
    catatan: '',
  });

  const classStudents = siswaList
    .filter((s) => s.kelas === selectedKelas)
    .sort((a, b) => a.noAbsen - b.noAbsen);

  // Helper to calculate score and predicate
  const calculateFinalScore = (n: {
    tugas: number;
    kuis: number;
    praktik: number;
    proyek: number;
    ujian: number;
  }) => {
    const b = settings.bobotNilai;
    const totalBobot = b.tugas + b.kuis + b.praktik + b.proyek + b.ujian || 100;
    const finalScore = Math.round(
      (n.tugas * b.tugas +
        n.kuis * b.kuis +
        n.praktik * b.praktik +
        n.proyek * b.proyek +
        n.ujian * b.ujian) /
        totalBobot
    );

    let predikat = 'D';
    if (finalScore >= 90) predikat = 'A';
    else if (finalScore >= 80) predikat = 'B';
    else if (finalScore >= 70) predikat = 'C';

    return { finalScore, predikat };
  };

  const getSiswaGrade = (siswaId: string) => {
    const found = nilaiList.find(
      (n) =>
        n.siswaId === siswaId &&
        n.mapel === selectedMapel &&
        n.semester === settings.semester &&
        n.tahunAjaran === settings.tahunAjaran
    );

    if (found) {
      return {
        tugas: found.nilaiTugas,
        kuis: found.nilaiKuis,
        praktik: found.nilaiPraktik,
        proyek: found.nilaiProyek,
        ujian: found.nilaiUjian,
        catatan: found.catatanGuru || '',
      };
    }

    // Default placeholder
    return {
      tugas: 80,
      kuis: 80,
      praktik: 80,
      proyek: 80,
      ujian: 80,
      catatan: '',
    };
  };

  const handleOpenEditGrade = (siswa: PesertaDidik) => {
    setEditingSiswa(siswa);
    const existing = getSiswaGrade(siswa.id);
    setEditGradeValues(existing);
  };

  const handleSaveGradeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSiswa) return;

    const existingIndex = nilaiList.findIndex(
      (n) =>
        n.siswaId === editingSiswa.id &&
        n.mapel === selectedMapel &&
        n.semester === settings.semester &&
        n.tahunAjaran === settings.tahunAjaran
    );

    let updatedList: NilaiSiswa[];
    if (existingIndex >= 0) {
      updatedList = [...nilaiList];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        nilaiTugas: Number(editGradeValues.tugas),
        nilaiKuis: Number(editGradeValues.kuis),
        nilaiPraktik: Number(editGradeValues.praktik),
        nilaiProyek: Number(editGradeValues.proyek),
        nilaiUjian: Number(editGradeValues.ujian),
        catatanGuru: editGradeValues.catatan,
      };
    } else {
      const newGrade: NilaiSiswa = {
        id: `nil-${Date.now()}-${editingSiswa.id}`,
        siswaId: editingSiswa.id,
        mapel: selectedMapel,
        semester: settings.semester,
        tahunAjaran: settings.tahunAjaran,
        nilaiTugas: Number(editGradeValues.tugas),
        nilaiKuis: Number(editGradeValues.kuis),
        nilaiPraktik: Number(editGradeValues.praktik),
        nilaiProyek: Number(editGradeValues.proyek),
        nilaiUjian: Number(editGradeValues.ujian),
        catatanGuru: editGradeValues.catatan,
      };
      updatedList = [...nilaiList, newGrade];
    }

    onSaveNilai(updatedList);
    showToast(`Nilai ${editingSiswa.nama} berhasil disimpan!`, 'success');
    setEditingSiswa(null);
  };

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const sum =
      Number(weights.tugas) +
      Number(weights.kuis) +
      Number(weights.praktik) +
      Number(weights.proyek) +
      Number(weights.ujian);

    if (sum !== 100) {
      showToast(`Total bobot harus tepat 100%! Saat ini: ${sum}%`, 'error');
      return;
    }

    onUpdateSettings({ ...settings, bobotNilai: weights });
    showToast('Pengaturan bobot nilai berhasil diperbarui!', 'success');
    setIsWeightModalOpen(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csv = `No,Nama Siswa,NISN,Mapel,Tugas,Kuis,Praktik,Proyek,Ujian,Nilai Akhir,Predikat\n`;
    classStudents.forEach((s) => {
      const g = getSiswaGrade(s.id);
      const { finalScore, predikat } = calculateFinalScore(g);
      csv += `"${s.noAbsen}","${s.nama}","${s.nisn}","${selectedMapel}","${g.tugas}","${g.kuis}","${g.praktik}","${g.proyek}","${g.ujian}","${finalScore}","${predikat}"\n`;
    });
    downloadTextFile(`buku-nilai-${selectedMapel}-kelas${selectedKelas}.csv`, csv, 'text/csv');
    showToast('Rekap nilai diekspor ke CSV.', 'info');
  };

  // COPAS text
  const currentNilaiListForCopas: NilaiSiswa[] = classStudents.map((s) => {
    const g = getSiswaGrade(s.id);
    return {
      id: s.id,
      siswaId: s.id,
      mapel: selectedMapel,
      semester: settings.semester,
      tahunAjaran: settings.tahunAjaran,
      nilaiTugas: g.tugas,
      nilaiKuis: g.kuis,
      nilaiPraktik: g.praktik,
      nilaiProyek: g.proyek,
      nilaiUjian: g.ujian,
      catatanGuru: g.catatan,
    };
  });

  const copasText = formatNilaiCopas(
    selectedKelas,
    selectedMapel,
    classStudents,
    currentNilaiListForCopas,
    settings
  );

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <span>Buku Nilai & Rapor Formatif/Sumatif</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perhitungan rata-rata otomatis dengan bobot dinamis (Tugas, Kuis, Praktik, Proyek, Ujian)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WAJIB TOMBOL COPAS */}
          <CopasButton
            textToCopy={copasText}
            label="COPAS Rekap Nilai"
            size="md"
            variant="primary"
            filename={`nilai-${selectedMapel}-kelas${selectedKelas}.txt`}
            title={`Rekap Nilai ${selectedMapel} Kelas ${selectedKelas}`}
          />

          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Atur Bobot Nilai</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
            title="Ekspor ke Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Class & Subject Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Kelas */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-500 mr-1">Kelas:</span>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKelas(k as KelasNumber)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedKelas === k
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Kelas {k}
              </button>
            ))}
          </div>

          {/* Mapel */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Mapel:</span>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value as MataPelajaran)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              {DAFTAR_MAPEL.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Active Weights Indicator */}
        <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Bobot: Tgs ({settings.bobotNilai.tugas}%) • Kuis ({settings.bobotNilai.kuis}%) • Prk (
          {settings.bobotNilai.praktik}%) • Pry ({settings.bobotNilai.proyek}%) • Ujn (
          {settings.bobotNilai.ujian}%)
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {classStudents.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            Belum ada siswa di Kelas {selectedKelas}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Absen</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-3 text-center">Tugas ({settings.bobotNilai.tugas}%)</th>
                  <th className="py-3 px-3 text-center">Kuis ({settings.bobotNilai.kuis}%)</th>
                  <th className="py-3 px-3 text-center">Praktik ({settings.bobotNilai.praktik}%)</th>
                  <th className="py-3 px-3 text-center">Proyek ({settings.bobotNilai.proyek}%)</th>
                  <th className="py-3 px-3 text-center">Ujian ({settings.bobotNilai.ujian}%)</th>
                  <th className="py-3 px-3 text-center font-black text-emerald-900 bg-emerald-50">
                    Nilai Akhir
                  </th>
                  <th className="py-3 px-3 text-center font-black text-emerald-900 bg-emerald-50">
                    Predikat
                  </th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((siswa) => {
                  const grade = getSiswaGrade(siswa.id);
                  const { finalScore, predikat } = calculateFinalScore(grade);

                  return (
                    <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-600">#{siswa.noAbsen}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{siswa.nama}</div>
                        <div className="text-[11px] text-slate-400">NISN: {siswa.nisn}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                        {grade.tugas}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                        {grade.kuis}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                        {grade.praktik}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                        {grade.proyek}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                        {grade.ujian}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-base text-emerald-800 bg-emerald-50/50">
                        {finalScore}
                      </td>
                      <td className="py-3 px-3 text-center bg-emerald-50/50">
                        <span
                          className={`font-black text-xs px-2.5 py-0.5 rounded-full ${
                            predikat === 'A'
                              ? 'bg-emerald-200 text-emerald-900'
                              : predikat === 'B'
                              ? 'bg-teal-100 text-teal-900'
                              : predikat === 'C'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {predikat}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleOpenEditGrade(siswa)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Input</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Single Student Grade Input Modal */}
      {editingSiswa && (
        <Modal
          isOpen={!!editingSiswa}
          onClose={() => setEditingSiswa(null)}
          title={`Input Nilai Siswa: ${editingSiswa.nama}`}
          subtitle={`Mapel: ${selectedMapel} • Kelas ${selectedKelas} • TP ${settings.tahunAjaran}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveGradeForm} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nilai Tugas (Bobot {settings.bobotNilai.tugas}%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={editGradeValues.tugas}
                  onChange={(e) =>
                    setEditGradeValues({
                      ...editGradeValues,
                      tugas: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nilai Kuis (Bobot {settings.bobotNilai.kuis}%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={editGradeValues.kuis}
                  onChange={(e) =>
                    setEditGradeValues({
                      ...editGradeValues,
                      kuis: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Praktik (Bobot {settings.bobotNilai.praktik}%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={editGradeValues.praktik}
                  onChange={(e) =>
                    setEditGradeValues({
                      ...editGradeValues,
                      praktik: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proyek (Bobot {settings.bobotNilai.proyek}%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={editGradeValues.proyek}
                  onChange={(e) =>
                    setEditGradeValues({
                      ...editGradeValues,
                      proyek: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ujian / SAS / PAT (Bobot {settings.bobotNilai.ujian}%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={editGradeValues.ujian}
                onChange={(e) =>
                  setEditGradeValues({
                    ...editGradeValues,
                    ujian: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Guru / Deskripsi Capaian
              </label>
              <textarea
                rows={2}
                value={editGradeValues.catatan}
                onChange={(e) =>
                  setEditGradeValues({ ...editGradeValues, catatan: e.target.value })
                }
                placeholder="Contoh: Menunjukkan penguasaan sangat baik dalam rukun salat..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSiswa(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
              >
                Simpan Nilai
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Weights Config Modal */}
      {isWeightModalOpen && (
        <Modal
          isOpen={isWeightModalOpen}
          onClose={() => setIsWeightModalOpen(false)}
          title="Atur Bobot Penilaian"
          subtitle="Tentukan persentase kontribusi masing-masing komponen penilaian (Total = 100%)"
          maxWidth="sm"
        >
          <form onSubmit={handleSaveWeights} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bobot Nilai Tugas (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={weights.tugas}
                onChange={(e) =>
                  setWeights({ ...weights, tugas: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bobot Nilai Kuis (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={weights.kuis}
                onChange={(e) =>
                  setWeights({ ...weights, kuis: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bobot Nilai Praktik (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={weights.praktik}
                onChange={(e) =>
                  setWeights({ ...weights, praktik: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bobot Nilai Proyek (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={weights.proyek}
                onChange={(e) =>
                  setWeights({ ...weights, proyek: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bobot Nilai Ujian (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={weights.ujian}
                onChange={(e) =>
                  setWeights({ ...weights, ujian: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="p-2.5 bg-slate-100 rounded-lg text-xs font-bold flex justify-between">
              <span>Total Persentase:</span>
              <span
                className={
                  Number(weights.tugas) +
                    Number(weights.kuis) +
                    Number(weights.praktik) +
                    Number(weights.proyek) +
                    Number(weights.ujian) ===
                  100
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }
              >
                {Number(weights.tugas) +
                  Number(weights.kuis) +
                  Number(weights.praktik) +
                  Number(weights.proyek) +
                  Number(weights.ujian)}
                % / 100%
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsWeightModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
              >
                Terapkan Bobot
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
