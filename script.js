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

// Which product IDs are actually ready to ship right now.
// Add more IDs here later as you get real stock for other products —
// everything NOT listed here shows as unavailable instead of a working buy button.
const AVAILABLE_PRODUCT_IDS = ["p1"];

// Status + label for every other product. Using varied, honest wording
// (instead of repeating "Coming Soon" on every card) so the grid doesn't
// look monotonous — but none of these claim real stock that doesn't exist,
// since that button underneath is a real, working order form.
// status: "outofstock" (red-ish) or "comingsoon" (grey)
const PRODUCT_STATUS = {
  p2: { status: "outofstock", label: "Out of Stock" },
  p3: { status: "comingsoon", label: "Coming Soon" },
  p4: { status: "comingsoon", label: "Coming Soon" },
  p5: { status: "comingsoon", label: "Launching Soon" },
  p6: { status: "outofstock", label: "Out of Stock" },
  p7: { status: "comingsoon", label: "Notify Me Soon" },
  p8: { status: "comingsoon", label: "New Arrival Soon" }
};

// ---- Render the featured showcase banner ----
function renderFeaturedProduct(){
  const wrap = document.getElementById('featuredProduct');
  if(!wrap) return;

  const p = PRODUCTS.find(prod => AVAILABLE_PRODUCT_IDS.includes(prod.id));
  if(!p) return;

  const img = (p.images && p.images.length > 0) ? p.images[0] : p.image;

  wrap.innerHTML = `
    <a href="product.html?id=${p.id}" class="featured-card">
      <span class="featured-ribbon">Featured</span>
      ${img ? `<img class="featured-img" src="${img}" alt="${p.name}">` : ''}
      <div class="featured-body">
        <div class="featured-tag">✅ Ready to Ship</div>
        <div class="featured-name">${p.name}</div>
        <div class="featured-price-row">
          <span class="featured-price">৳${p.price}</span>
          ${p.discountPercent ? `<span class="featured-strike">৳${p.originalPrice}</span>` : ''}
        </div>
        <span class="featured-btn">Shop Now</span>
      </div>
    </a>
  `;
}

// ---- Render product grid on homepage ----
function renderProductGrid(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;

  // Everything except the featured/available product(s) shows here as unavailable
  PRODUCTS.filter(p => !AVAILABLE_PRODUCT_IDS.includes(p.id)).forEach(p => {
    const info = PRODUCT_STATUS[p.id] || { status: "comingsoon", label: "Coming Soon" };
    const card = document.createElement('div');
    card.className = 'card coming-soon';

    const imageContent = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
      : `🛍️`;

    const badgeClass = info.status === 'outofstock' ? 'badge-outofstock' : 'badge-comingsoon';

    card.innerHTML = `
      <div class="img-box">
        <span class="${badgeClass}">${info.label}</span>
        ${imageContent}
      </div>
      <div class="cbody">
        <div class="cname">${p.name}</div>
        <div class="stars">${starString(p.rating)} <span class="count">(${p.reviews})</span></div>
        <div class="price-row"><span class="cprice">${info.label}</span></div>
        <span class="view-btn disabled">Not Available Yet</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProduct();
  renderProductGrid();
});
