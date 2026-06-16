# Girl Scouts — da.live Authoring Guide (Header, Nav, Footer, Promos)

This guide explains how to author the `/footer`, `/nav`, and `/nav-promos`
documents in da.live so the published site matches the migrated block code on
`feature/setup`. The code styles the structure; **these documents drive what
renders**. Mirror the reference markup in `drafts/` (`footer.plain.html`,
`nav.plain.html`, `nav-promos.plain.html`) when authoring.

> The local dev server proxies **published** content. Repo `content/` files are
> a local preview mirror only (git-excluded). To go live, author + **Preview/
> Publish** each document in da.live.

---

## 0. Assets to upload first

Upload these to da.live (or commit to `/icons/` — already committed on the
branch). Replace placeholder art where noted.

| Asset | Used by | Notes |
|---|---|---|
| `gs-logo-header.png` | nav logo | committed |
| `gs-logo.png` | footer logo | committed |
| Social SVGs: `facebook, x, youtube, instagram, linkedin, whatsapp` | footer "Follow Us On" | committed |
| `star.svg`, `account.svg` | header toggle, account icon | committed |
| `sparkle.svg` | offer-banner (violet 4-point sparkle) | committed |
| `footer-newsletter.jpg` | footer newsletter + **all promo placeholders** | **placeholder** — replace with real promo/newsletter photos |
| Promo art: New Arrivals, Customise Uniform, Kit Bag, $15 Off, Uniforms Collection | `/nav-promos`, sections | **needs real artwork** |

---

## 1. `/footer` document

Five sections, each separated by `---` and tagged with a **Section Metadata**
block whose **Style** value becomes the region class the footer block reads.

1. **Brand** — the GS logo image. Section Metadata → Style: `footer-brand`
2. **Links** — five `H3` headings, each followed by a bulleted link list:
   - *Quick Links*: My Account, Quick Order, Store Locator, Cookie Dough Program Credits, View our Digital Catalog, New to Girl Scouts?
   - *Help Center*: Contact us, Return & Refund Policy, Where to place badges & insignia, FAQ, Promotional Exclusions, Size Guide
   - *About Us*: Girl Scouts of the USA homepage, Donate, Lifetime Membership
   - *Local Resources*: Find your Nearest Store, Find your local council, Find Cookies
   - *Follow Us On*: six **links** whose text is an icon shortcode — `:facebook:` `:x:` `:youtube:` `:instagram:` `:linkedin:` `:whatsapp:`
   - Section Metadata → Style: `footer-links`
3. **Newsletter** — image, then `H3` "Be the first to know what's new!", a paragraph, and a "Subscribe now" link. Style: `footer-newsletter`
4. **Wholesale** — one paragraph: **Hello, Wholesale Partners** / **Login Here** / for your personalized Experience. Style: `footer-wholesale`
5. **Legal** — paragraph of legal links (Privacy Policy, Terms & Conditions of Use, Product Safety Statement) + paragraph "© 2025 Girl Scouts of the USA". Style: `footer-legal`
6. **Robots** — add a page-level **Metadata** block (NOT Section Metadata):
   `Robots = noindex, nofollow`. This becomes a `<meta>` tag, not visible text.

Reference: `drafts/footer.md` and `drafts/footer.plain.html`.

---

## 2. `/nav` document

Four top-level sections (brand, nav list, empty tools placeholder, offer banner):

1. **Brand** — a link to `/` wrapping the nav logo image.
2. **Nav list** — a single bulleted list with these items, in order:
   `New`, `Shop by Grade`, `Uniforms`, `Apparel & Accessories`,
   `Badges, Patches & Awards`, `Gifts`, `Toys & Outdoors`, `Council`, `Sale`,
   then `Account`.
   - **New** has a **nested sub-list** of grouped columns. Each group = a link
     (the column heading) with its own nested list of sub-links:
     - Girls → Official Apparel, Tops, Bottom, Dresses, Outerwear, Accessories, Self-Care
     - Women → Official Apparel, Tops, Bottom, Outerwear, Accessories
     - All Gender → Tops, Bottom, Accessories
     - Accessories → Jewellery, Bags & Backpacks, Hats & Hair, Socks & Slippers, Self-Care & Beauty, Scarves & Ties
   - **Account** has a nested list: Log in, Registration, My Account, Combined Auth.
     (It is hidden from the desktop nav bar and surfaced via the account dropdown.)
3. **Tools** — an empty `<div>` (the block injects search/wishlist/cart/account).
4. **Offer banner** — an `offer-banner` block (see below). The header pulls it
   out of the nav fragment and pins it **on top of** the header (above the nav
   row), on both desktop and mobile.

Notes:
- Nav links are intended to be API-driven in production; this document supplies
  the structure and the "New" mega-menu grouping.
- Reference: `drafts/nav.plain.html`.

### 2a. `offer-banner` block (dismissible promo strip on top of the header)

Author this as the **last section** of `/nav` (after the empty tools `<div>`).
It is a two-row block:

| offer-banner |
|---|
| Free Gift with purchase of a Uniform – Use Code: FREEPURPLEBAG [Redeem Now](/sale) |
| [Terms & Conditions](/terms) |

- **Row 1** = the message text plus the **Redeem** call-to-action link.
- **Row 2** = the **Terms & Conditions** link (hidden on mobile/tablet).
- The block adds the violet sparkle icon, the green band (`#d5f267`), and a
  dismiss (×) button. Dismissal is remembered in the browser (localStorage).
- To change the offer, edit the message text / link targets. To remove the
  banner entirely, delete this section.
- Reference: the `offer-banner` block in `drafts/nav.plain.html`.

---

## 3. `/nav-promos` document (authored promo blocks for the mega menu)

A single section containing one or more **promo blocks**. Each carries a `Menu`
key matching a nav item's slug (`toClassName` of its label, e.g. `new`,
`apparel-accessories`). The header groups them by key and injects them into the
matching mega-menu panel.

**Block types & variants** (pick the block name accordingly):

| Block | Variant (name suffix) | Use |
|---|---|---|
| `promo-banner` | _(none)_ small card; `offer` badge card | compact card, nav promos |
| `promo-banner large` | _(adds `large`)_ | full 1:1 (372×372) hero card with the heading + **arrow CTA** overlaid top-left (e.g. "New Arrivals" → "Shop All Collection ›") |
| `promo-feature` | color: `gold`/`forest`/`peach`/`sunshine` | image + panel + heading + subtext + **button** |
| `promo-tile` | _(none)_ | vertical 3:5 image-bg tile + heading + arrow CTA |

For the `large` promo, the heading uses the Girl Scout display font and the CTA
link label renders in forest green with a chevron arrow. It is full-width inside
the mobile mega-menu accordion.

**Authoring a promo block** (table rows):
- `Menu` | the target nav slug (e.g. `new`)
- `Color` | a color modifier (promo-banner / promo-feature)
- _image row_ | the card/background image
- _text row_ | heading / caption
- _link row_ | CTA link (label + href)

Example set (from `drafts/nav-promos.plain.html`):
- `promo-banner`, Menu `new`, Color `violet`, "Customise Your Uniform" → /uniforms
- `promo-banner`, Menu `new`, Color `khaki`, "Free My Girl Scout Kit Bag" → /new
- `promo-banner large`, Menu `apparel-accessories`, "New Arrivals" → /new

**Reusing promos elsewhere:** `promo-feature` and `promo-tile` are standalone
blocks — author them directly in any page section (no `Menu` key needed). See
`drafts/promo-blocks-test.plain.html`.

---

## 4. Publish & verify

1. Author each document in da.live and **Preview** (then Publish).
2. Confirm on the feature preview: `https://feature-setup--gsusa--deepaksharma-adobe.aem.page/`
3. Check: footer renders 5 regions with white social icons; header shows promo
   banner + toggle + nav row + mega menu with injected promos; mobile drawer
   accordions work.
4. Replace placeholder imagery with real artwork.

---

## 5. Responsive grid system (for developers)

The GS layout follows a **three-tier responsive column grid** (Figma node 3:1102
desktop/mobile + tablet PDP frames). This is implemented in `styles/styles.css`
— authors don't configure it, but developers building blocks should align to it.

| | Mobile (< 768px) | Tablet (768–1279px) | Desktop (≥ 1280px) |
|---|---|---|---|
| Columns | 4 | 12 | 12 |
| Margin (outer) | 20px | 20px | 56px |
| Gutter | 16px | 16px | 24px |
| Content frame | 320px (within 360) | within 20px margins | 1168px (within 1280) |

**Tokens** (auto-switch at the 768px and 1280px breakpoints — never branch on
the breakpoint yourself):

- `--grid-columns` — 4 (mobile) → 12 (tablet) → 12 (desktop)
- `--grid-margin` — 20px → 20px → 56px
- `--grid-gutter` — 16px → 16px → 24px
- `--grid-max-width` — 1280px (the section content frame)
- `--bp-tablet` (768px), `--bp-desktop` (1280px) — reference constants

Sections (`main > .section > div`) already use these: they cap at
`--grid-max-width` and pad by `--grid-margin`.

**`.grid-12` utility** — opt a container into the column grid:

```html
<div class="grid-12">
  <div class="col-span-4">…</div>
  <div class="col-span-4">…</div>
  <div class="col-span-4">…</div>
  <div class="col-span-6">…</div>
  <div class="col-span-6">…</div>
</div>
```

- Track count and gutter follow the active tier (4 cols / 16px on mobile,
  12 cols / 16px on tablet, 12 cols / 24px on desktop).
- Span helpers: `.col-span-3`, `.col-span-4`, `.col-span-6`, `.col-span-12`.
  On mobile (4 tracks) spans wider than 4 clamp to the full row; from tablet
  (768px, 12 tracks) up they take their true width.
- Apply `.grid-12` to a block/section **child** container — not as a standalone
  block name (EDS would try to load a block module of that name).

**Reference retrofit:** `blocks/columns/columns.css` lays its columns out on the
12-track grid on desktop (`.columns-2-cols` → span 6, `-3-cols` → span 4,
`-4-cols` → span 3) and stacks on mobile.
