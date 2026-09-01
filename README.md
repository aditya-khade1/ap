# AP Fashion Mart

A premium, mobile-first ecommerce storefront built with Next.js 15, TypeScript and Tailwind CSS.
Orders are placed directly through **WhatsApp with Cash on Delivery** — no online payment, no database,
no cloud backend required.

## Features

- **Home page** with hero, categories, featured picks, offers, store location & directions
- **Shop** with search, category/price/size filters, sorting, pagination
- **Category pages** for Sarees, Kids Wear, Jewellery, Bangles, Night Suit, Kurti, Blouse, Hand Bags, Ladies Innerwear
- **Product detail** with image gallery, sizes, colors, stock status, Order on WhatsApp
- **WhatsApp ordering** — every product opens a prefilled `wa.me` message directly, no cart or checkout needed
- **Cash on Delivery** — no online payment gateway
- **Guest shopping** — customers never need an account to order
- **Admin-only auth** — a protected login guards the admin dashboard; customers shop as guests
- **Admin product manager** (`/admin/products`) — add, edit, delete, duplicate, search and filter
  products; upload images from the computer; mark products as Featured
- **Local product store** — products are saved to a local JSON file (`data/products.json`) that is
  seeded on first run, so admin changes survive restarts with no database required
- **Admin dashboard** with stats, order management, customer list
- **Click-to-call** and **Get Directions** functionality
- **SEO** with sitemap, robots.txt, Open Graph metadata
- **Responsive design** optimized for mobile

## How ordering works

The purchase journey is:

```
Product → Order on WhatsApp →
WhatsApp opens with complete order message (Cash on Delivery)
```

Each product has an **Order on WhatsApp** button that builds a message with the product name,
size/colour, quantity, individual price and total, then opens
`https://wa.me/919370549753?text=<encoded>` on mobile or WhatsApp Web on desktop.
The customer sends the message and pays Cash on Delivery when the order arrives.

There is no cart, no checkout and no customer account — ordering is instant and guest-friendly.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| State | Zustand (toasts) |
| Data | Netlify Database (managed Postgres) via Drizzle ORM |
| Auth | NextAuth.js v5 (local users) |
| Orders | WhatsApp + Cash on Delivery |
| Images | Local seed images |
| Icons | Lucide React |
| Fonts | Playfair Display + DM Sans |

## Getting Started

### Setup

1. Install dependencies:

```bash
cd "AP FASHION"
npm install
```

2. (Optional) Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

No database setup is required. All products, users and orders use local data — the site
works out of the box after `npm install`.

### Adding products from the admin panel

1. Configure admin credentials (see [Secure admin setup](#secure-admin-setup) below).
2. Sign in at `/auth/login`.
3. Open **Products → Add Product**, upload images from your computer and save.
4. The product appears instantly on the website (homepage sections, shop, search, category pages).

Uploaded images are stored in `public/product-assets/` and product records persist in
`data/products.json`, so nothing is lost between restarts and no database is required.

> Note: uploaded images are served instantly in both `npm run dev` and the production server
> (`npm run start`) — a `/product-assets/*` route handler streams the folder so brand-new
> uploads never require a server restart.

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Secure Admin Setup

The admin account lives in the `admin_users` table of the Netlify Database. It is
created by the seed migration (`netlify/database/migrations/..._seed_admin_user.sql`),
which stores only a PBKDF2-SHA256 hash of the password — the plaintext is never
stored anywhere.

To change the admin password:

1. Generate a hash of the new password:

   ```bash
   node scripts/hash-admin-password.mjs "<new-password>"
   ```

2. Update (or insert) the admin row with the new hash — e.g. via a new database
   migration. Deploy, and sign in at `/auth/login` with the admin email and the
   new password.

Passwords are compared with a constant-time check (PBKDF2-SHA256, 310k iterations,
random 16-byte salt). Customers do not need an account — they shop as guests and
order directly via WhatsApp. Admins sign in through `/auth/login` to reach the
protected dashboard.

## Environment Variables

No manual setup is required for the database — the Netlify Database is provisioned
automatically and migrations (including the admin account seed) are applied at deploy
time. Admin sign-in additionally uses the `ADMIN_EMAIL` + password hash stored in the
database; see [Secure admin setup](#secure-admin-setup) below.

| Variable | Description |
|----------|------------|
| `NEXTAUTH_SECRET` | Long random secret for NextAuth/session signing |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (default: 919370549753) |

The WhatsApp destination is `+91 93705 49753` and is defined in `lib/whatsapp.ts`.
To change it, update `WHATSAPP_NUMBER` there.

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run hash:admin` | Generate an `ADMIN_PASSWORD_HASH` from a password |

## Project Structure

```
AP FASHION/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (local data)
│   ├── admin/              # Admin dashboard (auth-protected)
│   ├── auth/               # Admin login
│   ├── shop/               # Shop page
│   ├── category/           # Category pages
│   └── product/            # Product detail (Order on WhatsApp)
├── components/             # React components
├── lib/                    # Utilities & config
│   ├── whatsapp.ts         # WhatsApp order message builder
│   ├── data/               # Local data layer (products, orders, users, coupons)
│   ├── auth.ts             # NextAuth config
│   ├── store.ts            # Store data
│   └── utils.ts            # Helper functions
├── hooks/                  # React hooks
├── types/                  # TypeScript types
└── seed/                   # Local product seed data
```

## License

Private - AP Fashion Mart
