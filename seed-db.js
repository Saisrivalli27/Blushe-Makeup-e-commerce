require('dotenv').config();
const { Client } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Missing DATABASE_URL in .env file');
  process.exit(1);
}

const client = new Client({
  connectionString: databaseUrl,
});

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

async function seedDb() {
  console.log('Connecting to database...');
  await client.connect();
  
  // Create table if not exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100),
      type VARCHAR(100),
      image_url VARCHAR(255),
      badge VARCHAR(50),
      rating DECIMAL(3, 1),
      reviews_count INTEGER,
      in_stock BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const allProducts = [];
  let idCounter = 1;

  for (const [section, types] of Object.entries(sections)) {
    for (const type of types) {
      for (let i = 1; i <= 20; i++) {
        const price = Math.floor(Math.random() * (5000 - 500) + 500); // Price between 500 and 5000
        const isNew = Math.random() > 0.8;
        const isBestseller = Math.random() > 0.9;
        let badge = null;
        if (isNew) badge = 'New';
        else if (isBestseller) badge = 'Best Seller';

        const image = images[idCounter % images.length];

        allProducts.push({
          name: `BLUSHÉ ${type} - Variant ${i}`,
          description: `Experience the luxury of our premium ${type.toLowerCase()}. Designed for all-day wear and a flawless finish, this is a must-have in your beauty routine.`,
          price: price,
          category: section,
          type: type.toLowerCase().replace(/ /g, '-'),
          image_url: image,
          badge: badge,
          rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Rating between 3.5 and 5.0
          reviews_count: Math.floor(Math.random() * 500),
          in_stock: true
        });

        idCounter++;
      }
    }
  }

  console.log(`Generated ${allProducts.length} products. Inserting...`);

  try {
    for (const product of allProducts) {
      await client.query(`
        INSERT INTO products (name, description, price, category, type, image_url, badge, rating, reviews_count, in_stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        product.name, product.description, product.price, product.category, product.type, product.image_url,
        product.badge, product.rating, product.reviews_count, product.in_stock
      ]);
    }
    console.log('Database seeding completed successfully!');
  } catch (e) {
    console.error('Error during insert:', e);
  } finally {
    await client.end();
  }
}

seedDb().catch(console.error);
