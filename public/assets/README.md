# ZeroQ Public Assets Directory

This directory contains all static assets served directly.

## Structure

```
public/
├── assets/
│   ├── outlets/        ← Outlet thumbnail images (1:1 square, .webp)
│   │   ├── outlet-main-canteen.webp
│   │   ├── outlet-rishabs-food-court.webp
│   │   ├── outlet-snow-cubes.webp
│   │   ├── outlet-metro-cafe.webp
│   │   ├── outlet-pr-cafe.webp
│   │   └── outlet-aswins-food-court.webp
│   └── items/          ← Menu item images (1:1 square, .png)
│       ├── meal-*.png
│       ├── snack-*.png
│       ├── beverage-*.png
│       └── dessert-*.png
└── favicon.ico
```

## Generating Images

See `docs/IMAGE_MANIFEST.md` for:
- Complete list of all 54 required image files
- AI generation prompts for each asset category
- Format and aspect ratio requirements

## Fallback

During development, missing images fall back gracefully using `next/image` error handling.
