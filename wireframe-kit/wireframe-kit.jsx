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

export const Navbar = ({ brand = 'App Name', items = [], children, className, ...props }) => (
  <nav className={cn('wf-navbar', className)} {...props}>
    <span className="wf-navbar__brand">{brand}</span>
    {items.length > 0 && (
      <nav className="wf-navbar__items">
        {items.map((item, i) => (
          <a key={i} className="wf-navbar__item">{item}</a>
        ))}
      </nav>
    )}
    {children}
    <Avatar size="sm" />
  </nav>
);

export const Sidebar = ({ items = ['Dashboard', 'Settings'], active = 0, title, children, className, ...props }) => (
  <aside className={cn('wf-sidebar', className)} {...props}>
    {title && <div className="wf-sidebar__title">{title}</div>}
    {items.map((item, i) => (
      <a key={i} className={cn('wf-sidebar__item', i === active && 'wf-sidebar__item--active')}>
        {item}
      </a>
    ))}
    {children}
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
