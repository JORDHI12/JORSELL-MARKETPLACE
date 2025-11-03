// cart.js
import { supabase } from "./api.js"; // pastikan kamu sudah punya api.js yg inisialisasi Supabase

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function clearCart() {
  localStorage.removeItem("cart");
  updateCartUI();
}
export function addToCart(product) {
  let cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  updateCartUI();
}
export function removeFromCart(productId) {
  let cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartUI();
}
function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find((i) => i.id == id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id != id);
  saveCart(cart);
  updateCartUI();
}
export function updateCartUI() {
  const cartContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!cartContainer || !totalEl) return;

  const cart = getCart();
  cartContainer.innerHTML = "";
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="muted">Keranjang kosong</p>`;
    totalEl.textContent = "Rp 0";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-info">
        <strong>${item.name}</strong><br>
        <small>${item.qty} x Rp ${item.price.toLocaleString()}</small>
      </div>
      <div>
        <button class="btn-minus" data-id="${item.id}">-</button>
        <button class="btn-plus" data-id="${item.id}">+</button>
        <button class="btn-remove" data-id="${item.id}">🗑️</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  totalEl.textContent = "Rp " + total.toLocaleString();

  document.querySelectorAll(".btn-plus").forEach((btn) =>
    btn.addEventListener("click", () => changeQty(btn.dataset.id, 1))
  );
  document.querySelectorAll(".btn-minus").forEach((btn) =>
    btn.addEventListener("click", () => changeQty(btn.dataset.id, -1))
  );
  document.querySelectorAll(".btn-remove").forEach((btn) =>
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
  );
}

// 🟣 Fungsi checkout ke Supabase
export async function checkoutCart(userId) {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 1️⃣ Simpan data order utama
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{ user_id: userId, total }])
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    alert("Gagal membuat pesanan.");
    return;
  }

  // 2️⃣ Simpan detail per produk
  const orderItems = cart.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    name: item.name,
    price: item.price,
    qty: item.qty,
    subtotal: item.price * item.qty,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error(itemsError);
    alert("Gagal menyimpan item pesanan.");
    return;
  }

  clearCart();
  alert("Checkout berhasil! Pesanan telah disimpan.");
}

document.addEventListener("DOMContentLoaded", updateCartUI);
