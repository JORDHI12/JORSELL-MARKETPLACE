import { supabase } from "./api.js";

/* ============================================================
   🗂️ FUNGSI KATEGORI MARKETPLACE
   ============================================================ */

// Ambil semua kategori dari Supabase
export async function ambilKategori() {
  const { data, error } = await supabase
    .from("kategori")
    .select("*")
    .order("nama", { ascending: true });
  if (error) {
    console.error("Gagal ambil kategori:", error);
    return [];
  }
  return data;
}

// Ambil semua produk berdasarkan kategori_id
export async function ambilProdukByKategori(kategori_id) {
  const { data, error } = await supabase
    .from("produk")
    .select("id, nama, deskripsi, harga, gambar_url, kategori_id")
    .eq("kategori_id", kategori_id);
  if (error) {
    console.error("Gagal ambil produk:", error);
    return [];
  }
  return data;
}

/* ============================================================
   🛍️ TAMPILKAN PRODUK PER KATEGORI DI UI
   ============================================================ */
async function renderKategoriDanProduk() {
  const kategoriContainer = document.getElementById("kategori-menu");
  const produkContainer = document.getElementById("daftar-produk");

  const kategoriList = await ambilKategori();

  // tampilkan kategori di menu
  kategoriContainer.innerHTML = kategoriList
    .map(
      (k) => `
      <button class="kategori-item" data-id="${k.id}">
        ${k.icon ? `<img src="${k.icon}" alt="${k.nama}" />` : ""}
        ${k.nama}
      </button>`
    )
    .join("");

  // default: tampilkan produk kategori pertama
  if (kategoriList.length > 0) {
    const produkAwal = await ambilProdukByKategori(kategoriList[0].id);
    tampilkanProduk(produkAwal);
  }

  // event listener kategori
  document.querySelectorAll(".kategori-item").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const produk = await ambilProdukByKategori(id);
      tampilkanProduk(produk);
      document
        .querySelectorAll(".kategori-item")
        .forEach((b) => b.classList.remove("aktif"));
      btn.classList.add("aktif");
    });
  });

  function tampilkanProduk(produkList) {
    produkContainer.innerHTML = produkList.length
      ? produkList
          .map(
            (p) => `
        <div class="produk-card">
          <img src="${p.gambar_url}" alt="${p.nama}" />
          <h3>${p.nama}</h3>
          <p>${p.deskripsi}</p>
          <b>Rp ${p.harga}</b>
        </div>`
          )
          .join("")
      : "<p>Tidak ada produk di kategori ini.</p>";
  }
}

document.addEventListener("DOMContentLoaded", renderKategoriDanProduk);
