# Aplikasi Uploader Video/Foto (PHP)

Aplikasi web sederhana untuk mengunggah file video dan foto, kemudian mendapatkan tautan yang dapat dibagikan.

## Fitur

- Unggah file video dan foto (mendukung format umum)
- Drag and drop file atau pilih dari perangkat
- Pratinjau file yang diunggah
- Tautan yang dapat disalin dengan mudah
- Antarmuka yang responsif dan mudah digunakan

## Format File yang Didukung

### Gambar
- PNG (.png)
- JPEG/JPG (.jpg, .jpeg)
- GIF (.gif)
- WebP (.webp)

### Video
- MP4 (.mp4)
- MOV (.mov)
- AVI (.avi)
- MKV (.mkv)
- WebM (.webm)

## Batasan
- Ukuran file maksimum: 100 MB

## Cara Menggunakan

1. Unggah semua file ke server web PHP Anda
2. Pastikan direktori `uploads` memiliki izin tulis (chmod 755)
3. Buka aplikasi melalui browser
4. Pilih file dengan mengklik tombol "Pilih File" atau tarik dan lepas file ke area yang ditentukan
5. Tunggu hingga proses unggah selesai
6. Setelah berhasil, tautan file akan ditampilkan dan dapat disalin dengan tombol "Salin Tautan"

## Struktur Proyek

```
php_uploader/
├── index.html       # Halaman utama aplikasi
├── style.css        # File CSS untuk styling
├── script.js        # File JavaScript untuk interaksi
├── upload.php       # Skrip PHP untuk menangani unggahan
└── uploads/         # Direktori penyimpanan file yang diunggah
```

## Persyaratan Server

- Server web dengan PHP 7.0 atau lebih tinggi
- Konfigurasi PHP dengan `file_uploads = On`
- Nilai `upload_max_filesize` dan `post_max_size` di php.ini minimal 100M
- Izin tulis pada direktori `uploads`
