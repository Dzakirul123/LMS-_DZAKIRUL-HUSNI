import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Calendar,
  Users,
  Search,
  Printer,
  Download,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AbsensiRecord,
  PesertaDidik,
  KelasNumber,
  StatusAbsensi,
  MadrasahSettings,
} from '../../types/lms';
import { CopasButton } from '../common/CopasButton';
import { useToast } from '../common/Toast';
import { formatPresensiCopas, printContent } from '../../utils/copas';

interface AbsensiManagerProps {
  settings: MadrasahSettings;
  siswaList: PesertaDidik[];
  absensiList: AbsensiRecord[];
  onSaveAbsensi: (list: AbsensiRecord[]) => void;
}

export const AbsensiManager: React.FC<AbsensiManagerProps> = ({
  settings,
  siswaList,
  absensiList,
  onSaveAbsensi,
}) => {
  const { showToast } = useToast();

  const [selectedTanggal, setSelectedTanggal] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedKelas, setSelectedKelas] = useState<KelasNumber>(6);
  const [viewMode, setViewMode] = useState<'harian' | 'rekap_siswa'>('harian');

  // Filter students by selected class
  const classStudents = siswaList
    .filter((s) => s.kelas === selectedKelas)
    .sort((a, b) => a.noAbsen - b.noAbsen);

  // Get current attendance for selected date and class
  const currentRecords = absensiList.filter(
    (a) => a.tanggal === selectedTanggal && a.kelas === selectedKelas
  );

  const getStudentStatus = (siswaId: string): StatusAbsensi => {
    const rec = currentRecords.find((a) => a.siswaId === siswaId);
    return rec ? rec.status : 'Hadir'; // Default to Hadir
  };

  const getStudentCatatan = (siswaId: string): string => {
    const rec = currentRecords.find((a) => a.siswaId === siswaId);
    return rec?.catatan || '';
  };

  const handleUpdateStatus = (siswaId: string, status: StatusAbsensi, catatan?: string) => {
    const existingIndex = absensiList.findIndex(
      (a) => a.tanggal === selectedTanggal && a.siswaId === siswaId
    );

    let updatedList: AbsensiRecord[];
    if (existingIndex >= 0) {
      updatedList = [...absensiList];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        status,
        catatan: catatan !== undefined ? catatan : updatedList[existingIndex].catatan,
      };
    } else {
      const newRec: AbsensiRecord = {
        id: `abs-${Date.now()}-${siswaId}`,
        tanggal: selectedTanggal,
        kelas: selectedKelas,
        siswaId,
        status,
        catatan: catatan || '',
      };
      updatedList = [...absensiList, newRec];
    }

    onSaveAbsensi(updatedList);
  };

  // Bulk action: Hadirkan Semua
  const handleHadirkanSemua = () => {
    let updatedList = [...absensiList];
    classStudents.forEach((s) => {
      const idx = updatedList.findIndex(
        (a) => a.tanggal === selectedTanggal && a.siswaId === s.id
      );
      if (idx >= 0) {
        updatedList[idx] = { ...updatedList[idx], status: 'Hadir' };
      } else {
        updatedList.push({
          id: `abs-${Date.now()}-${s.id}`,
          tanggal: selectedTanggal,
          kelas: selectedKelas,
          siswaId: s.id,
          status: 'Hadir',
        });
      }
    });

    onSaveAbsensi(updatedList);
    showToast(`Semua peserta didik Kelas ${selectedKelas} diset HADIR!`, 'success');
  };

  // Calculations for summary
  const totalHadir = classStudents.filter((s) => getStudentStatus(s.id) === 'Hadir').length;
  const totalSakit = classStudents.filter((s) => getStudentStatus(s.id) === 'Sakit').length;
  const totalIzin = classStudents.filter((s) => getStudentStatus(s.id) === 'Izin').length;
  const totalAlpa = classStudents.filter((s) => getStudentStatus(s.id) === 'Alpa').length;
  const persenHadir =
    classStudents.length > 0 ? Math.round((totalHadir / classStudents.length) * 100) : 0;

  // Active records for COPAS
  const activeAbsensiForClass = classStudents.map((s) => ({
    id: s.id,
    tanggal: selectedTanggal,
    kelas: selectedKelas,
    siswaId: s.id,
    status: getStudentStatus(s.id),
    catatan: getStudentCatatan(s.id),
  }));

  const copasText = formatPresensiCopas(
    selectedTanggal,
    selectedKelas,
    classStudents,
    activeAbsensiForClass,
    settings
  );

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-700" />
            <span>Presensi & Absensi Peserta Didik</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan harian (Hadir, Sakit, Izin, Alpa) dan rekap kehadiran siap kirim ke WhatsApp wali murid
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WAJIB TOMBOL COPAS */}
          <CopasButton
            textToCopy={copasText}
            label="COPAS Rekap ke WA"
            size="md"
            variant="primary"
            filename={`rekap-presensi-kelas${selectedKelas}-${selectedTanggal}.txt`}
            title={`Presensi Kelas ${selectedKelas} - MIN 1 Paser`}
          />

          <button
            onClick={handleHadirkanSemua}
            className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
            title="Klik untuk menandai seluruh siswa hadir sekaligus"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Hadirkan Semua</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Date, Class, Mode */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tanggal */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Kelas Selector */}
          <div className="flex items-center gap-1">
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
        </div>

        {/* View switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('harian')}
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              viewMode === 'harian' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Input Harian
          </button>
          <button
            onClick={() => setViewMode('rekap_siswa')}
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              viewMode === 'rekap_siswa' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Rekap Bulanan
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="text-xs font-semibold text-slate-500">Tingkat Kehadiran</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{persenHadir}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{classStudents.length} Siswa</div>
        </div>

        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 shadow-2xs text-center">
          <div className="text-xs font-bold text-emerald-800">Hadir (H)</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalHadir}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Anak</div>
        </div>

        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 shadow-2xs text-center">
          <div className="text-xs font-bold text-amber-800">Sakit (S)</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{totalSakit}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Anak</div>
        </div>

        <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 shadow-2xs text-center">
          <div className="text-xs font-bold text-blue-800">Izin (I)</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{totalIzin}</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Anak</div>
        </div>

        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100 shadow-2xs text-center col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-rose-800">Alpa (A)</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{totalAlpa}</div>
          <div className="text-[11px] text-rose-600 mt-0.5">Anak</div>
        </div>
      </div>

      {/* Main Table / Mobile Friendly Cards */}
      {viewMode === 'harian' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {classStudents.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm">
              Belum ada data peserta didik di Kelas {selectedKelas}.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {classStudents.map((siswa) => {
                const currentStatus = getStudentStatus(siswa.id);
                const currentCatatan = getStudentCatatan(siswa.id);

                return (
                  <div
                    key={siswa.id}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Student Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          #{siswa.noAbsen}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{siswa.nama}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            siswa.jenisKelamin === 'L'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {siswa.jenisKelamin}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        NISN: {siswa.nisn} • {siswa.keterangan}
                      </div>

                      {/* Optional Note Input for Sakit / Izin */}
                      {(currentStatus === 'Sakit' || currentStatus === 'Izin') && (
                        <input
                          type="text"
                          placeholder={`Catatan keterangan ${currentStatus.toLowerCase()}...`}
                          value={currentCatatan}
                          onChange={(e) =>
                            handleUpdateStatus(siswa.id, currentStatus, e.target.value)
                          }
                          className="mt-2 w-full max-w-md px-2.5 py-1 text-xs bg-amber-50 border border-amber-200 rounded-lg text-slate-700 focus:outline-hidden"
                        />
                      )}
                    </div>

                    {/* Status Buttons for Touch / Mobile */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(siswa.id, 'Hadir')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          currentStatus === 'Hadir'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                      >
                        {currentStatus === 'Hadir' && <Check className="w-3.5 h-3.5" />}
                        <span>Hadir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(siswa.id, 'Sakit')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          currentStatus === 'Sakit'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                        }`}
                      >
                        {currentStatus === 'Sakit' && <Check className="w-3.5 h-3.5" />}
                        <span>Sakit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(siswa.id, 'Izin')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          currentStatus === 'Izin'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-800'
                        }`}
                      >
                        {currentStatus === 'Izin' && <Check className="w-3.5 h-3.5" />}
                        <span>Izin</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(siswa.id, 'Alpa')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          currentStatus === 'Alpa'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                        }`}
                      >
                        {currentStatus === 'Alpa' && <Check className="w-3.5 h-3.5" />}
                        <span>Alpa</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Rekap Kumulatif Per Siswa */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4 text-center">Hadir</th>
                  <th className="py-3 px-4 text-center">Sakit</th>
                  <th className="py-3 px-4 text-center">Izin</th>
                  <th className="py-3 px-4 text-center">Alpa</th>
                  <th className="py-3 px-4 text-center">% Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((s, idx) => {
                  const studentRecords = absensiList.filter((a) => a.siswaId === s.id);
                  const h = studentRecords.filter((a) => a.status === 'Hadir').length || 1;
                  const sk = studentRecords.filter((a) => a.status === 'Sakit').length;
                  const iz = studentRecords.filter((a) => a.status === 'Izin').length;
                  const al = studentRecords.filter((a) => a.status === 'Alpa').length;
                  const total = h + sk + iz + al;
                  const pct = Math.round((h / total) * 100);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-600">#{s.noAbsen}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{s.nama}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{h}</td>
                      <td className="py-3 px-4 text-center font-bold text-amber-700">{sk}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">{iz}</td>
                      <td className="py-3 px-4 text-center font-bold text-rose-700">{al}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-black text-xs px-2 py-0.5 rounded-full ${
                            pct >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
