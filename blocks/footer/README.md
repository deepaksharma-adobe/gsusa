# Footer block

Global site footer loaded from the `/footer` fragment (or `metadata` footer path).

## Authoring structure

| Region class | Content |
|---|---|
| `footer-brand` | White logo (`gs-logo-header.png`, 126×42) |
| `footer-links` | Heading + `<ul>` pairs (Quick Links, Help Center, About Us, Local Resources, Follow Us) |
| `footer-newsletter` | Hero image, heading, body copy, Subscribe link |
| `footer-wholesale` | Wholesale partners callout with login link |
| `footer-legal` | Legal links paragraph + copyright |

Social icons use `<span class="icon icon-{name}">` (decorated by `decorateIcons()`).

## Behavior

- **Mobile:** accordion columns (Quick Links open by default); Follow Us always visible; stacked legal links
- **Desktop (≥1280px):** 3-column link grid + row 2 (Local Resources / Follow Us); sidebar newsletter + wholesale; inline legal bar

## Figma reference

- Desktop: `5168:208610`
- Mobile: `5650:138173`
