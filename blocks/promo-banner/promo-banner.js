/**
 * Promo Banner block.
 *
 * Authored as a small table. The first rows are configuration
 * (key/value), the remaining rows are the card content:
 *
 *   | promo-banner (large) |          <- variant via block class suffix
 *   | Menu  | new          |          <- stable menu key (matches API nav slug)
 *   | Color | violet       |          <- optional color modifier
 *   | <image>              |          <- card image
 *   | Customise Your Uniform |        <- caption / heading
 *   | <a href="/uniforms">Shop</a> |  <- optional CTA
 *
 * The block exposes its menu key via `data-menu` so the header can tag it to
 * the matching mega-menu item. Variants are CSS-only (promo-banner--{variant}).
 */

const CONFIG_KEYS = ['menu', 'color'];

export default function decorate(block) {
  const config = {};
  const contentRows = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent?.trim().toLowerCase();
    if (cells.length === 2 && CONFIG_KEYS.includes(key)) {
      config[key] = cells[1].textContent.trim();
      row.remove();
    } else {
      contentRows.push(row);
    }
  });

  if (config.menu) block.dataset.menu = config.menu;
  if (config.color) block.classList.add(`promo-banner--${config.color}`);

  // Flatten content rows into the card: image first, then caption/CTA.
  const card = document.createElement('a');
  card.className = 'promo-banner__card';

  const img = block.querySelector('picture, img');
  const link = block.querySelector('a');
  if (link) card.href = link.getAttribute('href');

  if (img) {
    const media = img.closest('picture') || img;
    card.append(media.cloneNode(true));
  }

  // Caption — first content row with text but no image and no link.
  const captionRow = contentRows.find((row) => !row.querySelector('img, picture, a')
    && row.textContent.trim());
  if (captionRow) {
    const span = document.createElement('span');
    span.className = 'promo-banner__caption';
    span.textContent = captionRow.textContent.trim();
    card.append(span);
  }

  block.textContent = '';
  block.append(card);
}
