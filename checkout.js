// ===== Fashion Items — checkout page logic =====

const ORDER_SHEET_URL = "https://script.google.com/macros/s/AKfycbyKtIQQ1b1LJ07dvBaWiBFNk9SAYrYku8sh3xUUi1bbUP0W-fwM8-YxKckIWAGobweB/exec";

// ---- Read product + selection from the URL (set by product.js's Buy Now link) ----
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const qty = Math.max(1, parseInt(params.get('qty') || '1', 10));
const colour = params.get('colour') || null;

const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

document.title = "Checkout — " + product.name;
document.getElementById('backLink').href = `product.html?id=${product.id}`;

// ---- Order summary (right side) ----
const img = (product.images && product.images.length > 0) ? product.images[0] : product.image;
document.getElementById('oiImage').src = img || '';
document.getElementById('oiImage').alt = product.name;
document.getElementById('oiName').textContent = product.name;
document.getElementById('oiMeta').textContent =
  (colour ? `${colour} · ` : '') + `Qty: ${qty}`;

const subtotal = product.price * qty;
document.getElementById('oiSubtotal').textContent = `৳${subtotal}`;

// ---- Shipping selection ----
let shippingCost = 130; // default matches the "active" option in the HTML
let shippingArea = "Outside Dhaka";

function updateTotals(){
  const total = subtotal + shippingCost;
  document.getElementById('sumShipping').textContent = `৳${shippingCost}`;
  document.getElementById('sumTotal').textContent = `৳${total}`;
  document.getElementById('btnTotal').textContent = `৳${total}`;
}
updateTotals();

document.querySelectorAll('.shipping-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.shipping-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    shippingCost = parseInt(opt.dataset.cost, 10);
    shippingArea = opt.dataset.area;
    updateTotals();
  });
});

// ---- Place Order ----
document.getElementById('placeOrderBtn').addEventListener('click', async () => {
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const address = document.getElementById('fAddress').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const notes = document.getElementById('fNotes').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const btn = document.getElementById('placeOrderBtn');

  if(!name || !phone || !address){
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Placing Order...';

  const total = subtotal + shippingCost;

  const payload = {
    name: name,
    phone: phone,
    city: shippingArea, // reuses the existing Sheet column
    address: address,
    coupon: '',
    email: email,
    notes: notes,
    shippingArea: shippingArea,
    shippingCost: shippingCost,
    total: total,
    items: [{
      product: product.name,
      colour: colour || 'N/A',
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
    console.error('Order failed to save to Sheet:', err);
    sheetSaveFailed = true;
  }

  // Real buying intent confirmed — track it as a Lead regardless of the sheet outcome above.
  if(typeof fbq === 'function'){ fbq('track', 'Lead'); }

  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('thankYouView').style.display = 'block';

  const thankYouText = document.getElementById('thankYouText');
  thankYouText.textContent = sheetSaveFailed
    ? "We couldn't confirm your order saved — please message us on WhatsApp or Facebook to be safe, and we'll sort it out right away."
    : "We've received your order. We'll call you shortly to confirm before shipping.";
});
