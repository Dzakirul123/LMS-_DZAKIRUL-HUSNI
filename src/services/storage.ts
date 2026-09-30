import {
  MadrasahSettings,
  PesertaDidik,
  MateriPembelajaran,
  Tugas,
  PengumpulanTugas,
  KuisInteraktif,
  HasilKuis,
  AbsensiRecord,
  NilaiSiswa,
  PortofolioKarya,
  Pengumuman,
  getFaseByKelas,
} from '../types/lms';

const STORAGE_KEYS = {
  SETTINGS: 'lms_min1paser_settings',
  SISWA: 'lms_min1paser_siswa_v6',
  MATERI: 'lms_min1paser_materi_v6',
  TUGAS: 'lms_min1paser_tugas_v6',
  PENGUMPULAN: 'lms_min1paser_pengumpulan_v6',
  KUIS: 'lms_min1paser_kuis_v6',
  HASIL_KUIS: 'lms_min1paser_hasil_kuis_v6',
  ABSENSI: 'lms_min1paser_absensi_v6',
  NILAI: 'lms_min1paser_nilai_v6',
  PORTOFOLIO: 'lms_min1paser_portofolio_v6',
  PENGUMUMAN: 'lms_min1paser_pengumuman_v6',
};

export const DEFAULT_SETTINGS: MadrasahSettings = {
  namaMadrasah: 'MIN 1 Paser',
  npsn: '60721890',
  alamat: 'Jl. Kusuma Bangsa Km. 2, Tanah Grogot',
  kabupaten: 'Kabupaten Paser',
  provinsi: 'Kalimantan Timur',
  namaGuru: 'Dzakirul Husni, S.Pd.I',
  nipGuru: '198805122019031008',
  jabatanGuru: 'Super Admin LMS & Guru Kelas 6 (Fase C)',
  tahunAjaran: '2026/2027',
  semester: 'Ganjil',
  bobotNilai: {
    tugas: 25,
    kuis: 20,
    praktik: 25,
    proyek: 15,
    ujian: 15,
  },
};

// ==========================================
// SEED DATA KHUSUS KELAS 6 (FASE C)
// MIN 1 PASER - TP 2026/2027
// ==========================================

export const SEED_SISWA: PesertaDidik[] = [
  {
    id: 's-k6-1',
    nisn: '0118923401',
    nama: 'Zahra Amelia Putri',
    noAbsen: 1,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'P',
    keterangan: 'Ketua Kelas 6 & Kandidat Ujian Madrasah Teladan',
    kontakWali: '081254320101',
  },
  {
    id: 's-k6-2',
    nisn: '0118923402',
    nama: 'Umar Firdaus Al-Khattab',
    noAbsen: 2,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'L',
    keterangan: 'Pratama Pramuka Penggalang MI & Fasih Qira`ah',
    kontakWali: '081254320102',
  },
  {
    id: 's-k6-3',
    nisn: '0118923403',
    nama: 'Muhammad Nabil Al-Ghazali',
    noAbsen: 3,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'L',
    keterangan: 'Juara 1 Olimpiade Sains Madrasah (KSM) Bidang IPAS',
    kontakWali: '081254320103',
  },
  {
    id: 's-k6-4',
    nisn: '0118923404',
    nama: 'Fathiyyah Nur Aisyah',
    noAbsen: 4,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'P',
    keterangan: 'Hafal Juz 30 & 29 (Program Tahfidz Unggulan MIN 1 Paser)',
    kontakWali: '081254320104',
  },
  {
    id: 's-k6-5',
    nisn: '0118923405',
    nama: 'Raihan Dwi Pangestu',
    noAbsen: 5,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'L',
    keterangan: 'Unggul dalam Matematika Pecahan & Geometri Ruang',
    kontakWali: '081254320105',
  },
  {
    id: 's-k6-6',
    nisn: '0118923406',
    nama: 'Najwa Khadijah Azzahra',
    noAbsen: 6,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'P',
    keterangan: 'Sekretaris Kelas, Mahir Menulis Pidato & Puisi',
    kontakWali: '081254320106',
  },
  {
    id: 's-k6-7',
    nisn: '0118923407',
    nama: 'Bilal Ramadan Al-Banjari',
    noAbsen: 7,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'L',
    keterangan: 'Muazin Musala Madrasah & Aktif Berolahraga PJOK',
    kontakWali: '081254320107',
  },
  {
    id: 's-k6-8',
    nisn: '0118923408',
    nama: 'Salma Salsabila Ramadhani',
    noAbsen: 8,
    kelas: 6,
    fase: 'Fase C',
    jenisKelamin: 'P',
    keterangan: 'Bendahara Kelas, Sangat Rapi & Teliti Pembukuan',
    kontakWali: '081254320108',
  },
];

// MATERI KHUSUS KELAS 6 FASE C
// Mencakup Mapel Agama (Al-Qur'an Hadis, Akidah Akhlak, Fikih, SKI, Bahasa Arab)
// dan Mapel Umum (Matematika, Bahasa Indonesia, IPAS, Pend Pancasila, SBdP, PJOK)
export const SEED_MATERI: MateriPembelajaran[] = [
  {
    id: 'mat-k6-1',
    judul: 'Ketentuan Makanan Halal dan Haram serta Hikmahnya bagi Tubuh',
    mapel: 'Fikih',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Makanan & Minuman yang Halal Lagi Baik (Halalan Thayyiban)',
    tujuanPembelajaran: 'Peserta didik kelas 6 mampu menganalisis kriteria makanan yang halal menurut zat, cara memperoleh, dan cara mengolahnya, serta mengidentifikasi jenis makanan yang diharamkan dalam Al-Qur`an (bangkai, darah mengalir, babi, sembelihan tanpa menyebut asma Allah) beserta hikmah medis dan spiritualnya.',
    materi: `Makanan halal adalah segala jenis makanan yang diperbolehkan oleh syariat Islam untuk dikonsumsi. Allah SWT berfirman dalam Surah Al-Baqarah ayat 168:
"Wahai manusia! Makanlah dari makanan yang halal dan baik yang terdapat di bumi..."

A. Tiga Syarat Kehalalan Makanan:
1. Halal Li-dzatihi (Zatnya): Zat makanannya sendiri tidak najis dan tidak dilarang syariat (contoh: beras, sayuran, daging sapi yang disembelih secara syar'i).
2. Halal Li-ghairihi (Cara Mendapatkannya): Diperoleh dari usaha yang halal, bukan hasil mencuri, korupsi, atau menipu sesama.
3. Halal Thayyiban (Cara Mengolah & Kesehatannya): Bersih, higienis, tidak mengandung racun/kedaluwarsa, serta bermanfaat bagi stamina dan kecerdasan tubuh.

B. Makanan yang Diharamkan dalam Al-Qur'an (Surah Al-Ma'idah ayat 3):
1. Bangkai (kecuali bangkai ikan dan belalang yang halal).
2. Darah yang mengalir (damman masfuhan).
3. Daging babi dan seluruh produk turunannya.
4. Hewan yang disembelih atas nama selain Allah.
5. Hewan yang mati tercekik, terpukul, terjatuh, tertanduk, atau diterkam binatang buas kecuali sempat disembelih syar'i sebelum mati.
6. Binatang buas yang bertaring tajam dan burung yang berkuku cengkeram kuat.

C. Manfaat dan Hikmah Mengonsumsi Makanan Halal:
- Doa lebih cepat diijabah oleh Allah SWT.
- Membentuk akhlak mulia dan hati yang tenang.
- Menjaga kesehatan organ pencernaan dari penyakit biologis.
- Terhindar dari siksa api neraka.`,
    instruksi: '1. Bacalah rangkuman materi Fikih Kelas 6 di atas secara teliti.\n2. Tuliskan 3 perbedaan antara bangkai hewan darat dan bangkai laut (ikan) di buku catatan Fikih.\n3. Periksa kemasan 2 produk makanan ringan di rumahmu: catat logo Halal Kemenag/MUI dan nomor registrasinya pada form tugas.',
    linkReferensi: 'https://kemenag.go.id/fikih-mi-kelas-6',
    videoUrl: 'https://www.youtube.com/watch?v=sample-fikih-makanan-halal-k6',
    lampiranNama: 'Lembar_Ringkasan_Fikih_Kelas_6_MIN1Paser.pdf',
    tanggalDibuat: '2026-08-10',
  },
  {
    id: 'mat-k6-2',
    judul: 'Memahami Makna Hari Akhir (Kiamat Sugra & Kubra) dan Hikmah Iman',
    mapel: 'Akidah Akhlak',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Meneguhkan Iman kepada Hari Kiamat',
    tujuanPembelajaran: 'Peserta didik kelas 6 dapat menguraikan makna iman kepada Hari Akhir (rukun iman ke-5), membedakan tanda Kiamat Sugra (kematian, bencana lokal) dan Kiamat Kubra (matahari terbit dari barat, sangkakala Israfil), serta menerapkan perilaku istikamah dan tanggung jawab amal.',
    materi: `Iman kepada Hari Akhir adalah meyakini dengan sepenuh hati bahwa seluruh alam semesta dan seisinya akan mengalami kehancuran total atas kehendak Allah SWT, lalu manusia akan dibangkitkan untuk mempertanggungjawabkan perbuatannya di hadapan Allah.

A. Pembagian Kiamat:
1. Kiamat Sugra (Kiamat Kecil):
Kehancuran sebagian alam atau kematian yang menimpa individu makhluk hidup.
Contoh: Meninggalnya seseorang, bencana alam gempa bumi, banjir, tanah longsor.
Dalil: "Tiap-tiap yang berjiwa akan merasakan mati." (QS. Ali 'Imran: 185).

2. Kiamat Kubra (Kiamat Besar):
Kehancuran total seluruh alam semesta, bintang-bintang berjatuhan, bumi diguncangkan sehebat-hebatnya, dan sangkakala ditiup oleh Malaikat Israfil.
Tanda-tanda Kiamat Kubra: Munculnya Dajjal, turunnya Nabi Isa AS, terbitnya matahari dari arah barat, keluarnya Yakjuj dan Makjuj.

B. Tahapan Perjalanan Hari Akhir:
1. Yaumul Ba'ats: Hari kebangkitan dari kubur.
2. Yaumul Mahsyar: Hari dikumpulkannya seluruh manusia di Padang Mahsyar yang terik.
3. Yaumul Hisab: Hari perhitungan seluruh amal perbuatan sekecil biji zarrah.
4. Yaumul Mizan: Hari penimbangan berat amal kebaikan melawan amal keburukan.
5. Shirathal Mustaqim: Jembatan yang dibentangkan di atas neraka menuju surga Allah SWT.`,
    instruksi: 'Catat 5 nama hari akhir (nama lain Yaumul Qiyamah) beserta artinya di buku tulis Akidah Akhlak Kelas 6. Tuliskan 3 sikap yang kamu lakukan setiap hari di madrasah sebagai wujud iman bahwa segala amal dicatat malaikat Raqib dan Atid.',
    linkReferensi: 'https://kemenag.go.id/akidah-akhlak-mi-kelas-6',
    tanggalDibuat: '2026-08-15',
  },
  {
    id: 'mat-k6-3',
    judul: 'Hukum Bacaan Mad Lazim Mukhaffaf dan Mutsaqqal Kalimi serta Harfi',
    mapel: "Al-Qur'an Hadis",
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 2: Memperdalam Kaidah Ilmu Tajwid Lanjutan',
    tujuanPembelajaran: 'Peserta didik kelas 6 mampu menganalisis hukum tajwid Mad Far`i khususnya Mad Lazim (Mukhaffaf Kalimi, Mutsaqqal Kalimi, Mukhaffaf Harfi, Mutsaqqal Harfi) dengan panjang bacaan 6 harakat (3 alif) serta mempraktikkannya pada bacaan surah Al-Fatihah dan surah pembuka (Fawatihussuwar).',
    materi: `Mad secara bahasa artinya memanjangkan suara. Mad Lazim adalah Mad Far'i yang wajib dibaca panjang sebanyak 6 harakat (3 alif) tanpa boleh dikurangi.

1. Mad Lazim Mutsaqqal Kalimi (مُثَقَّل كَلِمِي):
Terjadi apabila huruf Mad bertemu dengan huruf bertasydid dalam SATU KATA.
Cara membaca: Dipanjangkan 6 harakat lalu ditekan (diberatkan) pada huruf yang bertasydid.
Contoh Utama: Kata وَلَا الضَّآلِّينَ (QS. Al-Fatihah: 7), kata الْحَآقَّةُ (QS. Al-Haqqah: 1).

2. Mad Lazim Mukhaffaf Kalimi (مُخَفَّف كَلِمِي):
Terjadi apabila huruf Mad bertemu huruf bersukun asli (bukan karena waqaf) dalam SATU KATA dan tidak bertasydid (ringan).
Dalam mushaf Al-Qur'an hanya ada satu lafaz, yaitu: آلْآنَ (dibaca Aal-aana) pada QS. Yunus ayat 51 dan 91.

3. Mad Lazim Harfi (pada huruf potong awal surah / Fawatihussuwar):
- Mutsaqqal Harfi: Mengandung idgham karena huruf berikutnya diidghamkan (contoh: الم - lafaz Laam Miim).
- Mukhaffaf Harfi: Tidak ada idgham (contoh: ق - Qaaf, ص - Shaad, ن - Nuun).
Panjang bacaan: Tetap 6 harakat (3 alif).`,
    instruksi: 'Praktikkan membaca ayat terakhir surah Al-Fatihah dengan menahan panjang Mad Lazim Mutsaqqal Kalimi tepat 6 ketukan harakat. Buka Al-Qur`an, temukan 2 contoh Mad Lazim pada Juz 29 atau 30!',
    linkReferensi: 'https://kemenag.go.id/quran-hadis-mi-kelas-6',
    tanggalDibuat: '2026-08-20',
  },
  {
    id: 'mat-k6-4',
    judul: 'Sejarah Masuknya Islam di Nusantara & Peran Wali Songo di Tanah Jawa',
    mapel: 'Sejarah Kebudayaan Islam (SKI)',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Jejak Dakwah Islam di Nusantara',
    tujuanPembelajaran: 'Peserta didik kelas 6 mampu menjelaskan saluran masuknya Islam ke Nusantara (perdagangan, perkawinan, pendidikan pesantren, tasawuf, dan kesenian) serta mengidentifikasi strategi dakwah damai dan kearifan lokal Wali Songo (Sunan Gresik hingga Sunan Kalijaga).',
    materi: `Islam masuk ke Nusantara secara damai tanpa peperangan. Para saudagar muslim dari Gujarat, Persia, dan Arab berlabuh di pelabuhan pesisir seperti Samudera Pasai, Malaka, Gresik, Tuban, hingga pesisir Kalimantan Timur (Kerajaan Kutai Kartanegara dan Paser).

A. Saluran Penyebaran Islam di Nusantara:
1. Jalur Perdagangan: Hubungan maritim antar pulau yang ramah dan jujur dalam bertransaksi.
2. Jalur Perkawinan: Saudagar muslim menikah dengan putri adipati atau bangsawan lokal.
3. Jalur Pendidikan Pesantren: Didirikannya padepokan dan pondok pesantren oleh para ulama.
4. Jalur Kesenian: Penggunaan media wayang kulit, tembang ilir-ilir, dan gamelan oleh Sunan Kalijaga dan Sunan Bonang untuk menarik simpati masyarakat secara bijak.

B. Teladan Wali Songo (Sembilan Tokoh Dakwah):
- Maulana Malik Ibrahim (Sunan Gresik): Perintis dakwah, mengajarkan pertanian dan pengobatan.
- Raden Rahmat (Sunan Ampel): Ajaran "Mo Limo" (menolak 5 perkara maksiat).
- Raden Makhdum Ibrahim (Sunan Bonang): Gamelan bonang dan tembang Tombo Ati.
- Raden Mas Said (Sunan Kalijaga): Akulturasi budaya Islam dengan busana lurik dan lakon wayang.`,
    instruksi: 'Tuliskan rangkuman 4 jalur penyebaran Islam di buku catatan SKI Kelas 6. Ceritakan secara singkat bagaimana Sunan Kalijaga memanfaatkan kesenian wayang kulit sebagai sarana dakwah tauhid!',
    linkReferensi: 'https://kemenag.go.id/ski-mi-kelas-6',
    tanggalDibuat: '2026-08-22',
  },
  {
    id: 'mat-k6-5',
    judul: 'Teks Bacaan Percakapan: Aktivitas di Madrasah (فِي الْمَدْرَسَةِ)',
    mapel: 'Bahasa Arab',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Ad-Darsul Awwal: As-Sa`ah wal Ansyithah fil Madrasah (السَّاعَةُ وَالْأَنْشِطَةُ)',
    tujuanPembelajaran: 'Peserta didik kelas 6 mampu melafalkan mufrodat tentang jam (as-sa`ah) dan aktivitas harian di madrasah, menyusun kalimat tanya "Fii ayyi saa`atin..." (Pada jam berapa...), serta melakukan hiwar (percakapan) sederhana dalam bahasa Arab.',
    materi: `Mufrodat Pilihan Waktu dan Jam (السَّاعَةُ):
- السَّاعَةُ الْوَاحِدَةُ (As-Saa'atul Waahidah) = Pukul 01.00
- السَّاعَةُ السَّادِسَةُ (As-Saa'atus Saadisah) = Pukul 06.00
- السَّاعَةُ السَّابِعَةُ صَبَاحًا (As-Saa'atus Saabi'ah shabaahan) = Pukul 07.00 pagi
- وَالنِّصْفُ (wan-nishfu) = Lebih 30 menit
- وَالرُّبْعُ (war-rub'u) = Lebih 15 menit
- إِلَّا رُبْعًا (illaa rub'an) = Kurang 15 menit

Pola Kalimat Tanya dan Jawab:
Pertanyaan: فِي أَيِّ سَاعَةٍ تَذْهَبُ إِلَى الْمَدْرَسَةِ؟
(Fii ayyi saa'atin tadzhabu ilal madrasati?) = Pada jam berapa kamu berangkat ke madrasah?
Jawaban: أَذْهَبُ إِلَى الْمَدْرَسَةِ فِي السَّاعَةِ السَّادِسَةِ وَالنِّصْفِ صَبَاحًا
(Adzhabu ilal madrasati fiis saa'atis saadisati wan nishfi shabaahan) = Saya berangkat ke madrasah pada pukul 06.30 pagi.`,
    instruksi: 'Hafalkan kosakata jam 1 sampai 12. Praktikkan membaca percakapan di atas berpasangan atau di depan cermin, lalu kumpulkan rekaman suara lafalmu!',
    linkReferensi: 'https://kemenag.go.id/bahasa-arab-mi-kelas-6',
    tanggalDibuat: '2026-08-25',
  },
  {
    id: 'mat-k6-6',
    judul: 'Operasi Hitung Campuran Bilangan Bulat Negatif dan Positif',
    mapel: 'Matematika',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Bilangan Bulat Negatif dalam Kehidupan Sehari-hari',
    tujuanPembelajaran: 'Peserta didik kelas 6 mampu melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan bulat (positif dan negatif) serta menyelesaikan masalah kontekstual yang melibatkan perubahan suhu, ketinggian, dan kedalaman air laut.',
    materi: `Bilangan bulat terdiri atas bilangan bulat positif, bilangan nol, dan bilangan bulat negatif (disebelah kiri angka nol pada garis bilangan).

A. Prinsip Penjumlahan dan Pengurangan:
1. Menjumlahkan dua bilangan bertanda sama: Jumlahkan angkanya dan tandanya tetap.
   Contoh: (-8) + (-5) = -13
2. Menjumlahkan dua bilangan beda tanda: Kurangkan angka besar dengan angka kecil, tandanya mengikuti angka yang bernilai mutlak lebih besar.
   Contoh: (-15) + 20 = +5 ; 12 + (-20) = -8
3. Aturan Pengurangan: Ubah operasi pengurangan menjadi penjumlahan dengan lawan dari bilangan pengurang!
   a - b = a + (-b)
   Contoh: 7 - (-9) = 7 + (+9) = 16 ; (-6) - 10 = (-6) + (-10) = -16

B. Prinsip Perkalian dan Pembagian Bilangan Bulat:
- Positif x Positif = Positif (+)
- Negatif x Negatif = Positif (+)
- Positif x Negatif = Negatif (-)
- Negatif x Positif = Negatif (-)
Contoh: (-7) x (-8) = +56 ; (-45) : (+9) = -5

C. Urutan Hierarki Operasi Campuran (KABATAKU):
1. Tanda Kurung (...) didahulukan.
2. Perkalian (x) dan Pembagian (:) setara (kerjakan urut dari kiri ke kanan).
3. Penjumlahan (+) dan Pengurangan (-) setara (kerjakan urut dari kiri ke kanan).
Contoh: 25 + (-5) x 4 = 25 + (-20) = 5.`,
    instruksi: 'Kerjakan soal latihan latihan nomor 1 sampai 5 di buku tulis Matematika Kelas 6. Gunakan langkah penyelesaian KABATAKU yang runtut!',
    linkReferensi: 'https://buku.kemdikbud.go.id/matematika-kelas-6-merdeka',
    tanggalDibuat: '2026-08-28',
  },
  {
    id: 'mat-k6-7',
    judul: 'Menelaah Struktur dan Unsur Kebahasaan Teks Eksplanasi Ilmiah',
    mapel: 'Bahasa Indonesia',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 2: Menjelaskan Fenomena Alam dan Sosial Lewat Tulisan Ilmiah',
    tujuanPembelajaran: 'Peserta didik kelas 6 mampu menganalisis struktur teks eksplanasi ilmiah (pernyataan umum, deretan penjelas sebab-akibat, dan kesimpulan/interpretasi) serta menggunakan konjungsi kausalitas dan kronologis dengan benar.',
    materi: `Teks eksplanasi ilmiah adalah teks yang menjelaskan terjadinya suatu peristiwa alam, ilmu pengetahuan, atau fenomena sosial berdasarkan fakta ilmiah (bukan fiksi atau opini belaka).

A. Struktur Teks Eksplanasi:
1. Pernyataan Umum (General Statement): Berisi pengenalan awal topik atau fenomena yang dibahas (misalnya: definisi gerhana bulan atau penemuan listrik oleh Michael Faraday).
2. Deretan Penjelas (Urutan Sebab-Akibat): Berisi rangkaian penjelasan mendalam tentang proses atau alasan fenomena tersebut bisa terjadi secara bertahap dan logis.
3. Interpretasi / Kesimpulan: Berisi intisari, rangkuman, atau pandangan penulis terkait fenomena yang dijelaskan.

B. Kaidah Kebahasaan Teks Eksplanasi:
- Menggunakan kalimat pasif (contoh: energi listrik disalurkan melalui gardu transmisi).
- Menggunakan konjungsi kausalitas (sebab-akibat): karena, oleh sebab itu, sehingga, jika.
- Menggunakan konjungsi kronologis (urutan waktu): pertama, kemudian, lalu, setelah itu.
- Menggunakan istilah ilmiah baku sesuai Kamus Besar Bahasa Indonesia (KBBI).`,
    instruksi: 'Bacalah satu artikel teks eksplanasi tentang "Penemuan Arus Listrik dan Manfaatnya bagi Dunia". Tentukan bagian Pernyataan Umum, Deretan Penjelas, dan Kesimpulannya!',
    linkReferensi: 'https://buku.kemdikbud.go.id/bahasa-indonesia-kelas-6',
    tanggalDibuat: '2026-09-01',
  },
  {
    id: 'mat-k6-8',
    judul: 'Sistem Pernapasan Manusia: Organ, Mekanisme Dada-Perut, dan Penyakit',
    mapel: 'IPAS',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Bagaimana Tubuh Kita Bergerak dan Bernapas?',
    tujuanPembelajaran: 'Peserta didik kelas 6 dapat mengidentifikasi urutan organ pernapasan manusia (hidung, faring, laring, trakea, bronkus, bronkiolus, alveolus), membedakan pernapasan dada dan pernapasan perut, serta menganalisis cara menjaga kesehatan organ paru-paru.',
    materi: `Bernapas adalah proses menghirup oksigen (O2) dari udara dan menghembuskan karbon dioksida (CO2) serta uap air dari dalam tubuh.

A. Urutan Jalur Saluran Pernapasan Manusia:
1. Rongga Hidung: Udara disaring oleh rambut hidung, dihangatkan oleh konka, dan dilembapkan oleh selaput lendir.
2. Faring (Tekak): Persimpangan antara saluran pernapasan dan pencernaan.
3. Laring: Terdapat pita suara dan epiglotis (katup penutup makanan).
4. Trakea (Batang Tenggorokan): Pipa berongga yang tersusun dari cincin tulang rawan dan memiliki silia penyapu debu kotoran.
5. Bronkus: Cabang tenggorokan menuju paru-paru kanan dan paru-paru kiri.
6. Bronkiolus: Percabangan halus dari bronkus di dalam paru-paru.
7. Alveolus: Kantung udara kecil tempat terjadinya pertukaran gas O2 dan CO2 secara difusi dengan pembuluh kapiler darah.

B. Perbedaan Mekanisme Pernapasan:
- Pernapasan Dada: Menggunakan otot antartulang rusuk (otot interkostal). Saat inspirasi tulang rusuk terangkat, rongga dada membesar, tekanan paru mengecil, udara masuk.
- Pernapasan Perut: Menggunakan otot sekat rongga badan (diafragma). Saat inspirasi diafragma mendatar, rongga dada membesar, udara terhisap masuk.

C. Gangguan Sistem Pernapasan:
Asma, bronkitis, influenza, pneumonia, dan emfisema akibat paparan asap rokok dan polusi udara.`,
    instruksi: 'Gambarkan bagan organ pernapasan manusia dari hidung hingga alveolus pada buku gambar A4. Beri warna berbeda pada paru-paru kanan dan kiri, lalu kumpulkan foto baganmu!',
    linkReferensi: 'https://buku.kemdikbud.go.id/ipas-kelas-6-merdeka',
    tanggalDibuat: '2026-09-03',
  },
  {
    id: 'mat-k6-9',
    judul: 'Penerapan Nilai-Nilai Sila Pancasila dalam Kehidupan Berbangsa',
    mapel: 'Pendidikan Pancasila',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Menjiwai Nilai Pancasila dalam Tindakan Nyata',
    tujuanPembelajaran: 'Peserta didik kelas 6 mampu menganalisis contoh perilaku yang mencerminkan pengamalan Sila 1 sampai Sila 5 Pancasila dalam lingkungan madrasah, keluarga, dan masyarakat majemuk di Kabupaten Paser.',
    materi: `Pancasila adalah dasar negara dan pandangan hidup bangsa Indonesia. Bagi peserta didik Madrasah Ibtidaiyah, nilai Pancasila sejalan dengan nilai-nilai luhur Islam Rahmatan Lil 'Alamin.

1. Sila Pertama: Ketuhanan Yang Maha Esa (Simbol Bintang Emas)
- Menjalankan ibadah salat fardhu tepat waktu.
- Menghormati teman yang berbeda keyakinan tanpa mengejek.
- Membina kerukunan antarumat beragama di lingkungan sekitar.

2. Sila Kedua: Kemanusiaan yang Adil dan Beradab (Simbol Rantai Emas)
- Gemar menolong korban musibah banjir atau musibah kebakaran.
- Menjenguk teman sekelas yang sedang terbaring sakit di rumah sakit.
- Menolak segala bentuk perundungan (bullying) baik fisik maupun verbal.

3. Sila Ketiga: Persatuan Indonesia (Simbol Pohon Beringin)
- Cinta tanah air dan bangga menggunakan produk buatan dalam negeri.
- Mengutamakan persatuan suku Jawa, Bugis, Banjar, Paser, Dayak di madrasah.

4. Sila Keempat: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan (Kepala Banteng)
- Melakukan musyawarah mufakat saat pemilihan ketua kelas 6.
- Menghargai dan menerima hasil keputusan rapat dengan lapang dada.

5. Sila Kelima: Keadilan Sosial bagi Seluruh Rakyat Indonesia (Padi dan Kapas)
- Hidup hemat, gemar menabung di tabungan madrasah, dan tidak bergaya hidup boros.
- Menghormati hak-hak orang lain dan tidak merusak fasilitas umum.`,
    instruksi: 'Tuliskan 2 contoh nyata pengamalan Sila ke-2 dan Sila ke-4 yang pernah kamu lakukan sendiri di MIN 1 Paser selama 1 bulan terakhir!',
    linkReferensi: 'https://buku.kemdikbud.go.id/pendidikan-pancasila-kelas-6',
    tanggalDibuat: '2026-09-05',
  },
  {
    id: 'mat-k6-10',
    judul: 'Mengenal Reklame: Poster, Brosur, Baliho, dan Spanduk Edukatif',
    mapel: 'SBdP',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Seni Rupa - Reklame Media Komunikasi Visual',
    tujuanPembelajaran: 'Peserta didik kelas 6 dapat membedakan reklame komersial dan non-komersial, menganalisis ciri-ciri poster yang efektif (singkat, jelas, warna kontras, gambar komunikatif), serta merancang draf poster kampanye peduli lingkungan madrasah.',
    materi: `Reklame adalah suatu media atau sarana untuk menyampaikan informasi, mengajak, mempromosikan, dan menawarkan suatu produk barang, jasa, atau pesan sosial kepada masyarakat luas.

A. Jenis Reklame Berdasarkan Tujuannya:
1. Reklame Komersial: Bertujuan untuk mencari keuntungan materiil (contoh: iklan susu, toko buku, perlengkapan seragam madrasah).
2. Reklame Non-Komersial: Bertujuan mengajak masyarakat melakukan tindakan positif tanpa mencari keuntungan finansial (contoh: himbauan hemat air, poster menjaga kebersihan madrasah, poster stop bullying).

B. Syarat-Syarat Reklame yang Baik dan Menarik:
- Pesan Jelas dan Singkat: Mudah dipahami dalam sekali pandang oleh pembaca yang berjalan.
- Huruf yang Terbaca: Menggunakan tipografi tegas, berjarak pas, dan kontras dengan warna latar.
- Komposisi Visual Seimbang: Proporsi antara gambar ilustrasi dan teks tulisan harmonis.
- Menggunakan Kalimat Ajakan Persuasif: Contoh: "Buanglah Sampah pada Tempatnya, Madrasah Sehat Ibadahpun Khusyuk!".`,
    instruksi: 'Rancanglah draf satu poster berukuran A4 bertema "Peduli Lingkungan & Hemat Energi di MIN 1 Paser". Lengkapi dengan slogan menarik dan gambar berwarna!',
    linkReferensi: 'https://buku.kemdikbud.go.id/sbdp-kelas-6',
    tanggalDibuat: '2026-09-08',
  },
];

// TUGAS KHUSUS KELAS 6 FASE C
export const SEED_TUGAS: Tugas[] = [
  {
    id: 'tgs-k6-1',
    judul: 'Analisis Soal Cerita Operasi Hitung Campuran Bilangan Bulat',
    mapel: 'Matematika',
    kelas: 6,
    fase: 'Fase C',
    materiTerkait: 'Operasi Hitung Campuran Bilangan Bulat Negatif dan Positif',
    instruksi: 'Selesaikan 5 soal cerita bilangan bulat berikut secara mandiri dengan menuliskan langkah KABATAKU yang runtut:\n1. Suhu di ruang pendingin mula-mula adalah -8°C. Karena listrik padam, suhu naik 3°C setiap 15 menit. Berapakah suhu ruangan setelah listrik padam selama 1 jam?\n2. Hitung hasil dari: (-125) : 5 + 40 x (-3) - (-50) = ...\n3. Seorang penyelam berada di kedalaman 18 meter di bawah permukaan laut (-18 m). Kemudian ia naik setinggi 7 meter, lalu menyelam lagi turun 4 meter. Di kedalaman berapa meter posisi penyelam sekarang?\n4. Pak Ahmad memiliki hutang sebesar Rp 60.000. Hari ini ia membayar Rp 45.000, kemudian meminjam lagi Rp 20.000. Tuliskan dalam bentuk bilangan bulat dan berapa sisa hutangnya?\n5. Tuliskan kesimpulan hukum tanda perkalian negatif dikali negatif!',
    batasWaktu: '2026-10-18T23:59',
    jenis: 'Isian',
    bobotNilai: 100,
    tanggalDibuat: '2026-09-10',
  },
  {
    id: 'tgs-k6-2',
    judul: 'Praktik Uji Identifikasi Kriteria Makanan Halal & Cek Barcode BPJPH',
    mapel: 'Fikih',
    kelas: 6,
    fase: 'Fase C',
    materiTerkait: 'Ketentuan Makanan Halal dan Haram serta Hikmahnya bagi Tubuh',
    instruksi: 'Carilah 2 bungkus makanan ringan atau bumbu dapur di rumahmu. Catat:\n1. Nama Merk Produk\n2. Nomor Sertifikat Halal BPJPH Kemenag / MUI\n3. Tanggal Kedaluwarsa (Expired Date)\n4. Tuliskan 3 bahan komposisi utama dan apakah semuanya halal Li-dzatihi.\nKumpulkan laporan teks atau foto kemasannya di form pengumpulan tugas!',
    batasWaktu: '2026-10-22T23:59',
    jenis: 'Praktik',
    bobotNilai: 100,
    tanggalDibuat: '2026-09-12',
  },
  {
    id: 'tgs-k6-3',
    judul: 'Proyek Pembuatan Model Alat Peraga Sederhana Paru-Paru Manusia',
    mapel: 'IPAS',
    kelas: 6,
    fase: 'Fase C',
    materiTerkait: 'Sistem Pernapasan Manusia: Organ, Mekanisme Dada-Perut, dan Penyakit',
    instruksi: 'Buatlah model alat peraga paru-paru sederhana dari bahan botol plastik bekas 1.5 liter, sedotan plastik (trakea & bronkus), dan 2 balon karet (paru-paru & diafragma). Ambil foto atau rekam video singkat 1 menit demonstrasi saat membran diafragma ditarik ke bawah dan balon mengembang.',
    batasWaktu: '2026-10-25T23:59',
    jenis: 'Proyek',
    bobotNilai: 100,
    tanggalDibuat: '2026-09-14',
  },
  {
    id: 'tgs-k6-4',
    judul: 'Portofolio Penulisan Naskah Pidato Kelulusan Madrasah & Toleransi',
    mapel: 'Bahasa Indonesia',
    kelas: 6,
    fase: 'Fase C',
    materiTerkait: 'Menelaah Struktur dan Unsur Kebahasaan Teks Eksplanasi Ilmiah',
    instruksi: 'Tuliskan satu naskah pidato persuasif perpisahan kelas 6 sebanyak 3-4 paragraf yang berisi ucapan terima kasih kepada guru-guru MIN 1 Paser, permohonan maaf atas khilaf, dan pesan semangat melanjutkan ke jenjang MTs/SMP. Terapkan tanda baca dan kalimat efektif sesuai kaidah Bahasa Indonesia.',
    batasWaktu: '2026-10-28T23:59',
    jenis: 'Portofolio',
    bobotNilai: 100,
    tanggalDibuat: '2026-09-16',
  },
];

// PENGUMPULAN TUGAS SISWA KELAS 6
export const SEED_PENGUMPULAN: PengumpulanTugas[] = [
  {
    id: 'sub-k6-1',
    tugasId: 'tgs-k6-1',
    siswaId: 's-k6-1', // Zahra Amelia Putri
    tanggalKumpul: '2026-09-14T15:20',
    isiJawaban: `Jawaban Zahra Amelia Putri (Kelas 6, Absen 1):
1. Waktu padam = 1 jam = 60 menit. Kenaikan = (60:15) x 3°C = 4 x 3°C = 12°C. Suhu akhir = (-8°C) + 12°C = 4°C.
2. (-125) : 5 + 40 x (-3) - (-50) = (-25) + (-120) + 50 = (-145) + 50 = -95.
3. Posisi penyelam = (-18) + 7 - 4 = (-11) - 4 = -15 meter (berada di 15 meter di bawah permukaan laut).
4. Hutang = -60.000 + 45.000 = -15.000. Meminjam lagi = -15.000 + (-20.000) = -35.000. Sisa hutang Pak Ahmad adalah Rp 35.000.
5. Dua bilangan bertanda negatif jika dikalikan selalu menghasilkan bilangan positif karena operasi tanda saling membalik arah pada garis bilangan.`,
    nilai: 100,
    catatanGuru: 'Sangat sempurna Zahra! Runtutan langkah pengerjaan KABATAKU sangat rapi dan logis. Pertahankan prestasi belajarmu!',
    status: 'Sudah Dinilai',
  },
  {
    id: 'sub-k6-2',
    tugasId: 'tgs-k6-1',
    siswaId: 's-k6-2', // Umar Firdaus
    tanggalKumpul: '2026-09-15T10:15',
    isiJawaban: `Jawaban Umar Firdaus (Kelas 6, Absen 2):
1. 4°C (karena naik 12 derajat dari minus 8).
2. (-25) + (-120) + 50 = -95.
3. (-18) + 7 = -11, lalu -11 - 4 = -15 meter di bawah laut.
4. Sisa hutang = Rp 35.000 (bentuk bulat: -35.000).
5. Negatif dikali negatif hasilnya positif.`,
    nilai: 96,
    catatanGuru: 'Bagus sekali Umar! Langkah pengerjaan sudah benar dan tepat waktu.',
    status: 'Sudah Dinilai',
  },
  {
    id: 'sub-k6-3',
    tugasId: 'tgs-k6-2',
    siswaId: 's-k6-1',
    tanggalKumpul: '2026-09-18T16:30',
    isiJawaban: `Laporan Identifikasi Makanan Halal oleh Zahra Amelia:
1. Produk A: Biskuit Gandum Roma Kelapa. No Halal ID: ID00410000000001021. Exp: 12 Desember 2027. Komposisi: Tepung gandum, minyak nabati, kelapa parut, gula. Semua bahan halal Li-dzatihi.
2. Produk B: Susu UHT Cokelat. No Halal: ID00110000034211122. Exp: 05 Mei 2027. Menggunakan susu sapi segar higienis bersertifikasi BPOM dan halal BPJPH Kemenag RI.`,
    linkTugas: 'https://drive.google.com/min1paser-fikih-k6-zahra',
    nilai: 98,
    catatanGuru: 'Laporan investigasi kemasan yang sangat cermat. Zahra telah memahami pentingnya sertifikasi halal.',
    status: 'Sudah Dinilai',
  },
];

// KUIS INTERAKTIF KHUSUS KELAS 6 FASE C
export const SEED_KUIS: KuisInteraktif[] = [
  {
    id: 'kuis-k6-1',
    judul: 'Asesmen Formatif Fikih Kelas 6: Makanan & Minuman Halal Haram',
    mapel: 'Fikih',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Makanan & Minuman yang Halal Lagi Baik',
    tujuanPembelajaran: 'Mengukur penguasaan konsep syarat makanan halal, jenis bangkai yang dikecualikan, dan ayat pengharaman babi dalam QS. Al-Maidah ayat 3.',
    durasiMenit: 15,
    tanggalDibuat: '2026-09-05',
    aktif: true,
    soal: [
      {
        id: 'soal-k6-1-1',
        pertanyaan: 'Berdasarkan QS. Al-Baqarah ayat 168, Allah SWT memerintahkan seluruh manusia untuk memakan makanan yang halal dan "thayyib". Arti dari perkataan "thayyib" adalah ...',
        opsiA: 'Harganya mahal dan bermerk luar negeri',
        opsiB: 'Baik, sehat, bersih, dan bermanfaat bagi tubuh',
        opsiC: 'Berjumlah sangat banyak sampai kenyang',
        opsiD: 'Diolah dengan bumbu yang pedas',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Kata Thayyiban bermakna baik secara mutu, higienis, bergizi seimbang, dan tidak menimbulkan mudarat bagi kesehatan fisik serta pikiran manusia.',
      },
      {
        id: 'soal-k6-1-2',
        pertanyaan: 'Rasulullah SAW menjelaskan ada dua bangkai yang halal dimakan oleh umat Islam tanpa disembelih terlebih dahulu, yaitu bangkai ...',
        opsiA: 'Ayam dan bebek',
        opsiB: 'Sapi dan kambing',
        opsiC: 'Ikan dan belalang',
        opsiD: 'Kelinci dan burung dara',
        kunciJawaban: 'C',
        bobot: 20,
        pembahasan: 'Berdasarkan hadis riwayat Ibnu Majah dan Ahmad: "Dihalalkan bagi kita dua macam bangkai dan dua macam darah. Adapun dua bangkai adalah ikan dan belalang, sedangkan dua darah adalah hati dan limpa."',
      },
      {
        id: 'soal-k6-1-3',
        pertanyaan: 'Pak Ahmad menyembelih seekor sapi jantan yang sehat. Namun saat menyembelih, beliau sengaja tidak membaca Basmalah dan mempersembahkannya untuk sesajen pohon keramat. Hukum memakan daging sapi tersebut adalah ...',
        opsiA: 'Halal karena sapi hewan jinak',
        opsiB: 'Makruh karena mubazir jika dibuang',
        opsiC: 'Haram karena disembelih atas nama selain Allah',
        opsiD: 'Mubah jika sudah dimasak matang',
        kunciJawaban: 'C',
        bobot: 20,
        pembahasan: 'QS. Al-Maidah ayat 3 menegaskan haram memakan hewan yang disembelih atas nama selain Allah (persembahan berhala/sesajen kemusyrikan).',
      },
      {
        id: 'soal-k6-1-4',
        pertanyaan: 'Apabila seseorang memakan makanan yang didapatkan dari hasil mencuri uang madrasah, maka makanan tersebut menjadi haram karena faktor ...',
        opsiA: 'Haram Li-dzatihi',
        opsiB: 'Haram Li-ghairihi',
        opsiC: 'Haram mutlak bawaan lahir',
        opsiD: 'Haram karena kedaluwarsa',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Haram Li-ghairihi terjadi ketika zat makanannya suci/halal (misal nasi/roti), namun cara mendapatkannya melanggar hukum syariat (mencuri/menipu).',
      },
      {
        id: 'soal-k6-1-5',
        pertanyaan: 'Berikut ini yang merupakan hikmah utama membiasakan diri mengonsumsi makanan yang halal adalah ...',
        opsiA: 'Menjadikan tubuh cepat gemuk dan mewah',
        opsiB: 'Doa mudah dikabulkan Allah dan terpelihara hati dari perbuatan tercela',
        opsiC: 'Mendapat pujian sebagai orang paling kaya di madrasah',
        opsiD: 'Bebas dari kewajiban berpuasa di bulan Ramadan',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Mengonsumsi rezeki halal merupakan syarat utama terkabulnya doa seorang hamba dan menumbuhkan cahaya kebaikan dalam kalbu.',
      },
    ],
  },
  {
    id: 'kuis-k6-2',
    judul: 'Kuis Interaktif Matematika Kelas 6: Operasi Campuran KABATAKU',
    mapel: 'Matematika',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Bilangan Bulat Positif dan Negatif',
    tujuanPembelajaran: 'Menguji ketelitian siswa kelas 6 dalam menyelesaikan operasi perkalian, pembagian, penjumlahan bilangan bulat negatif dan positif.',
    durasiMenit: 15,
    tanggalDibuat: '2026-09-08',
    aktif: true,
    soal: [
      {
        id: 'soal-k6-2-1',
        pertanyaan: 'Hasil dari perhitungan (-18) + (-27) adalah ...',
        opsiA: '45',
        opsiB: '-45',
        opsiC: '-9',
        opsiD: '9',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Menjumlahkan dua bilangan yang keduanya bertanda negatif: 18 + 27 = 45, tandanya negatif sehingga menjadi -45.',
      },
      {
        id: 'soal-k6-2-2',
        pertanyaan: 'Hasil dari 15 - (-25) adalah ...',
        opsiA: '-10',
        opsiB: '10',
        opsiC: '40',
        opsiD: '-40',
        kunciJawaban: 'C',
        bobot: 20,
        pembahasan: '15 - (-25) = 15 + (+25) = 40.',
      },
      {
        id: 'soal-k6-2-3',
        pertanyaan: 'Hasil dari perkalian (-12) x (-8) adalah ...',
        opsiA: '96',
        opsiB: '-96',
        opsiC: '84',
        opsiD: '-84',
        kunciJawaban: 'A',
        bobot: 20,
        pembahasan: 'Negatif dikali negatif menghasilkan tanda positif: (-12) x (-8) = +96.',
      },
      {
        id: 'soal-k6-2-4',
        pertanyaan: 'Hasil dari operasi campuran: 50 + (-10) x 4 adalah ...',
        opsiA: '160',
        opsiB: '10',
        opsiC: '-10',
        opsiD: '-90',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Dahulukan operasi perkalian: (-10) x 4 = -40. Kemudian hitung 50 + (-40) = 10.',
      },
      {
        id: 'soal-k6-2-5',
        pertanyaan: 'Suhu puncak gunung mula-mula adalah -4°C. Saat malam hari suhu turun lagi sebesar 7°C. Berapakah suhu puncak gunung di malam hari?',
        opsiA: '3°C',
        opsiB: '-3°C',
        opsiC: '-11°C',
        opsiD: '11°C',
        kunciJawaban: 'C',
        bobot: 20,
        pembahasan: 'Suhu mula-mula -4°C, turun 7°C artinya dikurangi 7: (-4) - 7 = (-4) + (-7) = -11°C.',
      },
    ],
  },
  {
    id: 'kuis-k6-3',
    judul: 'Kuis IPA Terpadu Kelas 6: Sistem Organ Pernapasan Manusia',
    mapel: 'IPAS',
    kelas: 6,
    fase: 'Fase C',
    babTopik: 'Bab 1: Bagaimana Tubuh Kita Bernapas?',
    tujuanPembelajaran: 'Menguji pemahaman tentang fungsi alveolus, trakea, selaput pleura, serta mekanisme pertukaran oksigen dan karbon dioksida.',
    durasiMenit: 15,
    tanggalDibuat: '2026-09-11',
    aktif: true,
    soal: [
      {
        id: 'soal-k6-3-1',
        pertanyaan: 'Bagian organ pernapasan yang menjadi tempat utama pertukaran gas oksigen (O2) dan karbon dioksida (CO2) adalah ...',
        opsiA: 'Trakea',
        opsiB: 'Bronkiolus',
        opsiC: 'Alveolus',
        opsiD: 'Laring',
        kunciJawaban: 'C',
        bobot: 20,
        pembahasan: 'Alveolus berdinding sangat tipis dan dikelilingi kapiler darah tempat terjadinya difusi oksigen ke sel darah merah.',
      },
      {
        id: 'soal-k6-3-2',
        pertanyaan: 'Fungsi rambut getar (silia) dan lendir pada trakea (batang tenggorokan) adalah ...',
        opsiA: 'Menghasilkan suara nyaring saat berbicara',
        opsiB: 'Menyaring kotoran dan debu halus yang lolos dari rongga hidung',
        opsiC: 'Menghancurkan gumpalan makanan yang tertelan',
        opsiD: 'Menyimpan cadangan oksigen darurat',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Silia bergerak menyapu kotoran atau kuman ke atas menuju faring agar dapat dibatukkan keluar.',
      },
      {
        id: 'soal-k6-3-3',
        pertanyaan: 'Pada saat bernapas dengan mekanisme pernapasan perut, otot diafragma akan berkontraksi menjadi mendatar sehingga ...',
        opsiA: 'Rongga dada mengecil dan udara keluar',
        opsiB: 'Rongga dada membesar dan udara dari luar masuk ke paru-paru',
        opsiC: 'Jantung berhenti berdetak sesaat',
        opsiD: 'Tekanan udara di dalam paru-paru meningkat tajam',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Ketika diafragma mendatar saat inspirasi, volume rongga dada membesar, tekanan paru turun di bawah tekanan atmosfer sehingga udara luar mengalir masuk.',
      },
      {
        id: 'soal-k6-3-4',
        pertanyaan: 'Selaput ganda yang membungkus dan melindungi organ paru-paru dari gesekan tulang rusuk disebut ...',
        opsiA: 'Perikardium',
        opsiB: 'Pleura',
        opsiC: 'Meninges',
        opsiD: 'Diafragma',
        kunciJawaban: 'B',
        bobot: 20,
        pembahasan: 'Pleura adalah selaput pembungkus paru-paru yang mengandung cairan pelumas untuk mengurangi gesekan saat mengembang kempis.',
      },
      {
        id: 'soal-k6-3-5',
        pertanyaan: 'Gangguan penyempitan saluran pernapasan yang disebabkan oleh reaksi alergi terhadap debu, serbuk bunga, atau udara dingin disebut ...',
        opsiA: 'Pneumonia',
        opsiB: 'TBC',
        opsiC: 'Asma',
        opsiD: 'Emfisema',
        kunciJawaban: 'C',
        bobot: 20,
        pembahasan: 'Asma adalah penyakit penyempitan saluran bronkus yang umumnya dipicu reaksi hipersensitivitas atau alergi.',
      },
    ],
  },
];

// HASIL KUIS KELAS 6
export const SEED_HASIL_KUIS: HasilKuis[] = [
  {
    id: 'hk-k6-1',
    kuisId: 'kuis-k6-1',
    siswaId: 's-k6-1', // Zahra Amelia Putri
    tanggalSelesai: '2026-09-06T10:45',
    jawabanSiswa: {
      'soal-k6-1-1': 'B',
      'soal-k6-1-2': 'C',
      'soal-k6-1-3': 'C',
      'soal-k6-1-4': 'B',
      'soal-k6-1-5': 'B',
    },
    totalSkor: 100,
    nilaiAkhir: 100,
    jumlahBenar: 5,
    jumlahSalah: 0,
  },
  {
    id: 'hk-k6-2',
    kuisId: 'kuis-k6-1',
    siswaId: 's-k6-2', // Umar Firdaus
    tanggalSelesai: '2026-09-06T11:15',
    jawabanSiswa: {
      'soal-k6-1-1': 'B',
      'soal-k6-1-2': 'C',
      'soal-k6-1-3': 'C',
      'soal-k6-1-4': 'A', // keliru
      'soal-k6-1-5': 'B',
    },
    totalSkor: 80,
    nilaiAkhir: 80,
    jumlahBenar: 4,
    jumlahSalah: 1,
  },
  {
    id: 'hk-k6-3',
    kuisId: 'kuis-k6-2',
    siswaId: 's-k6-1', // Zahra Amelia
    tanggalSelesai: '2026-09-09T09:30',
    jawabanSiswa: {
      'soal-k6-2-1': 'B',
      'soal-k6-2-2': 'C',
      'soal-k6-2-3': 'A',
      'soal-k6-2-4': 'B',
      'soal-k6-2-5': 'C',
    },
    totalSkor: 100,
    nilaiAkhir: 100,
    jumlahBenar: 5,
    jumlahSalah: 0,
  },
];

// PRESENSI KHUSUS KELAS 6
export const SEED_ABSENSI: AbsensiRecord[] = [
  { id: 'abs-k6-1', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-1', status: 'Hadir' },
  { id: 'abs-k6-2', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-2', status: 'Hadir' },
  { id: 'abs-k6-3', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-3', status: 'Hadir' },
  { id: 'abs-k6-4', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-4', status: 'Hadir' },
  { id: 'abs-k6-5', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-5', status: 'Hadir' },
  { id: 'abs-k6-6', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-6', status: 'Izin', catatan: 'Pelatihan Duta Moderasi Beragama Kemenag Paser' },
  { id: 'abs-k6-7', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-7', status: 'Hadir' },
  { id: 'abs-k6-8', tanggal: '2026-09-29', kelas: 6, siswaId: 's-k6-8', status: 'Hadir' },
];

// NILAI REKAPITULASI KELAS 6
export const SEED_NILAI: NilaiSiswa[] = [
  {
    id: 'nil-k6-1',
    siswaId: 's-k6-1', // Zahra Amelia
    mapel: 'Fikih',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    nilaiTugas: 98,
    nilaiKuis: 100,
    nilaiPraktik: 96,
    nilaiProyek: 95,
    nilaiUjian: 97,
    catatanGuru: 'Sangat istimewa! Menguasai dalil makanan halal dan senantiasa menjadi teladan adab di kelas 6.',
  },
  {
    id: 'nil-k6-2',
    siswaId: 's-k6-1', // Zahra Amelia
    mapel: 'Matematika',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    nilaiTugas: 100,
    nilaiKuis: 100,
    nilaiPraktik: 95,
    nilaiProyek: 94,
    nilaiUjian: 98,
    catatanGuru: 'Kecakapan berpikir logis dan pemecahan masalah soal cerita KABATAKU sangat mengagumkan.',
  },
  {
    id: 'nil-k6-3',
    siswaId: 's-k6-2', // Umar Firdaus
    mapel: 'Fikih',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    nilaiTugas: 95,
    nilaiKuis: 80,
    nilaiPraktik: 98,
    nilaiProyek: 90,
    nilaiUjian: 88,
    catatanGuru: 'Praktik hafalan dan adab sangat tinggi. Tingkatkan ketelitian pada evaluasi teori soal kuis.',
  },
  {
    id: 'nil-k6-4',
    siswaId: 's-k6-3', // Muhammad Nabil
    mapel: 'IPAS',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    nilaiTugas: 96,
    nilaiKuis: 95,
    nilaiPraktik: 98,
    nilaiProyek: 97,
    nilaiUjian: 95,
    catatanGuru: 'Bakat sains sangat menonjol, pembuatan peraga paru-paru sangat inspiratif bagi teman-temannya.',
  },
  {
    id: 'nil-k6-5',
    siswaId: 's-k6-4', // Fathiyyah Nur Aisyah
    mapel: "Al-Qur'an Hadis",
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    nilaiTugas: 98,
    nilaiKuis: 95,
    nilaiPraktik: 100,
    nilaiProyek: 96,
    nilaiUjian: 97,
    catatanGuru: 'Makharijul huruf dan penerapan kaidah hukum Mad Lazim Kalimi dan Harfi sangat fasih dan tartil.',
  },
];

// PORTOFOLIO KARYA KELAS 6
export const SEED_PORTOFOLIO: PortofolioKarya[] = [
  {
    id: 'port-k6-1',
    siswaId: 's-k6-1',
    judul: 'Laporan Proyek Model Alat Peraga Paru-Paru Manusia dan Mekanisme Inspirasi',
    kategori: 'Proyek',
    mapel: 'IPAS',
    tanggal: '2026-09-18',
    deskripsi: 'Model pernapasan menggunakan tabung transparan dan balon elastis diafragma. Berhasil mendemonstrasikan hukum fisika tekanan rongga dada saat menarik napas.',
    mediaUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    catatanGuru: 'Karya inovatif yang sangat aplikatif untuk media pembelajaran rekan sekelas.',
  },
  {
    id: 'port-k6-2',
    siswaId: 's-k6-2',
    judul: 'Rekaman Video Praktik Adzan dan Khutbah Jumat Cilik di Musala MIN 1 Paser',
    kategori: 'Dokumentasi Praktik',
    mapel: 'Fikih',
    tanggal: '2026-09-22',
    deskripsi: 'Praktik khutbah jumat singkat bertema "Birrul Walidain dan Menjaga Silaturahmi" dengan intonasi mantap dan rukun khutbah yang lengkap.',
    mediaUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80',
    catatanGuru: 'Suara lantang, artikulasi fasih, dan penuh penghayatan. Calon dai madrasah masa depan.',
  },
  {
    id: 'port-k6-3',
    siswaId: 's-k6-4',
    judul: 'Mushaf Mini Tulisan Tangan Surah Al-Haqqah Berhiaskan Hukum Mad Lazim',
    kategori: 'Karya',
    mapel: "Al-Qur'an Hadis",
    tanggal: '2026-09-24',
    deskripsi: 'Kaligrafi mushaf Al-Qur`an dengan memberi kode warna merah pada lafaz Mad Lazim Mutsaqqal Kalimi.',
    mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    catatanGuru: 'Sangat rapi, indah, dan mendalam segi ilmu tajwidnya.',
  },
];

// PENGUMUMAN KHUSUS KELAS 6
export const SEED_PENGUMUMAN: Pengumuman[] = [
  {
    id: 'ann-k6-1',
    judul: 'Persiapan Pendalaman Materi & Try Out Ujian Madrasah Kelas 6 TP 2026/2027',
    konten: `Assalamu'alaikum Wr. Wb.\n\nDiberitahukan kepada seluruh siswa-siswi Kelas 6 MIN 1 Paser bahwa program pendalaman materi (bimbel intensif) dan Try Out Asesmen Madrasah Berbasis Digital (CBT) akan dimulai pada pekan ke-2 Oktober 2026.\n\nMateri yang diujikan mencakup:\n1. Kelompok Mata Pelajaran Agama (Al-Qur'an Hadis, Akidah Akhlak, Fikih, SKI, Bahasa Arab)\n2. Kelompok Mata Pelajaran Umum (Matematika, Bahasa Indonesia, IPAS, Pendidikan Pancasila)\n\nSeluruh siswa dimohon rajin mengulang materi ajar di LMS ini dan menyelesaikan latihan soal secara berkala.\n\nWassalamu'alaikum Wr. Wb.`,
    tanggal: '2026-09-26',
    kategori: 'Penting',
    targetKelas: 6,
    aktif: true,
    dipin: true,
  },
  {
    id: 'ann-k6-2',
    judul: 'Jadwal Pembuatan Pas Foto Ijazah & Verifikasi Berkas Kelulusan Kelas 6',
    konten: 'Pemotretan pas foto ijazah dan rapor akhir kelulusan kelas 6 akan dilaksanakan pada hari Kamis, 8 Oktober 2026. Siswa wajib memakai seragam madrasah lengkap beratribut rapi, jilbab putih bagi siswi dan peci hitam bagi siswa.',
    tanggal: '2026-09-20',
    kategori: 'Kegiatan',
    targetKelas: 6,
    aktif: true,
    dipin: false,
  },
  {
    id: 'ann-k6-3',
    judul: 'Sosialisasi Program Lanjutan Masuk MTs Negeri 1 Paser & Pesantren',
    konten: 'Pihak madrasah mengundang orang tua/wali murid kelas 6 untuk hadir pada sosialisasi jalur prestasi akademik dan tahfidz masuk MTsN 1 Paser serta pondok pesantren unggulan di Kalimantan Timur pada Sabtu mendatang.',
    tanggal: '2026-09-15',
    kategori: 'Umum',
    targetKelas: 6,
    aktif: true,
    dipin: false,
  },
];

// Helper to get from localstorage with fallback to default seed
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  getSettings(): MadrasahSettings {
    return getStorage<MadrasahSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings: MadrasahSettings): void {
    setStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  getSiswa(): PesertaDidik[] {
    return getStorage<PesertaDidik[]>(STORAGE_KEYS.SISWA, SEED_SISWA);
  },
  saveSiswa(siswa: PesertaDidik[]): void {
    setStorage(STORAGE_KEYS.SISWA, siswa);
  },

  getMateri(): MateriPembelajaran[] {
    return getStorage<MateriPembelajaran[]>(STORAGE_KEYS.MATERI, SEED_MATERI);
  },
  saveMateri(materi: MateriPembelajaran[]): void {
    setStorage(STORAGE_KEYS.MATERI, materi);
  },

  getTugas(): Tugas[] {
    return getStorage<Tugas[]>(STORAGE_KEYS.TUGAS, SEED_TUGAS);
  },
  saveTugas(tugas: Tugas[]): void {
    setStorage(STORAGE_KEYS.TUGAS, tugas);
  },

  getPengumpulan(): PengumpulanTugas[] {
    return getStorage<PengumpulanTugas[]>(STORAGE_KEYS.PENGUMPULAN, SEED_PENGUMPULAN);
  },
  savePengumpulan(pengumpulan: PengumpulanTugas[]): void {
    setStorage(STORAGE_KEYS.PENGUMPULAN, pengumpulan);
  },

  getKuis(): KuisInteraktif[] {
    return getStorage<KuisInteraktif[]>(STORAGE_KEYS.KUIS, SEED_KUIS);
  },
  saveKuis(kuis: KuisInteraktif[]): void {
    setStorage(STORAGE_KEYS.KUIS, kuis);
  },

  getHasilKuis(): HasilKuis[] {
    return getStorage<HasilKuis[]>(STORAGE_KEYS.HASIL_KUIS, SEED_HASIL_KUIS);
  },
  saveHasilKuis(hasil: HasilKuis[]): void {
    setStorage(STORAGE_KEYS.HASIL_KUIS, hasil);
  },

  getAbsensi(): AbsensiRecord[] {
    return getStorage<AbsensiRecord[]>(STORAGE_KEYS.ABSENSI, SEED_ABSENSI);
  },
  saveAbsensi(absensi: AbsensiRecord[]): void {
    setStorage(STORAGE_KEYS.ABSENSI, absensi);
  },

  getNilai(): NilaiSiswa[] {
    return getStorage<NilaiSiswa[]>(STORAGE_KEYS.NILAI, SEED_NILAI);
  },
  saveNilai(nilai: NilaiSiswa[]): void {
    setStorage(STORAGE_KEYS.NILAI, nilai);
  },

  getPortofolio(): PortofolioKarya[] {
    return getStorage<PortofolioKarya[]>(STORAGE_KEYS.PORTOFOLIO, SEED_PORTOFOLIO);
  },
  savePortofolio(portofolio: PortofolioKarya[]): void {
    setStorage(STORAGE_KEYS.PORTOFOLIO, portofolio);
  },

  getPengumuman(): Pengumuman[] {
    return getStorage<Pengumuman[]>(STORAGE_KEYS.PENGUMUMAN, SEED_PENGUMUMAN);
  },
  savePengumuman(pengumuman: Pengumuman[]): void {
    setStorage(STORAGE_KEYS.PENGUMUMAN, pengumuman);
  },

  resetAllData(): void {
    localStorage.clear();
    setStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    setStorage(STORAGE_KEYS.SISWA, SEED_SISWA);
    setStorage(STORAGE_KEYS.MATERI, SEED_MATERI);
    setStorage(STORAGE_KEYS.TUGAS, SEED_TUGAS);
    setStorage(STORAGE_KEYS.PENGUMPULAN, SEED_PENGUMPULAN);
    setStorage(STORAGE_KEYS.KUIS, SEED_KUIS);
    setStorage(STORAGE_KEYS.HASIL_KUIS, SEED_HASIL_KUIS);
    setStorage(STORAGE_KEYS.ABSENSI, SEED_ABSENSI);
    setStorage(STORAGE_KEYS.NILAI, SEED_NILAI);
    setStorage(STORAGE_KEYS.PORTOFOLIO, SEED_PORTOFOLIO);
    setStorage(STORAGE_KEYS.PENGUMUMAN, SEED_PENGUMUMAN);
  },

  exportFullBackup(): string {
    const backup = {
      settings: this.getSettings(),
      siswa: this.getSiswa(),
      materi: this.getMateri(),
      tugas: this.getTugas(),
      pengumpulan: this.getPengumpulan(),
      kuis: this.getKuis(),
      hasilKuis: this.getHasilKuis(),
      absensi: this.getAbsensi(),
      nilai: this.getNilai(),
      portofolio: this.getPortofolio(),
      pengumuman: this.getPengumuman(),
      backupDate: new Date().toISOString(),
      khususKelas: 6,
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.saveSettings(data.settings);
      if (data.siswa) this.saveSiswa(data.siswa);
      if (data.materi) this.saveMateri(data.materi);
      if (data.tugas) this.saveTugas(data.tugas);
      if (data.pengumpulan) this.savePengumpulan(data.pengumpulan);
      if (data.kuis) this.saveKuis(data.kuis);
      if (data.hasilKuis) this.saveHasilKuis(data.hasilKuis);
      if (data.absensi) this.saveAbsensi(data.absensi);
      if (data.nilai) this.saveNilai(data.nilai);
      if (data.portofolio) this.savePortofolio(data.portofolio);
      if (data.pengumuman) this.savePengumuman(data.pengumuman);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },
};
