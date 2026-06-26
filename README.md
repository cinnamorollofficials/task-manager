# Task Management System

Aplikasi Task Management System sederhana yang dibangun menggunakan **Express.js, React.js (Vite), dan MySQL**. Aplikasi ini didesain menggunakan **Material Design 3 Expressive Theme** untuk memberikan antarmuka pengguna yang premium, modern, dan sangat responsif.

---

## Fitur Utama (MVP)
1. **Autentikasi Pengguna**:
   - Register akun baru.
   - Login dengan pengembalian token JWT.
   - Logout (menghapus token di sisi client).
   - Proteksi route (halaman utama hanya dapat diakses setelah login).
2. **Manajemen Tugas (CRUD)**:
   - Membuat tugas baru dengan *Title*, *Description*, *Status*, dan *Deadline*.
   - Menampilkan daftar tugas milik masing-masing user.
   - Memperbarui tugas (edit judul, deskripsi, status, deadline).
   - Menghapus tugas dengan konfirmasi dialog.
3. **Filter & Live Search**:
   - Menyaring tugas berdasarkan status (`Pending`, `In Progress`, `Selesai`).
   - Pencarian tugas real-time (live search) berdasarkan judul.

---

## Desain Antarmuka (Material Design 3 Expressive)
- **Tema Visual**: Sleek Dark Mode menggunakan palet warna kontras tinggi M3.
- **Bentuk (Shapes)**: Sudut melengkung yang menonjol (`rounded-3xl` / 24px) untuk kartu, tombol pill, dan dialog modal.
- **Mikro-Animasi**: Efek hover interaktif, active scaling (ripple-like), dan overlay modal transparan dengan blur (`backdrop-blur`).

---

## Panduan Instalasi & Jalankan Lokal

### 1. Prasyarat
- Node.js (versi 16 atau lebih baru)
- MySQL Database

### 2. Setup Database
1. Buka MySQL client Anda (PhpMyAdmin, Laragon, DBeaver, dll.).
2. Buat database baru bernama `task_manager`.
3. Import berkas `backend/schema.sql` untuk menginisialisasi tabel `users` dan `tasks`.

### 3. Setup Backend
1. Buka terminal di folder `backend/`.
2. Duplikat file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan konfigurasi database Anda di dalam file `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=task_manager
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Install dependensi:
   ```bash
   npm install
   ```
5. Jalankan server backend (development mode):
   ```bash
   npm run dev
   ```
   *Server backend akan berjalan di `http://localhost:5000`.*

### 4. Setup Frontend
1. Buka terminal baru di folder `frontend/`.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   *Aplikasi frontend akan berjalan di `http://localhost:5173` atau port yang tertera pada terminal.*

---

## Menjalankan Menggunakan Docker (Rekomendasi - Cukup 1 Klik)

Aplikasi ini sudah mendukung Docker Compose untuk inisialisasi instan tanpa perlu install MySQL atau Node secara lokal.
1. Pastikan **Docker** dan **Docker Compose** telah terinstal di komputer Anda.
2. Jalankan perintah berikut di direktori root project:
   ```bash
   docker-compose up --build
   ```
3. Docker secara otomatis akan:
   - Membuat database MySQL dan mengimport `schema.sql`.
   - Menjalankan server backend Express di `http://localhost:5000`.
   - Menjalankan aplikasi frontend React di `http://localhost:3000`.

---

## Dokumentasi RESTful API Endpoints

### 1. Autentikasi (`/api/auth`)
- **Register Akun Baru**:
  - `POST /api/auth/register`
  - Body (JSON):
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "secretpassword"
    }
    ```
- **Login**:
  - `POST /api/auth/login`
  - Body (JSON):
    ```json
    {
      "email": "john@example.com",
      "password": "secretpassword"
    }
    ```
  - Response (JSON):
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
    ```

### 2. Manajemen Tugas (`/api/tasks`)
*Seluruh endpoint di bawah wajib menyertakan Header: `Authorization: Bearer <token>`*

- **Ambil Semua Tugas (Mendukung Search & Filter)**:
  - `GET /api/tasks`
  - Query Params (Opsional):
    - `status`: `pending` | `in-progress` | `done`
    - `search`: Kata kunci pencarian judul (misal: `laporan`)
- **Buat Tugas Baru**:
  - `POST /api/tasks`
  - Body (JSON):
    ```json
    {
      "title": "Belajar React M3",
      "description": "Mempelajari integrasi Material Design 3 di Tailwind",
      "status": "in-progress",
      "deadline": "2026-06-30"
    }
    ```
- **Update Tugas**:
  - `PUT /api/tasks/:id`
  - Body (JSON): Mengirimkan field yang ingin diupdate saja (parsial).
- **Hapus Tugas**:
  - `DELETE /api/tasks/:id`
