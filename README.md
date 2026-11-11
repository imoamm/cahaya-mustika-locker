# Cahaya Mustika Internesia — Locker (Zeco & Vivorti)
Website statis tanpa build. Buka `index.html` atau unggah folder ini ke hosting/GitHub Pages.
Halaman: index, pages/produk, portofolio, artikel (+4 artikel), kontak.
WhatsApp: +62 811-3301-819. Nama model & deskripsi produk adalah contoh; sesuaikan dengan katalog resmi.

## Cara mengganti gambar placeholder
Gambar placeholder ada di `assets/images/`. Cara termudah: **timpa file dengan foto Anda, pakai nama file yang sama.**

| Bagian | Folder | Ukuran disarankan |
|---|---|---|
| Lokasi Penerapan (Beranda) | `assets/images/lokasi/` | 1200×800 px (`perkantoran.webp`: 800×1100 px, kartunya tinggi) |
| Portofolio (9 kartu) | `assets/images/portofolio/` | 1200×850 px |
| Artikel (4 gambar) | `assets/images/artikel/` | 1200×750 px |

- Gambar otomatis dipotong (crop) agar pas kartu, jadi objek utama sebaiknya di tengah foto.
- Semua gambar memakai format `.webp`. Jika mengganti dengan JPG/PNG, konversi dulu ke `.webp` agar nama file tetap sama.
- Satu gambar artikel dipakai di 3 tempat (utama, terbaru, carousel), jadi cukup ganti sekali per artikel.
- Kompres foto (disarankan di bawah 200 KB per gambar) agar situs tetap cepat.
- Isi atribut `alt=""` pada gambar di portofolio dan artikel dengan deskripsi singkat untuk SEO/aksesibilitas.
