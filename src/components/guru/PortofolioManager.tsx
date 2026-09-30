import React, { useState } from 'react';
import {
  FolderKanban,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit2,
  Image as ImageIcon,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  PortofolioKarya,
  PesertaDidik,
  MataPelajaran,
  DAFTAR_MAPEL,
  MadrasahSettings,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';

interface PortofolioManagerProps {
  settings: MadrasahSettings;
  portofolioList: PortofolioKarya[];
  onSavePortofolio: (list: PortofolioKarya[]) => void;
  siswaList: PesertaDidik[];
}

export const PortofolioManager: React.FC<PortofolioManagerProps> = ({
  settings,
  portofolioList,
  onSavePortofolio,
  siswaList,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategoriFilter, setSelectedKategoriFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<{
    siswaId: string;
    judul: string;
    kategori: 'Karya' | 'Proyek' | 'Tugas' | 'Dokumentasi Praktik';
    mapel: MataPelajaran;
    deskripsi: string;
    mediaUrl: string;
    catatanGuru: string;
  }>({
    siswaId: siswaList[0]?.id || '',
    judul: '',
    kategori: 'Dokumentasi Praktik',
    mapel: 'Fikih',
    deskripsi: '',
    mediaUrl: '',
    catatanGuru: '',
  });

  const filteredPortofolio = portofolioList.filter((p) => {
    const siswa = siswaList.find((s) => s.id === p.siswaId);
    const matchSearch =
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      siswa?.nama.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKat =
      selectedKategoriFilter === 'all' || p.kategori === selectedKategoriFilter;

    return matchSearch && matchKat;
  });

  const handleOpenAdd = () => {
    setFormData({
      siswaId: siswaList[0]?.id || '',
      judul: '',
      kategori: 'Dokumentasi Praktik',
      mapel: 'Fikih',
      deskripsi: '',
      mediaUrl: '',
      catatanGuru: 'Karya sangat kreatif dan menunjukkan pemahaman materi yang mendalam.',
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.deskripsi.trim()) {
      showToast('Judul dan deskripsi karya wajib diisi!', 'error');
      return;
    }

    const newItem: PortofolioKarya = {
      id: `port-${Date.now()}`,
      ...formData,
      tanggal: new Date().toISOString().split('T')[0],
    };

    onSavePortofolio([newItem, ...portofolioList]);
    showToast('Portofolio karya peserta didik berhasil ditambahkan!', 'success');
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Hapus karya portofolio "${judul}"?`)) {
      onSavePortofolio(portofolioList.filter((p) => p.id !== id));
      showToast('Karya portofolio dihapus.', 'info');
    }
  };

  // COPAS text
  const copasText = `🎨 *GALERI PORTOFOLIO & KARYA SISWA ${settings.namaMadrasah.toUpperCase()}*
========================================
Tahun Ajaran: ${settings.tahunAjaran} (${settings.semester})

${filteredPortofolio
  .map((p, idx) => {
    const s = siswaList.find((x) => x.id === p.siswaId);
    return `${idx + 1}. *${p.judul}*
• Peserta Didik: ${s?.nama || 'Siswa'} (Kelas ${s?.kelas})
• Kategori: ${p.kategori} | Mapel: ${p.mapel}
• Deskripsi: ${p.deskripsi}
• Catatan Guru: "${p.catatanGuru || '-'}"
`;
  })
  .join('\n')}
_Dibina oleh: ${settings.namaGuru} - ${settings.namaMadrasah}_`;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-700" />
            <span>Portofolio & Dokumentasi Praktik Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Etalase karya seni, proyek sains, dokumentasi praktik ibadah, dan catatan apresiasi guru
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Portofolio</span>
          </button>

          <CopasButton
            textToCopy={copasText}
            label="COPAS Galeri Karya"
            size="md"
            variant="secondary"
            filename="portofolio-karya-min1paser.txt"
            title="Portofolio Siswa MIN 1 Paser"
          />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari karya, nama siswa, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        <select
          value={selectedKategoriFilter}
          onChange={(e) => setSelectedKategoriFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
        >
          <option value="all">Semua Kategori</option>
          <option value="Karya">Karya Seni / Kaligrafi</option>
          <option value="Proyek">Proyek Mandiri / Kelompok</option>
          <option value="Tugas">Tugas Terbaik</option>
          <option value="Dokumentasi Praktik">Dokumentasi Praktik Ibadah</option>
        </select>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortofolio.length === 0 ? (
          <div className="col-span-full p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Belum ada portofolio yang cocok.
          </div>
        ) : (
          filteredPortofolio.map((port) => {
            const siswa = siswaList.find((s) => s.id === port.siswaId);
            return (
              <div
                key={port.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image banner if present */}
                  {port.mediaUrl ? (
                    <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={port.mediaUrl}
                        alt={port.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                        {port.kategori}
                      </span>
                    </div>
                  ) : (
                    <div className="h-24 bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-between p-4">
                      <FolderKanban className="w-8 h-8 text-emerald-700" />
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-emerald-900 shadow-2xs">
                        {port.kategori}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-emerald-800">{port.mapel}</span>
                      <span>{new Date(port.tanggal).toLocaleDateString('id-ID')}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{port.judul}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="font-bold text-slate-800">{siswa?.nama}</span>
                      <span>• Kelas {siswa?.kelas}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {port.deskripsi}
                    </p>

                    {port.catatanGuru && (
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 italic">
                        <span className="font-bold not-italic">Catatan Guru: </span>
                        "{port.catatanGuru}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <CopasButton
                    textToCopy={`🎨 *KARYA SISWA MIN 1 PASER*\nJudul: ${port.judul}\nNama: ${siswa?.nama} (Kelas ${siswa?.kelas})\nKategori: ${port.kategori} (${port.mapel})\nDeskripsi: ${port.deskripsi}\nCatatan Guru: "${port.catatanGuru}"`}
                    label="COPAS"
                    size="sm"
                    variant="outline"
                  />
                  <button
                    onClick={() => handleDelete(port.id, port.judul)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                    title="Hapus Portofolio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Portfolio Modal */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Tambah Dokumentasi Portofolio"
          subtitle="Dokumentasikan karya dan praktik ibadah peserta didik MIN 1 Paser"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peserta Didik *
                </label>
                <select
                  value={formData.siswaId}
                  onChange={(e) => setFormData({ ...formData, siswaId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                >
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} (Kelas {s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kategori: e.target.value as
                        | 'Karya'
                        | 'Proyek'
                        | 'Tugas'
                        | 'Dokumentasi Praktik',
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                >
                  <option value="Dokumentasi Praktik">Dokumentasi Praktik Ibadah</option>
                  <option value="Karya">Karya Seni / Kaligrafi</option>
                  <option value="Proyek">Proyek Belajar</option>
                  <option value="Tugas">Tugas Terbaik</option>
                </select>
              </div>
            </div>

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
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                >
                  {DAFTAR_MAPEL.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Karya *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Video Praktik Wudhu Sesuai Sunnah"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Karya / Aktivitas Praktik *
              </label>
              <textarea
                required
                rows={3}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Ceritakan proses pembuatan karya atau unjuk keterampilan siswa..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Foto / Dokumentasi Media (Opsional)
              </label>
              <input
                type="url"
                value={formData.mediaUrl}
                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan & Apresiasi Guru
              </label>
              <textarea
                rows={2}
                value={formData.catatanGuru}
                onChange={(e) => setFormData({ ...formData, catatanGuru: e.target.value })}
                placeholder="Kata-kata motivasi dan apresiasi atas pencapaian siswa..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
              >
                Simpan ke Portofolio
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
