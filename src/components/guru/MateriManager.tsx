import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Video,
  Image as ImageIcon,
  FileText,
  Copy,
  Printer,
  Download,
  FolderTree,
  Eye,
} from 'lucide-react';
import {
  MateriPembelajaran,
  MataPelajaran,
  KelasNumber,
  DAFTAR_MAPEL,
  getFaseByKelas,
  MadrasahSettings,
  Tugas,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { formatMateriCopas, printContent } from '../../utils/copas';

interface MateriManagerProps {
  settings: MadrasahSettings;
  materiList: MateriPembelajaran[];
  onSaveMateri: (list: MateriPembelajaran[]) => void;
  tugasList: Tugas[];
}

export const MateriManager: React.FC<MateriManagerProps> = ({
  settings,
  materiList,
  onSaveMateri,
  tugasList,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapelFilter, setSelectedMapelFilter] = useState<string>('all');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('all');
  const [selectedBabFilter, setSelectedBabFilter] = useState<string>('all');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    judul: string;
    mapel: MataPelajaran;
    kelas: KelasNumber;
    babTopik: string;
    tujuanPembelajaran: string;
    materi: string;
    instruksi: string;
    linkReferensi: string;
    videoUrl: string;
    gambarUrl: string;
    lampiranNama: string;
  }>({
    judul: '',
    mapel: 'Fikih',
    kelas: 6,
    babTopik: 'Bab 1',
    tujuanPembelajaran: '',
    materi: '',
    instruksi: '',
    linkReferensi: '',
    videoUrl: '',
    gambarUrl: '',
    lampiranNama: '',
  });

  // Preview Modal
  const [previewMateri, setPreviewMateri] = useState<MateriPembelajaran | null>(null);

  // Unique Bab / Topics for filter
  const babList = Array.from(new Set(materiList.map((m) => m.babTopik))).filter(Boolean);

  // Filtered List
  const filteredMateri = materiList.filter((m) => {
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.babTopik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.materi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchMapel = selectedMapelFilter === 'all' || m.mapel === selectedMapelFilter;
    const matchKelas = selectedKelasFilter === 'all' || m.kelas.toString() === selectedKelasFilter;
    const matchBab = selectedBabFilter === 'all' || m.babTopik === selectedBabFilter;

    return matchSearch && matchMapel && matchKelas && matchBab;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      mapel: 'Fikih',
      kelas: 4,
      babTopik: 'Bab 1: Fikih Ibadah',
      tujuanPembelajaran: 'Peserta didik memahami konsep pokok bahasan dengan baik.',
      materi: '',
      instruksi: '1. Pelajari rangkuman materi di atas.\n2. Buatlah catatan penting di buku tulis madrasah.',
      linkReferensi: '',
      videoUrl: '',
      gambarUrl: '',
      lampiranNama: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m: MateriPembelajaran) => {
    setEditingId(m.id);
    setFormData({
      judul: m.judul,
      mapel: m.mapel,
      kelas: m.kelas,
      babTopik: m.babTopik,
      tujuanPembelajaran: m.tujuanPembelajaran,
      materi: m.materi,
      instruksi: m.instruksi,
      linkReferensi: m.linkReferensi || '',
      videoUrl: m.videoUrl || '',
      gambarUrl: m.gambarUrl || '',
      lampiranNama: m.lampiranNama || '',
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.materi.trim()) {
      showToast('Judul dan isi materi wajib diisi!', 'error');
      return;
    }

    const fase = getFaseByKelas(formData.kelas);

    if (editingId) {
      const updated = materiList.map((m) =>
        m.id === editingId
          ? {
              ...m,
              ...formData,
              fase,
            }
          : m
      );
      onSaveMateri(updated);
      showToast('Materi pembelajaran berhasil diperbarui!', 'success');
    } else {
      const newMateri: MateriPembelajaran = {
        id: `mat-${Date.now()}`,
        ...formData,
        fase,
        tanggalDibuat: new Date().toISOString().split('T')[0],
      };
      onSaveMateri([newMateri, ...materiList]);
      showToast('Materi baru berhasil ditambahkan!', 'success');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Hapus materi "${judul}"?`)) {
      onSaveMateri(materiList.filter((m) => m.id !== id));
      showToast('Materi berhasil dihapus.', 'info');
      if (previewMateri?.id === id) setPreviewMateri(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span>Materi Pembelajaran Kurikulum Merdeka</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar bahan ajar Mapel Umum & Agama Islam MI (Fase A, B, C) dengan tombol COPAS siap WhatsApp
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Materi Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi, bab, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filter Mapel */}
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

          {/* Filter Kelas */}
          <select
            value={selectedKelasFilter}
            onChange={(e) => setSelectedKelasFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Kelas</option>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <option key={k} value={k}>
                Kelas {k} ({getFaseByKelas(k as KelasNumber)})
              </option>
            ))}
          </select>

          {/* Filter Bab */}
          {babList.length > 0 && (
            <select
              value={selectedBabFilter}
              onChange={(e) => setSelectedBabFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden max-w-[160px] truncate"
            >
              <option value="all">Semua Bab/Topik</option>
              {babList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Materi Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMateri.length === 0 ? (
          <div className="md:col-span-2 p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Belum ada materi yang sesuai dengan pencarian.
          </div>
        ) : (
          filteredMateri.map((materi) => {
            // Find linked assignment if any
            const linkedTugas = tugasList.find((t) => t.materiTerkait.includes(materi.judul) || t.mapel === materi.mapel);
            const copasText = formatMateriCopas(materi, settings, linkedTugas);

            return (
              <div
                key={materi.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {materi.mapel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        Kelas {materi.kelas} ({materi.fase})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(materi.tanggalDibuat).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  {/* Bab & Title */}
                  <div>
                    <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>{materi.babTopik}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug group-hover:text-emerald-800 transition-colors">
                      {materi.judul}
                    </h3>
                  </div>

                  {/* Tujuan Pembelajaran */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-800">🎯 TP: </span>
                    <span className="line-clamp-2">{materi.tujuanPembelajaran}</span>
                  </div>

                  {/* Ringkasan Isi Materi */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {materi.materi}
                  </p>

                  {/* Media Indicator */}
                  {(materi.videoUrl || materi.linkReferensi) && (
                    <div className="flex items-center gap-3 text-[11px] text-emerald-700 font-semibold pt-1">
                      {materi.videoUrl && (
                        <span className="flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 text-rose-500" /> Ada Video
                        </span>
                      )}
                      {materi.linkReferensi && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5 text-blue-500" /> Sumber Belajar
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer with Mandatory COPAS Button & Management */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {/* WAJIB TOMBOL COPAS */}
                  <CopasButton
                    textToCopy={copasText}
                    label="COPAS Materi"
                    size="sm"
                    variant="primary"
                    filename={`materi-${materi.judul.toLowerCase().replace(/\s+/g, '-')}.txt`}
                    title={`Materi: ${materi.judul}`}
                  />

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewMateri(materi)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                      title="Lihat Materi Lengkap"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(materi)}
                      className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Materi"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(materi.id, materi.judul)}
                      className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      title="Hapus Materi"
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

      {/* Add / Edit Materi Modal */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingId ? 'Edit Materi Pembelajaran' : 'Buat Materi Baru'}
          subtitle={`MIN 1 Paser • Dikelola oleh ${settings.namaGuru}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      {m.name} ({m.kategori})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kelas & Fase *
                </label>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bab / Topik Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={formData.babTopik}
                  onChange={(e) => setFormData({ ...formData, babTopik: e.target.value })}
                  placeholder="Contoh: Bab 2: Salat Berjamaah"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Materi Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Tata Cara dan Posisi Saf Salat Berjamaah"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tujuan Pembelajaran (TP) *
              </label>
              <textarea
                required
                rows={2}
                value={formData.tujuanPembelajaran}
                onChange={(e) =>
                  setFormData({ ...formData, tujuanPembelajaran: e.target.value })
                }
                placeholder="Tuliskan capaian dan tujuan yang harus dikuasai peserta didik..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Isi Materi Lengkap *
              </label>
              <textarea
                required
                rows={6}
                value={formData.materi}
                onChange={(e) => setFormData({ ...formData, materi: e.target.value })}
                placeholder="Tuliskan materi penjelasan, ayat Al-Qur'an, dalil hadits, poin-poin penting..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instruksi Siswa / Aktivitas Belajar *
              </label>
              <textarea
                required
                rows={2}
                value={formData.instruksi}
                onChange={(e) => setFormData({ ...formData, instruksi: e.target.value })}
                placeholder="Langkah yang harus dilakukan siswa setelah membaca materi..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Video Belajar (YouTube)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Referensi / Sumber Bacaan
                </label>
                <input
                  type="url"
                  value={formData.linkReferensi}
                  onChange={(e) => setFormData({ ...formData, linkReferensi: e.target.value })}
                  placeholder="https://kemenag.go.id/..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
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
                {editingId ? 'Simpan Perubahan' : 'Terbitkan Materi'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Full Preview Modal with Direct COPAS and Print */}
      {previewMateri && (
        <Modal
          isOpen={!!previewMateri}
          onClose={() => setPreviewMateri(null)}
          title={previewMateri.judul}
          subtitle={`${previewMateri.mapel} • Kelas ${previewMateri.kelas} (${previewMateri.fase}) • ${previewMateri.babTopik}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="text-xs font-bold text-emerald-900">🎯 TUJUAN PEMBELAJARAN:</div>
              <p className="text-xs text-emerald-800 mt-1">{previewMateri.tujuanPembelajaran}</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                📖 Rangkuman Materi:
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line p-4 bg-slate-50 rounded-xl border border-slate-200">
                {previewMateri.materi}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-xs font-bold text-amber-900">📝 INSTRUKSI SISWA:</div>
              <p className="text-xs text-amber-800 mt-1 whitespace-pre-line">
                {previewMateri.instruksi}
              </p>
            </div>

            {previewMateri.videoUrl && (
              <div className="text-xs">
                <span className="font-bold text-slate-700">Video Pendukung: </span>
                <a
                  href={previewMateri.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Buka Video Pembelajaran <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <CopasButton
                textToCopy={formatMateriCopas(previewMateri, settings)}
                label="COPAS Materi ke WA"
                size="md"
                variant="primary"
                filename={`materi-${previewMateri.judul}.txt`}
                title={`Materi: ${previewMateri.judul}`}
              />

              <button
                type="button"
                onClick={() => setPreviewMateri(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
