[README.md](https://github.com/user-attachments/files/31109919/README.md)
# Rovaniemi Essentials Map — PWA

This folder is a ready-to-deploy Progressive Web App (PWA) version of your
Rovaniemi map. It's free, lightweight, and installs like an app on both
Android and iPhone — no app store needed.

## What's inside

```
pwa/
├── index.html       ← your map (rovaniemi_map.html, renamed + PWA-enabled)
├── manifest.json     ← tells phones the app name, icon, colors
├── sw.js             ← service worker — caches the app so it works offline
├── icons/            ← app icons in the sizes phones need
└── README.md         ← this file
```

## Step 1 — Put this on GitHub (free)

1. Go to https://github.com and sign in (or create a free account).
2. Click the **+** in the top-right → **New repository**.
3. Name it something like `rovaniemi-map`. Keep it **Public**. Click
   **Create repository**.
4. On the new repo page, click **uploading an existing file** (or drag the
   contents of this `pwa` folder — the *files inside it*, not the folder
   itself — into the upload box).
5. Upload `index.html`, `manifest.json`, `sw.js`, and the whole `icons/`
   folder. Commit the changes.

## Step 2 — Turn on GitHub Pages (free)

1. In your repo, go to **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Click **Save**.
4. Wait ~1 minute. GitHub will show you a live URL, something like:
   `https://<your-username>.github.io/rovaniemi-map/`

That URL is now your live app — free, permanent (as long as the repo
exists), no server to maintain.

## Step 3 — Install it on a phone

**Android (Chrome):** open the URL → tap the **⋮** menu → **Add to Home
screen** (Chrome may also show an automatic "Install app" banner).

**iPhone (Safari):** open the URL → tap the **Share** icon (square with an
arrow) → **Add to Home Screen**.

Either way, an app icon appears on the home screen. Opening it launches
full-screen, no browser address bar — feels like a real app.

## Offline behavior

- The app shell (map page, icons, layout) is cached on first visit, so the
  app opens even with no internet afterward.
- Map tiles (the Standard and 3D Terrain backgrounds) are cached as they're
  viewed — so areas already browsed once will keep showing tiles offline,
  but brand-new areas need internet the first time.
- Marker data, popups, phone/email/website info — all of that is baked
  directly into `index.html`, so it always works offline regardless of
  tiles.

## Updating the map later

Whenever you regenerate the map with `make_rovaniemi_map.py`:
1. Copy the new `rovaniemi_map.html` over this folder's `index.html`
   (keep the filename `index.html`).
2. Re-add the PWA `<head>` tags and the service-worker registration script
   at the bottom if they're missing (or ask me to redo it).
3. Push the updated `index.html` to the same GitHub repo (upload again,
   commit). GitHub Pages updates automatically within a minute or two.
4. Bump the cache version in `sw.js` (e.g. `rovaniemi-app-v1` →
   `rovaniemi-app-v2`) so phones pick up the new version instead of an old
   cached copy.

## Cost & duration

Completely free — GitHub account, GitHub Pages hosting, and this app all
cost nothing. No subscriptions, no renewal, nothing to cancel after your
3 months. Just stop updating it (or delete the repo) whenever you're done.
