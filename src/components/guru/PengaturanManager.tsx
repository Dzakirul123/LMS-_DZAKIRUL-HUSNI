import React, { useState } from 'react';
import {
  Settings,
  School,
  UserCheck,
  Calendar,
  Save,
  RotateCcw,
  Download,
  Upload,
  Database,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import {
  MadrasahSettings,
  DAFTAR_TAHUN_AJARAN,
  Semester,
} from '../../types/lms';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { downloadTextFile } from '../../utils/copas';

interface PengaturanManagerProps {
  settings: MadrasahSettings;
  onUpdateSettings: (settings: MadrasahSettings) => void;
  onDataReset: () => void;
}

export const PengaturanManager: React.FC<PengaturanManagerProps> = ({
  settings,
  onUpdateSettings,
  onDataReset,
}) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<MadrasahSettings>({ ...settings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    showToast('Identitas Madrasah & Pengaturan berhasil disimpan!', 'success');
  };

  const handleExportBackup = () => {
    const backupJson = StorageService.exportFullBackup();
    const filename = `backup-lms-min1paser-${new Date().toISOString().split('T')[0]}.json`;
    downloadTextFile(filename, backupJson, 'application/json');
    showToast('Cadangan data LMS berhasil diunduh.', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importBackup(content);
        if (success) {
          showToast('Data LMS berhasil dipulihkan dari cadangan!', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast('Format cadangan JSON tidak valid.', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Peringatan: Tindakan ini akan mengembalikan seluruh data MIN 1 Paser ke data bawaan awal. Lanjutkan?'
      )
    ) {
      StorageService.resetAllData();
      onDataReset();
      showToast('Data berhasil direset ke pengaturan awal MIN 1 Paser.', 'info');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-700" />
          <span>Pengaturan Identitas Madrasah & Sistem LMS</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola profil MIN 1 Paser, Akun Guru Super Admin Dzakirul Husni, Tahun Ajaran, dan Semester
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-700" />
            <span>Identitas Resmi Madrasah</span>
          </h3>
          <p className="text-xs text-slate-500">Informasi yang muncul pada kop surat, laporan nilai, dan teks COPAS</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Madrasah *
            </label>
            <input
              type="text"
              required
              value={formData.namaMadrasah}
              onChange={(e) => setFormData({ ...formData, namaMadrasah: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">NPSN</label>
            <input
              type="text"
              value={formData.npsn}
              onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Madrasah</label>
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kabupaten & Provinsi</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.kabupaten}
                onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Guru Super Admin Profile */}
        <div className="border-b border-slate-100 pb-3 pt-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Guru & Super Admin Madrasah</span>
          </h3>
          <p className="text-xs text-slate-500">Nama pengampu dan penanggung jawab sistem LMS</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Guru (Admin Super) *
            </label>
            <input
              type="text"
              required
              value={formData.namaGuru}
              onChange={(e) => setFormData({ ...formData, namaGuru: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">NIP / NUPTK</label>
            <input
              type="text"
              value={formData.nipGuru}
              onChange={(e) => setFormData({ ...formData, nipGuru: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan Guru</label>
          <input
            type="text"
            value={formData.jabatanGuru}
            onChange={(e) => setFormData({ ...formData, jabatanGuru: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
          />
        </div>

        {/* Academic Year and Semester */}
        <div className="border-b border-slate-100 pb-3 pt-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Tahun Ajaran & Semester Berjalan</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tahun Ajaran (2026/2027 s/d 2030/2031)
            </label>
            <select
              value={formData.tahunAjaran}
              onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold"
            >
              {DAFTAR_TAHUN_AJARAN.map((ta) => (
                <option key={ta} value={ta}>
                  {ta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value as Semester })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Backup and Data Maintenance */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <span>Cadangan Data & Pemeliharaan LMS</span>
          </h3>
          <p className="text-xs text-slate-500">Simpan salinan data lengkap atau pulihkan kembali kapan saja</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export Backup */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <Download className="w-5 h-5 text-emerald-700 mb-2" />
              <div className="font-bold text-xs text-slate-900">Unduh Cadangan JSON</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Simpan semua siswa, materi, tugas, kuis, nilai, dan absensi ke komputer/HP.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 mt-3 inline-block">Ekspor Sekarang →</span>
          </button>

          {/* Import Backup */}
          <label className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors flex flex-col justify-between cursor-pointer">
            <div>
              <Upload className="w-5 h-5 text-blue-700 mb-2" />
              <div className="font-bold text-xs text-slate-900">Pulihkan Cadangan</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Unggah file JSON cadangan untuk memulihkan seluruh data madrasah.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 mt-3 inline-block">Pilih File JSON →</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {/* Reset Data */}
          <button
            type="button"
            onClick={handleResetData}
            className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <RotateCcw className="w-5 h-5 text-rose-700 mb-2" />
              <div className="font-bold text-xs text-rose-900">Reset Data Bawaan</div>
              <p className="text-[11px] text-rose-700/80 mt-1">
                Kembalikan seluruh isi LMS ke contoh data awal MIN 1 Paser.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 mt-3 inline-block">Reset Data Awal →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
