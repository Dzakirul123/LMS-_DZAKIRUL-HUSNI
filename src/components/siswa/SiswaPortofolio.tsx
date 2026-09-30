import React, { useState } from 'react';
import {
  FolderKanban,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Award,
} from 'lucide-react';
import {
  PortofolioKarya,
  PesertaDidik,
  MataPelajaran,
  DAFTAR_MAPEL,
  MadrasahSettings,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface SiswaPortofolioProps {
  settings: MadrasahSettings;
  siswa: PesertaDidik;
  portofolioList: PortofolioKarya[];
  onSavePortofolio: (list: PortofolioKarya[]) => void;
}

export const SiswaPortofolio: React.FC<SiswaPortofolioProps> = ({
  settings,
  siswa,
  portofolioList,
  onSavePortofolio,
}) => {
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<{
    judul: string;
    kategori: 'Karya' | 'Proyek' | 'Tugas' | 'Dokumentasi Praktik';
    mapel: MataPelajaran;
    deskripsi: string;
    mediaUrl: string;
  }>({
    judul: '',
    kategori: 'Karya',
    mapel: 'Akidah Akhlak',
    deskripsi: '',
    mediaUrl: '',
  });

  const myPortofolio = portofolioList.filter((p) => p.siswaId === siswa.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.deskripsi.trim()) {
      showToast('Judul dan deskripsi karya harus diisi!', 'error');
      return;
    }

    const newItem: PortofolioKarya = {
      id: `port-${Date.now()}`,
      siswaId: siswa.id,
      ...formData,
      tanggal: new Date().toISOString().split('T')[0],
      catatanGuru: 'Karya telah diunggah dan sedang dalam peninjauan guru.',
    };

    onSavePortofolio([newItem, ...portofolioList]);
    showToast('Karyamu berhasil ditambahkan ke portofolio!', 'success');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-700" />
            <span>Portofolio & Dokumentasi Karyaku</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kumpulan karya seni, kaligrafi, eksperimen sains, dan video praktik ibadahmu di MIN 1 Paser
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Unggah Karyaku</span>
        </button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myPortofolio.length === 0 ? (
          <div className="md:col-span-2 p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Kamu belum memiliki portofolio yang tersimpan. Klik tombol "Unggah Karyaku" di atas untuk menambahkan hasil karyamu!
          </div>
        ) : (
          myPortofolio.map((port) => (
            <div
              key={port.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {port.mediaUrl ? (
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={port.mediaUrl}
                      alt={port.judul}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80';
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
                    <span className="font-bold text-emerald-800">{port.mapel}</span>
                    <span>{new Date(port.tanggal).toLocaleDateString('id-ID')}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{port.judul}</h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {port.deskripsi}
                  </p>

                  {port.catatanGuru && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 italic">
                      <span className="font-bold not-italic">Catatan Ustadz Dzakirul Husni: </span>
                      "{port.catatanGuru}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Unggah Karya ke Portofolio"
          subtitle="Tampilkan kreativitas dan hasil belajarmu"
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Karya / Praktik *
              </label>
              <input
                type="text"
                required
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Kaligrafi Asmaul Husna Al-Fattah"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={formData.mapel}
                  onChange={(e) =>
                    setFormData({ ...formData, mapel: e.target.value as MataPelajaran })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {DAFTAR_MAPEL.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kategori: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Karya">Karya Seni / Kaligrafi</option>
                  <option value="Proyek">Proyek Belajar</option>
                  <option value="Tugas">Tugas Terbaik</option>
                  <option value="Dokumentasi Praktik">Dokumentasi Praktik</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Singkat Karya *
              </label>
              <textarea
                required
                rows={3}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Ceritakan tentang karyamu, bahan yang digunakan, atau apa yang kamu pelajari..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Link Foto Karya / Video (Opsional)
              </label>
              <input
                type="url"
                value={formData.mediaUrl}
                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                placeholder="https://drive.google.com/... atau link foto"
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
                Simpan Karya
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
