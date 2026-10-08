// Landing page KLINIK SEHAT BERSAMA, klinik pratama di Yogyakarta.
// Self-contained: tidak memakai AuthenticatedLayout, tidak menerima props.
// Header/nav + footer inline.
import { useMemo, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import {
    Baby,
    CalendarCheck,
    CheckCircle2,
    Clock,
    FlaskConical,
    HeartPulse,
    MapPin,
    Menu,
    Phone,
    Pill,
    Siren,
    Stethoscope,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia.
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

interface Layanan {
    nama: string;
    deskripsi: string;
    icon: LucideIcon;
    tarifMulai: number;
}

const LAYANAN: Layanan[] = [
    { nama: 'Poli Umum', deskripsi: 'Pemeriksaan kesehatan umum, surat sehat, dan konsultasi keluhan harian.', icon: Stethoscope, tarifMulai: 50000 },
    { nama: 'Poli Gigi', deskripsi: 'Pembersihan karang gigi, tambal, cabut gigi, dan behel oleh dokter gigi.', icon: HeartPulse, tarifMulai: 75000 },
    { nama: 'Poli Anak', deskripsi: 'Imunisasi, tumbuh kembang, dan penanganan keluhan kesehatan anak.', icon: Baby, tarifMulai: 60000 },
    { nama: 'Laboratorium', deskripsi: 'Cek darah lengkap, gula darah, kolesterol, asam urat, dan tes kehamilan.', icon: FlaskConical, tarifMulai: 35000 },
    { nama: 'Apotek', deskripsi: 'Obat resep dan non-resep dengan harga transparan, dilayani apoteker.', icon: Pill, tarifMulai: 0 },
    { nama: 'Khitanan', deskripsi: 'Layanan khitan modern metode laser dengan pendampingan dokter anak.', icon: CheckCircle2, tarifMulai: 900000 },
];

interface Dokter {
    nama: string;
    gelar: string;
    spesialisasi: string;
    poli: string;
    jadwal: string;
}

const DOKTER: Dokter[] = [
    { nama: 'dr. Sinta Maharani', gelar: 'dr.', spesialisasi: 'Dokter Umum', poli: 'Poli Umum', jadwal: 'Senin, Sabtu • 08.00, 12.00' },
    { nama: 'dr. Andi Wijaya', gelar: 'dr.', spesialisasi: 'Dokter Umum', poli: 'Poli Umum', jadwal: 'Senin, Jumat • 16.00, 20.00' },
    { nama: 'drg. Budi Hartono', gelar: 'drg.', spesialisasi: 'Dokter Gigi', poli: 'Poli Gigi', jadwal: 'Senin, Rabu, Jumat • 09.00, 15.00' },
    { nama: 'dr. Rina Lestari, Sp.A', gelar: 'dr.', spesialisasi: 'Spesialis Anak', poli: 'Poli Anak', jadwal: 'Selasa, Kamis, Sabtu • 10.00, 14.00' },
    { nama: 'dr. Dewi Anggraini', gelar: 'dr.', spesialisasi: 'Dokter Umum', poli: 'Poli Umum', jadwal: 'Sabtu, Minggu • 08.00, 12.00' },
    { nama: 'apt. Fajar Nugroho', gelar: 'apt.', spesialisasi: 'Apoteker', poli: 'Apotek', jadwal: 'Setiap hari • 08.00, 21.00' },
];

const JADWAL_PRAKTIK = [
    { poli: 'Poli Umum', seninJumat: '08.00, 20.00', sabtu: '08.00, 16.00', minggu: '08.00, 12.00' },
    { poli: 'Poli Gigi', seninJumat: '09.00, 15.00', sabtu: '09.00, 13.00', minggu: 'Tutup' },
    { poli: 'Poli Anak', seninJumat: '10.00, 14.00', sabtu: '10.00, 14.00', minggu: 'Tutup' },
    { poli: 'Laboratorium', seninJumat: '07.00, 20.00', sabtu: '07.00, 16.00', minggu: '08.00, 12.00' },
    { poli: 'Apotek', seninJumat: '08.00, 21.00', sabtu: '08.00, 21.00', minggu: '08.00, 21.00' },
];

const ALUR_BOOKING = [
    { langkah: '1', judul: 'Pilih Poli', deskripsi: 'Tentukan layanan yang dibutuhkan: umum, gigi, anak, atau laboratorium.' },
    { langkah: '2', judul: 'Pilih Tanggal & Dokter', deskripsi: 'Sesuaikan jadwal praktik dokter dengan waktumu lewat formulir di bawah.' },
    { langkah: '3', judul: 'Isi Data Diri', deskripsi: 'Nama, nomor HP aktif, dan keluhan singkat agar dokter siap melayani.' },
    { langkah: '4', judul: 'Konfirmasi via WhatsApp', deskripsi: 'Nomor antrean dikirim ke WhatsApp-mu. Datang 15 menit sebelum jadwal.' },
];

const STATS = [
    { label: 'Pasien terlayani', value: 25000, suffix: '+' },
    { label: 'Dokter & tenaga medis', value: 18, suffix: '' },
    { label: 'Tahun melayani', value: 15, suffix: '' },
    { label: 'Tingkat kepuasan', value: 98, suffix: '%' },
];

const GALERI = [
    { judul: 'Ruang tunggu yang nyaman', foto: '/images/landing-klinik/galeri-ruang-tunggu.jpg' },
    { judul: 'Laboratorium modern', foto: '/images/landing-klinik/galeri-lab.jpg' },
    { judul: 'Peralatan medis terstandar', foto: '/images/landing-klinik/galeri-stetoskop.jpg' },
    { judul: 'Fasilitas bersih & rapi', foto: '/images/landing-klinik/galeri-koridor.jpg' },
];

export default function KlinikLanding() {
    const [menuBuka, setMenuBuka] = useState(false);

    // Form booking, state saja, tanpa backend.
    const [nama, setNama] = useState('');
    const [poli, setPoli] = useState('');
    const [dokter, setDokter] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jam, setJam] = useState('');
    const [bookingOk, setBookingOk] = useState(false);

    const hariIni = useMemo(() => {
        const d = new Date();
        const bln = String(d.getMonth() + 1).padStart(2, '0');
        const tgl = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${bln}-${tgl}`;
    }, []);

    // IGD buka 24 jam setiap hari.
    const statusIgd = useMemo(() => ({ buka: true }), []);

    function kirimBooking(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !poli || !tanggal || !jam) return;
        setBookingOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#layanan', label: 'Layanan' },
        { href: '#dokter', label: 'Dokter' },
        { href: '#jadwal', label: 'Jadwal' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#booking', label: 'Booking' },
        { href: '#lokasi', label: 'Lokasi' },
    ];

    return (
        <div className="min-h-screen bg-teal-50/60 pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700">
                            <HeartPulse className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                            KLINIK <span className="text-teal-700">SEHAT BERSAMA</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-teal-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-teal-700 hover:bg-teal-800 sm:inline-flex" asChild>
                        <a href="#booking">Booking Online</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-teal-900/10 px-4 py-2 lg:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-teal-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,.12) 0, transparent 40%), radial-gradient(circle at 15% 85%, rgba(255,255,255,.08) 0, transparent 40%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">Klinik Pratama • Yogyakarta</Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Nomor Antrean <span className="text-teal-200">Dikirim ke WhatsApp.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-teal-100/90">
                            Daftar online, datang pas giliranmu tiba, tanpa duduk berjam-jam di ruang tunggu.
                            Poli umum, gigi, anak, lab, dan apotek. Menerima pasien umum dan BPJS.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-white text-teal-800 hover:bg-teal-50" asChild>
                                <a href="#booking">Booking Jadwal</a>
                            </Button>
                            <a href="#layanan" className="text-sm font-semibold text-teal-100 underline-offset-4 hover:underline">
                                atau lihat layanannya dulu →
                            </a>
                        </div>
                        <div className="mt-8 flex items-center gap-2.5 rounded-xl bg-white/10 p-3 text-sm">
                            <span className="relative flex h-3 w-3">
                                <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60', statusIgd.buka && 'bg-green-400')} />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
                            </span>
                            <span className="font-medium">IGD buka 24 jam setiap hari, (0274) 555-0100</span>
                        </div>
                    </div>
                    <div className="relative mx-auto hidden w-full max-w-md sm:flex lg:max-w-lg">
                        <img src="/images/landing-klinik/hero.jpg" alt="Dokter Klinik Sehat Bersama saat konsultasi" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
                        <div className="absolute top-4 left-4 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-teal-800 shadow-lg">BPJS & Umum</div>
                        <div className="absolute right-4 bottom-4 rounded-2xl bg-teal-950 px-4 py-2 text-xs font-semibold text-teal-100 shadow-lg">Sejak 2011</div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {STATS.map((s) => (
                        <Card key={s.label} className="text-center">
                            <CardContent className="p-5">
                                <StatCounter value={s.value} suffix={s.suffix} className="text-3xl font-extrabold text-teal-700" />
                                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Layanan */}
            <section id="layanan" className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-center">
                    <Badge variant="outline" className="border-teal-700/30 text-teal-700">Layanan Kami</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Satu Atap untuk Semua Kebutuhan Kesehatan</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Tarif transparan sejak awal, tidak ada biaya tersembunyi.</p>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {LAYANAN.map((l) => (
                        <Card key={l.nama} className="transition-shadow hover:shadow-md">
                            <CardContent className="p-5">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700/10">
                                    <l.icon className="h-5 w-5 text-teal-700" />
                                </span>
                                <p className="mt-3 font-bold">{l.nama}</p>
                                <p className="mt-1 text-sm text-stone-600">{l.deskripsi}</p>
                                <p className="mt-3 text-sm font-bold text-teal-700">
                                    {l.tarifMulai === 0 ? 'Harga sesuai obat' : `Mulai ${rupiah(l.tarifMulai)}`}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Dokter */}
            <section id="dokter" className="bg-white py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <Badge variant="outline" className="border-teal-700/30 text-teal-700">Tim Medis</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Dokter & Tenaga Kesehatan Kami</h2>
                        <p className="mx-auto mt-2 max-w-lg text-stone-600">Seluruh dokter ber-SIP aktif dan berpengalaman menangani pasien setiap hari.</p>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {DOKTER.map((d) => (
                            <Card key={d.nama} className="overflow-hidden">
                                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-800">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-extrabold text-white">
                                        {d.nama.replace(/^(dr\.|drg\.|apt\.)\s*/, '').split(' ').map((w) => w[0]).slice(0, 2).join('')}
                                    </span>
                                </div>
                                <CardContent className="p-4">
                                    <p className="font-bold">{d.nama}</p>
                                    <p className="text-sm text-teal-700">{d.spesialisasi} • {d.poli}</p>
                                    <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-600"><Clock className="h-3.5 w-3.5" /> {d.jadwal}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Jadwal praktik */}
            <section id="jadwal" className="mx-auto max-w-6xl px-4 py-14">
                <div className="text-center">
                    <Badge variant="outline" className="border-teal-700/30 text-teal-700">Jadwal Praktik</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Jam Pelayanan Tiap Poli</h2>
                </div>
                <Card className="mt-8 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Poli / Layanan</TableHead>
                                    <TableHead>Senin, Jumat</TableHead>
                                    <TableHead>Sabtu</TableHead>
                                    <TableHead>Minggu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {JADWAL_PRAKTIK.map((j) => (
                                    <TableRow key={j.poli}>
                                        <TableCell className="font-semibold">{j.poli}</TableCell>
                                        <TableCell>{j.seninJumat}</TableCell>
                                        <TableCell>{j.sabtu}</TableCell>
                                        <TableCell>{j.minggu}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
                <p className="mt-3 text-center text-sm text-stone-500">IGD tetap buka 24 jam termasuk hari libur nasional.</p>
            </section>

            {/* Galeri suasana klinik */}
            <section id="galeri" className="bg-stone-950 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Suasana Klinik Sehat Bersama</h2>
                    <p className="mt-1 text-sm text-stone-400">Fasilitas bersih dan nyaman untuk kenyamanan pasien.</p>
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="w-60 shrink-0 overflow-hidden rounded-xl sm:w-72">
                                <img src={g.foto} alt={g.judul} loading="lazy" className="h-40 w-full object-cover sm:h-48" />
                                <p className="bg-stone-900 px-3 py-2.5 text-sm font-medium text-stone-200">{g.judul}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alur booking */}
            <section className="bg-teal-900 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-center text-3xl font-extrabold tracking-tight">Booking Online dalam 4 Langkah</h2>
                    <p className="mx-auto mt-2 max-w-lg text-center text-sm text-teal-200">Tanpa antre lama, nomor urutmu sudah tercatat sebelum datang.</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {ALUR_BOOKING.map((a) => (
                            <div key={a.langkah} className="rounded-2xl bg-white/10 p-5">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400 text-lg font-extrabold text-teal-950">{a.langkah}</span>
                                <p className="mt-3 font-bold">{a.judul}</p>
                                <p className="mt-1 text-sm text-teal-100/85">{a.deskripsi}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perbandingan: datang langsung vs booking online */}
            <section className="mx-auto max-w-6xl px-4 pb-14">
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="border-b p-6 sm:p-8">
                            <h2 className="font-display text-2xl font-extrabold tracking-tight">Booking Online vs Datang Langsung</h2>
                            <p className="mt-1 text-sm text-stone-600">Rata-rata waktu tunggu pasien kami, Januari–September 2026.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/3"> </TableHead>
                                        <TableHead className="bg-teal-700/5 font-bold text-teal-800">Booking online</TableHead>
                                        <TableHead>Datang langsung</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        ['Waktu tunggu rata-rata', '±10 menit', '40–60 menit'],
                                        ['Kepastian dokter', 'Terjadwal, sesuai pilihan', 'Tergantung antrean hari itu'],
                                        ['Ubah jadwal', 'Via WhatsApp, maks. H-1', 'Antre ulang dari awal'],
                                        ['Biaya booking', 'Gratis', ', '],
                                    ].map(([aspek, online, langsung]) => (
                                        <TableRow key={aspek}>
                                            <TableCell className="font-semibold">{aspek}</TableCell>
                                            <TableCell className="bg-teal-700/5 font-semibold text-teal-900">{online}</TableCell>
                                            <TableCell className="text-stone-600">{langsung}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Form booking */}
            <section id="booking" className="mx-auto max-w-6xl px-4 py-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-teal-700/30 text-teal-700">Booking Online</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Daftar Sekarang, Datang Sesuai Jadwal</h2>
                        <p className="mt-2 text-stone-600">
                            Isi formulir, nomor antrean dikirim via WhatsApp maksimal 10 menit setelah pengiriman.
                            Booking H-1 sangat disarankan untuk poli gigi dan anak.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Gratis biaya booking untuk semua poli', 'Bisa reschedule via WhatsApp maksimal H-1', 'Bawa KTP/KK dan kartu BPJS (jika ada) saat datang'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-teal-600 bg-white p-4 shadow-sm">
                            <blockquote className="text-sm italic text-stone-700">
                                “Biasanya nunggu 45 menit sambil gendong anak. Kemarin booking online,
                                dari parkir langsung dipanggil, total 10 menit.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-stone-500">
                                Ibu Siti Rahayu, pasien Poli Anak, 3x berobat tahun ini
                            </figcaption>
                        </figure>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-teal-700" /> Form Booking Pasien</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookingOk ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Booking diterima!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{nama}</span>. Jadwal {poli}
                                        {dokter ? ` dengan ${dokter}` : ''} pada {tanggal} pukul {jam} WIB sudah kami catat.
                                        Nomor antrean akan dikirim via WhatsApp.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setBookingOk(false); setNama(''); setPoli(''); setDokter(''); setTanggal(''); setJam(''); }}>
                                        Buat booking lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimBooking} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bk-nama">Nama pasien</Label>
                                        <Input id="bk-nama" placeholder="cth: Siti Rahayu" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bk-poli">Poli</Label>
                                            <Select value={poli} onValueChange={setPoli} required>
                                                <SelectTrigger id="bk-poli"><SelectValue placeholder="Pilih poli" /></SelectTrigger>
                                                <SelectContent>
                                                    {['Poli Umum', 'Poli Gigi', 'Poli Anak', 'Laboratorium'].map((p) => (
                                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bk-dokter">Dokter (opsional)</Label>
                                            <Select value={dokter} onValueChange={setDokter}>
                                                <SelectTrigger id="bk-dokter"><SelectValue placeholder="Siapa saja" /></SelectTrigger>
                                                <SelectContent>
                                                    {DOKTER.map((d) => (
                                                        <SelectItem key={d.nama} value={d.nama}>{d.nama}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bk-tanggal">Tanggal</Label>
                                            <Input id="bk-tanggal" type="date" min={hariIni} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bk-jam">Jam</Label>
                                            <Select value={jam} onValueChange={setJam} required>
                                                <SelectTrigger id="bk-jam"><SelectValue placeholder="Pilih jam" /></SelectTrigger>
                                                <SelectContent>
                                                    {['08.00', '09.00', '10.00', '11.00', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00'].map((j) => (
                                                        <SelectItem key={j} value={j}>{j} WIB</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800">Kirim Booking</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Lokasi & kontak */}
            <section id="lokasi" className="mx-auto max-w-6xl px-4 pb-16">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="relative min-h-64 bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100" aria-hidden>
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(20,120,110,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(20,120,110,.08) 0 2px, transparent 2px 40px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-600 opacity-40" />
                                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 shadow-lg">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </span>
                                </span>
                                <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow">KLINIK SEHAT BERSAMA</p>
                            </div>
                        </div>
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Lokasi & Kontak</h2>
                            <div className="mt-4 space-y-3 text-sm text-stone-700">
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" /> Jl. Kaliurang KM 5, Sleman, Yogyakarta 55283<br />(depan Kampus UGM sisi utara)</p>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-teal-700" /> (0274) 555-0100 (Pendaftaran & IGD)</p>
                                <p className="flex items-center gap-2"><Siren className="h-4 w-4 shrink-0 text-red-600" /> IGD 24 jam: (0274) 555-0199</p>
                                <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-teal-700" /> Pendaftaran: 07.00, 20.00 WIB</p>
                            </div>
                            <Button size="lg" className="mt-6 w-full bg-green-600 hover:bg-green-700 sm:w-auto" asChild>
                                <a href="https://wa.me/6281212345678?text=Halo%20Klinik%20Sehat%20Bersama!%20Saya%20ingin%20bertanya%20tentang%20jadwal%20dokter." target="_blank" rel="noreferrer">
                                    Chat WhatsApp Klinik
                                </a>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-teal-950 text-teal-200/80">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600">
                                <HeartPulse className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">KLINIK <span className="text-teal-400">SEHAT BERSAMA</span></span>
                        </div>
                        <p className="mt-3 text-sm">Melayani kesehatan keluarga Yogyakarta dengan sepenuh hati sejak 2011.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Jam Pendaftaran</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Senin, Sabtu: 07.00, 20.00</li>
                            <li>Minggu: 07.00, 12.00</li>
                            <li>IGD: 24 jam</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Jl. Kaliurang KM 5, Sleman</li>
                            <li>(0274) 555-0100</li>
                            <li>IGD 24 jam: (0274) 555-0199</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-teal-900 py-4 text-center text-xs">© 2026 Klinik Sehat Bersama, Yogyakarta. Izin operasional Dinkes Sleman No. 445/2011.</div>
            </footer>

            <StickyMobileCta
                variant="call"
                title="Klinik Sehat Bersama"
                subtitle="Pendaftaran pasien • 07.00–20.00"
                actionLabel="Telepon Klinik"
                onAction={() => window.open('tel:+622745550100', '_self')}
            />
        </div>
    );
}
