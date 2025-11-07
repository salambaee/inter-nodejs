# Autentikasi dengan JWT

## Pengertian
**JWT (JSON Web Token)** adalah standar terbuka (RFC 7519) yang digunakan untuk mengamankan pertukaran informasi antar sistem dalam format **JSON**.  
Token ini biasanya digunakan untuk proses **autentikasi dan otorisasi**, di mana server mengeluarkan token saat pengguna berhasil login.

JWT terdiri dari tiga bagian utama yang dipisahkan oleh titik (`.`):
1. **Header** – berisi tipe token dan algoritma enkripsi (misalnya HS256).
2. **Payload** – berisi data pengguna (seperti `id` dan `username`).
3. **Signature** – hasil hash dari header dan payload untuk menjamin keaslian data.
## Instalasi
#### Clone Repository
```
git clone https://github.com/username/inter-nodejs.git cd inter-nodejs
```
#### Install Dependencies
```
npm install
```
#### Buat file `.env`
```
PORT=3000
JWT_SECRET=rahasia
```
#### Jalankan server
```
node server.js
```
Server akan berjalan di localhost

## Endpoint
- POST `/auth/register` registrasi pengguna baru
- POST `/auth/login` login dan mendapatkan token JWT
- GET `/movies` ambil semua data film
- GET `/movies/:id` ambil film berdasarkan ID
- POST `/movies` tambah data film baru
- PUT `/movies/:id` update data film
- DELETE `/movies/:id` hapus data film
- GET `/directors` ambil semua data sutradara
- GET `/directors/:id` ambil sutradara berdasarkan ID
- POST `/directors` tambah data sutradara
- PUT `/directors/:id` update data sutradara
- DELETE `/directors/:id` hapus data sutradara

## Tangkapan Layar