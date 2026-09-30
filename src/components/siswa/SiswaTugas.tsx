import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  Tugas,
  PengumpulanTugas,
  PesertaDidik,
  MadrasahSettings,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { formatTugasCopas } from '../../utils/copas';

interface SiswaTugasProps {
  settings: MadrasahSettings;
  siswa: PesertaDidik;
  tugasList: Tugas[];
  pengumpulanList: PengumpulanTugas[];
  onSavePengumpulan: (list: PengumpulanTugas[]) => void;
}

export const SiswaTugas: React.FC<SiswaTugasProps> = ({
  settings,
  siswa,
  tugasList,
  pengumpulanList,
  onSavePengumpulan,
}) => {
  const { showToast } = useToast();

  const [activeTabFilter, setActiveTabFilter] = useState<'semua' | 'belum' | 'selesai'>('semua');
  const [submittingTugas, setSubmittingTugas] = useState<Tugas | null>(null);
  const [jawabanInput, setJawabanInput] = useState('');
  const [linkInput, setLinkInput] = useState('');

  // Tasks for student's class
  const classTugas = tugasList.filter((t) => t.kelas === siswa.kelas);

  const filteredTugas = classTugas.filter((t) => {
    const isSubmitted = pengumpulanList.some(
      (p) => p.tugasId === t.id && p.siswaId === siswa.id
    );
    if (activeTabFilter === 'belum') return !isSubmitted;
    if (activeTabFilter === 'selesai') return isSubmitted;
    return true;
  });

  const handleOpenSubmit = (tugas: Tugas) => {
    const existing = pengumpulanList.find(
      (p) => p.tugasId === tugas.id && p.siswaId === siswa.id
    );
    setSubmittingTugas(tugas);
    setJawabanInput(existing ? existing.isiJawaban : '');
    setLinkInput(existing ? existing.linkTugas || '' : '');
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTugas) return;
    if (!jawabanInput.trim()) {
      showToast('Isi jawaban tidak boleh kosong!', 'error');
      return;
    }

    const existingIndex = pengumpulanList.findIndex(
      (p) => p.tugasId === submittingTugas.id && p.siswaId === siswa.id
    );

    let updatedList: PengumpulanTugas[];
    if (existingIndex >= 0) {
      updatedList = [...pengumpulanList];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        isiJawaban: jawabanInput,
        linkTugas: linkInput,
        tanggalKumpul: new Date().toISOString(),
      };
      showToast('Tugasmu berhasil diperbarui!', 'success');
    } else {
      const newSub: PengumpulanTugas = {
        id: `sub-${Date.now()}`,
        tugasId: submittingTugas.id,
        siswaId: siswa.id,
        tanggalKumpul: new Date().toISOString(),
        isiJawaban: jawabanInput,
        linkTugas: linkInput,
        status: 'Belum Dinilai',
      };
      updatedList = [newSub, ...pengumpulanList];
      showToast('Alhamdulillah! Tugas berhasil dikumpulkan ke guru.', 'success');
    }

    onSavePengumpulan(updatedList);
    setSubmittingTugas(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-700" />
          <span>Tugas & Pengumpulan Lembar Kerja Siswa</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kumpulkan tugas mandiri atau kelompok dan periksa nilai serta umpan balik dari guru
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTabFilter('semua')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTabFilter === 'semua'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua Tugas ({classTugas.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('belum')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTabFilter === 'belum'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Belum Dikumpulkan
        </button>
        <button
          onClick={() => setActiveTabFilter('selesai')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTabFilter === 'selesai'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Sudah Dikumpulkan
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTugas.length === 0 ? (
          <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Tidak ada tugas pada kategori ini.
          </div>
        ) : (
          filteredTugas.map((tugas) => {
            const submission = pengumpulanList.find(
              (p) => p.tugasId === tugas.id && p.siswaId === siswa.id
            );
            const copasText = formatTugasCopas(tugas, settings);

            return (
              <div
                key={tugas.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
                      {tugas.mapel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                      {tugas.jenis}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Batas Waktu: {new Date(tugas.batasWaktu).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{tugas.judul}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Materi Terkait: {tugas.materiTerkait} • Bobot: {tugas.bobotNilai} Poin
                  </div>
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    <span className="font-bold text-slate-900 block mb-1">Instruksi:</span>
                    {tugas.instruksi}
                  </div>
                </div>

                {/* Submission Status or Grade Box */}
                {submission && (
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Status: {submission.status}
                      </span>
                      {submission.status === 'Sudah Dinilai' && (
                        <span className="text-base font-black text-emerald-800 bg-white px-3 py-1 rounded-lg border border-emerald-300">
                          Nilai: {submission.nilai} / 100
                        </span>
                      )}
                    </div>

                    <div className="text-emerald-900">
                      <span className="font-semibold">Jawabanmu: </span>
                      <span className="italic">"{submission.isiJawaban}"</span>
                    </div>

                    {submission.catatanGuru && (
                      <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-emerald-800 italic">
                        <span className="font-bold not-italic">Catatan Ustadz Dzakirul Husni: </span>
                        "{submission.catatanGuru}"
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <CopasButton
                    textToCopy={copasText}
                    label="COPAS Soal Tugas"
                    size="sm"
                    variant="outline"
                  />

                  <button
                    onClick={() => handleOpenSubmit(tugas)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submission ? 'Edit / Kirim Ulang Tugas' : 'Kumpulkan Jawaban'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      {submittingTugas && (
        <Modal
          isOpen={!!submittingTugas}
          onClose={() => setSubmittingTugas(null)}
          title={`Kumpulkan Tugas: ${submittingTugas.judul}`}
          subtitle={`Kelas ${submittingTugas.kelas} • ${submittingTugas.mapel}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveSubmission} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tuliskan Jawaban / Rangkuman Tugasmu *
              </label>
              <textarea
                required
                rows={6}
                value={jawabanInput}
                onChange={(e) => setJawabanInput(e.target.value)}
                placeholder="Ketik jawaban soal, laporan proyek, atau refleksi belajar di sini..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Link Lampiran / Google Drive / Foto Karya (Opsional)
              </label>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubmittingTugas(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirimkan ke Guru</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
