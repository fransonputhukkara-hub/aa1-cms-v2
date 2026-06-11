# Sanskriti Silks — Storefront (Proposal Build)

A premium e-commerce storefront for a handloom saree brand, built with **React 18 + TypeScript + Vite + Tailwind CSS**.
Two product ranges (**Kalyani Cotton** and **Soft Silk**), an editorial hero, collection tiles, product grids
with hover "add to bag", and a fully working slide-out cart.

> All product names, prices, copy, and contact details are **placeholders** — swap in the client's real data.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default http://localhost:5173).

## Build for production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build
```

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. In Vercel → New Project → import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`.
   (No special `vercel.json` needed — it's a static SPA.)

## Project structure

```
public/sarees/            29 saree photos (cotton-01..19, silk-01..10)
src/
  data/products.ts        product catalogue (edit names / prices / images here)
  types.ts                Product & CartItem types
  context/CartContext.tsx cart state (add / qty / remove / subtotal / drawer)
  lib/format.ts           INR formatter
  components/             Header, Hero, Marquee, Categories, ProductCard,
                          ProductGrid, StorySplit, Values, Testimonial,
                          Newsletter, Footer, CartDrawer, Reveal
  App.tsx                 page composition
  index.css               Tailwind + design tokens (wine / gold / ivory)
```

## Editing the catalogue

Open `src/data/products.ts`. Each product:

```ts
{ id, name, type: 'Kalyani Cotton' | 'Soft Silk', price, mrp, isNew, image }
```

Add images to `public/sarees/` and point `image` at `/sarees/your-file.jpg`.

## Next steps (optional)
- Wire to **Firebase** (Firestore products + Auth) to match your StitchBill setup.
- Add a **product detail page** + filter (Cotton / Soft Silk / All) via React Router.
- Hook checkout to a payment gateway (Razorpay / Cashfree) or WhatsApp order links.
"# aa1" 
