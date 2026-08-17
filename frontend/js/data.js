import { apiFetch } from './utils.js?v=3';

let cachedProducts = null;

const generateMockData = () => {
  const sections = {
    face: ['Foundation', 'Concealer', 'Blush', 'Bronzer', 'Highlighter', 'Setting Powder', 'Setting Spray', 'Primer', 'BB Cream', 'Color Corrector'],
    eyes: ['Eyeshadow Palette', 'Mascara', 'Eyeliner', 'Eyebrow Pencil', 'Eyebrow Gel', 'False Lashes', 'Lash Primer', 'Eye Primer', 'Under Eye Concealer', 'Liquid Eyeshadow'],
    lips: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Lip Balm', 'Lip Stain', 'Liquid Lipstick', 'Lip Plumper', 'Lip Oil', 'Lip Scrub', 'Lip Tint'],
    brushes: ['Foundation Brush', 'Concealer Brush', 'Powder Brush', 'Blush Brush', 'Eyeshadow Brush', 'Blending Brush', 'Eyeliner Brush', 'Lip Brush', 'Beauty Sponge', 'Brush Set'],
    collections: ['Summer Collection', 'Holiday Set', 'Bridal Kit', 'Everyday Essentials', 'Glow Up Kit', 'Matte Collection', 'Travel Mini Set', 'Pro Artist Kit', 'Skincare Hybrid Set', 'Limited Edition']
  };

  const images = [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1580870059816-77884d3d19ea?w=800&q=80',
    'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&q=80',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80'
  ];

  const allProducts = [];
  let idCounter = 1;

  for (const [section, types] of Object.entries(sections)) {
    for (const type of types) {
      for (let i = 1; i <= 20; i++) {
        const price = Math.floor(Math.random() * (5000 - 500) + 500);
        const isNew = Math.random() > 0.8;
        const isBestseller = Math.random() > 0.9;
        let badge = null;
        if (isNew) badge = 'New';
        else if (isBestseller) badge = 'Best Seller';

        allProducts.push({
          id: idCounter,
          brand: 'BLUSHÉ',
          name: `BLUSHÉ ${type} - Variant ${i}`,
          description: `Experience the luxury of our premium ${type.toLowerCase()}. Designed for all-day wear and a flawless finish, this is a must-have in your beauty routine.`,
          price: price,
          category: section,
          type: type.toLowerCase().replace(/ /g, '-'),
          image: images[idCounter % images.length], // changed from image_url to image
          image_url: images[idCounter % images.length], // keeping this just in case backend expects it
          badge: badge,
          rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
          reviews: Math.floor(Math.random() * 500), // changed from reviews_count
          reviews_count: Math.floor(Math.random() * 500),
          shades: Math.floor(Math.random() * 10) + 1, // added shades
          in_stock: true
        });

        idCounter++;
      }
    }
  }
  return allProducts;
};

// Fetch all products from API (and cache them in memory)
export const fetchAllProducts = async () => {
  if (cachedProducts) return cachedProducts;
  try {
    const data = await apiFetch('/products');
    if (!data || data.length === 0) {
      cachedProducts = generateMockData();
    } else {
      cachedProducts = data;
    }
    return cachedProducts;
  } catch (err) {
    console.warn('API failed, falling back to mock data...');
    cachedProducts = generateMockData();
    return cachedProducts;
  }
};
// Backwards compatibility with sync code if they use `products` directly (will be empty until fetched)
export let products = [];
fetchAllProducts().then(data => { products = data; });

// Get products by category
export const getProductsByCategory = async (category) => {
  const all = await fetchAllProducts();
  return all.filter(p => p.category === category);
};

// Get product by ID
export const getProductById = async (id) => {
  const all = await fetchAllProducts();
  return all.find(p => p.id == id);
};

// Get new arrivals (is_new flag equivalent or badge 'New')
export const getNewArrivals = async () => {
  const all = await fetchAllProducts();
  return all.filter(p => p.badge === 'New').slice(0, 4);
};

// Get best sellers (badge 'Best Seller')
export const getBestSellers = async () => {
  const all = await fetchAllProducts();
  return all.filter(p => p.badge === 'Best Seller' || p.badge === 'Viral').slice(0, 4);
};
