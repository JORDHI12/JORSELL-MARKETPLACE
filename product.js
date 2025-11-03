// script.js
import { supabase } from "./api.js";

/* ============================================================
   🧩 FUNGSI CRUD UTAMA UNTUK MARKETPLACE JORSELL
   ============================================================ */

// 🟢 1. Tambah produk baru
export async function tambahProduk(nama, harga, deskripsi, gambar_url) {
  const { data, error } = await supabase.from("produk").insert([
    { nama, harga, deskripsi, gambar_url }
  ]);
  if (error) {
    console.error("Gagal tambah produk:", error);
  } else {
    console.log("Produk berhasil ditambahkan:", data);
  }
}

// 🔵 2. Ambil semua produk
export async function ambilProduk() {
  const { data, error } = await supabase.from("produk").select("*").order("id", { ascending: false });
  if (error) {
    console.error("Gagal mengambil produk:", error);
    return [];
  }
  console.log("Data produk:", data);
  return data;
}

// 🟡 3. Update produk
export async function updateProduk(id, fieldBaru) {
  const { data, error } = await supabase.from("produk").update(fieldBaru).eq("id", id);
  if (error) {
    console.error("Gagal update:", error);
  } else {
    console.log("Produk diupdate:", data);
  }
}

// 🔴 4. Hapus produk
export async function hapusProduk(id) {
  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) {
    console.error("Gagal hapus produk:", error);
  } else {
    console.log("Produk berhasil dihapus:", id);
  }
}

/* ============================================================
   🛒 Contoh Penggunaan di UI
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  // Ambil semua produk dan tampilkan
  const daftar = await ambilProduk();
  const container = document.getElementById("daftar-produk");

  if (container) {
    container.innerHTML = daftar
      .map(p => `
        <div class="produk">
          <img src="${p.gambar_url}" alt="${p.nama}" />
          <h3>${p.nama}</h3>
          <p>${p.deskripsi}</p>
          <strong>Rp ${p.harga}</strong>
        </div>
      `)
      .join("");
  }
});
