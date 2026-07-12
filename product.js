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

// ---- Buy Now → order modal ----
const ORDER_SHEET_URL = "https://script.google.com/macros/s/AKfycbyKtIQQ1b1LJ07dvBaWiBFNk9SAYrYku8sh3xUUi1bbUP0W-fwM8-YxKckIWAGobweB/exec";

let qty = 1;
const qtyValEl = document.getElementById('qtyVal');

function updateModalTotal(){
  document.getElementById('modalTotal').textContent = `৳${product.price * qty}`;
}

document.getElementById('qtyMinus').addEventListener('click', () => {
  qty = Math.max(1, qty - 1);
  qtyValEl.textContent = qty;
  updateModalTotal();
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  qty = qty + 1;
  qtyValEl.textContent = qty;
  updateModalTotal();
});

const modalOverlay = document.getElementById('modalOverlay');

document.getElementById('buyBtn').addEventListener('click', () => {
  qty = 1;
  qtyValEl.textContent = qty;
  document.getElementById('modalProductLine').textContent =
    product.name + (selectedColour ? ` — ${selectedColour}` : '');
  updateModalTotal();
  document.getElementById('modalFormView').style.display = 'block';
  document.getElementById('modalThankYouView').style.display = 'none';
  document.getElementById('errorMsg').style.display = 'none';
  modalOverlay.classList.add('open');
});

function closeModal(){ modalOverlay.classList.remove('open'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) closeModal(); });
document.getElementById('closeThankYouBtn').addEventListener('click', closeModal);

document.getElementById('submitOrderBtn').addEventListener('click', async () => {
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const city = document.getElementById('fCity').value.trim();
  const address = document.getElementById('fAddress').value.trim();
  const coupon = document.getElementById('fCoupon').value.trim(); // captured now; coupon logic/discount comes later
  const errorMsg = document.getElementById('errorMsg');
  const submitBtn = document.getElementById('submitOrderBtn');

  if(!name || !phone || !city || !address){
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Placing Order...';

  const payload = {
    name: name,
    phone: phone,
    city: city,
    address: address,
    coupon: coupon,
    items: [{
      product: product.name,
      colour: selectedColour || 'N/A',
      quantity: qty,
      price: product.price
    }]
  };

  let sheetSaveFailed = false;
  try{
    await fetch(ORDER_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script doesn't send CORS headers back; this still delivers the write
      body: JSON.stringify(payload)
    });
  } catch(err){
    // This only catches genuine failures (e.g. no internet connection at all) —
    // sheetSaveFailed tells the thank-you view to be honest about it.
    console.error('Order failed to save to Sheet:', err);
    sheetSaveFailed = true;
  }

  // Track this as a Lead in the Pixel — the visitor showed real buying intent
  // by completing the form, regardless of the sheet write outcome above.
  if(typeof fbq === 'function'){ fbq('track', 'Lead'); }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Confirm Order';
  document.getElementById('modalFormView').style.display = 'none';
  document.getElementById('modalThankYouView').style.display = 'block';

  const thankYouText = document.querySelector('.thankyou-text');
  if(sheetSaveFailed){
    thankYouText.textContent = "We couldn't confirm your order saved — please message us directly on WhatsApp or Facebook to be safe, and we'll sort it out right away.";
  } else {
    thankYouText.textContent = "We've received your order. We'll call you shortly to confirm before shipping.";
  }

  // reset fields for next time
  document.getElementById('fName').value = '';
  document.getElementById('fPhone').value = '';
  document.getElementById('fCity').value = '';
  document.getElementById('fAddress').value = '';
  document.getElementById('fCoupon').value = '';
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
