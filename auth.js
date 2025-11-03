// script.js
import { supabase } from "./api.js";

/* ============================================================
   👤 AUTHENTICATION: REGISTER, LOGIN, LOGOUT
   ============================================================ */

// 🟢 Register user baru
export async function registerUser(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) return console.error("Gagal register:", error.message);
  console.log("User berhasil register:", data);
  alert("Pendaftaran berhasil! Silakan login.");
}

// 🔵 Login user
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return alert("Login gagal: " + error.message);
  console.log("Login sukses:", data);
  alert("Login berhasil!");
  window.location.reload();
}

// 🔴 Logout user
export async function logoutUser() {
  await supabase.auth.signOut();
  alert("Berhasil logout!");
  window.location.reload();
}

/* ============================================================
   🛒 CRUD PRODUK
   ============================================================ */

// Tambah produk (hanya bisa kalau login)
export async function tambahProduk(nama, harga, deskripsi, gambar_url) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const { error } = await supabase.from("produk").insert([
    {
      user_id: user.id,
      nama,
      harga,
      deskripsi,
      gambar_url,
    },
  ]);

  if (error) console.error("Gagal tambah produk:", error);
  else alert("Produk berhasil ditambahkan!");
}

// Ambil produk dari semua user
export async function ambilProduk() {
  const { data, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, gambar_url, created_at");
  if (error) {
    console.error("Gagal ambil produk:", error);
    return [];
  }
  return data;
}

// Hapus produk berdasarkan ID
export async function hapusProduk(id) {
  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) console.error("Gagal hapus:", error);
  else alert("Produk berhasil dihapus!");
}

/* ============================================================
   🧠 LOAD DATA KE UI
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  // tampilkan user login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userInfo = document.getElementById("user-info");
  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");

  if (user) {
    userInfo.textContent = `Halo, ${user.email}`;
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";
  } else {
    userInfo.textContent = "Belum login";
    btnLogin.style.display = "inline-block";
    btnLogout.style.display = "none";
  }

  // tampilkan produk
  const daftar = await ambilProduk();
  const container = document.getElementById("daftar-produk");
  if (container) {
    container.innerHTML = daftar
      .map(
        (p) => `
      <div class="produk">
        <img src="${p.gambar_url}" alt="${p.nama}">
        <h3>${p.nama}</h3>
        <p>${p.deskripsi}</p>
        <b>Rp ${p.harga}</b>
      </div>
    `
      )
      .join("");
  }
});
