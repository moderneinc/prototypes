# Wireframe Kit — Guidelines

A lo-fi, sketch-style component library for prototyping Moderne interfaces. Ships in two formats that share a single CSS foundation: **vanilla JS web components** (`<wf-*>` custom elements) for static HTML pages, and a **React component library** for JSX projects.

---

## Quick Start

### HTML (Web Components)

Create an `.html` file and add two imports:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="wireframe-kit/wireframe-kit.css">
  <script src="wireframe-kit/wireframe-kit.js"></script>
</head>
<body class="wf-kit">

  <div class="wf-page">
    <wf-sidebar home="Moderne" items="Moddy|sparkles,DevCenter|pie-chart,Trigrep|search" active="0" tenant="MOD"></wf-sidebar>
    <wf-navbar org="Moderne, Inc." search="Search…" actions="✦,?" avatar="AC"></wf-navbar>
    <main class="wf-main">
      <h1 class="wf-h1">Hello Wireframe</h1>
      <wf-card title="My Card">
        <p>Content goes here.</p>
      </wf-card>
    </main>
  </div>

</body>
</html>
```

Key things to note: the `wf-kit` class on `<body>` activates the sketch font and background. The `wf-page` wrapper sets up an **L-shaped grid** — an 88px rail on the left that spans the full height, plus a 56px top bar that only sits over the main column. This mirrors the shell used in `trigrep.html` / `results.html`. Primary navigation lives in the rail; the top bar carries the tenant switcher, global search, and account/action icons. All web components auto-register when the script loads.

### React

```jsx
import './wireframe-kit.css';
import { Page, Navbar, Sidebar, Main, Card } from './wireframe-kit';

export default function App() {
  return (
    <Page>
      <Sidebar
        home="Moderne"
        items={[
          { label: 'Dashboard', icon: '◇' },
          { label: 'Recipes', icon: '▤' },
          { label: 'Activity', icon: '↻' },
        ]}
        active={0}
        tenant="MOD"
      />
      <Navbar org="Moderne, Inc." search="Search…" actions={['✦', '?']} avatar="AC" />
      <Main>
        <h1 className="wf-h1">Hello Wireframe</h1>
        <Card title="My Card">
          <p>Content goes here.</p>
        </Card>
      </Main>
    </Page>
  );
}
```

The React library uses named exports. Props mirror the HTML attributes but accept native JS types (arrays instead of comma-separated strings, booleans instead of attribute presence).

---

## File Structure

```
wireframe-kit/
  wireframe-kit.css        # Shared visual foundation (fonts, tokens, all styles)
  wireframe-kit.js         # Vanilla JS — 37 web components as ES module
  wireframe-kit.jsx        # React — named exports for all components
  index.html               # Browsable component catalog with search
  examples/
    dashboard.html         # Full dashboard prototype
    recipe-detail.html     # Recipe detail page prototype
    components.html        # Rendered component gallery
```

---

## Layout System

### Page Shell

Every prototype starts with an L-shaped page shell: an 88px **left rail** that spans the full height, a 56px **top bar** that sits only over the main column, and a main content area that "floats" inside the chrome with a rounded top-left corner. Both the rail and the top bar are page-colored, so they read as one continuous chrome surface — this matches how `trigrep.html` and `results.html` lay out the real Moderne shell.

Primary navigation lives in the rail. The top bar carries tenant/global context: org switcher, global search, action icons, account avatar.

**HTML:**
```html
<div class="wf-page">
  <wf-sidebar home="App" items="Moddy|sparkles,Trigrep|search" active="0" tenant="MOD"></wf-sidebar>
  <wf-navbar org="Org name" search="Search…" actions="✦,?" avatar="AC"></wf-navbar>
  <main class="wf-main">...</main>
</div>
```

For pages without a rail (e.g. a catalog or auth page), add `wf-page--no-sidebar`:
```html
<div class="wf-page wf-page--no-sidebar">
  <wf-navbar org="Org name"></wf-navbar>
  <main class="wf-main">...</main>
</div>
```

**React:**
```jsx
<Page>                              {/* or <Page noSidebar> */}
  <Sidebar
    home="App"
    items={[{ label: 'Dashboard', icon: '◇' }, { label: 'Settings', icon: '⚙' }]}
    active={0}
    tenant="MOD"
  />
  <Navbar org="Org name" search="Search…" actions={['✦', '?']} avatar="AC" />
  <Main>...</Main>
</Page>
```

### Grid, Stack, Row

These CSS utility classes handle internal layout. No web component needed — just apply classes directly.

```html
<!-- 2, 3, or 4 equal columns -->
<div class="wf-grid wf-grid--2">...</div>
<div class="wf-grid wf-grid--3">...</div>
<div class="wf-grid wf-grid--4">...</div>

<!-- Vertical stack with consistent gap -->
<div class="wf-stack">...</div>

<!-- Horizontal row, vertically centered -->
<div class="wf-row">...</div>
<div class="wf-row wf-row--spread">...</div>  <!-- space-between -->
```

For asymmetric layouts, span columns with inline styles:
```html
<div class="wf-grid wf-grid--3">
  <div style="grid-column: span 2;">Main content</div>
  <div>Sidebar content</div>
</div>
```

In React, the same classes work, plus you get wrapper components:
```jsx
<Grid cols={3}>...</Grid>
<Stack>...</Stack>
<Row spread>...</Row>
```

### Main Header

A flex row for page title + action buttons:

```html
<div class="wf-main__header">
  <div>
    <h1 class="wf-h2">Page Title</h1>
  </div>
  <div class="wf-row">
    <wf-button>Cancel</wf-button>
    <wf-button variant="primary">Save</wf-button>
  </div>
</div>
```

---

## Component Reference

### Buttons

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| Button | `<wf-button>` | `variant` (primary, secondary, ghost, destructive), `size` (sm, lg), `disabled` |
| ButtonGroup | `<wf-button-group>` | `items` (comma-separated labels) |
| ButtonTab | `<wf-button-tab>` | `items`, `active` (0-based index) |

**HTML examples:**
```html
<button class="wf-button wf-button--primary">Save</button>
<button class="wf-button wf-button--ghost wf-button--sm">Cancel</button>
<wf-button-group items="Day,Week,Month"></wf-button-group>
<wf-button-tab items="Overview,Details,History" active="0"></wf-button-tab>
```

Note: `<wf-button>` replaces itself with a native `<button>` on render. For full control, you can write `<button class="wf-button wf-button--primary">` directly.

**React:**
```jsx
<Button variant="primary">Save</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<ButtonGroup items={['Day', 'Week', 'Month']} />
<ButtonTab items={['Overview', 'Details', 'History']} active={0} onChange={i => ...} />
```

### Form Controls

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| Input | `<wf-input>` | `label`, `placeholder`, `value`, `error`, `helper`, `type` |
| Textarea | `<wf-textarea>` | `label`, `placeholder`, `rows` (default 4) |
| Select | `<wf-select>` | `placeholder`, `value` |
| Search | `<wf-search>` | `placeholder` |
| DatePicker | `<wf-datepicker>` | `value` |
| Checkbox | `<wf-checkbox>` | `label`, `checked` (boolean attr) |
| Radio | `<wf-radio>` | `label`, `selected` (boolean attr) |
| Toggle | `<wf-toggle>` | `label`, `on` (boolean attr) |
| Dropdown | `<wf-dropdown>` | `items`, `label` (trigger text) |
| Slider | `<wf-slider>` | `min`, `max`, `value`, `label`, `disabled` |

**HTML examples:**
```html
<wf-input label="Email" placeholder="you@example.com" error="Required"></wf-input>
<wf-textarea label="Notes" rows="6"></wf-textarea>
<wf-select placeholder="Choose..."></wf-select>
<wf-search placeholder="Search recipes..."></wf-search>
<wf-datepicker value="Jun 10, 2026"></wf-datepicker>
<wf-checkbox label="Remember me" checked></wf-checkbox>
<wf-radio label="Option A" selected></wf-radio>
<wf-toggle label="Dark mode" on></wf-toggle>
<wf-dropdown items="Edit,Duplicate,Delete" label="Actions"></wf-dropdown>
<wf-slider label="Confidence" min="0" max="100" value="75"></wf-slider>
```

Checkbox, radio, and toggle are interactive — clicking toggles their visual state. Dropdown opens/closes its menu on click.

**React:**
```jsx
<Input label="Email" placeholder="you@example.com" error="Required" />
<Checkbox label="Remember me" checked onChange={val => ...} />
<Toggle label="Dark mode" on onChange={val => ...} />
<Dropdown items={['Edit', 'Duplicate', 'Delete']} label="Actions" />
```

### Data Display

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| Avatar | `<wf-avatar>` | `initials`, `size` (sm, md, lg, xl) |
| Badge | `<wf-badge>` | `filled` (boolean attr); text content is the label |
| Tag | `<wf-tag>` | text content is the label |
| Chip | `<wf-chip>` | `removable` (boolean attr); text content is the label |
| KeyValuePair | `<wf-kv>` | `key`, `value` |
| ListItem | `<wf-list-item>` | `title`, `subtitle`, `trailing` |
| Progress | `<wf-progress>` | `value` (0–100) |
| DiffStat | `<wf-diffstat>` | `additions`, `deletions` |
| Table | `<wf-table>` | `rows`, `cols`, `headers` (comma-separated) |
| DataGrid | `<wf-data-grid>` | `rows`, `cols`, `headers` (comma-separated); adds toolbar |

**HTML examples:**
```html
<wf-avatar initials="AC" size="lg"></wf-avatar>
<wf-badge filled>v2.4.1</wf-badge>
<wf-tag>Java</wf-tag>
<wf-chip removable>Filter</wf-chip>
<wf-kv key="Author" value="Alice Chen"></wf-kv>
<wf-list-item title="Spring Boot Migration" subtitle="Java" trailing="2m ago"></wf-list-item>
<wf-progress value="75"></wf-progress>
<wf-diffstat additions="24" deletions="8"></wf-diffstat>
<wf-table rows="5" cols="4" headers="Name,Status,Role,Date"></wf-table>
<wf-data-grid rows="5" cols="3" headers="Recipe,Status,Date"></wf-data-grid>
```

Tables and data grids auto-fill with sample data (names, statuses, dates) when no content is provided. In React, the `Table` and `DataGrid` components also accept a `data` prop (array of arrays) for real content:

```jsx
<Table headers={['Name', 'Role']} data={[['Alice', 'Engineer'], ['Bob', 'Designer']]} />
```

### Navigation

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| Navbar (top bar) | `<wf-navbar>` | `org`, `search`, `actions` (comma-separated glyphs), `avatar` (initials) |
| Sidebar (rail) | `<wf-sidebar>` | `items` (`Label\|icon` pairs, comma-separated), `active` (0-based index), `home`, `home-icon`, `tenant`, `title` |
| Logo | `<wf-logo>` | `text` (default "Moderne"), `size` (sm, md, lg) |
| Breadcrumb | `<wf-breadcrumb>` | `items` (comma-separated) |
| Tabs | `<wf-tabs>` | `items`, `active` (0-based index) |
| Pagination | `<wf-pagination>` | `pages`, `active` (1-based page number) |

**Rail items** use a pipe-separated `Label|icon` shape so each item can render an icon above its label. Icon characters are stand-ins for Neo's Lucide icons. The active rail item bolds its label and highlights the icon pill — mirroring Neo's `Body/Navigation/selected` text style and `buttons/navigation active` color token.

```html
<wf-sidebar
  home="Moderne"
  items="Moddy|sparkles,DevCenter|pie-chart,Trigrep|search,Artifacts|package,Marketplace|globe,Builder|blocks,Activity|history,Changelog|activity"
  active="0"
  tenant="MOD">
</wf-sidebar>

<wf-navbar
  org="Moderne, Inc."
  search="Search recipes, repos, runs…"
  actions="✦,?,◐"
  avatar="AC">
</wf-navbar>

<wf-breadcrumb items="Home,Recipes,Spring Boot Migration"></wf-breadcrumb>
<wf-tabs items="Overview,Code Changes,History" active="0"></wf-tabs>
<wf-pagination pages="12" active="3"></wf-pagination>
```

**React** sidebar items accept either a string or `{ label, icon }`:

```jsx
<Sidebar
  home="Moderne"
  items={[
    { label: 'Dashboard', icon: '◇' },
    { label: 'Recipes', icon: '▤' },
    'Settings',
  ]}
  active={0}
  tenant="MOD"
/>

<Navbar org="Moderne, Inc." search="Search…" actions={['✦', '?', '◐']} avatar="AC" />
```

The legacy `brand` + text `items` props on Navbar still work for documentation/catalog pages that need a simple text link list (see `examples/components.html`), but new product prototypes should keep primary nav in the rail.

### Feedback

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| Alert | `<wf-alert>` | `variant` (info, success, warning, error), `title`; text content is the message |
| Banner | `<wf-banner>` | text content is the message |
| Toast | `<wf-toast>` | text content is the message |
| Modal | `<wf-modal>` | `title`, `open` (boolean attr) |
| Spinner | `<wf-spinner>` | `size` (sm, md, lg) |
| Tooltip | `<wf-tooltip>` | `content` (tooltip text); wraps its child content |
| Skeleton | `<wf-skeleton>` | `variant` (text, heading, circle, rect), `width`, `height` |

```html
<wf-alert variant="warning" title="Caution">Check your config.</wf-alert>
<wf-banner>System maintenance tonight at 11pm.</wf-banner>
<wf-toast>Recipe run completed</wf-toast>
<wf-modal title="Confirm Action" open>...</wf-modal>
<wf-spinner size="lg"></wf-spinner>
<wf-tooltip content="More info">Hover me</wf-tooltip>
<wf-skeleton variant="text" width="80%"></wf-skeleton>
```

### Cards & Charts

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| Card | `<wf-card>` | `title`, `footer` (boolean attr); child content fills the body |
| StatCard | `<wf-stat-card>` | `label`, `value`, `change` |
| Chart | `<wf-chart>` | `title`, `bars` (number of bars) |
| EmptyState | `<wf-empty-state>` | `title`, `message`, `action` (button label) |

```html
<wf-card title="Details" footer>
  <p>Card body content</p>
</wf-card>

<wf-stat-card label="Total Recipes" value="247" change="+12 this week"></wf-stat-card>
<wf-chart title="Weekly Runs" bars="7"></wf-chart>
<wf-empty-state title="No results" message="Try a different search" action="Reset"></wf-empty-state>
```

If you omit child content from a `<wf-card>`, it renders placeholder lines automatically.

### Developer Components

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| CodeSnippet | `<wf-code-snippet>` | `language`, `lines`; text content becomes the code |
| Tree | `<wf-tree>` | `depth`, `items` (items per level) |

```html
<wf-code-snippet language="yaml" lines="8"></wf-code-snippet>
<wf-tree depth="3" items="4"></wf-tree>
```

Without text content, CodeSnippet generates lorem placeholder code. With content:
```html
<wf-code-snippet language="java">
public class App {
  public static void main(String[] args) {
    System.out.println("Hello");
  }
}
</wf-code-snippet>
```

### Primitives

| Component | HTML Tag | Key Attributes / Props |
|---|---|---|
| Icon | `<wf-icon>` | `name` (lucide name, default `layout-dashboard`), `size` (sm, md, lg) |
| Divider | `<wf-divider>` | `dashed` (boolean attr) |
| Placeholder | CSS class | `.wf-placeholder` + `--short`, `--medium`, `--long` |

```html
<wf-icon name="search"></wf-icon>
<wf-icon name="layout-dashboard" size="lg"></wf-icon>
<wf-divider></wf-divider>
<wf-divider dashed></wf-divider>
<div class="wf-placeholder wf-placeholder--long"></div>
```

Icons use [Lucide](https://lucide.dev) — the same set used in `moderneui` and `neodesign`. Names are kebab-case (`chevron-down`, `bar-chart-2`, `git-commit`). Available out of the box: `activity`, `alert-circle`, `alert-triangle`, `bar-chart-2`, `bell`, `blocks`, `book-open`, `calendar`, `check`, `check-circle`, `chevron-down`/`-left`/`-right`/`-up`, `circle`, `columns`, `copy`, `diamond`, `download`, `ellipsis-vertical`, `external-link`, `eye`, `file`, `file-code`, `filter`, `folder`, `folder-git`, `git-commit`, `git-pull-request`, `globe`, `help-circle`, `history`, `home`, `inbox`, `info`, `layers`, `layout-dashboard`, `mail`, `message-circle`, `more-horizontal`, `package`, `pie-chart`, `play`, `play-circle`, `plus`, `refresh-cw`, `rocket`, `search`, `settings`, `share`, `sparkles`, `users`, `x`, `x-circle`, `zap`. To add more, drop the path markup into `LUCIDE_ICONS` in `wireframe-kit.js` (and `wireframe-kit.jsx`). Unknown names render as literal text so glyph passthrough still works.

The `<wf-sidebar>` default `items` mirrors **trigrep.html**'s nav set (Moddy/DevCenter/Trigrep/Artifacts/Marketplace/Builder/Activity/Changelog) so the rail looks like the real Moderne shell. Override `items` to swap in your own labels and icons. The `<wf-navbar org>` selector uses `users` (matching trigrep's people-figure org glyph).

### Typography Classes

Apply these to any element:

| Class | Effect |
|---|---|
| `.wf-h1` | 28px heading |
| `.wf-h2` | 22px heading |
| `.wf-h3` | 18px heading |
| `.wf-h4` | 15px heading |
| `.wf-text-light` | Muted text color |
| `.wf-text-sm` | 13px font size |
| `.wf-text-xs` | 11px font size |
| `.wf-mono` | Monospace font (Fira Code) |
| `.wf-truncate` | Ellipsis overflow |
| `.wf-sr-only` | Screen-reader only |
| `.wf-crosshatch-bg` | Crosshatch pattern fill |
| `.wf-dots-bg` | Dot pattern fill |

---

## Theming

All visual tokens are CSS custom properties on `:root`. Override them to customize.

### Colors (cool grays)

| Property | Default | Purpose |
|---|---|---|
| `--wf-bg` | `#f5f5f5` | Page background |
| `--wf-surface` | `#ffffff` | Card/component background |
| `--wf-fill` | `#ebebeb` | Subtle fills (table headers, hovers) |
| `--wf-fill-dark` | `#e0e0e0` | Stronger fills (active states) |
| `--wf-border` | `#c2c2c2` | Default borders |
| `--wf-border-dark` | `#9e9e9e` | Emphasized borders |
| `--wf-text` | `#333333` | Primary text |
| `--wf-text-light` | `#757575` | Secondary text |
| `--wf-text-lighter` | `#b0b0b0` | Placeholder/disabled text |
| `--wf-accent` | `#616161` | Accent color |
| `--wf-highlight` | `#e8e8e8` | Highlight background |

### Semantic colors (muted)

Used for status indicators, alerts, and validation. Intentionally desaturated to stay sketch-appropriate.

| Property | Default | Purpose |
|---|---|---|
| `--wf-info` / `-light` / `-dark` | `#8e96a0` / `#eceef1` / `#5f6670` | Informational states |
| `--wf-success` / `-light` / `-dark` | `#8e9a8f` / `#ecf0ec` / `#5f6e60` | Success states |
| `--wf-warning` / `-light` / `-dark` | `#9e978a` / `#f0eee8` / `#6a6458` | Warning states |
| `--wf-error` / `-light` / `-dark` | `#9e8e8e` / `#f0ecec` / `#6a5858` | Error states |

### Typography

| Property | Default |
|---|---|
| `--wf-font` | `'Handlee', cursive` |
| `--wf-font-mono` | `'Fira Code', monospace` |
| `--wf-font-size-xs` | `11px` |
| `--wf-font-size-sm` | `13px` |
| `--wf-font-size-md` | `15px` |
| `--wf-font-size-lg` | `18px` |
| `--wf-font-size-xl` | `22px` |
| `--wf-font-size-2xl` | `28px` |

### Sketch Effect

| Property | Default | Purpose |
|---|---|---|
| `--wf-radius` | `3px 4px 3px 5px` | Slightly irregular corners |
| `--wf-radius-lg` | `5px 7px 6px 8px` | Larger irregular corners |
| `--wf-shadow` | `1px 2px 0px rgba(0,0,0,0.06)` | Subtle offset shadow |
| `--wf-shadow-lg` | `2px 3px 0px rgba(0,0,0,0.08)` | Larger offset shadow |
| `--wf-crosshatch` | SVG data URI | Crosshatch pattern fill |
| `--wf-dots` | SVG data URI | Dot pattern fill |

### Spacing

| Property | Value |
|---|---|
| `--wf-space-xs` | `4px` |
| `--wf-space-sm` | `8px` |
| `--wf-space-md` | `16px` |
| `--wf-space-lg` | `24px` |
| `--wf-space-xl` | `32px` |
| `--wf-space-2xl` | `48px` |

### Neo-aligned semantic tokens

The kit includes a layer of semantic tokens that mirror Neo's Figma variable collections. These use the same naming hierarchy as Neo, making the upgrade path explicit. Each references the underlying wireframe primitive — when you switch to Neo, replace these values with Neo's resolved tokens.

| Wireframe token | Maps to Neo variable | Collection |
|---|---|---|
| `--wf-surface-page` | `surfaces/page` | Color |
| `--wf-surface-chrome` | `surfaces/page` (rail + topbar share page color) | Color |
| `--wf-surface-card` | `surfaces/card` | Color |
| `--wf-surface-hover` | `surfaces/list-hover` | Color |
| `--wf-surface-nav-active` | `buttons/navigation active` | Color |
| `--wf-surface-tooltip` | `surfaces/tooltip` | Color |
| `--wf-surface-code` | `code/background` | Color |
| `--wf-surface-input` | `input/background` | Color |
| `--wf-surface-datagrid` | `surfaces/data-grid/background` | Color |
| `--wf-border-primary` | `border/primary` | Color |
| `--wf-border-secondary` | `border/secondary` | Color |
| `--wf-border-focus` | `border/focus` | Color |
| `--wf-type-body` | `typography/body` | Color |
| `--wf-type-secondary` | `typography/legal` | Color |
| `--wf-type-error` | `typography/error` | Color |
| `--wf-type-success` | `typography/success` | Color |
| `--wf-type-warning` | `typography/warning` | Color |
| `--wf-type-link` | `typography/link/default` | Color |
| `--wf-type-navigation` | `typography/navigation/default` | Color |
| `--wf-type-navigation-selected` | `typography/navigation/selected` | Color |
| `--wf-shadow-card` | `Card/Shadow` | Shadow |
| `--wf-shadow-modal` | `Modal/Shadow` | Shadow |
| `--wf-shadow-dropdown` | `Dropdown/Shadow` | Shadow |
| `--wf-shadow-drawer` | `Drawer/Shadow` | Shadow |
| `--wf-type-size-sm` | `Font size/sm` | Type primitives |
| `--wf-type-size-h2`–`h6` | `Font size/h2`–`h6` | Type primitives |

Use the semantic tokens in new components when possible. They make find-and-replace straightforward during the Neo upgrade.

### Example Override

```html
<style>
  :root {
    --wf-font: 'Comic Neue', cursive;   /* different sketch font */
    --wf-bg: #f0f4f8;                    /* cooler background */
    --wf-border: #b0bec5;               /* blue-gray borders */
  }
</style>
```

---

## Templates

Two example templates are included in `examples/`. Use them as starting points.

### Dashboard (`examples/dashboard.html`)

A Moderne-style dashboard with navbar, sidebar, stat cards (4-column grid), tabbed navigation, charts (2-column grid), a banner notification, and a data grid with pagination. Good starting point for: overview pages, analytics views, admin dashboards.

### Recipe Detail (`examples/recipe-detail.html`)

A detail page with breadcrumb navigation, tags and badges, a dropdown action menu, tabbed content, a 2+1 column layout (main content + sidebar), code snippets with diffstats, key-value metadata, form controls, and an activity feed. Good starting point for: detail views, settings pages, profile pages.

### Using Templates

Copy the template and modify:

1. Update the `<wf-navbar>` brand and items
2. Change `<wf-sidebar>` items to match your navigation
3. Replace component content (stat card labels/values, table headers, etc.)
4. Add or remove sections as needed

---

## Upgrade Path to Neo

The wireframe kit is designed to make the transition to Neo (Moderne's production design system) as smooth as possible.

### API Alignment

Components accept the same prop names Neo uses wherever possible. For example, `variant="primary"` on buttons, `title` on cards, and `items`/`active` on tabs all map directly to Neo's API. When you're ready to upgrade, many components can be swapped by changing the import source and removing wireframe-only convenience props.

### Wireframe-Only Props

Some props exist only in the wireframe kit for quick prototyping. These have no Neo equivalent and should be removed during upgrade:

- `rows`, `cols` on Table/DataGrid (Neo expects real data)
- `lines` on CodeSnippet (Neo expects real code content)
- `bars` on Chart (Neo uses real charting libraries)
- `depth`, `items` on Tree (Neo expects real tree data)

### Upgrade Checklist

1. Replace `wireframe-kit.css` with Neo's stylesheet
2. Change imports from `./wireframe-kit` to Neo's package
3. Replace `<wf-*>` custom elements with Neo React components (or remove the `.js` import)
4. Remove wireframe-only convenience props (rows, cols, lines, bars, depth)
5. Supply real data where the kit was generating placeholder content
6. Replace `wf-kit` body class and `wf-*` layout classes with Neo equivalents
7. Switch font from Handlee to Inter (Neo's default)

---

## Contributor Guide

### Adding a New Component

1. **Pick a name.** Follow the `wf-*` prefix convention. Check Neo's Storybook for the canonical name.

2. **Add CSS.** In `wireframe-kit.css`, add styles under a new section comment. Use existing custom properties for colors, spacing, borders, and radii. Follow the cool-gray palette — use semantic color variables (`--wf-info`, `--wf-success`, `--wf-warning`, `--wf-error`) for status-related styling, but no brand or accent colors.

   ```css
   /* --- MyComponent --- */
   .wf-my-component {
     border: var(--wf-border-style);
     border-radius: var(--wf-radius);
     padding: var(--wf-space-md);
     background: var(--wf-surface);
     box-shadow: var(--wf-shadow);
     font-size: var(--wf-font-size-sm);
   }
   ```

3. **Add the web component.** In `wireframe-kit.js`, create a class extending `WfBase` and implement `render()`. Use the `h()` helper to create DOM elements. Register it in the `components` map at the bottom.

   ```js
   class WfMyComponent extends WfBase {
     render() {
       const label = this.attr('label', 'Default');
       this.innerHTML = '';
       this.className = 'wf-my-component';
       this.append(h('span', {}, label));
     }
   }

   // Add to the components map:
   'wf-my-component': WfMyComponent,
   ```

4. **Add the React component.** In `wireframe-kit.jsx`, add a named export. Use `cn()` for class composition. Use `useState` for interactive state.

   ```jsx
   export const MyComponent = ({ label = 'Default', className, ...props }) => (
     <div className={cn('wf-my-component', className)} {...props}>
       <span>{label}</span>
     </div>
   );
   ```

5. **Add to the catalog.** In `index.html`, add an entry in the appropriate category section, including a preview and code snippet.

6. **Add to examples.** If the component is commonly used, include it in the example templates.

### Naming Conventions

- CSS classes: `wf-component`, `wf-component__child`, `wf-component--variant` (BEM)
- Web component tags: `<wf-component>` (lowercase, hyphenated)
- React exports: `PascalCase` (e.g., `StatCard`, `ButtonGroup`, `CodeSnippet`)
- Attributes/props: `camelCase` in React, `lowercase` in HTML attributes

### Style Rules

To maintain the sketch aesthetic:

- **Borders:** Always use `var(--wf-border-style)` (1.5px solid) or reference `--wf-border` / `--wf-border-dark`
- **Border radius:** Use `var(--wf-radius)` (slightly irregular: 3px 4px 3px 5px) or `var(--wf-radius-lg)` — never use perfectly round corners on rectangles
- **Shadows:** Use `var(--wf-shadow)` — the offset (1px 2px) gives a hand-drawn feel
- **Colors:** Stay within the cool gray palette. For semantic colors, use the muted variables: `var(--wf-success)`, `var(--wf-error)`, `var(--wf-warning)`, `var(--wf-info)`. No brand or bright accent colors.
- **Font:** Components inherit `var(--wf-font)` (Handlee). Explicitly set `font-family: var(--wf-font)` on elements that create their own stacking context (buttons, inputs)
- **Fill patterns:** Use `var(--wf-crosshatch)` or `var(--wf-dots)` as `background-image` for decorative fills (avatars, progress bars, chart bars, empty state icons)

### API Design Rules

- **Generous defaults.** Every prop should have a sensible default. A component with zero attributes should render something useful.
- **Mirror Neo's props.** Use the same prop names as Neo wherever possible (variant, size, title, items, active, etc.).
- **Wireframe convenience props.** For prototype speed, add props like `rows`, `cols`, `lines` that generate placeholder content. These won't exist in Neo.
- **HTML attributes = strings.** Web component attributes are always strings. Parse numbers with `numAttr()`, booleans with `boolAttr()`.
- **React props = native types.** Accept arrays (not comma-separated strings), numbers, and booleans natively. Spread `...props` for flexibility.

### Testing Changes

Open `index.html` in a browser (or via a local server) to see all components rendered. The catalog page uses Inter for its chrome and only renders component previews in the Handlee wireframe font.

For a quick local server:
```bash
cd wireframe-kit
python3 -m http.server 8080
# Open http://localhost:8080
```

### File Checklist for New Components

- [ ] CSS styles added to `wireframe-kit.css`
- [ ] Web component class added to `wireframe-kit.js`
- [ ] Component registered in the `components` map in `wireframe-kit.js`
- [ ] React component exported from `wireframe-kit.jsx`
- [ ] Entry added to `index.html` catalog with preview and code
- [ ] Added to relevant example templates if commonly used

---

## Assemblies

Assemblies compose multiple wireframe components into structural layouts that mirror Neo's page-level patterns. Each assembly generates placeholder content by default, so dropping a single tag produces a realistic wireframe.

### Card Table Layout

A card-like table where each row contains stacked content (title, metadata badges, secondary info). Single outer border with radius, horizontal dividers, no vertical cell borders.

| Attribute | Default | Description |
|---|---|---|
| `title` | `"Results"` | Header title |
| `rows` | `5` | Number of sample rows |

```html
<wf-card-table title="Recipe Runs" rows="6"></wf-card-table>
```

**React:**
```jsx
<CardTable title="Recipe Runs" rows={6} />
// or with custom rows:
<CardTable title="Results">
  <CardTableRow title="My task" badges={[{label:'Done', variant:'success'}]} meta="Alice · Jun 1" />
</CardTable>
```

**Neo mapping:** Assemblies → Card Table Layout (uses DataGridPro, Badge, Button, Checkbox, Stack)

### Filter Results Layout

Filter bar (chips + search) above a data grid with a summary/pagination footer. Primary data display structure for filtered tabular data.

| Attribute | Default | Description |
|---|---|---|
| `rows` | `5` | Number of table rows |
| `cols` | `4` | Number of columns |
| `headers` | `"Repository,Status,Changes,Date"` | Column headers |
| `filters` | `"Status,Language,Organization"` | Filter chip labels |

```html
<wf-filter-results rows="8" headers="Name,Status,Type,Date" filters="Status,Type"></wf-filter-results>
```

**React:**
```jsx
<FilterResults filters={['Status', 'Language']} rows={8} headers="Name,Status,Type,Date" />
```

**Neo mapping:** Assemblies → Filter Results Layout (uses DataGrid, FilterChip, SearchChip, Badge, Pagination)

### Data Table Layout

Full-featured data grid with toolbar (search, filter, column visibility, bulk actions), sortable column headers, and pagination footer.

| Attribute | Default | Description |
|---|---|---|
| `rows` | `8` | Number of table rows |
| `cols` | `5` | Number of columns |
| `headers` | `"Name,Status,Type,Modified,Actions"` | Column headers |

```html
<wf-data-table-layout rows="10" headers="User,Role,Email,Last Login,Status"></wf-data-table-layout>
```

**React:**
```jsx
<DataTableLayout rows={10} headers="User,Role,Email,Last Login,Status" />
```

**Neo mapping:** Assemblies → Data Table Layout (uses DataGrid, Toolbar, SearchInput, FilterButton, Checkbox, Badge, Pagination)

### Changelog Feed Layout

Vertically stacked feed of timestamped events with icons, type badges, metadata, and navigation links. For activity logs and audit trails.

| Attribute | Default | Description |
|---|---|---|
| `entries` | `5` | Number of feed entries |
| `no-filters` | — | Boolean: hide the filter bar |

```html
<wf-changelog-feed entries="8"></wf-changelog-feed>
<wf-changelog-feed entries="3" no-filters></wf-changelog-feed>
```

**React:**
```jsx
<ChangelogFeed entries={8} />
<ChangelogFeed showFilters={false}>
  <ChangelogEntry icon="▶" type="Recipe Run" title="Migration completed" meta="Alice · 3 repos" timestamp="2h ago" />
</ChangelogFeed>
```

**Neo mapping:** Assemblies → Changelog Feed Layout (uses Card, Badge, Icon, Timestamp, FilterChip, EmptyState, Skeleton)

---

## Compositions

Compositions wire assemblies together with specific data schemas and state bindings. They represent complete Moderne product views.

### Recipe Execution Results

Instantiates FilterResultsTable within CardTableLayout. Shows a summary header with recipe name, aggregate stats, status badge, and action buttons, plus a tab bar and filtered results table.

| Attribute | Default | Description |
|---|---|---|
| `recipe` | `"Migrate to Java 17"` | Recipe display name |
| `status` | `"completed"` | Status: completed, running, failed, partially_failed |
| `repos` | `24` | Repository count |
| `changes` | `18` | Change count |
| `errors` | `2` | Error count |

```html
<wf-recipe-results recipe="Upgrade Spring Boot" status="running" repos="42" changes="30" errors="0"></wf-recipe-results>
```

**React:**
```jsx
<RecipeResults recipe="Upgrade Spring Boot" status="running" repos={42} changes={30} errors={0} />
```

**Neo mapping:** Compositions → Recipe Execution Results (uses CardTableLayout + FilterResultsTable + Loading + EmptyStates + Notifications)

### Empty State Activation

Onboarding variant of EmptyState with illustration, headline, description, prerequisite checklist, primary CTA, and documentation links. For first-use flows.

| Attribute | Default | Description |
|---|---|---|
| `headline` | `"Welcome to Moderne"` | Welcome heading |
| `description` | _(long default)_ | Explanatory text |
| `cta` | `"Run your first recipe"` | Primary button label |
| `illustration` | `"◈"` | Icon/emoji in the illustration circle |
| `prereqs` | `"Connect an SCM:done,..."` | Prerequisite list (label:state pairs) |

```html
<wf-activation headline="Get Started" cta="Connect your SCM" prereqs="Sign up:done,Connect SCM:pending"></wf-activation>
```

**React:**
```jsx
<Activation
  headline="Get Started"
  cta="Connect your SCM"
  prereqs={[{ label: 'Sign up', done: true }, { label: 'Connect SCM', done: false }]}
  links={[{ label: 'Documentation' }]}
/>
```

**Neo mapping:** Compositions → Empty State Activation (uses EmptyStates + Loading + Navigation + Notifications)
