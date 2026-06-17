import { getRootPath, isMultistore } from '@dropins/tools/lib/aem/configs.js';
// Dropin Components
import {
  Button,
  provider as UI,
} from '@dropins/tools/components.js';

// Block-level
import createModal from '../modal/modal.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1280px)');

/**
 * Toggles all storeSelector sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleStoreDropdown(sections, expanded = false) {
  sections
    .querySelectorAll('.storeview-modal .default-content-wrapper > ul > li')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
}

/**
 * Renders the store switcher modal in the footer.
 * @param {Element} footer The footer container element
 * @param {String} root The configured root path
 */
async function decorateStoreSwitcher(footer, root) {
  footer.innerHTML = `
      <div class="storeview-switcher-button"></div>
    `;

  // Container and component refs
  let modal;

  // Modal Actions
  const showModal = async (content) => {
    modal = await createModal([content]);
    modal.showModal();
  };

  // Rendering the Store Switcher Modal Content
  const $storeSwitcherBtn = footer.querySelector(
    '.storeview-switcher-button',
  );

  // Store Switcher Modal Content
  const storeSwitcherPath = '/store-switcher';
  let fragmentStoreView;

  try {
    fragmentStoreView = await loadFragment(storeSwitcherPath);
    if (!fragmentStoreView) throw new Error(`Footer does not render due to Store Switcher fragment (${storeSwitcherPath}) not found`);
  } catch (error) {
    console.error('Error loading store switcher fragment:', error);
    return;
  }

  // Store Switcher Modal Content
  const storeSwitcher = document.createElement('div');

  // Return Storename from stores-switcher
  const selected = [...fragmentStoreView.querySelectorAll('a')].find((a) => {
    const url = new URL(a.href);
    return url.pathname.startsWith(root);
  });

  storeSwitcher.id = 'storeview-modal';
  while (fragmentStoreView.firstElementChild) {
    storeSwitcher.append(fragmentStoreView.firstElementChild);
  }

  // create classes for storeview modal sections
  const classes = ['storeview-title', 'storeview-list'];
  classes.forEach((c, i) => {
    const section = storeSwitcher.children[i];
    if (section) section.classList.add(`storeview-modal-${c}`);
  });

  // Store Switcher Modal Content - Store View Title
  const storeViewTitle = storeSwitcher.querySelector('.storeview-modal-storeview-title');
  const title = storeViewTitle.querySelector('h3');
  if (title) {
    title.className = '';
    title.closest('h3').classList.add('storeview-modal-storeview-title');
    title.setAttribute('tabindex', '0');
  }

  // Storeview List
  const storeViewList = storeSwitcher.querySelector('.storeview-modal-storeview-list');

  if (storeViewList && storeViewList.children.length) {
    // Add storeview-selection class to parent UL
    storeViewList
      .querySelectorAll(':scope .default-content-wrapper > ul')
      .forEach((storeView) => {
        if (storeView.querySelector('ul')) storeView.classList.add('storeview-selection');
      });

    // if multiple stores exist per region, add class storeviews and click events for accordion
    storeViewList.querySelectorAll('.default-content-wrapper > ul > li > ul').forEach((storeRegion) => {
      if (storeRegion.children.length > 1) {
        if (storeRegion.querySelector('ul')) storeRegion.classList.add('storeviews');

        // Accessiblity: addeventlistener for 'click' and keyboard event and tab indexes
        storeViewList.querySelectorAll(':scope li').forEach((storeView) => {
          const link = storeView.closest('a');
          if (link) link.setAttribute('tabindex', '0');
          storeView.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              const expanded = storeView.getAttribute('aria-expanded') === 'true';
              toggleStoreDropdown(storeViewList);
              storeView.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            }
          });
          storeView.addEventListener('click', () => {
            const expanded = storeView.getAttribute('aria-expanded') === 'true';
            toggleStoreDropdown(storeViewList);
            storeView.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          });
        });
      }
    });

    // If only one storeview link in region, convert parent UL into the li and remove the child UL
    storeViewList.querySelectorAll('.default-content-wrapper > ul > li > ul').forEach((storeRegion) => {
      const li = storeRegion.closest('li');

      if (storeRegion.children.length <= 1) {
        li.classList.add('storeview-single-store');
        const ulParent = li.closest('ul');
        const replacedChild = (storeRegion.firstElementChild);
        replacedChild.className = 'storeview-single-store';

        ulParent.replaceChild(replacedChild, li);
        ulParent.setAttribute('tabindex', '0');
      } else {
        li.classList.add('storeview-multiple-stores');
        li.setAttribute('tabindex', '0');
      }
    });

    UI.render(Button, {
      children: `${selected.text}`,
      'data-testid': 'storeview-switcher-button',
      className: 'storeview-switcher-button',
      size: 'medium',
      variant: 'teritary',
      onClick: () => {
        showModal(storeSwitcher);
      },
    })($storeSwitcherBtn);
  }
}

/**
 * Sets the expanded/collapsed state of a footer link column.
 * @param {Element} column The `.footer-column` element
 * @param {Boolean} expanded Whether the column should be expanded
 */
function setColumnExpanded(column, expanded) {
  const toggle = column.querySelector('.footer-column-toggle');
  column.classList.toggle('footer-column--open', expanded);
  if (toggle) toggle.setAttribute('aria-expanded', expanded);
}

/**
 * Turns each heading + following list into a collapsible link column.
 * On desktop all columns are open and toggles disabled; on mobile they collapse.
 * @param {Element} container The links region container
 */
function decorateLinkColumns(container) {
  const columns = [];

  container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const list = heading.nextElementSibling;
    if (!list || list.tagName !== 'UL') return;

    const column = document.createElement('div');
    column.className = 'footer-column';

    // Build an accessible toggle button from the heading text.
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'footer-column-toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = heading.textContent;

    const title = document.createElement('span');
    title.className = 'footer-column-title';
    title.textContent = heading.textContent;

    heading.replaceWith(column);
    column.append(title, toggle, list);
    list.classList.add('footer-column-links');

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setColumnExpanded(column, !expanded);
    });

    columns.push(column);
  });

  // "Follow Us On" column hosts social icon links.
  const socialColumn = columns.find((col) => /follow us/i.test(col.querySelector('.footer-column-title')?.textContent || ''));
  if (socialColumn) socialColumn.classList.add('footer-social');

  const localCol = columns.find((col) => /local resources/i.test(
    col.querySelector('.footer-column-title')?.textContent || '',
  ));
  const socialCol = columns.find((col) => col.classList.contains('footer-social'));
  const primaryCols = columns.filter((col) => col !== localCol && col !== socialCol);
  if (primaryCols.length) {
    const row1 = document.createElement('div');
    row1.className = 'footer-links-row1';
    primaryCols[0].before(row1);
    primaryCols.forEach((col) => row1.append(col));
  }
  if (localCol && socialCol) {
    const row2 = document.createElement('div');
    row2.className = 'footer-links-row2';
    localCol.before(row2);
    row2.append(localCol, socialCol);
  }

  const applyResponsiveState = () => {
    columns.forEach((column, index) => {
      if (column.classList.contains('footer-social')) {
        setColumnExpanded(column, true);
      } else if (isDesktop.matches) {
        setColumnExpanded(column, true);
      } else {
        setColumnExpanded(column, index === 0);
      }
    });
  };

  applyResponsiveState();
  isDesktop.addEventListener('change', applyResponsiveState);

  return columns;
}

/**
 * Splits inline legal links into a list for stacked mobile / inline desktop layout.
 * @param {Element} legalRegion The `.footer-legal` section
 */
function decorateLegalLinks(legalRegion) {
  const linksParagraph = [...legalRegion.querySelectorAll('p')].find(
    (p) => p.querySelector('a') && !/©|all rights reserved/i.test(p.textContent),
  );
  if (!linksParagraph) return;

  const list = document.createElement('ul');
  list.className = 'footer-legal-links';
  linksParagraph.querySelectorAll('a').forEach((anchor) => {
    const item = document.createElement('li');
    item.append(anchor);
    list.append(item);
  });
  linksParagraph.replaceWith(list);
}

const DEFAULT_WHOLESALE_LOGIN = '/wholesale/login';

/**
 * Reads wholesale copy from authored markup (plain HTML or CMS bold lines).
 * @param {Element} wholesaleRegion The `.footer-wholesale` section
 * @returns {{ titleText: string, loginText: string, loginHref: string, subText: string } | null}
 */
function readWholesaleContent(wholesaleRegion) {
  const wrapper = wholesaleRegion.querySelector('.default-content-wrapper') || wholesaleRegion;
  const paragraphs = [...wrapper.querySelectorAll(':scope > p')];
  if (!paragraphs.length) return null;

  let titleText = 'Hello, Wholesale Partners';
  let loginText = 'Login Here';
  let loginHref = DEFAULT_WHOLESALE_LOGIN;
  let subText = 'for your personalized Experience';

  if (paragraphs.length >= 2) {
    titleText = paragraphs[0].textContent.trim();
    const loginPara = paragraphs[1];
    const loginAnchor = loginPara.querySelector('a');
    if (loginAnchor) {
      loginHref = loginAnchor.getAttribute('href') || DEFAULT_WHOLESALE_LOGIN;
      loginText = loginAnchor.textContent.trim();
    } else {
      loginText = loginPara.textContent.trim();
    }
    if (paragraphs[2]) {
      subText = paragraphs[2].textContent.trim();
    }
    return {
      titleText,
      loginText,
      loginHref,
      subText,
    };
  }

  const source = paragraphs[0];
  const strongs = [...source.querySelectorAll('strong')];
  const loginAnchor = source.querySelector('a');
  const subEl = source.querySelector('.footer-wholesale-sub');

  if (strongs[0]) {
    titleText = strongs[0].textContent.trim();
  }

  if (loginAnchor) {
    loginHref = loginAnchor.getAttribute('href') || DEFAULT_WHOLESALE_LOGIN;
    loginText = loginAnchor.textContent.trim();
  } else if (strongs[1]) {
    loginText = strongs[1].textContent.trim();
  }

  if (subEl) {
    subText = subEl.textContent.trim();
  } else {
    const remainder = source.cloneNode(true);
    remainder.querySelectorAll('strong, a, br, .footer-wholesale-sub').forEach((el) => el.remove());
    const text = remainder.textContent.trim();
    if (text) subText = text;
  }

  return {
    titleText,
    loginText,
    loginHref,
    subText,
  };
}

/**
 * Builds Figma wholesale callout markup (2722:357802).
 * @param {Element} wholesaleRegion The `.footer-wholesale` section
 */
function decorateWholesale(wholesaleRegion) {
  if (wholesaleRegion.querySelector('.footer-wholesale-body')) return;

  const content = readWholesaleContent(wholesaleRegion);
  if (!content) return;

  const wrapper = wholesaleRegion.querySelector('.default-content-wrapper') || wholesaleRegion;
  const {
    titleText,
    loginText,
    loginHref,
    subText,
  } = content;

  const body = document.createElement('div');
  body.className = 'footer-wholesale-body';

  const lead = document.createElement('p');
  lead.className = 'footer-wholesale-lead';

  lead.append(document.createTextNode(titleText), document.createElement('br'), document.createElement('br'));

  const login = document.createElement('a');
  login.href = loginHref;
  login.textContent = loginText;
  lead.append(login);

  const sub = document.createElement('p');
  sub.className = 'footer-wholesale-sub';
  sub.textContent = subText;

  body.append(lead, sub);
  wrapper.querySelectorAll('p').forEach((p) => p.remove());
  wrapper.append(body);
}

/**
 * Groups newsletter + wholesale into Figma right sidebar column (2722:357788).
 * @param {Element} footer The footer container element
 */
function decorateSidebar(footer) {
  const newsletter = footer.querySelector('.footer-newsletter');
  const wholesale = footer.querySelector('.footer-wholesale');
  if (!newsletter || !wholesale || footer.querySelector('.footer-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.className = 'footer-sidebar';
  newsletter.before(sidebar);
  sidebar.append(newsletter, wholesale);
}

/**
 * Wraps newsletter copy and adds CTA class for Figma subscribe row.
 * @param {Element} newsletterRegion The `.footer-newsletter` section
 */
function decorateNewsletter(newsletterRegion) {
  if (newsletterRegion.querySelector('.footer-newsletter-card')) return;

  const root = newsletterRegion.querySelector('.default-content-wrapper') || newsletterRegion;

  const heading = root.querySelector('h2, h3, h4');
  if (!heading) return;

  const description = heading.nextElementSibling?.tagName === 'P' ? heading.nextElementSibling : null;
  const ctaParagraph = [...root.querySelectorAll('p')].find((p) => p.querySelector('a'));
  const cta = ctaParagraph?.querySelector('a');
  if (!description || !cta || !ctaParagraph) return;

  const imageParagraph = [...root.querySelectorAll(':scope > p')].find(
    (p) => p.querySelector('img, picture') && p !== description && p !== ctaParagraph,
  );

  const card = document.createElement('div');
  card.className = 'footer-newsletter-card';

  const media = document.createElement('div');
  media.className = 'footer-newsletter-media';

  if (imageParagraph) {
    media.append(...imageParagraph.childNodes);
    imageParagraph.remove();
  } else {
    const picture = root.querySelector(':scope > picture');
    const standaloneImg = root.querySelector(':scope > img');
    if (picture) {
      media.append(picture);
    } else if (standaloneImg) {
      media.append(standaloneImg);
    }
  }

  if (media.childNodes.length) {
    card.append(media);
  }

  const body = document.createElement('div');
  body.className = 'footer-newsletter-body';
  description.classList.add('footer-newsletter-desc');
  cta.classList.add('footer-newsletter-cta');
  body.append(heading, description, cta);
  card.append(body);
  ctaParagraph.remove();

  root.append(card);
}

/**
 * Applies footer region classes to each section.
 * Prefers author-provided section metadata classes; otherwise classifies each
 * section by its content so the footer renders correctly regardless of how the
 * source document was authored.
 * @param {Element} footer The footer container element
 */
function tagFooterRegions(footer) {
  const sections = [...footer.querySelectorAll(':scope > .section')];
  const regionClasses = ['footer-brand', 'footer-links', 'footer-newsletter', 'footer-wholesale', 'footer-legal'];

  sections.forEach((section) => {
    // Respect an author-tagged region if present.
    if (regionClasses.some((c) => section.classList.contains(c))) return;

    const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const lists = section.querySelectorAll('ul');
    const text = section.textContent.trim();
    const hasImage = !!section.querySelector('picture, img');

    if (headings.length >= 2 && lists.length >= 2) {
      // Multiple heading + list pairs => the link columns region.
      section.classList.add('footer-links');
    } else if (hasImage && headings.length && /know what's new/i.test(text)) {
      section.classList.add('footer-newsletter');
    } else if (/wholesale partners/i.test(text)) {
      section.classList.add('footer-wholesale');
    } else if (/©|all rights reserved|privacy policy/i.test(text)) {
      section.classList.add('footer-legal');
    } else if (hasImage && !headings.length && !lists.length) {
      section.classList.add('footer-brand');
    }
  });

  // Robots / generic metadata sections should never display in the footer.
  sections.forEach((section) => {
    if (section.querySelector('.metadata')) {
      section.remove();
      return;
    }
    // Published metadata may arrive as plain key/value paragraphs with no class.
    const isUntagged = !regionClasses.some((c) => section.classList.contains(c));
    if (isUntagged && /^robots\b/i.test(section.textContent.trim())) {
      section.remove();
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const root = getRootPath();
  // Load Footer as Fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');

  // Footer content - Store Switcher
  if (isMultistore()) {
    await decorateStoreSwitcher(footer, root);
  }
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Ensure each region has its expected class, then build the link columns.
  tagFooterRegions(footer);
  const linksRegion = footer.querySelector('.footer-links');
  if (linksRegion) decorateLinkColumns(linksRegion);

  const newsletterRegion = footer.querySelector('.footer-newsletter');
  if (newsletterRegion) decorateNewsletter(newsletterRegion);

  const wholesaleRegion = footer.querySelector('.footer-wholesale');
  if (wholesaleRegion) decorateWholesale(wholesaleRegion);

  decorateSidebar(footer);

  const legalRegion = footer.querySelector('.footer-legal');
  if (legalRegion) {
    decorateLegalLinks(legalRegion);
    const copyright = [...legalRegion.querySelectorAll('p')].find(
      (p) => /©|all rights reserved/i.test(p.textContent),
    );
    if (copyright) copyright.classList.add('footer-legal-copyright');
  }

  block.append(footer);
}
