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

  const applyResponsiveState = () => {
    columns.forEach((column) => {
      if (column.classList.contains('footer-social')) {
        setColumnExpanded(column, true);
      } else {
        setColumnExpanded(column, isDesktop.matches);
      }
    });
  };

  applyResponsiveState();
  isDesktop.addEventListener('change', applyResponsiveState);

  return columns;
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

  // Decorate authored footer regions (tagged via section metadata).
  const linksRegion = footer.querySelector('.footer-links');
  if (linksRegion) decorateLinkColumns(linksRegion);

  block.append(footer);
}
