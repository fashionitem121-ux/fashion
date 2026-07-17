// ===== Fashion Items — product data ===== //
// This file feeds the homepage grid AND the product page.
// To add a real product later: replace the placeholder fields below,
// or duplicate an object in this array for a brand-new product.
//
// New fields added for the product detail page:
// - images: array of at least 4 photo URLs (swipeable gallery). Empty for now.
// - colours: up to 2 colour options, e.g. { name, hex, images }.
//     If a colour has its own "images" array, the gallery swaps to those
//     photos when that colour is picked. Leave "colours" as [] for any
//     product that only comes in one colour — the picker won't show at all.
// - description: array of {icon, label, text} — shown as bullet rows.
// - reviews: array of {name, rating, text, image}. These are EMPTY-SLOT
//   placeholders on purpose — replace with real customer feedback only.
//   Never publish fake reviews as if they're real customers; that's
//   misleading to shoppers and against Facebook/consumer-protection rules.
//
// Discount fields (originalPrice + discountPercent) only exist on Product 1
// right now — that's intentional, since the 45% deal applies to that one
// item only. Leave these two fields OUT of any product that isn't discounted,
// so the badge only ever shows where it's actually true.

const PRODUCTS = [
  {
    id: "p1",
    name: "Trendy Korean Long Wallet",
    price: 599,
    originalPrice: 1090,
    discountPercent: 45,
    rating: 4.5,
    reviews: 12,
    topSale: true,
    inStock: true,
    image: "Screenshot_20260717_202504_skybuy_becommerce_com_bd_MainActivity_edit_217243001606793.jpg",
    images: [
      "Screenshot_20260717_202504_skybuy_becommerce_com_bd_MainActivity_edit_217243001606793.jpg",
      "Screenshot_20260717_202523_skybuy_becommerce_com_bd_MainActivity_edit_217262315701872.jpg",
      "Screenshot_20260717_202538_skybuy_becommerce_com_bd_MainActivity_edit_217279822816949.jpg",
      "Screenshot_20260717_203003_skybuy_becommerce_com_bd_MainActivity.jpg",
      "Screenshot_20260717_203020_skybuy_becommerce_com_bd_MainActivity.jpg",
      "Screenshot_20260717_203037_skybuy_becommerce_com_bd_MainActivity.jpg"
    ], // default/shared gallery — used if a colour has no images of its own
    colours: [
      { name: "Pink", hex: "#F0B6C6", images: [] },
      { name: "Light Green", hex: "#B7C4A6", images: [] }
    ],
    description: [
      { icon: "🧵", label: "Material", text: "Premium PU Leather / Durable Stitching" },
      { icon: "📏", label: "Size", text: "Long clutch design, perfect for cards and cash" },
      { icon: "✨", label: "Features", text: "Multi-slot card organizer, elegant Korean fashion style" },
      { icon: "🎁", label: "Best for", text: "Women, students, and everyday trendy use" }
    ],
    reviews: []
  },
  {
    id: "p2",
    name: "Premium Fashion Item 2",
    price: 750,
    rating: 4.2,
    reviews: 8,
    topSale: true,
    inStock: true,
    image: "Screenshot_20260718_000933_skybuy_becommerce_com_bd_MainActivity_edit_229075586583499.jpg",
    images: [
      "Screenshot_20260718_000933_skybuy_becommerce_com_bd_MainActivity_edit_229075586583499.jpg"
    ],
    colours: [],
    description: [],
    reviews: []
  },
  {
    id: "p3",
    name: "Premium Fashion Item 3",
    price: 2999,
    rating: 4.8,
    reviews: 21,
    topSale: false,
    inStock: true,
    image: "Screenshot_20260718_001100_skybuy_becommerce_com_bd_MainActivity_edit_229049832489651.jpg",
    images: [
      "Screenshot_20260718_001100_skybuy_becommerce_com_bd_MainActivity_edit_229049832489651.jpg"
    ],
    colours: [],
    description: [],
    reviews: []
  },
  {
    id: "p4",
    name: "Premium Fashion Item 4",
    price: 5000,
    rating: 4.0,
    reviews: 5,
    topSale: false,
    inStock: true,
    image: "Screenshot_20260718_001218_skybuy_becommerce_com_bd_MainActivity_edit_229026798921342.jpg",
    images: [
      "Screenshot_20260718_001218_skybuy_becommerce_com_bd_MainActivity_edit_229026798921342.jpg"
    ],
    colours: [],
    description: [],
    reviews: []
  },
  {
    id: "p5",
    name: "Product Name 5",
    price: 0,
    rating: 4.6,
    reviews: 14,
    topSale: false,
    inStock: true,
    image: "",
    images: [],
    colours: [],
    description: [],
    reviews: []
  },
  {
    id: "p6",
    name: "Product Name 6",
    price: 0,
    rating: 4.3,
    reviews: 9,
    topSale: false,
    inStock: true,
    image: "",
    images: [],
    colours: [],
    description: [],
    reviews: []
  },
  {
    id: "p7",
    name: "Product Name 7",
    price: 0,
    rating: 4.7,
    reviews: 17,
    topSale: false,
    inStock: true,
    image: "",
    images: [],
    colours: [],
    description: [],
    reviews: []
  },
  {
    id: "p8",
    name: "Product Name 8",
    price: 0,
    rating: 4.1,
    reviews: 6,
    topSale: false,
    inStock: true,
    image: "",
    images: [],
    colours: [],
    description: [],
    reviews: []
  }
];
