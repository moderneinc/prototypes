/**
 * WIREFRAME KIT — Neo Design System (Lo-Fi)
 *
 * Vanilla JS ES Module with Web Components.
 * Each component registers as <wf-*> custom element.
 * Mirrors Neo's prop API via attributes, with generous defaults.
 *
 * Usage:
 *   <link rel="stylesheet" href="wireframe-kit/wireframe-kit.css">
 *   <script type="module" src="wireframe-kit/wireframe-kit.js"></script>
 *
 *   <wf-button variant="primary">Save</wf-button>
 *   <wf-table rows="5" cols="3" headers="Name,Status,Date"></wf-table>
 */

// ============================================
// UTILITY
// ============================================
const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    el.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
};

const placeholder = (variant = 'long') =>
  h('div', { className: `wf-placeholder wf-placeholder--${variant}` });

const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
const lorem = (n = 5) => {
  const words = [];
  for (let i = 0; i < n; i++) words.push(loremWords[i % loremWords.length]);
  return words.join(' ');
};

const sampleNames = ['Alice Chen', 'Bob Torres', 'Carol Kim', 'Dave Patel', 'Eve Johnson', 'Frank Liu', 'Grace Smith', 'Hiro Tanaka'];
const sampleStatuses = ['Active', 'Pending', 'Complete', 'Error', 'Running'];
const sampleDates = ['Jun 1', 'Jun 2', 'Jun 3', 'May 28', 'May 30', 'Jun 4', 'May 25', 'Jun 5'];

// ============================================
// BASE CLASS
// ============================================
class WfBase extends HTMLElement {
  connectedCallback() {
    if (!this._rendered) {
      this.render();
      this._rendered = true;
    }
  }
  attr(name, fallback = '') {
    return this.getAttribute(name) ?? fallback;
  }
  numAttr(name, fallback = 0) {
    const v = this.getAttribute(name);
    return v != null ? parseInt(v, 10) : fallback;
  }
  boolAttr(name) {
    return this.hasAttribute(name);
  }
  render() {}
}

// ============================================
// COMPONENTS
// ============================================

// --- Alert ---
class WfAlert extends WfBase {
  render() {
    const variant = this.attr('variant', 'info');
    const title = this.attr('title', 'Alert title');
    const icons = { info: 'i', success: '✓', warning: '!', error: '✕' };
    this.className = `wf-alert wf-alert--${variant}`;
    this.append(
      h('div', { className: 'wf-alert__icon' }, icons[variant] || 'i'),
      h('div', { className: 'wf-alert__content' },
        h('div', { className: 'wf-alert__title' }, title),
        h('div', { className: 'wf-alert__message' }, this.textContent || 'Alert description goes here')
      )
    );
  }
}

// --- Avatar ---
class WfAvatar extends WfBase {
  render() {
    const size = this.attr('size', 'md');
    const initials = this.attr('initials', '?');
    const sizeClass = size !== 'md' ? ` wf-avatar--${size}` : '';
    this.innerHTML = '';
    this.className = `wf-avatar${sizeClass}`;
    this.textContent = initials;
  }
}

// --- Badge ---
class WfBadge extends WfBase {
  render() {
    const text = this.textContent || 'Badge';
    const filled = this.boolAttr('filled');
    this.innerHTML = '';
    this.className = `wf-badge${filled ? ' wf-badge--filled' : ''}`;
    this.textContent = text;
  }
}

// --- Banner ---
class WfBanner extends WfBase {
  render() {
    const text = this.textContent || 'This is a banner message';
    this.innerHTML = '';
    this.className = 'wf-banner';
    this.append(
      h('span', {}, text),
      h('button', { className: 'wf-banner__dismiss' }, '×')
    );
  }
}

// --- Breadcrumb ---
class WfBreadcrumb extends WfBase {
  render() {
    const items = this.attr('items', 'Home,Section,Page').split(',');
    this.innerHTML = '';
    this.className = 'wf-breadcrumb';
    items.forEach((item, i) => {
      const isLast = i === items.length - 1;
      this.append(
        h('span', { className: `wf-breadcrumb__item${isLast ? ' wf-breadcrumb__item--active' : ''}` }, item.trim())
      );
      if (!isLast) this.append(h('span', { className: 'wf-breadcrumb__sep' }, '/'));
    });
  }
}

// --- Button ---
class WfButton extends WfBase {
  render() {
    const variant = this.attr('variant');
    const size = this.attr('size');
    const disabled = this.boolAttr('disabled');
    const text = this.textContent || 'Button';
    this.innerHTML = '';
    let cls = 'wf-button';
    if (variant) cls += ` wf-button--${variant}`;
    if (size) cls += ` wf-button--${size}`;
    if (disabled) cls += ' wf-button--disabled';
    this.className = '';
    const btn = h('button', { className: cls, ...(disabled ? { disabled: '' } : {}) }, text);
    this.replaceWith(btn);
  }
}

// --- ButtonGroup ---
class WfButtonGroup extends WfBase {
  render() {
    const items = this.attr('items', 'Left,Center,Right').split(',');
    this.innerHTML = '';
    this.className = 'wf-button-group';
    items.forEach(item => {
      this.append(h('button', { className: 'wf-button' }, item.trim()));
    });
  }
}

// --- ButtonTab ---
class WfButtonTab extends WfBase {
  render() {
    const items = this.attr('items', 'Tab 1,Tab 2,Tab 3').split(',');
    const active = this.numAttr('active', 0);
    this.innerHTML = '';
    this.className = 'wf-button-tab';
    items.forEach((item, i) => {
      this.append(h('button', {
        className: `wf-button-tab__item${i === active ? ' wf-button-tab__item--active' : ''}`
      }, item.trim()));
    });
  }
}

// --- Card ---
class WfCard extends WfBase {
  render() {
    const title = this.attr('title');
    const hasFooter = this.boolAttr('footer');
    const originalContent = this.innerHTML;
    this.innerHTML = '';
    this.className = 'wf-card';

    if (title) {
      this.append(h('div', { className: 'wf-card__header' },
        h('span', {}, title)
      ));
    }

    const body = h('div', { className: 'wf-card__body' });
    if (originalContent.trim()) {
      body.innerHTML = originalContent;
    } else {
      body.append(placeholder('long'), placeholder('medium'), placeholder('short'));
    }
    this.append(body);

    if (hasFooter) {
      this.append(h('div', { className: 'wf-card__footer' },
        h('button', { className: 'wf-button wf-button--ghost wf-button--sm' }, 'Cancel'),
        h('button', { className: 'wf-button wf-button--primary wf-button--sm' }, 'Save')
      ));
    }
  }
}

// --- StatCard ---
class WfStatCard extends WfBase {
  render() {
    const label = this.attr('label', 'Metric');
    const value = this.attr('value', '—');
    const change = this.attr('change');
    this.innerHTML = '';
    this.className = 'wf-stat-card';
    this.append(
      h('div', { className: 'wf-stat-card__label' }, label),
      h('div', { className: 'wf-stat-card__value' }, value)
    );
    if (change) this.append(h('div', { className: 'wf-stat-card__change' }, change));
  }
}

// --- Checkbox ---
class WfCheckbox extends WfBase {
  render() {
    const label = this.attr('label', this.textContent || 'Checkbox');
    const checked = this.boolAttr('checked');
    this.innerHTML = '';
    this.className = `wf-checkbox${checked ? ' wf-checkbox--checked' : ''}`;
    this.append(
      h('span', { className: 'wf-checkbox__box' }),
      h('span', {}, label)
    );
    this.addEventListener('click', () => {
      this.classList.toggle('wf-checkbox--checked');
    });
  }
}

// --- Chip ---
class WfChip extends WfBase {
  render() {
    const text = this.textContent || 'Chip';
    const removable = this.boolAttr('removable');
    this.innerHTML = '';
    this.className = 'wf-chip';
    this.append(h('span', {}, text));
    if (removable) {
      this.append(h('button', { className: 'wf-chip__remove' }, '×'));
    }
  }
}

// --- CodeSnippet ---
class WfCodeSnippet extends WfBase {
  render() {
    const lang = this.attr('language', 'code');
    const lines = this.numAttr('lines', 0);
    const content = this.textContent.trim();
    this.innerHTML = '';
    this.className = 'wf-code-snippet';

    this.append(h('div', { className: 'wf-code-snippet__header' },
      h('span', {}, lang),
      h('button', { className: 'wf-code-snippet__copy' }, 'Copy')
    ));

    if (content) {
      content.split('\n').forEach((line, i) => {
        const lineEl = h('span', { className: 'wf-code-snippet__line' },
          h('span', { className: 'wf-code-snippet__line-number' }, String(i + 1)),
          line
        );
        this.append(lineEl);
      });
    } else {
      const numLines = lines || 5;
      for (let i = 0; i < numLines; i++) {
        const fakeCode = lorem(Math.floor(Math.random() * 4) + 2);
        this.append(h('span', { className: 'wf-code-snippet__line' },
          h('span', { className: 'wf-code-snippet__line-number' }, String(i + 1)),
          fakeCode
        ));
      }
    }
  }
}

// --- Table ---
class WfTable extends WfBase {
  render() {
    const rows = this.numAttr('rows', 5);
    const cols = this.numAttr('cols', 4);
    const headers = this.attr('headers');
    const headerList = headers ? headers.split(',').map(h => h.trim()) :
      Array.from({ length: cols }, (_, i) => `Column ${i + 1}`);

    this.innerHTML = '';
    const table = h('table', { className: 'wf-table' });

    // Header
    const thead = h('thead');
    const headerRow = h('tr');
    headerList.forEach(hdr => headerRow.append(h('th', {}, hdr)));
    thead.append(headerRow);
    table.append(thead);

    // Body
    const tbody = h('tbody');
    for (let r = 0; r < rows; r++) {
      const row = h('tr');
      headerList.forEach((_, c) => {
        let content;
        if (c === 0) content = sampleNames[r % sampleNames.length];
        else if (c === headerList.length - 1) content = sampleDates[r % sampleDates.length];
        else content = lorem(Math.floor(Math.random() * 2) + 1);
        row.append(h('td', {}, content));
      });
      tbody.append(row);
    }
    table.append(tbody);
    this.append(table);
  }
}

// --- DataGrid ---
class WfDataGrid extends WfBase {
  render() {
    const rows = this.numAttr('rows', 5);
    const cols = this.numAttr('cols', 4);
    const headers = this.attr('headers');
    const headerList = headers ? headers.split(',').map(h => h.trim()) :
      Array.from({ length: cols }, (_, i) => `Column ${i + 1}`);

    this.innerHTML = '';

    // Toolbar
    const toolbar = h('div', { className: 'wf-datagrid__toolbar' },
      h('div', { className: 'wf-search', style: { flex: '0 0 200px' } },
        h('span', { className: 'wf-search__icon' }, '⌕'),
        h('input', { className: 'wf-search__input', placeholder: 'Filter...', type: 'text' })
      ),
      h('button', { className: 'wf-button wf-button--ghost wf-button--sm' }, 'Filters'),
      h('button', { className: 'wf-button wf-button--ghost wf-button--sm' }, 'Sort')
    );
    this.append(toolbar);

    // Table
    const table = h('table', { className: 'wf-table' });
    table.style.borderTop = 'none';
    table.style.borderRadius = '0 0 5px 5px';

    // Checkbox header + columns
    const thead = h('thead');
    const headerRow = h('tr');
    headerRow.append(h('th', { style: 'width:36px' },
      h('span', { className: 'wf-checkbox__box', style: 'width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid var(--wf-border-dark);border-radius:3px;background:var(--wf-surface);font-size:10px' })
    ));
    headerList.forEach(hdr => headerRow.append(h('th', {}, hdr)));
    thead.append(headerRow);
    table.append(thead);

    const tbody = h('tbody');
    for (let r = 0; r < rows; r++) {
      const row = h('tr');
      row.append(h('td', { style: 'width:36px' },
        h('span', { className: 'wf-checkbox__box', style: 'width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid var(--wf-border-dark);border-radius:3px;background:var(--wf-surface);font-size:10px' })
      ));
      headerList.forEach((_, c) => {
        let content;
        if (c === 0) content = sampleNames[r % sampleNames.length];
        else if (c === headerList.length - 1) content = sampleDates[r % sampleDates.length];
        else content = sampleStatuses[r % sampleStatuses.length];
        row.append(h('td', {}, content));
      });
      tbody.append(row);
    }
    table.append(tbody);
    this.append(table);
  }
}

// --- DatePicker ---
class WfDatePicker extends WfBase {
  render() {
    const value = this.attr('value', 'Select date...');
    this.innerHTML = '';
    this.className = 'wf-datepicker';
    this.append(
      h('span', { className: 'wf-datepicker__icon' }, '📅'),
      h('span', {}, value)
    );
  }
}

// --- DiffStat ---
class WfDiffStat extends WfBase {
  render() {
    const additions = this.numAttr('additions', 12);
    const deletions = this.numAttr('deletions', 4);
    this.innerHTML = '';
    this.className = 'wf-diffstat';

    const total = 5;
    const addSegs = Math.round((additions / (additions + deletions)) * total);
    const delSegs = total - addSegs;

    this.append(
      h('span', { className: 'wf-diffstat__text--add' }, `+${additions}`),
      h('span', { className: 'wf-diffstat__text--remove' }, `-${deletions}`)
    );

    const bar = h('span', { className: 'wf-diffstat__bar' });
    for (let i = 0; i < addSegs; i++) bar.append(h('span', { className: 'wf-diffstat__segment wf-diffstat__segment--add' }));
    for (let i = 0; i < delSegs; i++) bar.append(h('span', { className: 'wf-diffstat__segment wf-diffstat__segment--remove' }));
    this.append(bar);
  }
}

// --- Dropdown ---
class WfDropdown extends WfBase {
  render() {
    const items = this.attr('items', 'Option 1,Option 2,Option 3').split(',');
    const label = this.attr('label', 'Actions');
    this.innerHTML = '';
    this.className = 'wf-dropdown';

    const trigger = h('button', { className: 'wf-button' }, label, ' ▾');
    const menu = h('div', { className: 'wf-dropdown__menu' });
    menu.style.display = 'none';

    items.forEach(item => {
      menu.append(h('div', { className: 'wf-dropdown__item' }, item.trim()));
    });

    trigger.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    this.append(trigger, menu);
  }
}

// --- Input ---
class WfInput extends WfBase {
  render() {
    const label = this.attr('label');
    const plc = this.attr('placeholder', 'Enter text...');
    const helper = this.attr('helper');
    const error = this.attr('error');
    const value = this.attr('value', '');

    this.innerHTML = '';
    this.className = 'wf-input-group';

    if (label) this.append(h('label', { className: 'wf-input-group__label' }, label));
    this.append(h('input', {
      className: `wf-input${error ? ' wf-input--error' : ''}`,
      placeholder: plc,
      value,
      type: this.attr('type', 'text')
    }));
    if (helper) this.append(h('span', { className: 'wf-input-group__helper' }, helper));
    if (error) this.append(h('span', { className: 'wf-input-group__error' }, error));
  }
}

// --- KeyValuePair ---
class WfKeyValuePair extends WfBase {
  render() {
    const key = this.attr('key', 'Key');
    const value = this.attr('value', this.textContent || 'Value');
    this.innerHTML = '';
    this.className = 'wf-kv';
    this.append(
      h('span', { className: 'wf-kv__key' }, key),
      h('span', { className: 'wf-kv__value' }, value)
    );
  }
}

// --- ListItem ---
class WfListItem extends WfBase {
  render() {
    const title = this.attr('title', this.textContent || 'List item');
    const subtitle = this.attr('subtitle');
    const trailing = this.attr('trailing');
    this.innerHTML = '';
    this.className = 'wf-list-item';

    const content = h('div', { className: 'wf-list-item__content' },
      h('div', { className: 'wf-list-item__title' }, title)
    );
    if (subtitle) content.append(h('div', { className: 'wf-list-item__subtitle' }, subtitle));
    this.append(content);
    if (trailing) this.append(h('div', { className: 'wf-list-item__trailing' }, trailing));
  }
}

// --- Modal ---
class WfModal extends WfBase {
  render() {
    const title = this.attr('title', 'Modal Title');
    const open = this.boolAttr('open');
    const originalContent = this.innerHTML;
    this.innerHTML = '';

    if (!open) {
      this.style.display = 'none';
      return;
    }

    this.className = 'wf-modal-overlay';
    const modal = h('div', { className: 'wf-modal' },
      h('div', { className: 'wf-modal__header' },
        h('span', { className: 'wf-modal__title' }, title),
        h('button', { className: 'wf-modal__close' }, '×')
      ),
      h('div', { className: 'wf-modal__body' }),
      h('div', { className: 'wf-modal__footer' },
        h('button', { className: 'wf-button' }, 'Cancel'),
        h('button', { className: 'wf-button wf-button--primary' }, 'Confirm')
      )
    );

    const body = modal.querySelector('.wf-modal__body');
    if (originalContent.trim()) body.innerHTML = originalContent;
    else body.append(placeholder('long'), placeholder('medium'));

    this.append(modal);
  }
}

// --- Pagination ---
class WfPagination extends WfBase {
  render() {
    const pages = this.numAttr('pages', 5);
    const active = this.numAttr('active', 1);
    this.innerHTML = '';
    this.className = 'wf-pagination';

    this.append(h('span', { className: 'wf-pagination__item' }, '‹'));
    for (let i = 1; i <= Math.min(pages, 7); i++) {
      this.append(h('span', {
        className: `wf-pagination__item${i === active ? ' wf-pagination__item--active' : ''}`
      }, String(i)));
    }
    if (pages > 7) {
      this.append(h('span', { className: 'wf-pagination__ellipsis' }, '...'));
      this.append(h('span', { className: 'wf-pagination__item' }, String(pages)));
    }
    this.append(h('span', { className: 'wf-pagination__item' }, '›'));
  }
}

// --- Progress ---
class WfProgress extends WfBase {
  render() {
    const value = this.numAttr('value', 60);
    this.innerHTML = '';
    this.className = 'wf-progress';
    this.append(h('div', { className: 'wf-progress__bar', style: { width: `${value}%` } }));
  }
}

// --- Radio ---
class WfRadio extends WfBase {
  render() {
    const label = this.attr('label', this.textContent || 'Radio');
    const selected = this.boolAttr('selected');
    this.innerHTML = '';
    this.className = `wf-radio${selected ? ' wf-radio--selected' : ''}`;
    this.append(
      h('span', { className: 'wf-radio__circle' }),
      h('span', {}, label)
    );
    this.addEventListener('click', () => {
      this.classList.toggle('wf-radio--selected');
    });
  }
}

// --- Search ---
class WfSearch extends WfBase {
  render() {
    const plc = this.attr('placeholder', 'Search...');
    this.innerHTML = '';
    this.className = 'wf-search';
    this.append(
      h('span', { className: 'wf-search__icon' }, '⌕'),
      h('input', { className: 'wf-search__input', placeholder: plc, type: 'text' })
    );
  }
}

// --- Select ---
class WfSelect extends WfBase {
  render() {
    const plc = this.attr('placeholder', 'Select...');
    const value = this.attr('value');
    this.innerHTML = '';
    this.className = `wf-select${!value ? ' wf-select--placeholder' : ''}`;
    this.append(
      h('span', {}, value || plc),
      h('span', { className: 'wf-select__arrow' }, '▾')
    );
  }
}

// --- Tabs ---
class WfTabs extends WfBase {
  render() {
    const items = this.attr('items', 'Tab 1,Tab 2,Tab 3').split(',');
    const active = this.numAttr('active', 0);
    this.innerHTML = '';
    this.className = 'wf-tabs';
    items.forEach((item, i) => {
      this.append(h('button', {
        className: `wf-tabs__item${i === active ? ' wf-tabs__item--active' : ''}`
      }, item.trim()));
    });
  }
}

// --- Tag ---
class WfTag extends WfBase {
  render() {
    const text = this.textContent || 'Tag';
    this.innerHTML = '';
    this.className = 'wf-tag';
    this.textContent = text;
  }
}

// --- Textarea ---
class WfTextarea extends WfBase {
  render() {
    const label = this.attr('label');
    const plc = this.attr('placeholder', 'Enter text...');
    const rows = this.numAttr('rows', 4);
    this.innerHTML = '';
    this.className = 'wf-input-group';
    if (label) this.append(h('label', { className: 'wf-input-group__label' }, label));
    this.append(h('textarea', { className: 'wf-textarea', placeholder: plc, rows: String(rows) }));
  }
}

// --- Toast ---
class WfToast extends WfBase {
  render() {
    const message = this.textContent || 'Toast notification';
    this.innerHTML = '';
    this.className = 'wf-toast';
    this.append(
      h('span', {}, message),
      h('button', { className: 'wf-toast__dismiss' }, '×')
    );
  }
}

// --- Toggle ---
class WfToggle extends WfBase {
  render() {
    const label = this.attr('label', '');
    const on = this.boolAttr('on');
    this.innerHTML = '';
    this.className = `wf-toggle${on ? ' wf-toggle--on' : ''}`;
    this.append(
      h('span', { className: 'wf-toggle__track' },
        h('span', { className: 'wf-toggle__thumb' })
      )
    );
    if (label) this.append(h('span', {}, label));
    this.addEventListener('click', () => {
      this.classList.toggle('wf-toggle--on');
    });
  }
}

// --- Tree ---
class WfTree extends WfBase {
  render() {
    const depth = this.numAttr('depth', 3);
    const items = this.numAttr('items', 4);
    this.innerHTML = '';
    this.className = 'wf-tree';

    const buildLevel = (d, count) => {
      const container = h('div', { className: 'wf-tree-item__children' });
      for (let i = 0; i < count; i++) {
        const hasChildren = d > 1 && i < 2;
        const item = h('div', { className: 'wf-tree-item' },
          h('div', { className: 'wf-tree-item__row' },
            h('span', { className: 'wf-tree-item__toggle' }, hasChildren ? '▾' : ''),
            h('span', { className: 'wf-tree-item__icon' }, d > 1 ? '▤' : '◇'),
            h('span', {}, `${d > 1 ? 'Folder' : 'Item'} ${i + 1}`)
          )
        );
        if (hasChildren) item.append(buildLevel(d - 1, Math.max(2, count - 1)));
        container.append(item);
      }
      return container;
    };

    const root = buildLevel(depth, items);
    root.style.paddingLeft = '0';
    this.append(root);
  }
}

// --- Chart ---
class WfChart extends WfBase {
  render() {
    const title = this.attr('title', 'Chart');
    const bars = this.numAttr('bars', 6);
    this.innerHTML = '';
    this.className = 'wf-chart';

    this.append(h('div', { className: 'wf-chart__title' }, title));
    const area = h('div', { className: 'wf-chart__area' });
    for (let i = 0; i < bars; i++) {
      const height = 30 + Math.floor(Math.random() * 60);
      area.append(h('div', { className: 'wf-chart__bar', style: { height: `${height}%` } }));
    }
    this.append(area);
  }
}

// --- EmptyState ---
class WfEmptyState extends WfBase {
  render() {
    const title = this.attr('title', 'No results');
    const message = this.attr('message', 'Try adjusting your filters or search terms');
    const action = this.attr('action');
    this.innerHTML = '';
    this.className = 'wf-empty-state';
    this.append(
      h('div', { className: 'wf-empty-state__icon' }, '∅'),
      h('div', { className: 'wf-empty-state__title' }, title),
      h('div', { className: 'wf-empty-state__message' }, message)
    );
    if (action) {
      this.append(h('button', { className: 'wf-button wf-button--primary' }, action));
    }
  }
}

// --- Navbar (convenience) ---
class WfNavbar extends WfBase {
  render() {
    const brand = this.attr('brand', 'App Name');
    const items = this.attr('items', '');
    this.innerHTML = '';
    this.className = 'wf-navbar';
    this.append(h('span', { className: 'wf-navbar__brand' }, brand));
    if (items) {
      const nav = h('nav', { className: 'wf-navbar__items' });
      items.split(',').forEach(item => {
        nav.append(h('a', { className: 'wf-navbar__item' }, item.trim()));
      });
      this.append(nav);
    }
    this.append(h('span', { className: 'wf-avatar wf-avatar--sm' }, '?'));
  }
}

// --- Sidebar (convenience) ---
class WfSidebar extends WfBase {
  render() {
    const items = this.attr('items', 'Dashboard,Recipes,Settings').split(',');
    const active = this.numAttr('active', 0);
    const title = this.attr('title');
    this.innerHTML = '';
    this.className = 'wf-sidebar';

    if (title) {
      this.append(h('div', { className: 'wf-sidebar__title' }, title));
    }

    items.forEach((item, i) => {
      this.append(h('a', {
        className: `wf-sidebar__item${i === active ? ' wf-sidebar__item--active' : ''}`
      }, item.trim()));
    });
  }
}

// --- Divider ---
class WfDivider extends WfBase {
  render() {
    const dashed = this.boolAttr('dashed');
    const el = document.createElement('hr');
    el.className = `wf-divider${dashed ? ' wf-divider--dashed' : ''}`;
    this.replaceWith(el);
  }
}

// --- Icon ---
class WfIcon extends WfBase {
  render() {
    const name = this.attr('name', '◇');
    const size = this.attr('size', 'md');
    this.className = `wf-icon${size !== 'md' ? ` wf-icon--${size}` : ''}`;
    this.textContent = name;
  }
}

// --- Logo ---
class WfLogo extends WfBase {
  render() {
    const size = this.attr('size', 'md');
    const text = this.attr('text', 'Moderne');
    this.className = `wf-logo${size !== 'md' ? ` wf-logo--${size}` : ''}`;
    this.append(
      h('span', { className: 'wf-logo__mark' }, '◈'),
      h('span', { className: 'wf-logo__text' }, text)
    );
  }
}

// --- Skeleton ---
class WfSkeleton extends WfBase {
  render() {
    const variant = this.attr('variant', 'text');
    const width = this.attr('width');
    const height = this.attr('height');
    this.className = `wf-skeleton wf-skeleton--${variant}`;
    if (width) this.style.width = width;
    if (height) this.style.height = height;
  }
}

// --- Slider ---
class WfSlider extends WfBase {
  render() {
    const min = this.attr('min', '0');
    const max = this.attr('max', '100');
    const value = this.attr('value', '50');
    const label = this.attr('label');
    const disabled = this.boolAttr('disabled');
    this.className = 'wf-slider';

    const valueDisplay = h('span', { className: 'wf-slider__value' }, value);
    const input = h('input', {
      type: 'range',
      className: 'wf-slider__input',
      min, max, value,
      ...(disabled && { disabled: '' })
    });
    input.addEventListener('input', () => {
      valueDisplay.textContent = input.value;
    });

    if (label) {
      this.append(
        h('div', { className: 'wf-slider__header' },
          h('span', { className: 'wf-slider__label' }, label),
          valueDisplay
        )
      );
    }
    this.append(input);
  }
}

// --- Spinner ---
class WfSpinner extends WfBase {
  render() {
    const size = this.attr('size', 'md');
    this.className = `wf-spinner${size !== 'md' ? ` wf-spinner--${size}` : ''}`;
  }
}

// --- Tooltip ---
class WfTooltip extends WfBase {
  render() {
    const content = this.attr('content', 'Tooltip');
    this.className = 'wf-tooltip-wrapper';
    this.append(h('span', { className: 'wf-tooltip' }, content));
  }
}

// ============================================
// REGISTER ALL COMPONENTS
// ============================================
// ============================================
// ASSEMBLIES
// ============================================

// --- Card Table Layout ---
class WfCardTable extends WfBase {
  render() {
    const title = this.attr('title', 'Results');
    const rows = this.numAttr('rows', 5);
    const sampleTitles = ['Migrate to Java 17', 'Upgrade Spring Boot 3.x', 'Fix CVE-2024-1234', 'Modernize logging', 'Remove deprecated API'];
    const sampleTypes = ['Recipe Run', 'Commit', 'Visualization', 'Migration', 'Security'];

    this.className = 'wf-card-table';
    const header = h('div', { className: 'wf-card-table__header' },
      h('span', { className: 'wf-card-table__title' }, title),
      h('div', { className: 'wf-card-table__actions' },
        h('wf-button', { size: 'sm' }, 'Filter'),
        h('wf-button', { size: 'sm' }, 'Export')
      )
    );
    this.append(header);
    for (let i = 0; i < rows; i++) {
      const row = h('div', { className: 'wf-card-table__row' },
        h('wf-checkbox', {}),
        h('div', { className: 'wf-card-table__row-content' },
          h('div', { className: 'wf-card-table__row-title' }, sampleTitles[i % sampleTitles.length]),
          h('div', { className: 'wf-card-table__row-meta' },
            h('wf-badge', {}, sampleTypes[i % sampleTypes.length]),
            h('wf-badge', { variant: i % 3 === 0 ? 'success' : 'default' }, i % 3 === 0 ? 'Complete' : 'Pending')
          ),
          h('div', { className: 'wf-card-table__row-secondary' }, `${sampleNames[i % sampleNames.length]} · ${sampleDates[i % sampleDates.length]} · ${3 + i} repositories`)
        ),
        h('div', { className: 'wf-card-table__row-actions' },
          h('wf-button', { variant: 'ghost', size: 'sm' }, '⋮')
        )
      );
      this.append(row);
    }
  }
}

// --- Filter Results Layout ---
class WfFilterResults extends WfBase {
  render() {
    const rows = this.numAttr('rows', 5);
    const cols = this.numAttr('cols', 4);
    const headers = this.attr('headers', 'Repository,Status,Changes,Date');
    const filters = this.attr('filters', 'Status,Language,Organization');

    this.className = 'wf-filter-results';
    const filterChips = filters.split(',').map(f =>
      h('wf-chip', {}, f.trim())
    );
    const bar = h('div', { className: 'wf-filter-results__bar' },
      h('div', { className: 'wf-filter-results__filters' }, ...filterChips),
      h('div', { className: 'wf-filter-results__search' },
        h('wf-search', { placeholder: 'Search results…' })
      )
    );
    const table = h('div', { className: 'wf-filter-results__table' },
      h('wf-data-grid', { rows: String(rows), cols: String(cols), headers })
    );
    const summary = h('div', { className: 'wf-filter-results__summary' },
      h('span', {}, `${rows} results`),
      h('wf-pagination', {})
    );
    this.append(bar, table, summary);
  }
}

// --- Data Table Layout ---
class WfDataTableLayout extends WfBase {
  render() {
    const rows = this.numAttr('rows', 8);
    const cols = this.numAttr('cols', 5);
    const headers = this.attr('headers', 'Name,Status,Type,Modified,Actions');

    this.className = 'wf-data-table-layout';
    const toolbar = h('div', { className: 'wf-data-table-layout__toolbar' },
      h('div', { className: 'wf-data-table-layout__toolbar-left' },
        h('wf-search', { placeholder: 'Search…', size: 'sm' }),
        h('wf-button', { size: 'sm' }, '⧩ Filter'),
        h('wf-button', { size: 'sm' }, '⊞ Columns')
      ),
      h('div', { className: 'wf-data-table-layout__toolbar-right' },
        h('wf-button', { size: 'sm' }, 'Bulk actions')
      )
    );
    const grid = h('wf-data-grid', { rows: String(rows), cols: String(cols), headers });
    const footer = h('div', { className: 'wf-data-table-layout__footer' },
      h('span', {}, 'Selected: 0 items'),
      h('wf-pagination', {})
    );
    this.append(toolbar, grid, footer);
  }
}

// --- Changelog Feed Layout ---
class WfChangelogFeed extends WfBase {
  render() {
    const count = this.numAttr('entries', 5);
    const showFilters = !this.boolAttr('no-filters');
    const eventTypes = ['Recipe Run', 'Commit', 'Visualization', 'Ingestion', 'Migration'];
    const eventIcons = ['▶', '⊙', '◉', '↓', '⟳'];
    const titles = [
      'Migrate to Java 17 completed',
      'Pushed formatting fixes to spring-petclinic',
      'Generated dependency visualization',
      'Ingested 12 new repositories',
      'Applied security patches across 8 repos'
    ];
    const timestamps = ['3 hours ago', '5 hours ago', 'Yesterday', 'Mar 28, 2026', 'Mar 25, 2026'];

    this.className = 'wf-changelog-feed';
    if (showFilters) {
      const filters = h('div', { className: 'wf-changelog-feed__filters' },
        ...eventTypes.slice(0, 3).map(t => h('wf-chip', {}, t)),
        h('wf-chip', {}, 'Date range ▾')
      );
      this.append(filters);
    }
    const list = h('div', { className: 'wf-changelog-feed__list' });
    for (let i = 0; i < count; i++) {
      const entry = h('div', { className: 'wf-changelog-entry' },
        h('div', { className: 'wf-changelog-entry__icon' }, eventIcons[i % eventIcons.length]),
        h('div', { className: 'wf-changelog-entry__body' },
          h('div', { className: 'wf-changelog-entry__header' },
            h('wf-badge', {}, eventTypes[i % eventTypes.length]),
            h('span', { className: 'wf-changelog-entry__title' }, titles[i % titles.length])
          ),
          h('div', { className: 'wf-changelog-entry__meta' },
            `${sampleNames[i % sampleNames.length]} · ${2 + i} repositories affected`)
        ),
        h('div', { className: 'wf-changelog-entry__timestamp' }, timestamps[i % timestamps.length])
      );
      list.append(entry);
    }
    this.append(list);
  }
}

// ============================================
// COMPOSITIONS
// ============================================

// --- Recipe Execution Results ---
class WfRecipeResults extends WfBase {
  render() {
    const recipeName = this.attr('recipe', 'Migrate to Java 17');
    const status = this.attr('status', 'completed');
    const repos = this.numAttr('repos', 24);
    const changes = this.numAttr('changes', 18);
    const errors = this.numAttr('errors', 2);

    this.className = 'wf-recipe-results';
    const statusBadgeVariant = status === 'completed' ? 'success' : status === 'failed' ? 'error' : status === 'running' ? 'info' : 'warning';
    const summary = h('div', { className: 'wf-recipe-results__summary' },
      h('div', { className: 'wf-recipe-results__summary-left' },
        h('div', { className: 'wf-recipe-results__recipe-name' }, recipeName),
        h('div', { className: 'wf-recipe-results__stats' },
          h('span', {}, h('span', { className: 'wf-recipe-results__stat-value' }, String(repos)), ' repositories'),
          h('span', {}, h('span', { className: 'wf-recipe-results__stat-value' }, String(changes)), ' changes'),
          h('span', {}, h('span', { className: 'wf-recipe-results__stat-value' }, String(errors)), ' errors')
        )
      ),
      h('div', { className: 'wf-recipe-results__summary-right' },
        h('wf-badge', { variant: statusBadgeVariant }, status.charAt(0).toUpperCase() + status.slice(1)),
        h('wf-button', { variant: 'primary', size: 'sm' }, 'Commit Selected'),
        h('wf-button', { size: 'sm' }, 'Share')
      )
    );
    const tabs = h('div', { className: 'wf-recipe-results__tabs' },
      h('wf-tabs', { items: 'Results,Visualizations,Data Tables' })
    );
    const body = h('div', { className: 'wf-recipe-results__body' },
      h('wf-filter-results', { rows: '6', headers: 'Repository,Status,Changes,Diff' })
    );
    this.append(summary, tabs, body);
  }
}

// --- Empty State Activation ---
class WfActivation extends WfBase {
  render() {
    const headline = this.attr('headline', 'Welcome to Moderne');
    const description = this.attr('description', 'Run large-scale code transformations across all your repositories. Start by connecting your source code manager and running your first recipe.');
    const cta = this.attr('cta', 'Run your first recipe');
    const illustration = this.attr('illustration', '◈');
    const prereqsAttr = this.attr('prereqs', 'Connect an SCM:done,Add repositories:done,Run first recipe:pending');

    this.className = 'wf-activation';
    const illus = h('div', { className: 'wf-activation__illustration' }, illustration);
    const head = h('div', { className: 'wf-activation__headline' }, headline);
    const desc = h('div', { className: 'wf-activation__description' }, description);

    const prereqList = h('div', { className: 'wf-activation__prereqs' });
    prereqsAttr.split(',').forEach(p => {
      const [label, state] = p.split(':');
      const isDone = state?.trim() === 'done';
      const prereq = h('div', { className: `wf-activation__prereq wf-activation__prereq--${isDone ? 'done' : 'pending'}` },
        h('span', { className: 'wf-activation__prereq-icon' }, isDone ? '✓' : '○'),
        h('span', {}, label.trim())
      );
      prereqList.append(prereq);
    });

    const ctaArea = h('div', { className: 'wf-activation__cta' },
      h('wf-button', { variant: 'primary' }, cta),
      h('div', { className: 'wf-activation__links' },
        h('span', { className: 'wf-activation__link' }, 'Read the docs'),
        h('span', { className: 'wf-activation__link' }, 'Take a tour')
      )
    );

    this.append(illus, head, desc, prereqList, ctaArea);
  }
}

const components = {
  'wf-alert': WfAlert,
  'wf-avatar': WfAvatar,
  'wf-badge': WfBadge,
  'wf-banner': WfBanner,
  'wf-breadcrumb': WfBreadcrumb,
  'wf-button': WfButton,
  'wf-button-group': WfButtonGroup,
  'wf-button-tab': WfButtonTab,
  'wf-card': WfCard,
  'wf-stat-card': WfStatCard,
  'wf-checkbox': WfCheckbox,
  'wf-chip': WfChip,
  'wf-code-snippet': WfCodeSnippet,
  'wf-table': WfTable,
  'wf-data-grid': WfDataGrid,
  'wf-datepicker': WfDatePicker,
  'wf-diffstat': WfDiffStat,
  'wf-dropdown': WfDropdown,
  'wf-input': WfInput,
  'wf-kv': WfKeyValuePair,
  'wf-list-item': WfListItem,
  'wf-modal': WfModal,
  'wf-pagination': WfPagination,
  'wf-progress': WfProgress,
  'wf-radio': WfRadio,
  'wf-search': WfSearch,
  'wf-select': WfSelect,
  'wf-tabs': WfTabs,
  'wf-tag': WfTag,
  'wf-textarea': WfTextarea,
  'wf-toast': WfToast,
  'wf-toggle': WfToggle,
  'wf-tree': WfTree,
  'wf-chart': WfChart,
  'wf-empty-state': WfEmptyState,
  'wf-navbar': WfNavbar,
  'wf-sidebar': WfSidebar,
  'wf-divider': WfDivider,
  'wf-icon': WfIcon,
  'wf-logo': WfLogo,
  'wf-skeleton': WfSkeleton,
  'wf-slider': WfSlider,
  'wf-spinner': WfSpinner,
  'wf-tooltip': WfTooltip,
  // Assemblies
  'wf-card-table': WfCardTable,
  'wf-filter-results': WfFilterResults,
  'wf-data-table-layout': WfDataTableLayout,
  'wf-changelog-feed': WfChangelogFeed,
  // Compositions
  'wf-recipe-results': WfRecipeResults,
  'wf-activation': WfActivation,
};

for (const [name, cls] of Object.entries(components)) {
  if (!customElements.get(name)) {
    customElements.define(name, cls);
  }
}

console.log(`[wireframe-kit] ${Object.keys(components).length} components registered`);
