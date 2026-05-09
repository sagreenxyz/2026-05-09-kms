# Nursing Student Personal Information Management System

A static web application built with [Astro](https://astro.build) and [Daisy UI](https://daisyui.com), designed as a personal knowledge base and study tool for nursing students. Content is organized hierarchically and rendered inside an application shell with dynamic, folder-driven navigation.

---

## What This Is

This project is a content-driven application shell that:

- Displays study notes, reference material, quizzes, and journal entries.
- Generates navigation menus automatically from the folder structure inside `content/`.
- Supports hierarchical, ordered navigation with Previous, Next, and Home buttons.
- Allows multiple independent navigation chains within the same site.
- Scopes reusable UI components to the content sections that need them.

For full architectural detail and developer decision support, see [AGENTS.md](./AGENTS.md).

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Astro](https://astro.build) | Static site framework |
| [Daisy UI](https://daisyui.com) | UI component library (Tailwind-based) |
| GitHub Pages | Hosting and deployment |
| GitHub Actions | Automated build and deploy |

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

---

## Project Structure

```
project-root/
├── AGENTS.md                   ← Architecture blueprint & decision guide
├── README.md                   ← This file
├── astro.config.mjs            ← Astro configuration
├── package.json
├── src/
│   ├── layouts/
│   │   └── Shell.astro         ← Application shell (nav, header, footer)
│   ├── components/             ← Global shared components
│   └── pages/
│       └── maintenance.astro   ← Content tree validator (dev/staging only)
└── content/
    ├── config.json             ← Optional global root declaration
    ├── index.md                ← Site home
    └── [sections]/             ← Your content sections (see below)
```

---

## Adding Content

All content lives inside the `content/` folder. Astro reads this folder at build time to generate pages and navigation.

### Supported File Types

`.md`, `.mdx`, and `.astro` files are all treated as interchangeable content containers.

### Adding a New Section

1. Create a subfolder inside `content/`, e.g. `content/pharmacology/`.
2. Add an `index.md`, `index.mdx`, or `index.astro` — this is the section's entry point and always appears first in the menu.
3. Add your content files alongside the index.
4. Optionally add a `config.json` to control sort order or declare a navigation root.

### Controlling Sort Order

By default, files sort alphabetically. To customize the order, add a `config.json` to the folder:

```json
{
  "order": [
    "index",
    "drug-interactions",
    "antibiotics",
    "dosage-calculations"
  ]
}
```

The `index` file is always first regardless of its position in the `order` array.

### Declaring a Navigation Root

To make a section behave as its own self-contained navigation chain (with its own Home button), add `"root": true` to the folder's `config.json`:

```json
{
  "root": true,
  "order": ["index", "chapter-one", "chapter-two"]
}
```

When a user presses Home, the app walks up the folder tree and uses the nearest declared root as the home destination.

### Scoped Components

To add UI components that only apply to a specific section, create a `components/` subfolder inside that section:

```
content/pharmacology/
├── components/
│   └── DosageCalculator.astro  ← Only available within pharmacology
├── index.mdx
└── drug-interactions.md
```

Folders named `components/` are automatically excluded from navigation. If a component needs to be available higher up in the hierarchy, move the `components/` folder to a parent directory.

---

## Navigation

Each content page includes:

- **Previous** — goes to the prior document in the sorted content tree.
- **Next** — goes to the next document in the sorted content tree.
- **Home** — goes to the nearest declared root, or the global root if none is declared.

Navigation walks across folder boundaries depth-first, following your defined sort order.

---

## Maintenance & Validation

During development, visit `/maintenance` in your local or staging environment to:

- View the full content tree.
- Confirm all navigation chains and root declarations.
- Identify missing `index` files.
- See the resolved Previous / Next / Home for every document.
- Catch orphaned content with no clear chain.

> Run this page whenever you add or reorganize content sections.

---

## Deployment

This project deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

### Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, deployed content |
| `develop` | Active content development |
| Feature branches | Major content reorganizations |

Merge `develop` into `main` when content is ready to publish.

---

## Documentation

- **[AGENTS.md](./AGENTS.md)** — Full architecture reference, metadata schema, decision support questions, and open items to resolve during development. Read this before making any structural decisions.

---

## License

Private — personal use only.