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

// Per-product status. This drives the badge, whether the price/button
// actually works, and any real sales numbers you want to show.
// status: "instock" | "outofstock" | "comingsoon" | "newarrival"
// orderable: true = "View Product" is a working link to product.html
//            false = button is disabled, nobody can place an order for it
const PRODUCT_STATUS = {
  p1: { status: "instock",    orderable: true  }, // your real wallet
  p2: { status: "outofstock", orderable: false, topBadge: "Top Sale", soldCount: 1560 }, // real sales from your store, currently out of stock
  p3: { status: "instock",    orderable: true  }, // orders taken, sourced after
  p4: { status: "instock",    orderable: true  }, // orders taken, sourced after
  p5: { status: "comingsoon", orderable: false },
  p6: { status: "instock",    orderable: true  },
  p7: { status: "newarrival", orderable: true  },
  p8: { status: "newarrival", orderable: true  }
};

const STATUS_LABELS = {
  instock: "In Stock",
  outofstock: "Out of Stock",
  comingsoon: "Coming Soon",
  newarrival: "New Arrival"
};
const STATUS_BADGE_CLASS = {
  instock: "badge-stock",
  outofstock: "badge-outofstock",
  comingsoon: "badge-comingsoon",
  newarrival: "badge-newarrival"
};

// ---- Render the featured showcase banner (always your lead/first product) ----
function renderFeaturedProduct(){
  const wrap = document.getElementById('featuredProduct');
  if(!wrap) return;

  const p = PRODUCTS.find(prod => prod.id === "p1");
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

// ---- Render product grid on homepage (p1 included, in order) ----
function renderProductGrid(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;

  PRODUCTS.forEach(p => {
    const cfg = PRODUCT_STATUS[p.id] || { status: "comingsoon", orderable: false };
    const card = document.createElement('div');
    card.className = 'card' + (cfg.orderable ? '' : ' coming-soon');

    const imageContent = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
      : `🛍️`;

    const priceHTML = p.discountPercent
      ? `<span class="cprice">৳${p.price}</span> <span class="strike">৳${p.originalPrice}</span>`
      : `<span class="cprice">${p.price > 0 ? '৳' + p.price : 'Price coming soon'}</span>`;

    const soldText = cfg.soldCount ? ` <span class="count">· ${cfg.soldCount.toLocaleString()} sold</span>` : '';

    card.innerHTML = `
      <div class="img-box">
        ${cfg.topBadge ? `<span class="badge-top">${cfg.topBadge}</span>` : (p.discountPercent ? `<span class="badge-discount">${p.discountPercent}% OFF</span>` : '')}
        <span class="${STATUS_BADGE_CLASS[cfg.status]}">${STATUS_LABELS[cfg.status]}</span>
        ${imageContent}
      </div>
      <div class="cbody">
        <div class="cname">${p.name}</div>
        <div class="stars">${starString(p.rating)} <span class="count">(${p.reviews})</span>${soldText}</div>
        <div class="price-row">${priceHTML}</div>
        ${cfg.orderable
          ? `<a class="view-btn" href="product.html?id=${p.id}">View Product</a>`
          : `<span class="view-btn disabled">Not Available Yet</span>`}
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProduct();
  renderProductGrid();
});
