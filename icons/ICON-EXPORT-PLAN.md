# Icon Export & Dedup Plan

Reference for migrating the Girl Scouts icon library from Figma into `icons/`.
Source: Figma file `9LoLlN38Ej35qSVRcokDUu`, node `2697:347150` ("Icons" section).

> The Figma MCP integration exports these icons only as raster PNGs, not
> vectors. Export SVGs manually from Figma (right-click frame →
> **Copy as SVG**, or **Export → SVG**), then drop the `.svg` files into
> `icons/`. They will be deduped, hand-optimized, and `currentColor`-normalized.

## Normalization target (match existing repo convention)
- `viewBox="0 0 24 24"`, no fixed `width`/`height`
- Monochrome line icons: `fill="none" stroke="currentColor"` (stroke width per `--shape-icon-stroke-*`)
- Monochrome solid icons: `fill="currentColor"`
- Multi-color / illustrative icons: preserve original colors (do NOT flatten)
- `aria-hidden="true"`; strip editor metadata
- One icon = one kebab-case file matching its `icon-<name>` decoration class

## SKIP — already in repo, do NOT export (avoids duplicates)
Search, Heart, Cart, Edit, Star Rating, Facebook, Instagram, Youtube,
LinkedIn, Whatsapp, account / Sign In

## REPLACE — export; overwrite existing file (Figma = source of truth)
| Figma frame      | Overwrites              |
|------------------|-------------------------|
| Close            | `close.svg`, `x-lg.svg` |
| Twitter (X)      | `x.svg`                 |
| Delete           | `trash.svg`             |
| Arrow / Arrow Main | reconcile with `chevron-*` / `caret-*` |
| Plus, Minus      | (new, if wanted)        |

## ADD — export (no existing repo equivalent)
Thumb (up/down), Check, 3 Dots, Update, Share, Share new, Shipping,
Card wishlist, Print, Reorder, Download, Return order, Sign Out, Coupon,
Gift Card, Tag, Info, filter_list, Size Guide, Zoom in, Mail, Email, Call,
Time, Web, Location, menu_open, move, Menu Options, visibility, Calendar,
Upload, Table Sorting, Delivered, Shipped, Processing, Exchanged, Badges

### Multi-color illustrative set ("shipping and delivery") — keep colors
box, flag, t-shirt, iron, gift, shirt, etc.

## Notes
- The "Check" frame is a 5-variant stack — export only the single default state.
- Frames reusing generic names ("Icons", "Badges", "Heart", "Download",
  "Thumb") need unique semantic kebab-case filenames at export time.
