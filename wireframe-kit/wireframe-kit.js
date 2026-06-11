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

// ============================================
// LUCIDE ICONS
// Inline SVG icons matching the set used in moderneui / neodesign.
// Names follow lucide.dev. Keep this map alphabetised so swap-outs are easy.
// ============================================
const LUCIDE_ICONS = {
  'activity':         '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.68 2.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4.45 12H2"/>',
  'alert-circle':     '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  'alert-triangle':   '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'arrow-left':       '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  'arrow-right':      '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'bar-chart-2':      '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  'bell':             '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'blocks':           '<rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/>',
  'book-open':        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'calendar':         '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  'check':            '<polyline points="20 6 9 17 4 12"/>',
  'check-circle':     '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'chevron-down':     '<polyline points="6 9 12 15 18 9"/>',
  'chevron-left':     '<polyline points="15 18 9 12 15 6"/>',
  'chevron-right':    '<polyline points="9 18 15 12 9 6"/>',
  'chevron-up':       '<polyline points="18 15 12 9 6 15"/>',
  'circle':           '<circle cx="12" cy="12" r="10"/>',
  'columns':          '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>',
  'copy':             '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  'diamond':          '<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/>',
  'download':         '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  'ellipsis-vertical':'<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  'external-link':    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  'eye':              '<path d="M2.06 12.5C3.7 7.83 7.5 5 12 5s8.3 2.83 9.94 7.5C20.3 17.17 16.5 20 12 20S3.7 17.17 2.06 12.5z"/><circle cx="12" cy="12" r="3"/>',
  'file':             '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  'file-code':        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/>',
  'filter':           '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'folder':           '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  'git-commit':       '<circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>',
  'git-pull-request': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>',
  'globe':            '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  'folder-git':       '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="2"/><path d="M14 13h3"/><path d="M7 13h3"/>',
  'help-circle':      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'history':          '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  'home':             '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'inbox':            '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  'info':             '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  'layers':           '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  'mail':             '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  'message-circle':   '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  'more-horizontal':  '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'package':          '<path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  'pie-chart':        '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  'play':             '<polygon points="6 3 20 12 6 21 6 3"/>',
  'play-circle':      '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  'plus':             '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  'refresh-cw':       '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  'rocket':           '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  'search':           '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  'settings':         '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="3"/>',
  'share':            '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
  'sparkles':         '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/>',
  'users':            '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'x':                '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'x-circle':         '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  'zap':              '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
};

// Build an SVG DOM node for a lucide icon, or null if unknown.
// `size` is optional; pass a px number for fixed-pixel icons, omit for 1em.
const lucide = (name, size) => {
  const inner = LUCIDE_ICONS[name];
  if (!inner) return null;
  const dim = size != null ? `${size}` : '1em';
  const wrap = document.createElement('span');
  wrap.innerHTML = `<svg class="wf-lucide" viewBox="0 0 24 24" width="${dim}" height="${dim}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  return wrap.firstChild;
};

// Render a lucide SVG when `value` matches a known name; otherwise fall back
// to the literal glyph (or `fallback` when `value` is empty). Lets components
// keep accepting user-passed glyphs like '◆' alongside lucide names like 'home'.
const iconNode = (value, fallback, size) => {
  const svg = value ? lucide(value, size) : null;
  if (svg) return svg;
  const text = value || fallback || '';
  return document.createTextNode(text);
};

// Legacy glyph → lucide name aliases. Lets prototypes written before the
// icon swap (e.g. `home-icon="◆"`, `items="Dashboard|◇,Recipes|▤"`) keep
// working without being rewritten — the wireframe kit still renders Lucide.
// Mappings chosen to mirror trigrep.html's nav set: ↻ → history (clock+rewind,
// trigrep's "Activity"), ⌥ → folder-git (trigrep's "Repositories"), etc.
const GLYPH_TO_LUCIDE = {
  '◆': 'diamond', '◈': 'diamond',
  '◇': 'layout-dashboard', '▤': 'file-code', '⌥': 'folder-git',
  '☷': 'columns', '↻': 'history', '⚙': 'settings',
  '✦': 'sparkles', '?': 'help-circle', '◐': 'bell',
  '▶': 'play', '⊙': 'git-commit', '◉': 'bar-chart-2', '↓': 'download', '⟳': 'refresh-cw',
  '▾': 'chevron-down', '▴': 'chevron-up', '‹': 'chevron-left', '›': 'chevron-right',
  '✓': 'check', '✕': 'x', '○': 'circle', '∅': 'inbox', '⌕': 'search', '📅': 'calendar',
  '⋮': 'ellipsis-vertical', '⋯': 'more-horizontal', '…': 'more-horizontal',
};
const resolveIcon = (raw) => GLYPH_TO_LUCIDE[raw] || raw;

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
    const iconName = { info: 'info', success: 'check-circle', warning: 'alert-triangle', error: 'x-circle' }[variant] || 'info';
    this.className = `wf-alert wf-alert--${variant}`;
    this.append(
      h('div', { className: 'wf-alert__icon' }, lucide(iconName, 14)),
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
        h('span', { className: 'wf-search__icon' }, lucide('search', 14)),
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
      h('span', { className: 'wf-datepicker__icon' }, lucide('calendar', 14)),
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

    const trigger = h('button', { className: 'wf-button' }, iconNode(resolveIcon(label), label, 14), ' ', lucide('chevron-down', 12));
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
      h('span', { className: 'wf-search__icon' }, lucide('search', 14)),
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
      h('span', { className: 'wf-select__arrow' }, lucide('chevron-down', 14))
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
            h('span', { className: 'wf-tree-item__toggle' }, hasChildren ? lucide('chevron-down', 10) : ''),
            h('span', { className: 'wf-tree-item__icon' }, lucide(d > 1 ? 'folder' : 'file', 11)),
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
      h('div', { className: 'wf-empty-state__icon' }, lucide('inbox', 28)),
      h('div', { className: 'wf-empty-state__title' }, title),
      h('div', { className: 'wf-empty-state__message' }, message)
    );
    if (action) {
      this.append(h('button', { className: 'wf-button wf-button--primary' }, action));
    }
  }
}

// --- Navbar (global top bar that sits over the main column) ---
// Mirrors the real Moderne shell (results.html / trigrep.html):
// optional org-selector pill, flex spacer, search, icon-actions, avatar.
// Primary nav lives in the rail (<wf-sidebar>), not here.
class WfNavbar extends WfBase {
  render() {
    const org = this.attr('org', '');
    const search = this.attr('search', '');
    const actions = this.attr('actions', '');          // comma-separated icon glyphs
    const avatar = this.attr('avatar', '');             // initials; empty = no avatar
    const items = this.attr('items', '');               // legacy text link list
    const brand = this.attr('brand', '');               // legacy brand label
    this.innerHTML = '';
    this.className = 'wf-navbar';

    if (brand) {
      this.append(h('span', { className: 'wf-navbar__brand' }, brand));
    }

    if (org) {
      // `users` icon matches trigrep's org-selector glyph (people figure).
      this.append(h('button', { className: 'wf-navbar__org' },
        h('span', { className: 'wf-icon' }, lucide('users', 14)),
        h('span', {}, org),
        h('span', { className: 'wf-icon wf-icon--sm' }, lucide('chevron-down', 12))
      ));
    }

    if (items) {
      const nav = h('nav', { className: 'wf-navbar__items' });
      items.split(',').forEach(item => {
        nav.append(h('a', { className: 'wf-navbar__item' }, item.trim()));
      });
      this.append(nav);
    }

    this.append(h('span', { className: 'wf-navbar__spacer' }));

    if (search) {
      this.append(h('div', { className: 'wf-navbar__search' },
        h('span', { className: 'wf-navbar__search-icon' }, lucide('search', 14)),
        h('span', {}, search),
        h('span', { className: 'wf-navbar__search-kbd' },
          h('kbd', {}, '⌘'),
          h('kbd', {}, 'K')
        )
      ));
    }

    if (actions) {
      const group = h('div', { className: 'wf-navbar__actions' });
      actions.split(',').forEach(raw => {
        const token = raw.trim();
        group.append(h('button', { className: 'wf-navbar__action' }, iconNode(resolveIcon(token), token, 18)));
      });
      this.append(group);
    }

    if (avatar) {
      this.append(h('span', { className: 'wf-avatar wf-avatar--sm' }, avatar));
    }
  }
}

// --- Sidebar (left rail — 88px, icon + label stacked) ---
// Items accept "Label|icon" pairs (icon optional). Active state bolds the
// label and highlights the icon pill — mirrors Neo's Body/Navigation/selected
// typographic step + buttons/navigation active fill.
class WfSidebar extends WfBase {
  render() {
    // Default items mirror trigrep.html's NAV_ITEMS so the rail looks like the
    // real Moderne shell out of the box. Override `items` per prototype.
    const itemsAttr = this.attr('items', 'Moddy|sparkles,DevCenter|pie-chart,Trigrep|search,Artifacts|package,Marketplace|globe,Builder|blocks,Activity|history,Changelog|activity');
    const active = this.numAttr('active', 0);
    const title = this.attr('title');
    const home = this.attr('home', '');           // home/brand label, e.g. "Moderne"
    const homeIcon = this.attr('home-icon', 'diamond');
    const tenant = this.attr('tenant', '');        // tenant initials/short label

    this.innerHTML = '';
    this.className = 'wf-sidebar';

    if (home) {
      this.append(h('a', { className: 'wf-sidebar__home' },
        h('span', { className: 'wf-sidebar__item-icon' }, iconNode(resolveIcon(homeIcon), homeIcon, 22)),
        h('span', { className: 'wf-sidebar__item-label' }, home)
      ));
    }

    if (title) {
      this.append(h('div', { className: 'wf-sidebar__title' }, title));
    }

    itemsAttr.split(',').forEach((raw, i) => {
      const [label, icon = 'layout-dashboard'] = raw.split('|').map(s => s.trim());
      this.append(h('a', {
        className: `wf-sidebar__item${i === active ? ' wf-sidebar__item--active' : ''}`
      },
        h('span', { className: 'wf-sidebar__item-icon' }, iconNode(resolveIcon(icon), icon, 22)),
        h('span', { className: 'wf-sidebar__item-label' }, label)
      ));
    });

    if (tenant) {
      this.append(h('div', { className: 'wf-sidebar__footer' },
        h('div', { className: 'wf-sidebar__tenant' }, tenant)
      ));
    }
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
// `name` accepts a lucide icon name (e.g. "search") or a literal glyph for
// backwards compat. Lucide names render as inline SVG; unknown values render
// as text so existing prototypes that pass '◇' / '◆' still work.
class WfIcon extends WfBase {
  render() {
    const name = this.attr('name', 'layout-dashboard');
    const size = this.attr('size', 'md');
    this.innerHTML = '';
    this.className = `wf-icon${size !== 'md' ? ` wf-icon--${size}` : ''}`;
    this.append(iconNode(name, name));
  }
}

// --- Logo ---
class WfLogo extends WfBase {
  render() {
    const size = this.attr('size', 'md');
    const text = this.attr('text', 'Moderne');
    this.className = `wf-logo${size !== 'md' ? ` wf-logo--${size}` : ''}`;
    this.append(
      h('span', { className: 'wf-logo__mark' }, lucide('diamond', 22)),
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
          h('button', { className: 'wf-button wf-button--ghost wf-button--sm' }, lucide('ellipsis-vertical', 16))
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
        h('button', { className: 'wf-button wf-button--sm' }, lucide('filter', 14), ' Filter'),
        h('button', { className: 'wf-button wf-button--sm' }, lucide('columns', 14), ' Columns')
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
    const eventIcons = ['play', 'git-commit', 'bar-chart-2', 'download', 'refresh-cw'];
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
        h('div', { className: 'wf-changelog-entry__icon' }, lucide(eventIcons[i % eventIcons.length], 16)),
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
    const illustration = this.attr('illustration', 'rocket');
    const prereqsAttr = this.attr('prereqs', 'Connect an SCM:done,Add repositories:done,Run first recipe:pending');

    this.className = 'wf-activation';
    const illus = h('div', { className: 'wf-activation__illustration' }, iconNode(illustration, illustration, 40));
    const head = h('div', { className: 'wf-activation__headline' }, headline);
    const desc = h('div', { className: 'wf-activation__description' }, description);

    const prereqList = h('div', { className: 'wf-activation__prereqs' });
    prereqsAttr.split(',').forEach(p => {
      const [label, state] = p.split(':');
      const isDone = state?.trim() === 'done';
      const prereq = h('div', { className: `wf-activation__prereq wf-activation__prereq--${isDone ? 'done' : 'pending'}` },
        h('span', { className: 'wf-activation__prereq-icon' }, lucide(isDone ? 'check' : 'circle', 12)),
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
