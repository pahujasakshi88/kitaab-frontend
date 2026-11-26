# Kitaab 📚

Online book store. Users books browse karte hain, cart/wishlist use karte hain, order place karte hain
aur reading list track karte hain. Admin panel se books, categories, orders aur users manage hote hain.

## Tech stack

| Part | Stack |
|------|-------|
| Frontend (`kittab/`) | Next.js, TypeScript, Tailwind CSS, TanStack React Query, Axios |
| Backend (`DevBox/`) | Node.js, Express 5, TypeScript, MongoDB (Mongoose), JWT (cookie), Multer |
| Cache (optional) | Redis |

## Features

**User:** register/login, books browse (search, filter, sort), book details + reviews, quantity select,
Add to Cart / Buy Now, wishlist, checkout (Cash on Delivery), my orders + status history,
reading list (My Books), notifications, profile + change password, settings (notification preferences).

**Admin:** dashboard (stats, top selling, low stock, recent users), books (add/edit/delete/featured),
categories, orders (status update, CSV export), users (status, delete), analytics, notifications, settings.

**Notifications:** admin ko new order, low stock/out of stock, order cancelled, new user;
user ko order confirmed/shipped/delivered/cancelled (Settings mein "Order Updates" se band kiya ja sakta hai).

## Folder structure

```
DevBox/            # Backend
  src/
    config/        # db, redis
    controllers/   # request handlers
    middleware/    # auth, role (adminOnly), upload
    models/        # Mongoose models
    routes/        # API routes
    utils/         # token, notifications
    server.ts
kittab/            # Frontend
  src/
    app/           # Next.js pages (public, dashboard, admin)
    components/
    hooks/         # React Query hooks
    services/      # API calls
    lib/api.ts     # axios instance
```

## Requirements

- Node.js 18+
- MongoDB (local ya Atlas)
- Redis (optional: na ho to backend bina cache ke chalta hai)

## Setup

### 1. Backend

```bash
cd DevBox
npm install
```

`DevBox/.env` banao:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/bookapp
JWT_SECRET=apna_lamba_random_secret
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

Terminal mein `Server running on port 8000` aana chahiye.

### 2. Frontend

```bash
cd kittab
npm install
```

`kittab/.env.local` banao:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

App `http://localhost:3000` par khulegi.

> Env variables badalne ke baad dono servers restart karo.

## Environment variables

| Variable | Kahan | Matlab |
|----------|-------|--------|
| `PORT` | backend | Backend port (default 8000) |
| `MONGODB_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Login token sign karne ka secret (production mein alag, random value use karo) |
| `REDIS_URL` | backend | Redis URL (optional, default `redis://localhost:6379`) |
| `CLIENT_URL` | backend | Frontend URL(s) for CORS, comma se alag (default `http://localhost:3000`) |
| `NODE_ENV` | backend | `production` par cookie secure hoti hai |
| `NEXT_PUBLIC_API_URL` | frontend | Backend ka URL (default `http://localhost:8000`) |

> `.env` aur `.env.local` ko git mein commit mat karo.

## Admin account banana

Register hone par role hamesha `user` hota hai. Admin banane ke liye:

1. App mein normal register karo.
2. MongoDB mein (Compass ya shell se) `users` collection mein us user ka `role` `"admin"` kar do.
3. Logout/login karo, phir admin panel khulega.

## Scripts

| Folder | Command | Kaam |
|--------|---------|------|
| `DevBox` | `npm run dev` | Backend dev mode |
| `kittab` | `npm run dev` | Frontend dev mode |
| `kittab` | `npm run build` / `npm start` | Production build / run |
| `kittab` | `npm run lint` | Lint |

## Deploy karte waqt

- Frontend host par `NEXT_PUBLIC_API_URL` = backend ka URL.
- Backend host par `CLIENT_URL` = frontend ka URL (bina end `/` ke), `NODE_ENV=production`.
- Production mein cookie `secure` + `sameSite=none` hoti hai, isliye dono sites **https** par honi chahiye.
- Books ki images backend ke `uploads/` folder mein save hoti hain. Kai hosts par ye redeploy par
  saaf ho jata hai, wahan cloud storage (jaise Cloudinary) use karo.

## Abhi baaki

- Online payments (UPI/Card/Net Banking), abhi sirf Cash on Delivery
- Delivery fee (abhi hamesha Free)
- Forgot password
- Language / Appearance settings
- "New book" aur "Promotions" notifications (toggles save hote hain, par bhejne wala feature nahi hai)
- Tests