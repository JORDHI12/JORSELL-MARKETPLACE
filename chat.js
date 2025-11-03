// --- Inisialisasi Supabase ---
const SUPABASE_URL = "https://dukipkyrhvvoaxjtlazf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1a2lwa3lyaHZ2b2F4anRsYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTkzNTYsImV4cCI6MjA3NzM3NTM1Nn0._b24puVhVXXe7hAHfng_FLHSxrZK9_LfCoXa0Jvwfj8";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Fungsi utama Chat Room Per Produk ---
async function initProductChat() {
  const chatBox = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("btn-send-chat");

  // Ambil ID produk dari URL, contoh: ?product=123
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product");

  if (!productId) {
    chatBox.innerHTML = "<div class='muted-note'>ID produk tidak ditemukan.</div>";
    sendBtn.disabled = true;
    chatInput.disabled = true;
    return;
  }

  // Cek user login
  const { data: { user }, error: userErr } = await sb.auth.getUser();
  if (userErr || !user) {
    chatBox.innerHTML =
      "<div class='muted-note'>Silakan login terlebih dahulu untuk menggunakan chat produk ini.</div>";
    chatInput.disabled = true;
    sendBtn.disabled = true;
    return;
  }

  const userId = user.id;
  const userEmail = user.email;

  // --- Fungsi: Load pesan untuk produk tertentu ---
  async function loadMessages() {
    const { data, error } = await sb
      .from("product_chats")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: true });

    if (error) {
      chatBox.innerHTML = "Gagal memuat pesan.";
      console.error("Error memuat chat:", error);
      return;
    }

    chatBox.innerHTML = "";
    data.forEach((msg) => appendMessage(msg, msg.user_id === userId));
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- Fungsi: Tambahkan pesan ke tampilan ---
  function appendMessage(msg, isMine) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = isMine ? "flex-end" : "flex-start";
    wrapper.style.marginBottom = "6px";

    const bubble = document.createElement("div");
    bubble.textContent = msg.message;
    bubble.style.padding = "8px 12px";
    bubble.style.borderRadius = "12px";
    bubble.style.maxWidth = "70%";
    bubble.style.wordBreak = "break-word";
    bubble.style.background = isMine ? "#7851A9" : "#f2f2f2";
    bubble.style.color = isMine ? "#fff" : "#333";
    bubble.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);
  }

  // --- Fungsi: Kirim pesan baru ---
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const { error } = await sb.from("product_chats").insert([
      {
        product_id: productId,
        user_id: userId,
        email: userEmail,
        message: text,
      },
    ]);

    if (error) {
      console.error("Gagal kirim pesan:", error);
      return;
    }

    chatInput.value = "";
  }

  // Tombol kirim & enter
  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // --- Realtime: dengarkan pesan baru di room produk ini ---
  sb.channel(`chat-room-${productId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "product_chats",
        filter: `product_id=eq.${productId}`,
      },
      (payload) => {
        const msg = payload.new;
        appendMessage(msg, msg.user_id === userId);
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    )
    .subscribe();

  // --- Load pesan awal ---
  loadMessages();
}

document.addEventListener("DOMContentLoaded", initProductChat);
