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

// ---- Gallery (top-left) — rebuildable so colour selection can swap photos ----
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('dots');
let totalSlides = 0;
let current = 0;

function buildGallery(images){
  track.innerHTML = '';
  dotsWrap.innerHTML = '';
  current = 0;

  // Use real images if provided, otherwise show numbered placeholder slots
  // so it's obvious where photos need to go (minimum 4, per the page design).
  const slidesData = (images && images.length > 0) ? images : [1,2,3,4].map(() => null);
  totalSlides = slidesData.length;

  slidesData.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = src ? `<img src="${src}" alt="${product.name} photo ${i+1}">` : `🖼️ Photo ${i+1}`;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i===0 ? ' active':'');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  track.style.transform = `translateX(0%)`;
}

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

buildGallery(product.images);

// ---- Colour picker ----
let selectedColour = null;
if(product.colours && product.colours.length > 0){
  document.getElementById('colourBlock').style.display = 'block';
  const colourOptions = document.getElementById('colourOptions');

  product.colours.forEach((c, i) => {
    const opt = document.createElement('div');
    opt.className = 'colour-opt' + (i===0 ? ' active' : '');
    opt.innerHTML = `<div class="colour-swatch" style="background:${c.hex};"></div><div class="cname">${c.name}</div>`;
    opt.addEventListener('click', () => {
      [...colourOptions.children].forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
      selectedColour = c.name;
      // Swap gallery to this colour's photos if it has any, else fall back to default images
      buildGallery(c.images && c.images.length > 0 ? c.images : product.images);
      updateBuyLink();
    });
    colourOptions.appendChild(opt);
  });
  selectedColour = product.colours[0].name;
}

// ---- Price & buy (top-right) ----
document.getElementById('pbPrice').textContent = product.price > 0 ? `৳${product.price}` : 'Price coming soon';
if(product.discountPercent){
  document.getElementById('pbStrike').textContent = `৳${product.originalPrice}`;
  const tag = document.getElementById('discountTag');
  tag.textContent = `${product.discountPercent}% OFF`;
  tag.style.display = 'inline-block';
}
document.getElementById('pbStock').textContent = product.inStock ? '✓ In Stock' : '✕ Out of Stock';

// ---- Quantity + Buy Now → goes to the checkout page ----
let qty = 1;
const qtyValEl = document.getElementById('qtyVal');
const buyBtn = document.getElementById('buyBtn');

function updateBuyLink(){
  const colourParam = selectedColour ? `&colour=${encodeURIComponent(selectedColour)}` : '';
  buyBtn.href = `checkout.html?id=${encodeURIComponent(product.id)}&qty=${qty}${colourParam}`;
}
updateBuyLink();

document.getElementById('qtyMinus').addEventListener('click', () => {
  qty = Math.max(1, qty - 1);
  qtyValEl.textContent = qty;
  updateBuyLink();
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  qty = qty + 1;
  qtyValEl.textContent = qty;
  updateBuyLink();
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
