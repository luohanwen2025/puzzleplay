# PuzzlePlay

A static HTML5 puzzle game portal. No build step — just HTML, CSS, and game assets.

- **Live site:** [puzzleplay.online](https://puzzleplay.online/)
- **Hosting:** Cloudflare Pages (connected to this repo, auto-deploys on push)
- **Stack:** Static HTML + Tailwind CSS (Play CDN)

## Games

| Game | Type | Source |
|------|------|--------|
| Safari Story Mahjong | Mahjong Solitaire | GameDistribution (iframe) |
| Juice Merge | Merge Puzzle | Self-hosted |

## Structure

`
game-site/
├── index.html                Homepage (hero + featured grid)
├── games/
│   ├── safari-story-mahjong/  GD iframe embed
│   │   └── index.html
│   └── juice-merge/           Self-hosted game package
│       ├── index.html         Landing page (SEO + content)
│       ├── thumbnail.jpg
│       └── play/              Game files (mirrored from GD CDN)
├── favicon.png
├── apple-touch-icon.png
├── robots.txt
└── sitemap.xml
`

## License

All game copyrights belong to their respective developers.