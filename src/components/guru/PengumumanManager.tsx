import React, { useState } from 'react';
import {
  Bell,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Pin,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import { Pengumuman, KelasNumber, MadrasahSettings } from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { formatPengumumanCopas } from '../../utils/copas';

interface PengumumanManagerProps {
  settings: MadrasahSettings;
  pengumumanList: Pengumuman[];
  onSavePengumuman: (list: Pengumuman[]) => void;
}

export const PengumumanManager: React.FC<PengumumanManagerProps> = ({
  settings,
  pengumumanList,
  onSavePengumuman,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    judul: string;
    konten: string;
    kategori: 'Penting' | 'Kegiatan' | 'Libur' | 'Ujian' | 'Umum';
    targetKelas: 'Semua' | KelasNumber;
    aktif: boolean;
    dipin: boolean;
  }>({
    judul: '',
    konten: '',
    kategori: 'Penting',
    targetKelas: 'Semua',
    aktif: true,
    dipin: false,
  });

  const filtered = pengumumanList.filter(
    (p) =>
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.konten.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      konten: `Assalamu'alaikum Wr. Wb.\n\nDiberitahukan kepada seluruh bapak/ibu wali murid bahwa...\n\nWassalamu'alaikum Wr. Wb.`,
      kategori: 'Penting',
      targetKelas: 'Semua',
      aktif: true,
      dipin: false,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Pengumuman) => {
    setEditingId(p.id);
    setFormData({
      judul: p.judul,
      konten: p.konten,
      kategori: p.kategori,
      targetKelas: p.targetKelas,
      aktif: p.aktif,
      dipin: p.dipin,
    });
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.konten.trim()) {
      showToast('Judul dan isi pengumuman wajib diisi!', 'error');
      return;
    }

    if (editingId) {
      const updated = pengumumanList.map((p) =>
        p.id === editingId ? { ...p, ...formData } : p
      );
      onSavePengumuman(updated);
      showToast('Pengumuman berhasil diperbarui!', 'success');
    } else {
      const newAnn: Pengumuman = {
        id: `ann-${Date.now()}`,
        ...formData,
        tanggal: new Date().toISOString().split('T')[0],
      };
      onSavePengumuman([newAnn, ...pengumumanList]);
      showToast('Pengumuman baru berhasil dipublikasikan!', 'success');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Hapus pengumuman "${judul}"?`)) {
      onSavePengumuman(pengumumanList.filter((p) => p.id !== id));
      showToast('Pengumuman dihapus.', 'info');
    }
  };

  const handleTogglePin = (id: string) => {
    const updated = pengumumanList.map((p) =>
      p.id === id ? { ...p, dipin: !p.dipin } : p
    );
    onSavePengumuman(updated);
    showToast('Status pin pengumuman diubah.', 'info');
  };

  const handleToggleAktif = (id: string) => {
    const updated = pengumumanList.map((p) =>
      p.id === id ? { ...p, aktif: !p.aktif } : p
    );
    onSavePengumuman(updated);
    showToast('Status keaktifan pengumuman diubah.', 'info');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <span>Pusat Pengumuman & Broadcast Madrasah</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publikasikan informasi resmi MIN 1 Paser langsung ke siswa & siap COPAS ke WhatsApp Grup Wali Murid
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden"
          />
        </div>
      </div>

      {/* Announcement List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Tidak ada pengumuman yang sesuai.
          </div>
        ) : (
          filtered.map((item) => {
            const copasText = formatPengumumanCopas(item, settings);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs transition-all space-y-3 ${
                  item.dipin ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                } ${!item.aktif && 'opacity-60 bg-slate-50'}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        item.kategori === 'Penting'
                          ? 'bg-rose-100 text-rose-800'
                          : item.kategori === 'Kegiatan'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.kategori === 'Libur'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.kategori}
                    </span>

                    <span className="text-xs text-slate-500">
                      Sasaran:{' '}
                      <strong className="text-slate-700">
                        {item.targetKelas === 'Semua' ? 'Seluruh Kelas 1-6' : `Kelas ${item.targetKelas}`}
                      </strong>
                    </span>

                    {item.dipin && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                        <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                        Disematkan
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.judul}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-2 whitespace-pre-line leading-relaxed">
                    {item.konten}
                  </p>
                </div>

                {/* Footer with Mandatory COPAS and quick toggles */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {/* WAJIB TOMBOL COPAS */}
                  <CopasButton
                    textToCopy={copasText}
                    label="COPAS Broadcast WA"
                    size="sm"
                    variant="primary"
                    filename={`pengumuman-${item.judul.toLowerCase().replace(/\s+/g, '-')}.txt`}
                    title={`Broadcast Pengumuman: ${item.judul}`}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePin(item.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                        item.dipin
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{item.dipin ? 'Lepas Pin' : 'Sematkan'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleAktif(item.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                        item.aktif
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.aktif ? 'Aktif' : 'Nonaktif'}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-700 rounded-md"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.judul)}
                      className="p-1.5 text-slate-500 hover:text-rose-700 rounded-md"
                      title="Hapus"
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

      {/* Add / Edit Announcement Modal */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
          subtitle={`MIN 1 Paser • Dzakirul Husni`}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Pengumuman *
              </label>
              <input
                type="text"
                required
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Jadwal Pelaksanaan Asesmen Sumatif Ganjil"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
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
                  <option value="Penting">Penting</option>
                  <option value="Kegiatan">Kegiatan Madrasah</option>
                  <option value="Libur">Hari Libur</option>
                  <option value="Ujian">Ujian / Asesmen</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sasaran Kelas *
                </label>
                <select
                  value={formData.targetKelas}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetKelas:
                        e.target.value === 'Semua' ? 'Semua' : (parseInt(e.target.value) as KelasNumber),
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Semua">Seluruh Kelas (1 - 6)</option>
                  <option value="1">Kelas 1</option>
                  <option value="2">Kelas 2</option>
                  <option value="3">Kelas 3</option>
                  <option value="4">Kelas 4</option>
                  <option value="5">Kelas 5</option>
                  <option value="6">Kelas 6</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Isi Lengkap Pengumuman *
              </label>
              <textarea
                required
                rows={5}
                value={formData.konten}
                onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dipin}
                  onChange={(e) => setFormData({ ...formData, dipin: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Sematkan di Atas (Pin)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.aktif}
                  onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Status Aktif</span>
              </label>
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
                Publikasikan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
