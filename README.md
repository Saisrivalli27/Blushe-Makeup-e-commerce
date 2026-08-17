# Blushe E-Commerce

Blushe is a premium women's beauty and fashion e-commerce platform.

## Architecture

This project is built using a decoupled architecture:
- **Frontend**: Vanilla HTML/CSS/JS served statically.
- **Backend**: Express.js REST API with JWT authentication.
- **Database**: Supabase (PostgreSQL).

## Setup Instructions

### 1. Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com/).
2. In the Supabase SQL Editor, run the queries found in `database/supabase_schema.sql` to create the necessary tables (`products`, `cart`, `wishlist`, `orders`, `order_items`) and set up Row Level Security (RLS) policies.
3. Next, run the seed file `database/supabase_seed.sql` to populate the `products` table with the initial catalog data.

### 2. Environment Variables

Create a `.env` file in the root directory (where `package.json` is located) with the following required variables:

```env
# Application Port
PORT=5000

# Supabase Credentials
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# JWT Secret for authenticating users via API
JWT_SECRET=your_jwt_secret_string
```

*Note: Use the `Service Role` key from Supabase (found under Project Settings -> API) because the Express backend manages all database interactions directly, overriding RLS to act on behalf of authenticated users.*

### 3. Install Dependencies

Run the following command in the root directory:

```bash
npm install
```

### 4. Running Locally

You can run the frontend and backend concurrently.

**Start the Backend API (runs on port 5000):**
```bash
npm run dev
```

**Start the Frontend (serves the `frontend/` directory):**
```bash
npm run frontend
```
The frontend will typically be accessible at `http://localhost:3000`.

## API Documentation

### Auth
- `POST /api/auth/register`: Register a new user (`fullName`, `email`, `password`). Returns session token.
- `POST /api/auth/login`: Login existing user (`email`, `password`). Returns session token.

### Products
- `GET /api/products`: Fetch all products (public).
- `GET /api/products/:id`: Fetch single product by ID (public).

### Cart (Requires Authentication)
- `GET /api/cart`: Get current user's cart items.
- `POST /api/cart`: Add item to cart (`productId`, `quantity`).
- `PUT /api/cart/:cartItemId`: Update quantity (`quantity`).
- `DELETE /api/cart/:cartItemId`: Remove item from cart.

### Wishlist (Requires Authentication)
- `GET /api/wishlist`: Get current user's wishlist.
- `POST /api/wishlist`: Toggle product in wishlist (`productId`). Returns `{ isWishlisted: boolean }`.

### Orders (Requires Authentication)
- `GET /api/orders`: Get current user's order history.
- `POST /api/orders`: Create new order from current cart items. Returns the created order ID and empties the cart.
