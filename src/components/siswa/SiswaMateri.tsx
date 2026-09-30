import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Video,
  ExternalLink,
  Eye,
  CheckCircle2,
  FolderTree,
} from 'lucide-react';
import {
  MateriPembelajaran,
  PesertaDidik,
  MataPelajaran,
  DAFTAR_MAPEL,
  MadrasahSettings,
} from '../../types/lms';
import { Modal } from '../common/Modal';
import { CopasButton } from '../common/CopasButton';
import { formatMateriCopas } from '../../utils/copas';

interface SiswaMateriProps {
  settings: MadrasahSettings;
  siswa: PesertaDidik;
  materiList: MateriPembelajaran[];
}

export const SiswaMateri: React.FC<SiswaMateriProps> = ({
  settings,
  siswa,
  materiList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapelFilter, setSelectedMapelFilter] = useState<string>('all');
  const [activeMateriDetail, setActiveMateriDetail] = useState<MateriPembelajaran | null>(null);

  // Student class materials
  const filteredMateri = materiList.filter((m) => {
    const matchClass = m.kelas === siswa.kelas;
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.babTopik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.materi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMapel = selectedMapelFilter === 'all' || m.mapel === selectedMapelFilter;

    return matchClass && matchSearch && matchMapel;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <span>Bahan Ajar & Materi Belajar Kelas {siswa.kelas}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pelajari rangkuman materi, tonton video pembelajaran, dan amalkan ilmu yang bermanfaat
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi belajar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden"
          />
        </div>

        <select
          value={selectedMapelFilter}
          onChange={(e) => setSelectedMapelFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden w-full sm:w-auto"
        >
          <option value="all">Semua Mata Pelajaran</option>
          {DAFTAR_MAPEL.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Material Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMateri.length === 0 ? (
          <div className="md:col-span-2 p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Tidak ada materi yang sesuai pencarian untuk Kelas {siswa.kelas}.
          </div>
        ) : (
          filteredMateri.map((m) => {
            const copasText = formatMateriCopas(m, settings);

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {m.mapel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Kelas {m.kelas} ({m.fase})
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>{m.babTopik}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                      {m.judul}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {m.materi}
                  </p>

                  {m.videoUrl && (
                    <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>Dilengkapi Video Pembelajaran</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <CopasButton
                    textToCopy={copasText}
                    label="COPAS Materi"
                    size="sm"
                    variant="primary"
                    filename={`materi-${m.judul}.txt`}
                    title={`Materi: ${m.judul}`}
                  />

                  <button
                    onClick={() => setActiveMateriDetail(m)}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Baca Lengkap</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reader Modal */}
      {activeMateriDetail && (
        <Modal
          isOpen={!!activeMateriDetail}
          onClose={() => setActiveMateriDetail(null)}
          title={activeMateriDetail.judul}
          subtitle={`${activeMateriDetail.mapel} • ${activeMateriDetail.babTopik}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
              <span className="font-bold text-emerald-900">🎯 TUJUAN PEMBELAJARAN:</span>
              <p className="text-emerald-800 mt-1">{activeMateriDetail.tujuanPembelajaran}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {activeMateriDetail.materi}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900">📝 INSTRUKSI SISWA:</span>
              <p className="text-amber-800 mt-1 whitespace-pre-line">
                {activeMateriDetail.instruksi}
              </p>
            </div>

            {activeMateriDetail.videoUrl && (
              <div className="text-xs">
                <span className="font-bold text-slate-700">Video Belajar: </span>
                <a
                  href={activeMateriDetail.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Buka Link Video <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <CopasButton
                textToCopy={formatMateriCopas(activeMateriDetail, settings)}
                label="COPAS Ringkasan"
                size="sm"
                variant="secondary"
              />
              <button
                type="button"
                onClick={() => setActiveMateriDetail(null)}
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
