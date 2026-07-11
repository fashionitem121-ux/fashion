// ===== Fashion Items — site logic =====

// Google Sheet order-logging endpoint (used by product.html's order form,
// which we'll build once your first product photos are ready).
const ORDER_SHEET_URL = "https://script.google.com/macros/s/AKfycbyKtIQQ1b1LJ07dvBaWiBFNk9SAYrYku8sh3xUUi1bbUP0W-fwM8-YxKckIWAGobweB/exec";

// ---- Countdown timer ----
// Change this date any time you want to restart/extend the 15-day offer.
// Format: "YYYY-MM-DDTHH:MM:SS"
const COUNTDOWN_TARGET = new Date("2026-07-26T00:00:00");

function updateCountdown(){
  const now = new Date();
  let diff = COUNTDOWN_TARGET - now;
  if(diff < 0) diff = 0;

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ---- Render star rating ----
function starString(rating){
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5-full);
}

// ---- Render product grid on homepage ----
function renderProductGrid(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;

  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const imageContent = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
      : `🛍️`;

    const priceHTML = p.discountPercent
      ? `<span class="cprice">৳${p.price}</span> <span class="strike">৳${p.originalPrice}</span>`
      : `<span class="cprice">${p.price > 0 ? '৳' + p.price : 'Price coming soon'}</span>`;

    card.innerHTML = `
      <div class="img-box">
        ${p.discountPercent ? `<span class="badge-discount">${p.discountPercent}% OFF</span>` : (p.topSale ? '<span class="badge-top">Top Sale</span>' : '')}
        <span class="badge-stock">${p.inStock ? 'In Stock' : 'Out of Stock'}</span>
        ${imageContent}
      </div>
      <div class="cbody">
        <div class="cname">${p.name}</div>
        <div class="stars">${starString(p.rating)} <span class="count">(${p.reviews})</span></div>
        <div class="price-row">${priceHTML}</div>
        <a class="view-btn" href="product.html?id=${p.id}">View Product</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderProductGrid);
