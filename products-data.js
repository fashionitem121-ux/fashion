// ===== Fashion Items — product data =====
// This file feeds the homepage grid AND the product page.
// To add a real product later: replace the placeholder fields below,
// or duplicate an object in this array for a brand-new product.
// "image" left empty on purpose — once you send product photos,
// they'll be added here as image links (no code changes needed elsewhere).
//
// Discount fields (originalPrice + discountPercent) only exist on Product 1
// right now — that's intentional, since the 45% deal applies to that one
// item only. Leave these two fields OUT of any product that isn't discounted,
// so the badge only ever shows where it's actually true.

const PRODUCTS = [
  { id: "p1", name: "Product Name 1", price: 440, originalPrice: 800, discountPercent: 45, rating: 4.5, reviews: 12, topSale: true,  inStock: true, image: "" },
  { id: "p2", name: "Product Name 2", price: 0, rating: 4.2, reviews: 8,  topSale: true,  inStock: true, image: "" },
  { id: "p3", name: "Product Name 3", price: 0, rating: 4.8, reviews: 21, topSale: false, inStock: true, image: "" },
  { id: "p4", name: "Product Name 4", price: 0, rating: 4.0, reviews: 5,  topSale: false, inStock: true, image: "" },
  { id: "p5", name: "Product Name 5", price: 0, rating: 4.6, reviews: 14, topSale: false, inStock: true, image: "" },
  { id: "p6", name: "Product Name 6", price: 0, rating: 4.3, reviews: 9,  topSale: false, inStock: true, image: "" },
  { id: "p7", name: "Product Name 7", price: 0, rating: 4.7, reviews: 17, topSale: false, inStock: true, image: "" },
  { id: "p8", name: "Product Name 8", price: 0, rating: 4.1, reviews: 6,  topSale: false, inStock: true, image: "" }
];
