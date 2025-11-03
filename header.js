document.addEventListener("DOMContentLoaded", function() {
// Tombol Wishlist
const btnWishlist = document.getElementById("btn-wishlist");
btnWishlist.addEventListener("click", () => {
// Bisa diganti dengan modal atau dropdown notifikasi
alert("Belum ada notifikasi. Fitur ini bisa dikembangkan lebih lanjut.");
});

// Tombol Keranjang
const btnCart = document.getElementById("btn-cart-top");
btnCart.addEventListener("click", () => {
// Bisa diganti dengan modal keranjang atau redirect
alert("Keranjang kosong. Fitur ini bisa dihubungkan dengan backend Supabase.");
});

// Tombol Go untuk search
const btnSearchGo = document.getElementById("btn-search-go");
const searchInput = document.getElementById("search-input");
btnSearchGo.addEventListener("click", () => {
const query = searchInput.value.trim();
if(query) {
// Ganti alert dengan redirect ke halaman search jika sudah ada
// Contoh: window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
alert("Mencari produk: " + query);
} else {
alert("Masukkan kata kunci pencarian!");
searchInput.focus();
}
});

// Optional: search juga bisa dijalankan dengan Enter
searchInput.addEventListener("keypress", (e) => {
if(e.key === "Enter") {
btnSearchGo.click();
}
});

// Sticky header saat scroll
const header = document.querySelector(".app-header");
const stickyOffset = header.offsetTop;
window.addEventListener("scroll", () => {
if(window.pageYOffset > stickyOffset) {
header.classList.add("sticky");
} else {
header.classList.remove("sticky");
}
});
});
