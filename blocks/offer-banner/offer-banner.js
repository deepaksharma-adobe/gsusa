const DISMISSED_KEY = 'gs-offer-banner-dismissed';

/**
 * Offer Banner block — the dismissible promo strip above the header.
 *
 * Authored as a two-row block; the first link in each row drives the CTA:
 *
 *   | offer-banner |
 *   | Free Gift with purchase of a Uniform – Use Code: FREEPURPLEBAG [Redeem Now](/sale) |
 *   | [Terms & Conditions](/terms) |
 *
 * Row 1 = message text + the "Redeem" CTA link.
 * Row 2 = the "Terms & Conditions" link.
 *
 * Dismissal is persisted in localStorage so the banner stays hidden on return.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const messageRow = rows[0];
  const termsRow = rows[1];

  block.textContent = '';

  // If previously dismissed, render nothing.
  if (localStorage.getItem(DISMISSED_KEY) === 'true') {
    block.remove();
    return;
  }

  // Content group: sparkle icon + message + redeem CTA.
  const content = document.createElement('div');
  content.className = 'offer-banner__content';

  const icon = document.createElement('span');
  icon.className = 'offer-banner__sparkle';
  icon.setAttribute('aria-hidden', 'true');
  content.append(icon);

  if (messageRow) {
    const cell = messageRow.querySelector(':scope > div') || messageRow;
    const redeem = cell.querySelector('a');
    if (redeem) {
      redeem.classList.add('offer-banner__redeem');
      redeem.remove();
    }
    // EDS wraps cell text in a <p>; reuse it as the message, else build one.
    const innerP = cell.querySelector(':scope > p');
    const message = innerP || document.createElement('p');
    if (!innerP) message.append(...cell.childNodes);
    message.className = 'offer-banner__message';
    content.append(message);
    if (redeem) content.append(redeem);
  }

  block.append(content);

  // Terms link.
  if (termsRow) {
    const terms = termsRow.querySelector('a');
    if (terms) {
      terms.classList.add('offer-banner__terms');
      block.append(terms);
    }
  }

  // Dismiss button.
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'offer-banner__close';
  close.setAttribute('aria-label', 'Dismiss offer');
  close.addEventListener('click', () => {
    block.remove();
    localStorage.setItem(DISMISSED_KEY, 'true');
  });
  block.append(close);
}
