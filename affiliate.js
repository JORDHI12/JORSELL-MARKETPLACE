// Inisialisasi koneksi Supabase
const SUPABASE_URL = "https://dukipkyrhvvoaxjtlazf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1a2lwa3lyaHZ2b2F4anRsYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTkzNTYsImV4cCI6MjA3NzM3NTM1Nn0._b24puVhVXXe7hAHfng_FLHSxrZK9_LfCoXa0Jvwfj8";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fungsi utama Afiliasi
async function initAffiliate() {
  const input = document.getElementById("affiliate-link");
  const copyBtn = document.getElementById("btn-copy-aff");
  const note = document.getElementById("affiliate-note");
  const statsBtn = document.getElementById("btn-open-aff-stats");
  const statsBox = document.getElementById("aff-stats");

  try {
    // 1️⃣ Cek user login
    const { data: { user }, error: userError } = await sb.auth.getUser();
    if (userError || !user) {
      input.value = "";
      input.placeholder = "Login untuk membuat link afiliasi";
      note.textContent = "Silakan login terlebih dahulu.";
      return;
    }

    // 2️⃣ Buat link afiliasi
    const userId = user.id;
    const baseUrl = window.location.origin;
    const affiliateLink = `${baseUrl}?ref=${userId}`;
    input.value = affiliateLink;
    note.textContent = "Bagikan link ini untuk dapat komisi.";

    // 3️⃣ Tombol salin
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(affiliateLink);
      note.textContent = "✅ Link afiliasi disalin!";
      setTimeout(() => {
        note.textContent = "Bagikan link ini untuk dapat komisi.";
      }, 2000);
    });

    // 4️⃣ Tombol lihat statistik
    statsBtn.addEventListener("click", async () => {
      statsBox.textContent = "⏳ Memuat data...";
      const { data, error } = await sb
        .from("affiliate_stats")
        .select("total_clicks, total_sales, commission")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        statsBox.textContent = "Belum ada data afiliasi.";
      } else {
        statsBox.innerHTML = `
          Klik: ${data.total_clicks || 0}x<br>
          Penjualan: ${data.total_sales || 0}<br>
          Komisi: Rp${data.commission?.toLocaleString("id-ID") || 0}
        `;
      }
    });
  } catch (err) {
    console.error("Affiliate error:", err);
    note.textContent = "Terjadi kesalahan sistem.";
  }
}

// Jalankan setelah halaman siap
document.addEventListener("DOMContentLoaded", initAffiliate);
