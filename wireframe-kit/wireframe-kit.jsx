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
        <span className="wf-icon">◇</span>
        <span>{org}</span>
        <span className="wf-icon wf-icon--sm">▾</span>
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
        <span className="wf-navbar__search-icon">⌕</span>
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
          <button key={i} className="wf-navbar__action">{glyph}</button>
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
  items = [
    { label: 'Dashboard', icon: '◇' },
    { label: 'Recipes', icon: '▤' },
    { label: 'Activity', icon: '↻' },
    { label: 'Settings', icon: '⚙' },
  ],
  active = 0,
  title,
  home,
  homeIcon = '◆',
  tenant,
  children,
  className,
  ...props
}) => (
  <aside className={cn('wf-sidebar', className)} {...props}>
    {home && (
      <a className="wf-sidebar__home">
        <span className="wf-sidebar__item-icon">{homeIcon}</span>
        <span className="wf-sidebar__item-label">{home}</span>
      </a>
    )}
    {title && <div className="wf-sidebar__title">{title}</div>}
    {items.map((raw, i) => {
      const { label, icon = '◇' } = typeof raw === 'string' ? { label: raw } : raw;
      return (
        <a key={i} className={cn('wf-sidebar__item', i === active && 'wf-sidebar__item--active')}>
          <span className="wf-sidebar__item-icon">{icon}</span>
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
    <span className="wf-select__arrow">▾</span>
  </div>
);

export const Search = ({ placeholder = 'Search...', className, ...props }) => (
  <div className={cn('wf-search', className)} {...props}>
    <span className="wf-search__icon">⌕</span>
    <input className="wf-search__input" placeholder={placeholder} type="text" />
  </div>
);

export const DatePicker = ({ value = 'Select date...', className, ...props }) => (
  <div className={cn('wf-datepicker', className)} {...props}>
    <span className="wf-datepicker__icon">📅</span>
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
      <button className="wf-button" onClick={() => setOpen(!open)}>{label} ▾</button>
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

export const Icon = ({ name = '◇', size = 'md', className, ...props }) => (
  <span className={cn('wf-icon', size !== 'md' && `wf-icon--${size}`, className)} {...props}>
    {name}
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
  const icons = { info: 'i', success: '✓', warning: '!', error: '✕' };
  return (
    <div className={cn('wf-alert', `wf-alert--${variant}`, className)} {...props}>
      <div className="wf-alert__icon">{icons[variant] || 'i'}</div>
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
              <span className="wf-tree-item__toggle">{hasChildren ? '▾' : ''}</span>
              <span className="wf-tree-item__icon">{d > 1 ? '▤' : '◇'}</span>
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
    <div className="wf-empty-state__icon">∅</div>
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
    <span className="wf-logo__mark">◈</span>
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
        actions={<Button variant="ghost" size="sm">⋮</Button>}
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
        <Button size="sm">⧩ Filter</Button>
        <Button size="sm">⊞ Columns</Button>
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

export const ChangelogEntry = ({ icon = '▶', type = 'Recipe Run', title, meta, timestamp, className, ...props }) => (
  <div className={cn('wf-changelog-entry', className)} {...props}>
    <div className="wf-changelog-entry__icon">{icon}</div>
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
    { icon: '▶', type: 'Recipe Run', title: 'Migrate to Java 17 completed', meta: 'Alice Chen · 3 repositories', timestamp: '3 hours ago' },
    { icon: '⊙', type: 'Commit', title: 'Pushed formatting fixes', meta: 'Bob Torres · 1 repository', timestamp: '5 hours ago' },
    { icon: '◉', type: 'Visualization', title: 'Generated dependency graph', meta: 'Carol Kim · 8 repositories', timestamp: 'Yesterday' },
    { icon: '↓', type: 'Ingestion', title: 'Ingested 12 new repositories', meta: 'System · 12 repositories', timestamp: 'Mar 28, 2026' },
    { icon: '⟳', type: 'Migration', title: 'Applied security patches', meta: 'Dave Patel · 8 repositories', timestamp: 'Mar 25, 2026' },
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
  illustration = '◈',
  prereqs = [{ label: 'Connect an SCM', done: true }, { label: 'Add repositories', done: true }, { label: 'Run first recipe', done: false }],
  links = [{ label: 'Read the docs' }, { label: 'Take a tour' }],
  onAction,
  className,
  ...props
}) => (
  <div className={cn('wf-activation', className)} {...props}>
    <div className="wf-activation__illustration">{illustration}</div>
    <div className="wf-activation__headline">{headline}</div>
    <div className="wf-activation__description">{description}</div>
    {prereqs.length > 0 && (
      <div className="wf-activation__prereqs">
        {prereqs.map((p, i) => (
          <div key={i} className={`wf-activation__prereq wf-activation__prereq--${p.done ? 'done' : 'pending'}`}>
            <span className="wf-activation__prereq-icon">{p.done ? '✓' : '○'}</span>
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
