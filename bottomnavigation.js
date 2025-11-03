// navbar.js
export function initBottomNavigation() {
  const navItems = document.querySelectorAll(".bottom-nav-item");
  const pages = document.querySelectorAll(".page");

  // Fungsi untuk menampilkan halaman yang dipilih
  function showPage(pageId) {
    pages.forEach((p) => p.classList.remove("active"));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add("active");
  }

  // Tambahkan event click ke tiap menu nav
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-target");
      if (target) showPage(target);

      // ubah warna/aktifkan menu yang dipilih
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // Tampilkan halaman pertama secara default
  const firstPage = navItems[0]?.getAttribute("data-target");
  if (firstPage) showPage(firstPage);
}
