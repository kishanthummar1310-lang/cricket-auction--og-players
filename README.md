# Cricstrike – Cricket Auction

Static site (no build step). Pages: `/` home, `/admin` auctioneer console, `/viewer` live big-screen view.

## Deploy
1. `git init && git add . && git commit -m "Cricstrike"`
2. Push to GitHub.
3. vercel.com → Add New Project → import repo → Framework: **Other** → Deploy.

## How it works
State is kept in `localStorage` and synced live between tabs/windows **of the same browser**
(open `/admin` on the laptop, `/viewer` in another window cast to the projector).
Money is in lakh (100 L = 1 Cr). Bid steps: +10 L below 100 L, +20 L below 300 L, then +50 L.

For viewers on other devices, swap the `load()/save()` functions in `js/store.js`
for Firebase / Supabase realtime calls – everything else stays the same.
