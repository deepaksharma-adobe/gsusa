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
| `star.svg`, `account.svg` | header toggle/promo, account icon | committed |
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

Three top-level sections (brand, nav list, empty tools placeholder):

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

Notes:
- Nav links are intended to be API-driven in production; this document supplies
  the structure and the "New" mega-menu grouping.
- Reference: `drafts/nav.plain.html`.

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
| `promo-feature` | color: `gold`/`forest`/`peach`/`sunshine` | image + panel + heading + subtext + **button** |
| `promo-tile` | _(none)_ | vertical 3:5 image-bg tile + heading + arrow CTA |

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
