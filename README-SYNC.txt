A1 Sanskriti website ⇄ POS stock sync
=====================================
1. Copy these files into the aa1 repo (overwrite).
2. DELETE the old static catalog:  git rm src/data/products.ts
3. Create .env from .env.example (same two values) and add the SAME two
   environment variables in the aa1 Vercel project settings.
4. Optional: put your real WhatsApp number in src/lib/whatsapp.ts
   (WHATSAPP_NUMBER, currently a placeholder).
5. git add -A && git commit -m "Sync stock with POS inventory" && git push

How it works: products + stock come live from the POS database
(get_online_products RPC). Checkout calls place_online_order, which
atomically lowers the SAME inventory the store sells from and records
the order. Sell 2 in store -> website shows 2 fewer, and vice versa.
