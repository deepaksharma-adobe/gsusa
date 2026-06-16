/**
 * Promo Feature block.
 *
 * A wide feature banner: image on top, a colored content panel below with a
 * heading, optional subtext, and a solid CTA button. Reusable in any section;
 * can also be tagged to a nav mega-menu item via a `Menu` config row.
 *
 *   | promo-feature        |
 *   | Menu  | new          |   <- optional: tag to a mega-menu item
 *   | Color | gold         |   <- optional content-panel tint
 *   | <image>              |
 *   | Get 20% Off ...      |   <- heading
 *   | Shop Early and Save  |   <- subtext (optional)
 *   | <a href="/sale">Shop now</a> |  <- CTA button
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
    } else {
      contentRows.push(row);
    }
  });

  if (config.menu) block.dataset.menu = config.menu;
  if (config.color) block.classList.add(`promo-feature--${config.color}`);

  const img = block.querySelector('picture, img');
  const link = block.querySelector('a');

  const media = document.createElement('div');
  media.className = 'promo-feature__media';
  if (img) media.append((img.closest('picture') || img).cloneNode(true));

  const panel = document.createElement('div');
  panel.className = 'promo-feature__panel';

  // Text rows = content rows with text but no image/link. First = heading.
  const textRows = contentRows.filter((row) => !row.querySelector('img, picture, a')
    && row.textContent.trim());
  if (textRows[0]) {
    const heading = document.createElement('p');
    heading.className = 'promo-feature__heading';
    heading.textContent = textRows[0].textContent.trim();
    panel.append(heading);
  }
  if (textRows[1]) {
    const sub = document.createElement('p');
    sub.className = 'promo-feature__subtext';
    sub.textContent = textRows[1].textContent.trim();
    panel.append(sub);
  }
  if (link) {
    const cta = document.createElement('a');
    cta.className = 'promo-feature__cta button';
    cta.href = link.getAttribute('href');
    cta.textContent = link.textContent.trim();
    panel.append(cta);
  }

  block.textContent = '';
  if (img) block.append(media);
  block.append(panel);
}
