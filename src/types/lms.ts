export type Jenjang = 'MI';
export type KelasNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type Fase = 'Fase A' | 'Fase B' | 'Fase C';

export type Semester = 'Ganjil' | 'Genap';

export type MataPelajaran =
  // Mapel Agama MI
  | "Al-Qur'an Hadis"
  | 'Akidah Akhlak'
  | 'Fikih'
  | 'Sejarah Kebudayaan Islam (SKI)'
  | 'Bahasa Arab'
  // Mapel Umum
  | 'Matematika'
  | 'Bahasa Indonesia'
  | 'IPAS'
  | 'Pendidikan Pancasila'
  | 'SBdP'
  | 'PJOK';

export const DAFTAR_MAPEL: { name: MataPelajaran; kategori: 'Agama' | 'Umum'; icon: string; color: string }[] = [
  { name: "Al-Qur'an Hadis", kategori: 'Agama', icon: 'BookOpen', color: 'emerald' },
  { name: 'Akidah Akhlak', kategori: 'Agama', icon: 'HeartHandshake', color: 'teal' },
  { name: 'Fikih', kategori: 'Agama', icon: 'Sparkles', color: 'cyan' },
  { name: 'Sejarah Kebudayaan Islam (SKI)', kategori: 'Agama', icon: 'Compass', color: 'amber' },
  { name: 'Bahasa Arab', kategori: 'Agama', icon: 'Languages', color: 'green' },
  { name: 'Matematika', kategori: 'Umum', icon: 'Calculator', color: 'blue' },
  { name: 'Bahasa Indonesia', kategori: 'Umum', icon: 'BookMarked', color: 'indigo' },
  { name: 'IPAS', kategori: 'Umum', icon: 'Globe', color: 'emerald' },
  { name: 'Pendidikan Pancasila', kategori: 'Umum', icon: 'Shield', color: 'red' },
  { name: 'SBdP', kategori: 'Umum', icon: 'Palette', color: 'purple' },
  { name: 'PJOK', kategori: 'Umum', icon: 'Activity', color: 'orange' },
];

export const DAFTAR_TAHUN_AJARAN = [
  '2026/2027',
  '2027/2028',
  '2028/2029',
  '2029/2030',
  '2030/2031',
];

export type UserRole = 'guru' | 'siswa';

export interface MadrasahSettings {
  namaMadrasah: string;
  npsn: string;
  alamat: string;
  kabupaten: string;
  provinsi: string;
  namaGuru: string;
  nipGuru: string;
  jabatanGuru: string;
  tahunAjaran: string;
  semester: Semester;
  bobotNilai: {
    tugas: number;
    kuis: number;
    praktik: number;
    proyek: number;
    ujian: number;
  };
}

export interface PesertaDidik {
  id: string;
  nisn: string;
  nama: string;
  noAbsen: number;
  kelas: KelasNumber;
  fase: Fase;
  jenisKelamin: 'L' | 'P';
  keterangan: string; // e.g. "Aktif", "Perlu Pendampingan Khusus", "Bintang Kelas"
  kontakWali: string;
  fotoUrl?: string;
}

export interface MateriPembelajaran {
  id: string;
  judul: string;
  mapel: MataPelajaran;
  kelas: KelasNumber;
  fase: Fase;
  babTopik: string;
  tujuanPembelajaran: string;
  materi: string;
  instruksi: string;
  linkReferensi?: string;
  videoUrl?: string;
  gambarUrl?: string;
  lampiranNama?: string;
  tanggalDibuat: string;
}

export type JenisTugas = 'Pilihan Ganda' | 'Isian' | 'Uraian' | 'Proyek' | 'Praktik' | 'Portofolio';

export interface Tugas {
  id: string;
  judul: string;
  mapel: MataPelajaran;
  kelas: KelasNumber;
  fase: Fase;
  materiTerkait: string;
  instruksi: string;
  batasWaktu: string;
  jenis: JenisTugas;
  bobotNilai: number; // e.g. 100
  tanggalDibuat: string;
}

export interface PengumpulanTugas {
  id: string;
  tugasId: string;
  siswaId: string;
  tanggalKumpul: string;
  isiJawaban: string;
  linkTugas?: string;
  catatanSiswa?: string;
  nilai?: number;
  catatanGuru?: string;
  status: 'Belum Dinilai' | 'Sudah Dinilai';
}

export interface SoalKuis {
  id: string;
  pertanyaan: string;
  opsiA: string;
  opsiB: string;
  opsiC: string;
  opsiD: string;
  kunciJawaban: 'A' | 'B' | 'C' | 'D';
  bobot: number;
  pembahasan: string;
}

export interface KuisInteraktif {
  id: string;
  judul: string;
  mapel: MataPelajaran;
  kelas: KelasNumber;
  fase: Fase;
  babTopik: string;
  tujuanPembelajaran: string;
  durasiMenit: number;
  soal: SoalKuis[];
  tanggalDibuat: string;
  aktif: boolean;
}

export interface HasilKuis {
  id: string;
  kuisId: string;
  siswaId: string;
  tanggalSelesai: string;
  jawabanSiswa: Record<string, 'A' | 'B' | 'C' | 'D'>;
  totalSkor: number;
  nilaiAkhir: number; // 0 - 100
  jumlahBenar: number;
  jumlahSalah: number;
  isGugur?: boolean; // True jika siswa salah 3 kali dan gugur
  alasanGugur?: string;
}

export type StatusAbsensi = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface AbsensiRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelas: KelasNumber;
  siswaId: string;
  status: StatusAbsensi;
  catatan?: string;
}

export interface NilaiSiswa {
  id: string;
  siswaId: string;
  mapel: MataPelajaran;
  semester: Semester;
  tahunAjaran: string;
  nilaiTugas: number;
  nilaiKuis: number;
  nilaiPraktik: number;
  nilaiProyek: number;
  nilaiUjian: number;
  catatanGuru?: string;
}

export interface PortofolioKarya {
  id: string;
  siswaId: string;
  judul: string;
  kategori: 'Karya' | 'Proyek' | 'Tugas' | 'Dokumentasi Praktik';
  mapel: MataPelajaran;
  tanggal: string;
  deskripsi: string;
  mediaUrl?: string;
  catatanGuru?: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  konten: string;
  tanggal: string;
  kategori: 'Penting' | 'Kegiatan' | 'Libur' | 'Ujian' | 'Umum';
  targetKelas: 'Semua' | KelasNumber;
  aktif: boolean;
  dipin: boolean;
}

export function getFaseByKelas(kelas: KelasNumber): Fase {
  if (kelas === 1 || kelas === 2) return 'Fase A';
  if (kelas === 3 || kelas === 4) return 'Fase B';
  return 'Fase C';
}
