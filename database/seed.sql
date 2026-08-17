-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
('Dresses', 'dresses', 'Elegant and stylish dresses for every occasion'),
('Tops', 'tops', 'Trendy tops, blouses, and shirts'),
('Jeans', 'jeans', 'Premium denim for a perfect fit'),
('Kurties', 'kurties', 'Traditional and contemporary kurties'),
('Co-ord Sets', 'coord-sets', 'Matching sets for effortless style'),
('Workwear', 'workwear', 'Professional and sophisticated work attire'),
('Occasionwear', 'occasionwear', 'Stunning outfits for special events');

-- Seed subcategories (example)
INSERT INTO subcategories (category_id, name, slug) VALUES
(1, 'Maxi Dresses', 'maxi-dresses'),
(1, 'Midi Dresses', 'midi-dresses'),
(2, 'Blouses', 'blouses'),
(3, 'High-Waisted Jeans', 'high-waisted-jeans'),
(4, 'Cotton Kurties', 'cotton-kurties'),
(5, 'Blazer Sets', 'blazer-sets');

-- Seed brands
INSERT INTO brands (name) VALUES
('Blushé Signature'),
('Blushé Essentials'),
('Luxe by Blushé');

-- Seed 20 sample products
INSERT INTO products (category_id, brand_id, name, slug, description, price, sale_price, is_new) VALUES
(1, 1, 'Midnight Silk Slip Dress', 'midnight-silk-slip-dress', 'A luxurious silk slip dress in deep midnight blue.', 129.99, NULL, 1),
(1, 3, 'Rose Garden Midi Dress', 'rose-garden-midi-dress', 'Floral midi dress with a sweetheart neckline.', 89.99, 79.99, 1),
(2, 2, 'Classic White Poplin Shirt', 'classic-white-poplin-shirt', 'A crisp, oversized poplin shirt for everyday wear.', 59.99, NULL, 0),
(2, 1, 'Satin Wrap Blouse', 'satin-wrap-blouse', 'Elegant wrap blouse in soft blush pink satin.', 69.99, NULL, 1),
(3, 2, 'Vintage Wash Straight Jeans', 'vintage-wash-straight-jeans', 'High-waisted straight leg jeans with a vintage blue wash.', 98.00, NULL, 0),
(3, 1, 'Black Flare Denim', 'black-flare-denim', 'Flattering flared jeans in solid black.', 110.00, 89.99, 0),
(4, 1, 'Embroidered Cotton Kurti', 'embroidered-cotton-kurti', 'Hand-embroidered cotton kurti in off-white.', 75.00, NULL, 1),
(4, 3, 'Silk Blend Festive Kurti', 'silk-blend-festive-kurti', 'Rich silk blend kurti with intricate detailing for festive occasions.', 145.00, NULL, 1),
(5, 1, 'Linen Blend Co-ord Set', 'linen-blend-coord-set', 'Breathable linen blend matching crop top and wide-leg trousers.', 120.00, 99.99, 1),
(5, 3, 'Velvet Loungewear Set', 'velvet-loungewear-set', 'Plush velvet co-ord set for cozy elegance.', 135.00, NULL, 0),
(6, 1, 'Tailored Crepe Blazer', 'tailored-crepe-blazer', 'A perfectly tailored blazer in soft ivory crepe.', 150.00, NULL, 1),
(6, 2, 'Pleated Wide-Leg Trousers', 'pleated-wide-leg-trousers', 'High-rise pleated trousers in navy blue.', 85.00, 75.00, 0),
(7, 3, 'Sequin Evening Gown', 'sequin-evening-gown', 'Floor-length gown adorned with delicate sequins.', 250.00, NULL, 1),
(7, 1, 'Tiered Ruffle Gown', 'tiered-ruffle-gown', 'Dramatic tiered ruffle gown in emerald green.', 220.00, 180.00, 0),
(1, 2, 'Ribbed Knit Midi Dress', 'ribbed-knit-midi-dress', 'Form-fitting ribbed knit dress for everyday comfort.', 65.00, NULL, 0),
(2, 3, 'Lace Trim Camisole', 'lace-trim-camisole', 'Delicate lace-trimmed silk camisole.', 45.00, NULL, 1),
(3, 2, 'Distressed Boyfriend Jeans', 'distressed-boyfriend-jeans', 'Relaxed fit boyfriend jeans with distressed details.', 88.00, 68.00, 0),
(4, 1, 'Printed Georgette Kurti', 'printed-georgette-kurti', 'Lightweight georgette kurti with abstract floral print.', 55.00, NULL, 1),
(5, 2, 'Knit Skirt Co-ord', 'knit-skirt-coord', 'Cozy knit sweater and midi skirt matching set.', 115.00, NULL, 0),
(6, 1, 'Silk Pencil Skirt', 'silk-pencil-skirt', 'Classic pencil skirt in smooth black silk.', 95.00, NULL, 0);

-- Seed product images (just one primary image per product for sample)
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80', 1),
(2, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', 1),
(3, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80', 1),
(4, 'https://images.unsplash.com/photo-1564257631407-4deec8c7921a?w=500&q=80', 1),
(5, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', 1),
(6, 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500&q=80', 1),
(7, 'https://images.unsplash.com/photo-1583391733958-d25e04fac45f?w=500&q=80', 1),
(8, 'https://images.unsplash.com/photo-1509631179647-0c14873e1206?w=500&q=80', 1),
(9, 'https://images.unsplash.com/photo-1550614000-4b95d10a9c6c?w=500&q=80', 1),
(10, 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&q=80', 1),
(11, 'https://images.unsplash.com/photo-1598522325825-e5fc9271618a?w=500&q=80', 1),
(12, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80', 1),
(13, 'https://images.unsplash.com/photo-1566160980076-215c2d3080ff?w=500&q=80', 1),
(14, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80', 1),
(15, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', 1),
(16, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80', 1),
(17, 'https://images.unsplash.com/photo-1564257631407-4deec8c7921a?w=500&q=80', 1),
(18, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', 1),
(19, 'https://images.unsplash.com/photo-1550614000-4b95d10a9c6c?w=500&q=80', 1),
(20, 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500&q=80', 1);

-- Seed some basic inventory
INSERT INTO inventory (product_id, size, quantity)
SELECT id, 'S', 10 FROM products
UNION
SELECT id, 'M', 15 FROM products
UNION
SELECT id, 'L', 10 FROM products;
