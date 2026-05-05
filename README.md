# Tugas Besar II3240 Rekayasa Sistem dan Teknologi Informasi


<img width="1411" height="489" alt="image" src="https://github.com/user-attachments/assets/60490653-c047-4251-b1f4-12f7ed12acc3" />

## SPOT: Smart Protection & Object Tracker - Web Dashboard

*Website* ini dikembangkan dalam rangka memenuhi tugas besar II3240 Rekayasa Sistem dan Teknologi Informasi.
Kelompok 5
Anggota:
- Ratukhansa Salsabila / 18223034
- Favian Rafi Laftiyanto / 18223036
- Rafli Dwi Nugraha / 18223038
- Florecita Natawirya / 18223040

### A. Deskripsi

SPOT (Smart Protection & Object Tracker) adalah sistem keamanan IoT terintegrasi berupa perangkat yang dilengkapi dengan dashboard pemantauan berbasis web. Aplikasi dashboard ini memungkinkan pengguna untuk melacak lokasi perangkat secara real-time, memantau status baterai perangkat keras, memantau log aktivitas perangkat, manajemen akun, dan pemantauan visualisasi dan data analitik.

Layanan dashboard ini dapat diakses pada: **https://spot.cirro.my.id/** (Di-deploy menggunakan GitHub Pages).

Layanan Web Dashboard ini dikembangkan dengan memanfaatkan integrasi Hybrid antara Backend-as-a-Service (BaaS) dan protokol WebSockets (MQTT). Berikut adalah layanan yang dimanfaatkan pada dashboard ini:
1. **Supabase (Backend & Database)**: Digunakan sebagai penyimpanan basis data relasional (PostgreSQL) untuk profil pengguna, kredensial perangkat, serta menyimpan riwayat log notifikasi (Alarm, Activity, Lock). Supabase juga menangani sistem autentikasi pengguna secara aman.
2. **HiveMQ (MQTT Broker)**:
Digunakan sebagai jembatan komunikasi real-time dua arah antara ESP32 (perangkat keras SPOT) dan antarmuka website. Layanan ini menangani telemetry sensor (GPS, accelerometer, baterai) dan command execution (Buzzer).

### B. Fitur Utama

1. **Real-time Device Tracking**: Melacak titik koordinat GPS perangkat keras secara presisi di atas Google Maps terintegrasi, menampilkan posisi alat sekaligus posisi terkini dari pengguna.
2. **Device Status Monitoring**: Memantau indikator vital perangkat keras (persentase baterai, status Online/Offline, Mode perangkat) yang diperbarui secara instan melalui tangkapan data payload MQTT dan fetch data Supabase.
3. **Data Analytics & Visualization**: Memantau data analitik seperti jumlah perangkat yang terhubung, banyaknya deteksi pergerakan dalam tujuh hari terakhir, hingga visualisasi *Line Chart* banyaknya deteksi pergerakan objek setiap harinya.
4. **Device Activity Log Monitoring**: Memantau log aktivitas perangkat SPOT yang terhubung dengan suatu akun, mulai dari peringatan deteksi pergerakan, perubahan mode, hingga status koneksi.
5. **Manajemen Akun**: Membuat akun baru, masuk ke dalam suatu akun yang sudah terdaftar, mengubah foto profil, dan mengubah password akun.

### C. Technology Stack yang Digunakan
- **Frontend Framework**: React.js.
- **Build Tool & Language**: Vite dan TypeScript.
- **Styling & UI Components**: Tailwind CSS dan shadcn/ui.
- **Backend, Database & Auth**: Supabase (PostgreSQL).
- **IoT Communication**: MQTT HiveMQ.
- **Maps API**: React Google Maps API.
- **Deployment**: GitHub Pages (Custom Domain: spot.cirro.my.id).

### D. Screenshot Website
#### Register
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/25e57774-2063-4d29-97cd-038a428c1e59" />

#### Login
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/4b123fe1-c97a-4d44-91ea-b56736df3684" />

#### Dashboard Analitik
<img width="1898" height="905" alt="image" src="https://github.com/user-attachments/assets/caa83670-26cf-4aad-b688-46b72b6ec86d" />

#### Daftar Perangkat SPOT
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/fc916c3e-510e-4a07-b8ca-687e459b3299" />

#### Lacak Perangkat SPOT
<img width="1899" height="906" alt="image" src="https://github.com/user-attachments/assets/a18577f5-a03b-44aa-a5a2-3028722fd70d" />

#### Log Aktivitas Perangkat SPOT
<img width="1897" height="906" alt="image" src="https://github.com/user-attachments/assets/4b7e4c2d-cf8b-41c5-8f1a-86d14a413fcd" />

#### Edit Profile
<img width="1901" height="906" alt="image" src="https://github.com/user-attachments/assets/b021eca6-c810-4582-8ac7-1fa56907a2d4" />

#### Logout
<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/ef1684e8-055e-469a-9c86-55bee978bdee" />
