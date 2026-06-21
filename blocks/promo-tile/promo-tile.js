/**
 * Promo Tile block.
 *
 * A vertical collection tile (3:5) with a background image and an overlaid
 * heading + arrow CTA link. Sized to drop into carousels, PLP rows, or columns.
 * Reusable in any section; can also be tagged to a nav mega-menu item.
 *
 *   | promo-tile           |
 *   | Menu  | uniforms     |   <- optional: tag to a mega-menu item
 *   | <image>              |   <- background image
 *   | Our Uniforms Collection |  <- heading
 *   | <a href="/uniforms">Shop All Collection</a> |  <- CTA link
 */

const CONFIG_KEYS = ['menu'];

export default function decorate(block) {
  const config = {};
  const contentRows = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent?.trim().toLowerCase();
    if (cells.length === 2 && CONFIG_KEYS.includes(key)) {
      config[key] = cells[1].textContent.trim();
    } else {
      contentRows.push(row);
    }
  });

  if (config.menu) block.dataset.menu = config.menu;

  const img = block.querySelector('picture, img');
  const link = block.querySelector('a');
  const headingRow = contentRows.find((row) => !row.querySelector('img, picture, a')
    && row.textContent.trim());

  // The whole tile is a link when a CTA is present.
  const tile = link ? document.createElement('a') : document.createElement('div');
  tile.className = 'promo-tile__card';
  if (link) tile.href = link.getAttribute('href');

  if (img) {
    const media = document.createElement('div');
    media.className = 'promo-tile__media';
    media.append((img.closest('picture') || img).cloneNode(true));
    tile.append(media);
  }

  const content = document.createElement('div');
  content.className = 'promo-tile__content';
  if (headingRow) {
    const heading = document.createElement('p');
    heading.className = 'promo-tile__heading';
    heading.textContent = headingRow.textContent.trim();
    content.append(heading);
  }
  if (link) {
    const cta = document.createElement('span');
    cta.className = 'promo-tile__cta';
    cta.textContent = link.textContent.trim();
    content.append(cta);
  }
  tile.append(content);

  block.textContent = '';
  block.append(tile);
}
