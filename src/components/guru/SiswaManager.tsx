import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Check,
  Download,
  Printer,
  Copy,
  Phone,
  FileSpreadsheet,
  Upload,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  PesertaDidik,
  KelasNumber,
  Fase,
  getFaseByKelas,
  MadrasahSettings,
  AbsensiRecord,
  NilaiSiswa,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { downloadTextFile, printContent } from '../../utils/copas';

interface SiswaManagerProps {
  settings: MadrasahSettings;
  siswaList: PesertaDidik[];
  onSaveSiswa: (siswa: PesertaDidik[]) => void;
  absensiList: AbsensiRecord[];
  nilaiList: NilaiSiswa[];
}

interface ParsedBulkRow {
  nama: string;
  nisn: string;
  noAbsen: number;
  kelas: KelasNumber;
  jenisKelamin: 'L' | 'P';
  keterangan: string;
  kontakWali: string;
}

export const SiswaManager: React.FC<SiswaManagerProps> = ({
  settings,
  siswaList,
  onSaveSiswa,
  absensiList,
  nilaiList,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('all');
  const [selectedFaseFilter, setSelectedFaseFilter] = useState<string>('all');

  // Single Student Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    noAbsen: 1,
    kelas: 6 as KelasNumber,
    jenisKelamin: 'L' as 'L' | 'P',
    keterangan: 'Aktif',
    kontakWali: '',
  });

  // Bulk Student Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkTargetKelas, setBulkTargetKelas] = useState<KelasNumber>(6);
  const [bulkParsedPreview, setBulkParsedPreview] = useState<ParsedBulkRow[]>([]);
  const [bulkParseError, setBulkParseError] = useState<string | null>(null);

  // Detail Modal State
  const [detailSiswa, setDetailSiswa] = useState<PesertaDidik | null>(null);

  // Filtered List
  const filteredSiswa = siswaList.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.keterangan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKelas =
      selectedKelasFilter === 'all' || s.kelas.toString() === selectedKelasFilter;

    const matchFase = selectedFaseFilter === 'all' || s.fase === selectedFaseFilter;

    return matchSearch && matchKelas && matchFase;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      nisn: `01${Math.floor(10000000 + Math.random() * 90000000)}`,
      nama: '',
      noAbsen: siswaList.length + 1,
      kelas: 6,
      jenisKelamin: 'L',
      keterangan: 'Aktif',
      kontakWali: '081254320000',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (siswa: PesertaDidik) => {
    setEditingId(siswa.id);
    setFormData({
      nisn: siswa.nisn,
      nama: siswa.nama,
      noAbsen: siswa.noAbsen,
      kelas: siswa.kelas,
      jenisKelamin: siswa.jenisKelamin,
      keterangan: siswa.keterangan,
      kontakWali: siswa.kontakWali,
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      showToast('Nama peserta didik tidak boleh kosong.', 'error');
      return;
    }

    const fase = getFaseByKelas(formData.kelas);

    if (editingId) {
      // Update
      const updated = siswaList.map((s) =>
        s.id === editingId
          ? {
              ...s,
              ...formData,
              fase,
            }
          : s
      );
      onSaveSiswa(updated);
      showToast('Data peserta didik berhasil diperbarui!', 'success');
    } else {
      // Create new
      const newSiswa: PesertaDidik = {
        id: `s-${Date.now()}`,
        ...formData,
        fase,
      };
      onSaveSiswa([...siswaList, newSiswa]);
      showToast('Peserta didik baru berhasil ditambahkan!', 'success');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data peserta didik "${nama}"?`)) {
      const updated = siswaList.filter((s) => s.id !== id);
      onSaveSiswa(updated);
      showToast(`Data ${nama} berhasil dihapus.`, 'info');
      if (detailSiswa?.id === id) setDetailSiswa(null);
    }
  };

  // Bulk Add Handlers
  const handleOpenBulkAdd = () => {
    // Provide a helpful prefilled template
    const sampleTemplate = `Ahmad Fauzi Santoso, L, 0118923420, Ketua Regu Pramuka, 081234567890\nSiti Maryam Nurhaliza, P, 0118923421, Duta Literasi Madrasah, 081234567891\nMuhammad Ridwan Kamil, L, 0118923422, Juara Tartil Quran, 081234567892\nNurfadilah Rahmah, P, 0118923423, Bintang Matematika, 081234567893`;
    setBulkInputText(sampleTemplate);
    parseBulkText(sampleTemplate, bulkTargetKelas);
    setIsBulkModalOpen(true);
  };

  const parseBulkText = (text: string, defaultKelas: KelasNumber) => {
    setBulkParseError(null);
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (lines.length === 0) {
      setBulkParsedPreview([]);
      return;
    }

    const currentMaxAbsen = siswaList
      .filter((s) => s.kelas === defaultKelas)
      .reduce((max, s) => (s.noAbsen > max ? s.noAbsen : max), 0);

    const parsed: ParsedBulkRow[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Support Comma, Semicolon, or Tab separator
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t').map((p) => p.trim());
      } else if (line.includes(';')) {
        parts = line.split(';').map((p) => p.trim());
      } else if (line.includes(',')) {
        parts = line.split(',').map((p) => p.trim());
      } else {
        // Just names on separate lines
        parts = [line];
      }

      const nama = parts[0]?.replace(/^["']|["']$/g, '').trim();
      if (!nama) continue;

      // Extract gender (L/P)
      let jk: 'L' | 'P' = 'L';
      const second = parts[1]?.toUpperCase() || '';
      if (second.startsWith('P') || second.includes('PEREMPUAN') || second.includes('WANITA')) {
        jk = 'P';
      } else {
        jk = 'L';
      }

      // Extract NISN
      const nisnCandidate = parts[2]?.replace(/\D/g, '') || '';
      const nisn =
        nisnCandidate.length >= 8
          ? nisnCandidate
          : `01${Math.floor(10000000 + Math.random() * 90000000)}`;

      // Extract Keterangan & Kontak
      const keterangan = parts[3]?.replace(/^["']|["']$/g, '').trim() || 'Aktif';
      const kontakWali = parts[4]?.replace(/^["']|["']$/g, '').trim() || '081254320000';

      parsed.push({
        nama,
        nisn,
        noAbsen: currentMaxAbsen + parsed.length + 1,
        kelas: defaultKelas,
        jenisKelamin: jk,
        keterangan,
        kontakWali,
      });
    }

    setBulkParsedPreview(parsed);
  };

  const handleBulkTextChange = (text: string) => {
    setBulkInputText(text);
    parseBulkText(text, bulkTargetKelas);
  };

  const handleBulkKelasChange = (newKelas: KelasNumber) => {
    setBulkTargetKelas(newKelas);
    parseBulkText(bulkInputText, newKelas);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Strip header if contains nama/nisn
        const lines = text.split('\n');
        const cleanLines = lines.filter(
          (l) => !l.toLowerCase().includes('nama') && !l.toLowerCase().includes('nisn')
        );
        const processedText = cleanLines.join('\n');
        setBulkInputText(processedText);
        parseBulkText(processedText, bulkTargetKelas);
        showToast(`File ${file.name} berhasil dibaca (${cleanLines.length} baris).`, 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveBulk = () => {
    if (bulkParsedPreview.length === 0) {
      showToast('Tidak ada data siswa yang valid untuk ditambahkan.', 'error');
      return;
    }

    const newStudents: PesertaDidik[] = bulkParsedPreview.map((item, idx) => ({
      id: `s-bulk-${Date.now()}-${idx}`,
      nisn: item.nisn,
      nama: item.nama,
      noAbsen: item.noAbsen,
      kelas: item.kelas,
      fase: getFaseByKelas(item.kelas),
      jenisKelamin: item.jenisKelamin,
      keterangan: item.keterangan,
      kontakWali: item.kontakWali,
    }));

    onSaveSiswa([...siswaList, ...newStudents]);
    showToast(`Berhasil menambahkan ${newStudents.length} siswa secara massal!`, 'success');
    setIsBulkModalOpen(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csv = 'No,NISN,Nama Siswa,No Absen,Kelas,Fase,Jenis Kelamin,Keterangan,Kontak Wali\n';
    filteredSiswa.forEach((s, i) => {
      csv += `"${i + 1}","${s.nisn}","${s.nama}","${s.noAbsen}","Kelas ${s.kelas}","${s.fase}","${s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}","${s.keterangan}","${s.kontakWali}"\n`;
    });
    downloadTextFile('data-siswa-min1paser.csv', csv, 'text/csv;charset=utf-8');
    showToast('Data peserta didik berhasil diekspor ke CSV.', 'info');
  };

  // Format COPAS text for WhatsApp / docs
  const copasDaftarSiswa = `📋 *DATA PESERTA DIDIK ${settings.namaMadrasah.toUpperCase()}*
========================================
*Tahun Ajaran:* ${settings.tahunAjaran} (${settings.semester})
*Total Siswa Ditampilkan:* ${filteredSiswa.length} Siswa
*Filter:* ${selectedKelasFilter === 'all' ? 'Semua Kelas' : `Kelas ${selectedKelasFilter}`} (${selectedFaseFilter === 'all' ? 'Semua Fase' : selectedFaseFilter})

DAFTAR NAMA SISWA:
${filteredSiswa
  .map(
    (s, idx) =>
      `${idx + 1}. [No. ${s.noAbsen}] ${s.nama} (Kls ${s.kelas} - ${s.fase}) - Ket: ${s.keterangan}`
  )
  .join('\n')}

_Dicatat oleh: ${settings.namaGuru} - ${settings.namaMadrasah}_`;

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>Data Peserta Didik MIN 1 Paser</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data siswa Kelas 1 sampai 6 Kurikulum Merdeka (Fase A, B, dan C)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tambah Massal Button */}
          <button
            onClick={handleOpenBulkAdd}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Tambah banyak siswa sekaligus dari teks, Excel, atau CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Tambah Siswa Massal</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah 1 Siswa</span>
          </button>

          <CopasButton
            textToCopy={copasDaftarSiswa}
            label="COPAS Daftar Siswa"
            size="md"
            variant="secondary"
            filename="daftar-siswa-min1paser.txt"
            title="Daftar Peserta Didik MIN 1 Paser"
          />

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

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NISN, atau keterangan siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Kelas Filter */}
          <select
            value={selectedKelasFilter}
            onChange={(e) => setSelectedKelasFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Kelas (1-6)</option>
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
          </select>

          {/* Fase Filter */}
          <select
            value={selectedFaseFilter}
            onChange={(e) => setSelectedFaseFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Fase (A, B, C)</option>
            <option value="Fase A">Fase A (Kelas 1-2)</option>
            <option value="Fase B">Fase B (Kelas 3-4)</option>
            <option value="Fase C">Fase C (Kelas 5-6)</option>
          </select>
        </div>
      </div>

      {/* Student List Cards & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700">
            Total Menampilkan: <span className="text-emerald-700 font-extrabold">{filteredSiswa.length}</span> Peserta Didik
          </div>
          <div className="text-xs text-slate-400">
            Tersimpan aman di penyimpanan lokal peramban
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="block lg:hidden divide-y divide-slate-100">
          {filteredSiswa.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Tidak ada data siswa yang cocok dengan pencarian atau filter.
            </div>
          ) : (
            filteredSiswa.map((siswa) => (
              <div key={siswa.id} className="p-4 space-y-2 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {siswa.noAbsen}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">
                        {siswa.nama}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        NISN: {siswa.nisn} • {siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    Kelas {siswa.kelas} ({siswa.fase})
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="truncate">Ket: {siswa.keterangan}</span>
                  {siswa.kontakWali && (
                    <span className="text-emerald-700 font-mono text-[11px] shrink-0 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {siswa.kontakWali}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    onClick={() => setDetailSiswa(siswa)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(siswa)}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(siswa.id, siswa.nama)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-3">Nama Lengkap</th>
                <th className="py-3 px-3">NISN</th>
                <th className="py-3 px-3 text-center">Kelas & Fase</th>
                <th className="py-3 px-3 text-center">L/P</th>
                <th className="py-3 px-3">Keterangan / Catatan</th>
                <th className="py-3 px-3">Kontak Wali</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada data peserta didik yang cocok.
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa, idx) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      #{siswa.noAbsen}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900 text-sm">{siswa.nama}</div>
                      <div className="text-[10px] text-slate-400">ID: {siswa.id}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">
                      {siswa.nisn}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Kelas {siswa.kelas} ({siswa.fase})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span
                        className={`inline-block w-6 h-6 leading-6 rounded-full text-center text-[10px] ${
                          siswa.jenisKelamin === 'L'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {siswa.jenisKelamin}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {siswa.keterangan}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {siswa.kontakWali || '-'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailSiswa(siswa)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Lihat Profil & Rapor Singkat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(siswa)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(siswa.id, siswa.nama)}
                          className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH SISWA MASSAL */}
      {isBulkModalOpen && (
        <Modal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title="Tambah Peserta Didik Secara Massal (Bulk Import)"
          subtitle={`Tambahkan banyak siswa sekaligus ke Kelas ${bulkTargetKelas} MIN 1 Paser`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {/* Guide & Controls */}
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1.5 text-teal-900">
              <div className="font-bold flex items-center gap-1.5 text-teal-950">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Format Pengisian Cepat:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Ketik atau tempel (paste) daftar siswa dari <b>Excel, Google Sheets, atau WhatsApp</b>. Satu baris per siswa dengan urutan:
              </p>
              <div className="bg-white/80 p-2 rounded-lg font-mono text-[11px] text-teal-800 border border-teal-300">
                Nama Siswa, Jenis Kelamin (L/P), NISN, Catatan/Keterangan, No WA Wali
              </div>
              <p className="text-[10px] text-teal-700 italic">
                *Tips: Cukup masukkan nama saja per baris jika data lain belum lengkap, nomor absen dan NISN otomatis digenerate!
              </p>
            </div>

            {/* Target Kelas Selector & Upload File */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masukkan ke Kelas Target:
                </label>
                <select
                  value={bulkTargetKelas}
                  onChange={(e) => handleBulkKelasChange(parseInt(e.target.value) as KelasNumber)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  <option value={6}>Kelas 6 (Fase C) - Prioritas</option>
                  <option value={5}>Kelas 5 (Fase C)</option>
                  <option value={4}>Kelas 4 (Fase B)</option>
                  <option value={3}>Kelas 3 (Fase B)</option>
                  <option value={2}>Kelas 2 (Fase A)</option>
                  <option value={1}>Kelas 1 (Fase A)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atau Unggah File (.csv / .txt):
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Pilih File Excel CSV</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Textarea Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Data Siswa (Teks / Tempelan Tabel):
                </label>
                <span className="text-[11px] text-slate-500">
                  Terdeteksi: <b className="text-emerald-700">{bulkParsedPreview.length}</b> siswa
                </span>
              </div>
              <textarea
                rows={7}
                value={bulkInputText}
                onChange={(e) => handleBulkTextChange(e.target.value)}
                placeholder="Contoh:&#10;Muhammad Al-Fatih, L, 0118923425, Juara Pramuka, 081234567890&#10;Fatimah Azzahra, P, 0118923426, Hafizhah Juz 30, 081234567891"
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Live Preview Table */}
            {bulkParsedPreview.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Pratinjau Hasil Pembacaan ({bulkParsedPreview.length} Siswa):</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Siap ditambahkan ke database LMS
                  </span>
                </div>
                <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl bg-white">
                  <table className="w-full text-left text-[11px] text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2.5 text-center">Absen</th>
                        <th className="py-2 px-2.5">Nama Siswa</th>
                        <th className="py-2 px-2.5 text-center">L/P</th>
                        <th className="py-2 px-2.5">NISN</th>
                        <th className="py-2 px-2.5">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bulkParsedPreview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1.5 px-2.5 text-center font-bold text-emerald-800">
                            #{item.noAbsen}
                          </td>
                          <td className="py-1.5 px-2.5 font-bold text-slate-900">{item.nama}</td>
                          <td className="py-1.5 px-2.5 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.jenisKelamin === 'L'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {item.jenisKelamin}
                            </span>
                          </td>
                          <td className="py-1.5 px-2.5 font-mono text-slate-500">{item.nisn}</td>
                          <td className="py-1.5 px-2.5 text-slate-600 truncate max-w-[150px]">
                            {item.keterangan}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={bulkParsedPreview.length === 0}
                onClick={handleSaveBulk}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Simpan {bulkParsedPreview.length} Siswa Massal</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL TAMBAH / EDIT 1 SISWA */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingId ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
          subtitle={`MIN 1 Paser • Tahun Ajaran ${settings.tahunAjaran}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveForm} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Muhammad Rayhan Al-Fatih"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NISN *</label>
                <input
                  type="text"
                  required
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  placeholder="10 digit NISN"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Absen *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={60}
                  value={formData.noAbsen}
                  onChange={(e) =>
                    setFormData({ ...formData, noAbsen: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kelas (1 - 6) *
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) =>
                    setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keterangan / Catatan Karakter
              </label>
              <input
                type="text"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Contoh: Bintang Kelas, Rajin Iqra, Perlu Pendampingan Menulis"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Wali Murid
              </label>
              <input
                type="tel"
                value={formData.kontakWali}
                onChange={(e) => setFormData({ ...formData, kontakWali: e.target.value })}
                placeholder="Contoh: 081254320000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
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
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah Siswa'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Student Detail Modal */}
      {detailSiswa && (
        <Modal
          isOpen={!!detailSiswa}
          onClose={() => setDetailSiswa(null)}
          title={`Profil Peserta Didik: ${detailSiswa.nama}`}
          subtitle={`MIN 1 Paser • Kelas ${detailSiswa.kelas} (${detailSiswa.fase})`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start justify-between">
              <div>
                <h4 className="text-base font-extrabold text-emerald-950">{detailSiswa.nama}</h4>
                <div className="text-xs text-emerald-800 mt-1 space-y-0.5">
                  <div>NISN: <span className="font-mono font-bold">{detailSiswa.nisn}</span></div>
                  <div>No. Absen: #{detailSiswa.noAbsen} | Jenis Kelamin: {detailSiswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                  <div>Fase: {detailSiswa.fase} (Kurikulum Merdeka)</div>
                  <div>Catatan: {detailSiswa.keterangan}</div>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg text-xs">
                Kelas {detailSiswa.kelas}
              </span>
            </div>

            {/* Attendance Quick Stats */}
            <div>
              <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                Riwayat Presensi
              </h5>
              {(() => {
                const sAbs = absensiList.filter((a) => a.siswaId === detailSiswa.id);
                const h = sAbs.filter((a) => a.status === 'Hadir').length;
                const s = sAbs.filter((a) => a.status === 'Sakit').length;
                const i = sAbs.filter((a) => a.status === 'Izin').length;
                const a = sAbs.filter((a) => a.status === 'Alpa').length;
                return (
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                      <div className="font-bold text-lg">{h}</div>
                      <div>Hadir</div>
                    </div>
                    <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                      <div className="font-bold text-lg">{s}</div>
                      <div>Sakit</div>
                    </div>
                    <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
                      <div className="font-bold text-lg">{i}</div>
                      <div>Izin</div>
                    </div>
                    <div className="p-2 bg-rose-100 text-rose-900 rounded-lg">
                      <div className="font-bold text-lg">{a}</div>
                      <div>Alpa</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Grades */}
            <div>
              <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                Nilai & Catatan Guru
              </h5>
              {(() => {
                const sNilai = nilaiList.filter((n) => n.siswaId === detailSiswa.id);
                if (sNilai.length === 0) {
                  return (
                    <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                      Belum ada nilai yang diinput untuk siswa ini.
                    </div>
                  );
                }
                return (
                  <div className="space-y-2">
                    {sNilai.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>Mapel: {n.mapel}</span>
                          <span className="text-emerald-700">Tugas: {n.nilaiTugas} | Kuis: {n.nilaiKuis} | Ujian: {n.nilaiUjian}</span>
                        </div>
                        {n.catatanGuru && (
                          <div className="text-slate-600 italic">
                            Catatan: "{n.catatanGuru}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <CopasButton
                textToCopy={`👤 *BIODATA SISWA ${settings.namaMadrasah.toUpperCase()}*\nNama: ${detailSiswa.nama}\nNISN: ${detailSiswa.nisn}\nKelas: ${detailSiswa.kelas} (${detailSiswa.fase})\nAbsen: #${detailSiswa.noAbsen}\nKeterangan: ${detailSiswa.keterangan}\nKontak Wali: ${detailSiswa.kontakWali}`}
                label="COPAS Biodata"
                size="sm"
                variant="secondary"
              />
              <button
                type="button"
                onClick={() => setDetailSiswa(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
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
