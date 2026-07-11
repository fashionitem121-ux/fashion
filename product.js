// ===== Fashion Items — product page logic =====

function starString(rating){
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5-full);
}

function getProductFromURL(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
}

const product = getProductFromURL();

// ---- Title + rating ----
document.title = product.name + " — Fashion.Items";
document.getElementById('pName').textContent = product.name;
document.getElementById('pStars').innerHTML =
  `${starString(product.rating)} <span class="count">${product.rating} (${product.reviews} ratings)</span>`;

// ---- Gallery (top-left) ----
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('dots');

// Use real images if provided, otherwise show numbered placeholder slots
// so it's obvious where photos need to go (minimum 4, per the page design).
const galleryImages = (product.images && product.images.length > 0)
  ? product.images
  : [1,2,3,4].map(n => null);

galleryImages.forEach((src, i) => {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.innerHTML = src ? `<img src="${src}" alt="${product.name} photo ${i+1}">` : `🖼️ Photo ${i+1}`;
  track.appendChild(slide);

  const dot = document.createElement('div');
  dot.className = 'dot' + (i===0 ? ' active':'');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

const totalSlides = galleryImages.length;
let current = 0;
function goTo(i){
  current = (i + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx===current));
}
document.getElementById('prevBtn').addEventListener('click', () => goTo(current-1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current+1));

let startX = 0;
const carousel = document.querySelector('.carousel');
carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
carousel.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - startX;
  if(diff > 40) goTo(current-1);
  else if(diff < -40) goTo(current+1);
}, {passive:true});

// ---- Price & buy (top-right) ----
document.getElementById('pbPrice').textContent = product.price > 0 ? `৳${product.price}` : 'Price coming soon';
if(product.discountPercent){
  document.getElementById('pbStrike').textContent = `৳${product.originalPrice}`;
  const tag = document.getElementById('discountTag');
  tag.textContent = `${product.discountPercent}% OFF`;
  tag.style.display = 'inline-block';
}
document.getElementById('pbStock').textContent = product.inStock ? '✓ In Stock' : '✕ Out of Stock';

// Buy button placeholder — intentionally not wired to an order flow yet.
// Next step: connect this to the WhatsApp + Google Sheet + Pixel "Lead" flow.
document.getElementById('buyBtn').addEventListener('click', () => {
  alert("Ordering isn't set up on this page yet — coming in the next step!");
});

// ---- Description (bottom-left) ----
const descBox = document.getElementById('descBox');
if(product.description && product.description.length > 0){
  product.description.forEach(row => {
    const el = document.createElement('div');
    el.className = 'desc-row';
    el.innerHTML = `<span>${row.icon}</span><span class="d"><b>${row.label}:</b> ${row.text}</span>`;
    descBox.appendChild(el);
  });
} else {
  descBox.innerHTML = `<div class="desc-empty">Product description coming soon.</div>`;
}

// ---- Reviews (bottom-right) ----
const reviewBox = document.getElementById('reviewBox');
if(product.reviews && product.reviews.length > 0 && typeof product.reviews[0] === 'object'){
  product.reviews.forEach(r => {
    const el = document.createElement('div');
    el.className = 'review-card';
    el.innerHTML = `
      <div class="review-name">${r.name}</div>
      <div class="review-stars">${starString(r.rating)}</div>
      <div class="review-text">${r.text}</div>
      ${r.image ? `<img src="${r.image}" style="width:100%;border-radius:8px;margin-top:8px;">` : ''}
    `;
    reviewBox.appendChild(el);
  });
} else {
  reviewBox.innerHTML = `<div class="review-empty">No customer reviews yet — real reviews will appear here once you have them.</div>`;
}
