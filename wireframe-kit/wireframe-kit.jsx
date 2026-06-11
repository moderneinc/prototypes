/**
 * WIREFRAME KIT — Neo Design System (Lo-Fi)
 *
 * React component library for wireframe prototyping.
 * Mirrors Neo's prop API with generous defaults.
 *
 * Usage:
 *   import { Button, Card, DataGrid, Page } from './wireframe-kit';
 *   import './wireframe-kit.css';
 *
 *   export default () => (
 *     <Page>
 *       <Navbar brand="Moderne" items={['Recipes','Repos']} />
 *       <Sidebar items={['Dashboard','Settings']} active={0} />
 *       <Main>
 *         <Card title="Hello">Content here</Card>
 *       </Main>
 *     </Page>
 *   );
 */

import React, { useState } from 'react';

// ============================================
// UTILITY
// ============================================
const cn = (...classes) => classes.filter(Boolean).join(' ');

const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
const lorem = (n = 5) => loremWords.slice(0, n).join(' ');

const sampleNames = ['Alice Chen', 'Bob Torres', 'Carol Kim', 'Dave Patel', 'Eve Johnson', 'Frank Liu', 'Grace Smith', 'Hiro Tanaka'];
const sampleStatuses = ['Active', 'Pending', 'Complete', 'Error', 'Running'];
const sampleDates = ['Jun 1', 'Jun 2', 'Jun 3', 'May 28', 'May 30', 'Jun 4', 'May 25', 'Jun 5'];

// ============================================
// LUCIDE ICONS
// Inline SVG icons matching the set used in moderneui / neodesign.
// Names follow lucide.dev. Keep alphabetised so swap-outs are easy.
// ============================================
const LUCIDE_ICONS = {
  'activity':         '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.68 2.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4.45 12H2"/>',
  'alert-circle':     '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  'alert-triangle':   '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'bar-chart-2':      '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  'bell':             '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'blocks':           '<rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/>',
  'calendar':         '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  'check':            '<polyline points="20 6 9 17 4 12"/>',
  'check-circle':     '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'chevron-down':     '<polyline points="6 9 12 15 18 9"/>',
  'chevron-left':     '<polyline points="15 18 9 12 15 6"/>',
  'chevron-right':    '<polyline points="9 18 15 12 9 6"/>',
  'chevron-up':       '<polyline points="18 15 12 9 6 15"/>',
  'circle':           '<circle cx="12" cy="12" r="10"/>',
  'columns':          '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>',
  'diamond':          '<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/>',
  'download':         '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  'ellipsis-vertical':'<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  'file':             '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  'file-code':        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/>',
  'filter':           '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'folder':           '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  'folder-git':       '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="2"/><path d="M14 13h3"/><path d="M7 13h3"/>',
  'git-commit':       '<circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>',
  'globe':            '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  'help-circle':      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'history':          '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  'inbox':            '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  'info':             '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  'layers':           '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  'more-horizontal':  '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'package':          '<path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  'pie-chart':        '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  'play':             '<polygon points="6 3 20 12 6 21 6 3"/>',
  'refresh-cw':       '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  'rocket':           '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  'search':           '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  'settings':         '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="3"/>',
  'sparkles':         '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/>',
  'users':            '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'x-circle':         '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
};

// Render a lucide icon as inline SVG, or null if name unknown.
// `size` is optional: px number for fixed icons, omit for 1em (scales with text).
export const Lucide = ({ name, size, className }) => {
  const inner = LUCIDE_ICONS[name];
  if (!inner) return null;
  const dim = size != null ? size : '1em';
  return (
    <svg
      className={cn('wf-lucide', className)}
      viewBox="0 0 24 24"
      width={dim}
      height={dim}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
};

// Render a lucide SVG when `value` matches a known name; otherwise fall back
// to the literal glyph (or `fallback` when `value` is empty). Lets callers
// pass either a lucide name ('search') or a legacy glyph ('◆').
const IconOrGlyph = ({ value, fallback, size }) => {
  if (value && LUCIDE_ICONS[value]) return <Lucide name={value} size={size} />;
  return <>{value || fallback || ''}</>;
};

// Legacy glyph → lucide name aliases. Lets prototypes written before the
// icon swap (e.g. `homeIcon="◆"`, `items=[{icon:'◇'}]`) keep working without
// being rewritten — the wireframe kit still renders Lucide.
// Mirrors trigrep.html's nav set: ↻ → history (clock+rewind, "Activity"),
// ⌥ → folder-git ("Repositories"), etc.
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
const resolveIconName = (raw) => GLYPH_TO_LUCIDE[raw] || raw;

// ============================================
// LAYOUT
// ============================================

export const Page = ({ children, noSidebar, className, ...props }) => (
  <div className={cn('wf-page', noSidebar && 'wf-page--no-sidebar', className)} {...props}>
    {children}
  </div>
);

export const Main = ({ children, className, ...props }) => (
  <main className={cn('wf-main', className)} {...props}>
    {children}
  </main>
);

export const MainHeader = ({ children, className, ...props }) => (
  <div className={cn('wf-main__header', className)} {...props}>
    {children}
  </div>
);

export const Grid = ({ children, cols = 2, className, ...props }) => (
  <div className={cn('wf-grid', `wf-grid--${cols}`, className)} {...props}>
    {children}
  </div>
);

export const Stack = ({ children, className, ...props }) => (
  <div className={cn('wf-stack', className)} {...props}>
    {children}
  </div>
);

export const Row = ({ children, spread, className, ...props }) => (
  <div className={cn('wf-row', spread && 'wf-row--spread', className)} {...props}>
    {children}
  </div>
);

// ============================================
// NAVIGATION
// ============================================

// Global top bar that sits over the main column. Primary nav lives in the
// rail (<Sidebar>), not here. Optional: org-selector pill, search, icon
// actions, avatar. Pass JSX children to override any slot. The legacy
// `brand` + text `items` props are still accepted for backward compat but
// shouldn't be used in new prototypes.
export const Navbar = ({
  org,
  search,
  actions = [],
  avatar,
  brand,
  items = [],
  children,
  className,
  ...props
}) => (
  <nav className={cn('wf-navbar', className)} {...props}>
    {brand && <span className="wf-navbar__brand">{brand}</span>}
    {org && (
      <button className="wf-navbar__org">
        <span className="wf-icon"><Lucide name="users" size={14} /></span>
        <span>{org}</span>
        <span className="wf-icon wf-icon--sm"><Lucide name="chevron-down" size={12} /></span>
      </button>
    )}
    {items.length > 0 && (
      <nav className="wf-navbar__items">
        {items.map((item, i) => (
          <a key={i} className="wf-navbar__item">{item}</a>
        ))}
      </nav>
    )}
    <span className="wf-navbar__spacer" />
    {search && (
      <div className="wf-navbar__search">
        <span className="wf-navbar__search-icon"><Lucide name="search" size={14} /></span>
        <span>{search}</span>
        <span className="wf-navbar__search-kbd">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </span>
      </div>
    )}
    {actions.length > 0 && (
      <div className="wf-navbar__actions">
        {actions.map((glyph, i) => (
          <button key={i} className="wf-navbar__action">
            <IconOrGlyph value={resolveIconName(glyph)} fallback={glyph} size={18} />
          </button>
        ))}
      </div>
    )}
    {children}
    {avatar && <Avatar size="sm" initials={avatar} />}
  </nav>
);

// Left rail (88px). Items accept either strings ('Dashboard') or
// { label, icon } objects. Active state bolds the label and highlights the
// icon pill, mirroring Neo's Body/Navigation/selected typographic step plus
// the buttons/navigation active fill.
export const Sidebar = ({
  // Default items mirror trigrep.html's NAV_ITEMS so the rail looks like the
  // real Moderne shell out of the box. Override per prototype.
  items = [
    { label: 'Moddy', icon: 'sparkles' },
    { label: 'DevCenter', icon: 'pie-chart' },
    { label: 'Trigrep', icon: 'search' },
    { label: 'Artifacts', icon: 'package' },
    { label: 'Marketplace', icon: 'globe' },
    { label: 'Builder', icon: 'blocks' },
    { label: 'Activity', icon: 'history' },
    { label: 'Changelog', icon: 'activity' },
  ],
  active = 0,
  title,
  home,
  homeIcon = 'diamond',
  tenant,
  children,
  className,
  ...props
}) => (
  <aside className={cn('wf-sidebar', className)} {...props}>
    {home && (
      <a className="wf-sidebar__home">
        <span className="wf-sidebar__item-icon">
          <IconOrGlyph value={resolveIconName(homeIcon)} fallback={homeIcon} size={22} />
        </span>
        <span className="wf-sidebar__item-label">{home}</span>
      </a>
    )}
    {title && <div className="wf-sidebar__title">{title}</div>}
    {items.map((raw, i) => {
      const { label, icon = 'layout-dashboard' } = typeof raw === 'string' ? { label: raw } : raw;
      return (
        <a key={i} className={cn('wf-sidebar__item', i === active && 'wf-sidebar__item--active')}>
          <span className="wf-sidebar__item-icon">
            <IconOrGlyph value={resolveIconName(icon)} fallback={icon} size={22} />
          </span>
          <span className="wf-sidebar__item-label">{label}</span>
        </a>
      );
    })}
    {children}
    {tenant && (
      <div className="wf-sidebar__footer">
        <div className="wf-sidebar__tenant">{tenant}</div>
      </div>
    )}
  </aside>
);

export const Breadcrumb = ({ items = ['Home', 'Page'], className, ...props }) => (
  <nav className={cn('wf-breadcrumb', className)} {...props}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        <span className={cn('wf-breadcrumb__item', i === items.length - 1 && 'wf-breadcrumb__item--active')}>
          {item}
        </span>
        {i < items.length - 1 && <span className="wf-breadcrumb__sep">/</span>}
      </React.Fragment>
    ))}
  </nav>
);

export const Tabs = ({ items = ['Tab 1', 'Tab 2', 'Tab 3'], active = 0, onChange, className, ...props }) => {
  const [current, setCurrent] = useState(active);
  return (
    <div className={cn('wf-tabs', className)} {...props}>
      {items.map((item, i) => (
        <button
          key={i}
          className={cn('wf-tabs__item', i === current && 'wf-tabs__item--active')}
          onClick={() => { setCurrent(i); onChange?.(i); }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export const Pagination = ({ pages = 5, active = 1, className, ...props }) => (
  <div className={cn('wf-pagination', className)} {...props}>
    <span className="wf-pagination__item">‹</span>
    {Array.from({ length: Math.min(pages, 7) }, (_, i) => (
      <span key={i} className={cn('wf-pagination__item', i + 1 === active && 'wf-pagination__item--active')}>
        {i + 1}
      </span>
    ))}
    {pages > 7 && (
      <>
        <span className="wf-pagination__ellipsis">...</span>
        <span className="wf-pagination__item">{pages}</span>
      </>
    )}
    <span className="wf-pagination__item">›</span>
  </div>
);

// ============================================
// BUTTONS
// ============================================

export const Button = ({ children = 'Button', variant, size, disabled, className, ...props }) => (
  <button
    className={cn(
      'wf-button',
      variant && `wf-button--${variant}`,
      size && `wf-button--${size}`,
      disabled && 'wf-button--disabled',
      className
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export const ButtonGroup = ({ items = ['Left', 'Center', 'Right'], className, ...props }) => (
  <div className={cn('wf-button-group', className)} {...props}>
    {items.map((item, i) => (
      <button key={i} className="wf-button">{item}</button>
    ))}
  </div>
);

export const ButtonTab = ({ items = ['Tab 1', 'Tab 2', 'Tab 3'], active = 0, onChange, className, ...props }) => {
  const [current, setCurrent] = useState(active);
  return (
    <div className={cn('wf-button-tab', className)} {...props}>
      {items.map((item, i) => (
        <button
          key={i}
          className={cn('wf-button-tab__item', i === current && 'wf-button-tab__item--active')}
          onClick={() => { setCurrent(i); onChange?.(i); }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

// ============================================
// FORM CONTROLS
// ============================================

export const Input = ({ label, placeholder = 'Enter text...', helper, error, value, type = 'text', className, ...props }) => (
  <div className={cn('wf-input-group', className)}>
    {label && <label className="wf-input-group__label">{label}</label>}
    <input
      className={cn('wf-input', error && 'wf-input--error')}
      placeholder={placeholder}
      defaultValue={value}
      type={type}
      {...props}
    />
    {helper && <span className="wf-input-group__helper">{helper}</span>}
    {error && <span className="wf-input-group__error">{error}</span>}
  </div>
);

export const Textarea = ({ label, placeholder = 'Enter text...', rows = 4, className, ...props }) => (
  <div className={cn('wf-input-group', className)}>
    {label && <label className="wf-input-group__label">{label}</label>}
    <textarea className="wf-textarea" placeholder={placeholder} rows={rows} {...props} />
  </div>
);

export const Select = ({ placeholder = 'Select...', value, className, ...props }) => (
  <div className={cn('wf-select', !value && 'wf-select--placeholder', className)} {...props}>
    <span>{value || placeholder}</span>
    <span className="wf-select__arrow"><Lucide name="chevron-down" size={14} /></span>
  </div>
);

export const Search = ({ placeholder = 'Search...', className, ...props }) => (
  <div className={cn('wf-search', className)} {...props}>
    <span className="wf-search__icon"><Lucide name="search" size={14} /></span>
    <input className="wf-search__input" placeholder={placeholder} type="text" />
  </div>
);

export const DatePicker = ({ value = 'Select date...', className, ...props }) => (
  <div className={cn('wf-datepicker', className)} {...props}>
    <span className="wf-datepicker__icon"><Lucide name="calendar" size={14} /></span>
    <span>{value}</span>
  </div>
);

export const Checkbox = ({ label = 'Checkbox', checked: initialChecked = false, onChange, className, ...props }) => {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <label
      className={cn('wf-checkbox', checked && 'wf-checkbox--checked', className)}
      onClick={() => { setChecked(!checked); onChange?.(!checked); }}
      {...props}
    >
      <span className="wf-checkbox__box" />
      <span>{label}</span>
    </label>
  );
};

export const Radio = ({ label = 'Radio', selected: initialSelected = false, onChange, className, ...props }) => {
  const [selected, setSelected] = useState(initialSelected);
  return (
    <label
      className={cn('wf-radio', selected && 'wf-radio--selected', className)}
      onClick={() => { setSelected(!selected); onChange?.(!selected); }}
      {...props}
    >
      <span className="wf-radio__circle" />
      <span>{label}</span>
    </label>
  );
};

export const Toggle = ({ label, on: initialOn = false, onChange, className, ...props }) => {
  const [on, setOn] = useState(initialOn);
  return (
    <div
      className={cn('wf-toggle', on && 'wf-toggle--on', className)}
      onClick={() => { setOn(!on); onChange?.(!on); }}
      {...props}
    >
      <span className="wf-toggle__track">
        <span className="wf-toggle__thumb" />
      </span>
      {label && <span>{label}</span>}
    </div>
  );
};

export const Dropdown = ({ items = ['Option 1', 'Option 2', 'Option 3'], label = 'Actions', className, ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('wf-dropdown', className)} {...props}>
      <button className="wf-button" onClick={() => setOpen(!open)}>
        <IconOrGlyph value={resolveIconName(label)} fallback={label} size={14} /> <Lucide name="chevron-down" size={12} />
      </button>
      {open && (
        <div className="wf-dropdown__menu">
          {items.map((item, i) => (
            <div key={i} className="wf-dropdown__item">{item}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// DATA DISPLAY
// ============================================

export const Avatar = ({ initials = '?', size = 'md', className, ...props }) => (
  <div className={cn('wf-avatar', size !== 'md' && `wf-avatar--${size}`, className)} {...props}>
    {initials}
  </div>
);

export const Badge = ({ children = 'Badge', filled, className, ...props }) => (
  <span className={cn('wf-badge', filled && 'wf-badge--filled', className)} {...props}>
    {children}
  </span>
);

export const Tag = ({ children = 'Tag', className, ...props }) => (
  <span className={cn('wf-tag', className)} {...props}>{children}</span>
);

export const Chip = ({ children = 'Chip', removable, onRemove, className, ...props }) => (
  <span className={cn('wf-chip', className)} {...props}>
    <span>{children}</span>
    {removable && <button className="wf-chip__remove" onClick={onRemove}>×</button>}
  </span>
);

export const KeyValuePair = ({ label, value, className, ...props }) => (
  <div className={cn('wf-kv', className)} {...props}>
    <span className="wf-kv__key">{label}</span>
    <span className="wf-kv__value">{value}</span>
  </div>
);

export const ListItem = ({ title, subtitle, trailing, onClick, className, ...props }) => (
  <div className={cn('wf-list-item', className)} onClick={onClick} {...props}>
    <div className="wf-list-item__content">
      <div className="wf-list-item__title">{title}</div>
      {subtitle && <div className="wf-list-item__subtitle">{subtitle}</div>}
    </div>
    {trailing && <div className="wf-list-item__trailing">{trailing}</div>}
  </div>
);

export const Progress = ({ value = 60, className, ...props }) => (
  <div className={cn('wf-progress', className)} {...props}>
    <div className="wf-progress__bar" style={{ width: `${value}%` }} />
  </div>
);

export const DiffStat = ({ additions = 12, deletions = 4, className, ...props }) => {
  const total = 5;
  const addSegs = Math.round((additions / (additions + deletions)) * total);
  const delSegs = total - addSegs;
  return (
    <span className={cn('wf-diffstat', className)} {...props}>
      <span className="wf-diffstat__text--add">+{additions}</span>
      <span className="wf-diffstat__text--remove">-{deletions}</span>
      <span className="wf-diffstat__bar">
        {Array.from({ length: addSegs }, (_, i) => <span key={`a${i}`} className="wf-diffstat__segment wf-diffstat__segment--add" />)}
        {Array.from({ length: delSegs }, (_, i) => <span key={`d${i}`} className="wf-diffstat__segment wf-diffstat__segment--remove" />)}
      </span>
    </span>
  );
};

export const Icon = ({ name = 'layout-dashboard', size = 'md', className, ...props }) => (
  <span className={cn('wf-icon', size !== 'md' && `wf-icon--${size}`, className)} {...props}>
    <IconOrGlyph value={name} fallback={name} />
  </span>
);

// ============================================
// TABLE / DATAGRID
// ============================================

export const Table = ({ rows = 5, cols = 4, headers, data, className, ...props }) => {
  const headerList = headers || Array.from({ length: cols }, (_, i) => `Column ${i + 1}`);
  return (
    <table className={cn('wf-table', className)} {...props}>
      <thead>
        <tr>
          {headerList.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data ? data.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => <td key={c}>{cell}</td>)}
          </tr>
        )) : Array.from({ length: rows }, (_, r) => (
          <tr key={r}>
            {headerList.map((_, c) => {
              let content;
              if (c === 0) content = sampleNames[r % sampleNames.length];
              else if (c === headerList.length - 1) content = sampleDates[r % sampleDates.length];
              else content = sampleStatuses[r % sampleStatuses.length];
              return <td key={c}>{content}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const DataGrid = ({ rows = 5, cols = 4, headers, data, className, ...props }) => {
  const headerList = headers || Array.from({ length: cols }, (_, i) => `Column ${i + 1}`);
  return (
    <div className={className} {...props}>
      <div className="wf-datagrid__toolbar">
        <Search placeholder="Filter..." style={{ flex: '0 0 200px' }} />
        <Button variant="ghost" size="sm">Filters</Button>
        <Button variant="ghost" size="sm">Sort</Button>
      </div>
      <Table rows={rows} headers={headerList} data={data} style={{ borderTop: 'none', borderRadius: '0 0 5px 5px' }} />
    </div>
  );
};

// ============================================
// CARDS
// ============================================

export const Card = ({ title, footer, children, className, ...props }) => (
  <div className={cn('wf-card', className)} {...props}>
    {title && (
      <div className="wf-card__header">
        <span>{title}</span>
      </div>
    )}
    <div className="wf-card__body">
      {children || (
        <>
          <Placeholder variant="long" />
          <Placeholder variant="medium" />
          <Placeholder variant="short" />
        </>
      )}
    </div>
    {footer && (
      <div className="wf-card__footer">
        {typeof footer === 'boolean' ? (
          <>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save</Button>
          </>
        ) : footer}
      </div>
    )}
  </div>
);

export const StatCard = ({ label = 'Metric', value = '—', change, className, ...props }) => (
  <div className={cn('wf-stat-card', className)} {...props}>
    <div className="wf-stat-card__label">{label}</div>
    <div className="wf-stat-card__value">{value}</div>
    {change && <div className="wf-stat-card__change">{change}</div>}
  </div>
);

// ============================================
// FEEDBACK
// ============================================

export const Alert = ({ variant = 'info', title = 'Alert', children, className, ...props }) => {
  const iconName = { info: 'info', success: 'check-circle', warning: 'alert-triangle', error: 'x-circle' }[variant] || 'info';
  return (
    <div className={cn('wf-alert', `wf-alert--${variant}`, className)} {...props}>
      <div className="wf-alert__icon"><Lucide name={iconName} size={14} /></div>
      <div className="wf-alert__content">
        <div className="wf-alert__title">{title}</div>
        <div className="wf-alert__message">{children || 'Alert description goes here'}</div>
      </div>
    </div>
  );
};

export const Banner = ({ children = 'Banner message', onDismiss, className, ...props }) => (
  <div className={cn('wf-banner', className)} {...props}>
    <span>{children}</span>
    <button className="wf-banner__dismiss" onClick={onDismiss}>×</button>
  </div>
);

export const Toast = ({ children = 'Toast notification', onDismiss, className, ...props }) => (
  <div className={cn('wf-toast', className)} {...props}>
    <span>{children}</span>
    <button className="wf-toast__dismiss" onClick={onDismiss}>×</button>
  </div>
);

export const ToastContainer = ({ children, className, ...props }) => (
  <div className={cn('wf-toast-container', className)} {...props}>
    {children}
  </div>
);

export const Modal = ({ title = 'Modal Title', open = false, onClose, children, footer, className, ...props }) => {
  if (!open) return null;
  return (
    <div className={cn('wf-modal-overlay', className)} onClick={onClose} {...props}>
      <div className="wf-modal" onClick={e => e.stopPropagation()}>
        <div className="wf-modal__header">
          <span className="wf-modal__title">{title}</span>
          <button className="wf-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="wf-modal__body">
          {children || (
            <>
              <Placeholder variant="long" />
              <Placeholder variant="medium" />
            </>
          )}
        </div>
        <div className="wf-modal__footer">
          {footer || (
            <>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="primary">Confirm</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const Spinner = ({ size = 'md', className, ...props }) => (
  <span className={cn('wf-spinner', size !== 'md' && `wf-spinner--${size}`, className)} {...props} />
);

export const Tooltip = ({ content, children, className, ...props }) => (
  <span className={cn('wf-tooltip-wrapper', className)} {...props}>
    {children}
    <span className="wf-tooltip">{content}</span>
  </span>
);

// ============================================
// DEV TOOLS
// ============================================

export const CodeSnippet = ({ language = 'code', children, lines = 5, className, ...props }) => (
  <div className={cn('wf-code-snippet', className)} {...props}>
    <div className="wf-code-snippet__header">
      <span>{language}</span>
      <button className="wf-code-snippet__copy">Copy</button>
    </div>
    {children ? (
      children.split('\n').map((line, i) => (
        <span key={i} className="wf-code-snippet__line">
          <span className="wf-code-snippet__line-number">{i + 1}</span>
          {line}
        </span>
      ))
    ) : (
      Array.from({ length: lines }, (_, i) => (
        <span key={i} className="wf-code-snippet__line">
          <span className="wf-code-snippet__line-number">{i + 1}</span>
          {lorem(Math.floor(Math.random() * 4) + 2)}
        </span>
      ))
    )}
  </div>
);

export const Tree = ({ depth = 3, items = 4, className, ...props }) => {
  const renderLevel = (d, count) => (
    <div className="wf-tree-item__children" style={d === depth ? { paddingLeft: 0 } : undefined}>
      {Array.from({ length: count }, (_, i) => {
        const hasChildren = d > 1 && i < 2;
        return (
          <div key={i} className="wf-tree-item">
            <div className="wf-tree-item__row">
              <span className="wf-tree-item__toggle">{hasChildren ? <Lucide name="chevron-down" size={10} /> : ''}</span>
              <span className="wf-tree-item__icon"><Lucide name={d > 1 ? 'folder' : 'file'} size={11} /></span>
              <span>{d > 1 ? 'Folder' : 'Item'} {i + 1}</span>
            </div>
            {hasChildren && renderLevel(d - 1, Math.max(2, count - 1))}
          </div>
        );
      })}
    </div>
  );
  return (
    <div className={cn('wf-tree', className)} {...props}>
      {renderLevel(depth, items)}
    </div>
  );
};

// ============================================
// CHART & MISC
// ============================================

export const Chart = ({ title = 'Chart', bars = 6, className, ...props }) => (
  <div className={cn('wf-chart', className)} {...props}>
    <div className="wf-chart__title">{title}</div>
    <div className="wf-chart__area">
      {Array.from({ length: bars }, (_, i) => (
        <div key={i} className="wf-chart__bar" style={{ height: `${30 + Math.floor(Math.random() * 60)}%` }} />
      ))}
    </div>
  </div>
);

export const EmptyState = ({ title = 'No results', message = 'Try adjusting your filters', action, onAction, className, ...props }) => (
  <div className={cn('wf-empty-state', className)} {...props}>
    <div className="wf-empty-state__icon"><Lucide name="inbox" size={28} /></div>
    <div className="wf-empty-state__title">{title}</div>
    <div className="wf-empty-state__message">{message}</div>
    {action && <Button variant="primary" onClick={onAction}>{action}</Button>}
  </div>
);

export const Placeholder = ({ variant = 'long', className, ...props }) => (
  <div className={cn('wf-placeholder', `wf-placeholder--${variant}`, className)} {...props} />
);

export const Divider = ({ dashed, className, ...props }) => (
  <hr className={cn('wf-divider', dashed && 'wf-divider--dashed', className)} {...props} />
);

export const Skeleton = ({ variant = 'text', width, height, className, ...props }) => (
  <div
    className={cn('wf-skeleton', `wf-skeleton--${variant}`, className)}
    style={{ width, height }}
    {...props}
  />
);

export const Logo = ({ size = 'md', text = 'Moderne', className, ...props }) => (
  <span className={cn('wf-logo', size !== 'md' && `wf-logo--${size}`, className)} {...props}>
    <span className="wf-logo__mark"><Lucide name="diamond" size={22} /></span>
    <span className="wf-logo__text">{text}</span>
  </span>
);

// ============================================
// ASSEMBLIES
// ============================================

export const CardTableRow = ({ title, badges = [], meta, actions, className, children, ...props }) => (
  <div className={cn('wf-card-table__row', className)} {...props}>
    <Checkbox />
    <div className="wf-card-table__row-content">
      <div className="wf-card-table__row-title">{title}</div>
      {badges.length > 0 && (
        <div className="wf-card-table__row-meta">
          {badges.map((b, i) => <Badge key={i} variant={b.variant}>{b.label}</Badge>)}
        </div>
      )}
      {meta && <div className="wf-card-table__row-secondary">{meta}</div>}
      {children}
    </div>
    {actions && <div className="wf-card-table__row-actions">{actions}</div>}
  </div>
);

export const CardTable = ({ title = 'Results', rows, actions, className, children, ...props }) => (
  <div className={cn('wf-card-table', className)} {...props}>
    <div className="wf-card-table__header">
      <span className="wf-card-table__title">{title}</span>
      <div className="wf-card-table__actions">{actions || <><Button size="sm">Filter</Button><Button size="sm">Export</Button></>}</div>
    </div>
    {children || Array.from({ length: rows || 5 }, (_, i) => (
      <CardTableRow
        key={i}
        title={['Migrate to Java 17', 'Upgrade Spring Boot', 'Fix CVE-2024-1234', 'Modernize logging', 'Remove deprecated API'][i % 5]}
        badges={[{ label: ['Recipe Run', 'Commit', 'Visualization'][i % 3] }, { label: i % 3 === 0 ? 'Complete' : 'Pending', variant: i % 3 === 0 ? 'success' : 'default' }]}
        meta={`Alice Chen · Jun ${1 + i} · ${3 + i} repositories`}
        actions={<Button variant="ghost" size="sm"><Lucide name="ellipsis-vertical" size={16} /></Button>}
      />
    ))}
  </div>
);

export const FilterResults = ({ filters = ['Status', 'Language', 'Organization'], rows = 5, headers = 'Repository,Status,Changes,Date', summary, className, children, ...props }) => (
  <div className={cn('wf-filter-results', className)} {...props}>
    <div className="wf-filter-results__bar">
      <div className="wf-filter-results__filters">
        {filters.map((f, i) => <Chip key={i}>{f}</Chip>)}
      </div>
      <div className="wf-filter-results__search">
        <Search placeholder="Search results…" />
      </div>
    </div>
    <div className="wf-filter-results__table">
      {children || <DataGrid rows={rows} headers={headers} />}
    </div>
    <div className="wf-filter-results__summary">
      <span>{summary || `${rows} results`}</span>
      <Pagination />
    </div>
  </div>
);

export const DataTableLayout = ({ rows = 8, cols = 5, headers = 'Name,Status,Type,Modified,Actions', className, children, ...props }) => (
  <div className={cn('wf-data-table-layout', className)} {...props}>
    <div className="wf-data-table-layout__toolbar">
      <div className="wf-data-table-layout__toolbar-left">
        <Search placeholder="Search…" size="sm" />
        <Button size="sm"><Lucide name="filter" size={14} /> Filter</Button>
        <Button size="sm"><Lucide name="columns" size={14} /> Columns</Button>
      </div>
      <div className="wf-data-table-layout__toolbar-right">
        <Button size="sm">Bulk actions</Button>
      </div>
    </div>
    {children || <DataGrid rows={rows} cols={cols} headers={headers} />}
    <div className="wf-data-table-layout__footer">
      <span>Selected: 0 items</span>
      <Pagination />
    </div>
  </div>
);

export const ChangelogEntry = ({ icon = 'play', type = 'Recipe Run', title, meta, timestamp, className, ...props }) => (
  <div className={cn('wf-changelog-entry', className)} {...props}>
    <div className="wf-changelog-entry__icon">
      <IconOrGlyph value={icon} fallback={icon} size={16} />
    </div>
    <div className="wf-changelog-entry__body">
      <div className="wf-changelog-entry__header">
        <Badge>{type}</Badge>
        <span className="wf-changelog-entry__title">{title}</span>
      </div>
      {meta && <div className="wf-changelog-entry__meta">{meta}</div>}
    </div>
    {timestamp && <div className="wf-changelog-entry__timestamp">{timestamp}</div>}
  </div>
);

export const ChangelogFeed = ({ entries = 5, showFilters = true, className, children, ...props }) => {
  const defaults = [
    { icon: 'play', type: 'Recipe Run', title: 'Migrate to Java 17 completed', meta: 'Alice Chen · 3 repositories', timestamp: '3 hours ago' },
    { icon: 'git-commit', type: 'Commit', title: 'Pushed formatting fixes', meta: 'Bob Torres · 1 repository', timestamp: '5 hours ago' },
    { icon: 'bar-chart-2', type: 'Visualization', title: 'Generated dependency graph', meta: 'Carol Kim · 8 repositories', timestamp: 'Yesterday' },
    { icon: 'download', type: 'Ingestion', title: 'Ingested 12 new repositories', meta: 'System · 12 repositories', timestamp: 'Mar 28, 2026' },
    { icon: 'refresh-cw', type: 'Migration', title: 'Applied security patches', meta: 'Dave Patel · 8 repositories', timestamp: 'Mar 25, 2026' },
  ];
  return (
    <div className={cn('wf-changelog-feed', className)} {...props}>
      {showFilters && (
        <div className="wf-changelog-feed__filters">
          <Chip>Recipe Run</Chip>
          <Chip>Commit</Chip>
          <Chip>Visualization</Chip>
          <Chip>Date range ▾</Chip>
        </div>
      )}
      <div className="wf-changelog-feed__list">
        {children || defaults.slice(0, entries).map((e, i) => <ChangelogEntry key={i} {...e} />)}
      </div>
    </div>
  );
};

// ============================================
// COMPOSITIONS
// ============================================

export const RecipeResults = ({
  recipe = 'Migrate to Java 17',
  status = 'completed',
  repos = 24,
  changes = 18,
  errors = 2,
  tabs = ['Results', 'Visualizations', 'Data Tables'],
  className,
  children,
  ...props
}) => {
  const statusVariant = status === 'completed' ? 'success' : status === 'failed' ? 'error' : status === 'running' ? 'info' : 'warning';
  return (
    <div className={cn('wf-recipe-results', className)} {...props}>
      <div className="wf-recipe-results__summary">
        <div className="wf-recipe-results__summary-left">
          <div className="wf-recipe-results__recipe-name">{recipe}</div>
          <div className="wf-recipe-results__stats">
            <span><span className="wf-recipe-results__stat-value">{repos}</span> repositories</span>
            <span><span className="wf-recipe-results__stat-value">{changes}</span> changes</span>
            <span><span className="wf-recipe-results__stat-value">{errors}</span> errors</span>
          </div>
        </div>
        <div className="wf-recipe-results__summary-right">
          <Badge variant={statusVariant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
          <Button variant="primary" size="sm">Commit Selected</Button>
          <Button size="sm">Share</Button>
        </div>
      </div>
      <div className="wf-recipe-results__tabs">
        <Tabs items={tabs} />
      </div>
      <div className="wf-recipe-results__body">
        {children || <FilterResults rows={6} headers="Repository,Status,Changes,Diff" />}
      </div>
    </div>
  );
};

export const Activation = ({
  headline = 'Welcome to Moderne',
  description = 'Run large-scale code transformations across all your repositories. Start by connecting your source code manager and running your first recipe.',
  cta = 'Run your first recipe',
  illustration = 'rocket',
  prereqs = [{ label: 'Connect an SCM', done: true }, { label: 'Add repositories', done: true }, { label: 'Run first recipe', done: false }],
  links = [{ label: 'Read the docs' }, { label: 'Take a tour' }],
  onAction,
  className,
  ...props
}) => (
  <div className={cn('wf-activation', className)} {...props}>
    <div className="wf-activation__illustration">
      <IconOrGlyph value={illustration} fallback={illustration} size={40} />
    </div>
    <div className="wf-activation__headline">{headline}</div>
    <div className="wf-activation__description">{description}</div>
    {prereqs.length > 0 && (
      <div className="wf-activation__prereqs">
        {prereqs.map((p, i) => (
          <div key={i} className={`wf-activation__prereq wf-activation__prereq--${p.done ? 'done' : 'pending'}`}>
            <span className="wf-activation__prereq-icon"><Lucide name={p.done ? 'check' : 'circle'} size={12} /></span>
            <span>{p.label}</span>
          </div>
        ))}
      </div>
    )}
    <div className="wf-activation__cta">
      <Button variant="primary" onClick={onAction}>{cta}</Button>
      {links.length > 0 && (
        <div className="wf-activation__links">
          {links.map((l, i) => <span key={i} className="wf-activation__link">{l.label}</span>)}
        </div>
      )}
    </div>
  </div>
);

export const Slider = ({ min = 0, max = 100, value: initialValue = 50, label, disabled, className, ...props }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div className={cn('wf-slider', className)} {...props}>
      {label && (
        <div className="wf-slider__header">
          <span className="wf-slider__label">{label}</span>
          <span className="wf-slider__value">{value}</span>
        </div>
      )}
      <input
        type="range"
        className="wf-slider__input"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={e => setValue(Number(e.target.value))}
      />
    </div>
  );
};
