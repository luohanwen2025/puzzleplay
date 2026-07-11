# PuzzlePlay - Static Game Site

A complete static game portal. No build step - edit the HTML and deploy.
Built with Tailwind CSS (via Play CDN) and a clean Apple-inspired design.

- **Brand:** PuzzlePlay
- **Domain:** puzzleplay.online
- **Language:** English (target audience: overseas)
- **Stack:** Static HTML + Tailwind Play CDN + a little inline config

## File structure

```
game-site/
├── index.html                              Homepage (hero + featured games + how-to)
├── favicon.png                             32x32 PNG favicon
├── apple-touch-icon.png                    180x180 Apple touch icon
├── robots.txt                              Crawler rules (points to sitemap)
├── sitemap.xml                             Site map (update when adding games)
├── README.md                               This file
├── css/                                    (legacy - no longer used by default)
└── games/
    └── safari-story-mahjong/
        ├── index.html                      Game page (also the template for new games)
        └── Safari Story Mahjong_images/    Game screenshots + icon
            ├── image1-hero.jpg             Hero banner (1280x550, ~100KB)
            ├── image2.jpg                  Gameplay screenshot (1280x720)
            ├── image3.jpg                  Thumbnail (200x120)
            ├── image4.jpg                  Square icon (512x512, OG image)
            └── image5.jpg                  Mid-game screenshot (512x384)
```

## Tailwind setup

Both pages load Tailwind from the Play CDN and configure a shared theme inline:

- **Colors:** `ink` #1d1d1f, `sub` #424245, `muted` #86868b, `accent` #0071e3,
  `accentHover` #0077ed, `surface` #f5f5f7, `line` #d2d2d7
- **Font:** SF Pro / system stack
- **Container:** `max-w-content` = 1024px

When you add a new game page, copy the same `<script>` config block so the
look stays consistent.

## SEO checklist (already done on the two pages)

- Exactly one `<h1>` per page
- Multiple `<h2>` section headings
- `<link rel="canonical">` pointing to the puzzleplay.online URL
- Full Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`, etc.)
- JSON-LD structured data (`WebSite` on home, `VideoGame` + `BreadcrumbList` on game pages)
- `lang="en"` on `<html>`
- Images have `width`, `height`, descriptive `alt`, and `loading="lazy"`
- `robots.txt` + `sitemap.xml` use the real domain

## Add a new game (about 20-30 minutes)

Using the keyword `jewel coloring` as an example.
For **self-hosted** games (no domain-lock redirect), see the full guide:
[HOWTO-self-host-games.md](HOWTO-self-host-games.md)

### 1. Get the embed code

1. Sign in at gamedistribution.com
2. Find the game; the URL looks like `https://gamedistribution.com/games/jewel-coloring/`
3. In the page's game iframe, grab the game ID (a 32-character string between `/`)

### 2. Copy the template

Duplicate the whole `games/safari-story-mahjong/` folder and rename it:

```
games/safari-story-mahjong/   ->   games/jewel-coloring/
```

### 3. Edit the new page

Open `games/jewel-coloring/index.html` and update:

1. **SEO trio (in `<head>`):**
   - `<title>` -> `Jewel Coloring - Play Free Online | PuzzlePlay`
   - `<meta name="description">` -> a game-specific description
   - `<link rel="canonical">` -> `/games/jewel-coloring/`
   - Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`)
2. **Structured data:** update the `VideoGame` and `BreadcrumbList` JSON-LD
3. **Title + meta:** `<h1>` -> `Jewel Coloring`, and the category line
4. **Game iframe:** swap the ID in `src`
5. **Content (most important):** rewrite About / How to Play / Tips / FAQ in
   your own words. This original text is what separates you from copy-paste sites.

### 4. Update the homepage and sitemap

Add a card in `index.html` inside the featured grid:

```html
<a href="/games/jewel-coloring/" class="group rounded-2xl overflow-hidden bg-surface border border-line/60 hover:shadow-lg transition-shadow">
  <div class="aspect-[4/3] overflow-hidden">
    <img src="..." alt="Jewel Coloring thumbnail" width="200" height="120" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500">
  </div>
  <div class="p-4">
    <h3 class="text-sm font-semibold">Jewel Coloring</h3>
    <p class="text-xs text-muted mt-1">Coloring</p>
  </div>
</a>
```

Add a `<url>` block to `sitemap.xml`.

### 5. Preview locally

Just double-click `index.html` to open it in a browser.
(The game iframe needs an internet connection to load.)

## Deploy to Cloudflare Pages (free)

### First deploy

1. Register a Cloudflare account (if you don't have one)
2. Dashboard -> Workers & Pages -> Create
3. Pick "Pages" -> "Upload assets" (upload the folder directly)
4. Drag the whole `game-site` folder in
5. Click Deploy

You'll get a `xxx.pages.dev` URL right away.

### Bind your domain

1. The domain `puzzleplay.online` should point to Cloudflare
2. In the Pages project settings -> Custom domains -> add `puzzleplay.online`
3. Wait for DNS to take effect (a few minutes to a few hours)

### After binding the domain

The canonical URLs, `og:url`, JSON-LD `url`, `robots.txt`, and `sitemap.xml`
already use `puzzleplay.online`, so no find-and-replace is needed.

### Future updates

Each time you add a game, re-upload the whole folder to Cloudflare Pages.
If you connect the project to GitHub, pushes deploy automatically.

## Submit to Google

1. After deploy, go to [Google Search Console](https://search.google.com/search-console)
2. Add `puzzleplay.online` and verify (usually a TXT record)
3. Submit `https://puzzleplay.online/sitemap.xml`
4. Manually submit new page URLs to speed up indexing

## Key reminders

- **Original content is everything:** the About / How to Play / Tips / FAQ copy
  must be written by you. Copying the publisher's text defeats the purpose.
- **Keep URLs clean:** `/games/game-name/`, no extra nesting.
- **Trademark risk:** low for generic words, but avoid famous brands as page slugs.
- **AdSense review:** game aggregation sites can be hard to approve; be ready to
  start with Adsterra/Monetag as a fallback.
