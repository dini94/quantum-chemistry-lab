# Paket website Gaussian & ORCA — panduan upload

Paket ini berisi situs dokumentasi MkDocs Material. Demo interaktif hanya membuat contoh teks input; demo TIDAK menjalankan Gaussian atau ORCA dan tidak menghitung properti kimia.

## Cara memasang ke repository GitHub yang sudah ada (disarankan)

1. Unduh ZIP ini dan ekstrak di Mac/komputer Anda.
2. Buka repository `quantum-chemistry-lab` di GitHub Desktop. Jika belum ada, pasang GitHub Desktop dari https://desktop.github.com/ lalu pilih **File → Clone repository**.
3. Buka folder lokal repository `quantum-chemistry-lab` melalui menu **Repository → Show in Finder**.
4. Buka folder hasil ekstrak ZIP. Salin isi folder `gaussian-orca-website` ke folder repository lokal. Gabungkan folder `docs` dan `.github` bila diminta. Paket ini menyediakan `mkdocs.yml` dan `requirements.txt`; buat salinan kedua file lama sebelum menimpanya.
5. Di GitHub Desktop, tulis ringkasan commit `Add complete Gaussian ORCA learning module`, klik **Commit to main**, lalu **Push origin**.
6. Di GitHub pada repository, buka **Settings → Pages** dan pastikan source deployment adalah **GitHub Actions**. Setelah push, buka tab **Actions** untuk memeriksa build/deployment.

Jangan mengunggah ZIP mentah ke GitHub: GitHub tidak otomatis mengekstraknya. Upload/commit isi folder yang telah diekstrak.

## Sebelum deployment

Buka `mkdocs.yml`, lalu ganti `YOUR-USERNAME` pada `site_url`, `repo_name`, dan `repo_url` dengan username GitHub Anda. Untuk repository bernama `quantum-chemistry-lab`, URL situs biasanya `https://USERNAME.github.io/quantum-chemistry-lab/`.

## Isi

- `mkdocs.yml`, `requirements.txt`
- `docs/` — beranda, learning path, teori, struktur molekul, input builder, workflows, analisis hasil, publikasi, pustaka software, demo, about
- `docs/assets/` — CSS dan JavaScript demo
- `.github/workflows/deploy.yml` — GitHub Actions deployment
