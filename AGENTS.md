# agents.md — Architecture Blueprint & Decision Support Guide

> This document serves two purposes:
> 1. **Blueprint** — the authoritative reference for how this project is designed and why.
> 2. **Decision Support** — a guided framework to help you make consistent, architecturally sound decisions during development.

---

## Project Overview

A **Personal Information Management System** built for a nursing student, deployed as a static site on GitHub Pages. It is built with **Astro** and **Daisy UI** and structured as an **application shell** that renders hierarchical content from a `content/` folder containing Markdown (`.md`), MDX (`.mdx`), and Astro (`.astro`) files.

### Content Types Planned
- Study notes and lecture content
- Reference material
- Quizzes
- Journal entries

---

## Core Architecture Principles

1. **Content drives structure.** The folder hierarchy inside `content/` is the single source of truth for navigation, menus, and routing.
2. **Format is interchangeable.** `.md`, `.mdx`, and `.astro` files are treated identically as content containers. Format is a stylistic choice, not a structural one.
3. **Metadata controls order.** Filesystem alphabetical order is never used for navigation. Order is always driven by metadata.
4. **Index files are always first.** Any `index.md`, `index.mdx`, or `index.astro` inside a folder is always the first item in that folder's navigation sequence, by default.
5. **Components are scoped.** A folder named `components/` at any level is excluded from navigation and treated as a component library available to that folder and all its descendants.
6. **Roots are declared, not assumed.** Navigation chains are defined by a `root: true` flag in a `config.json` file. The app walks up the tree to find the nearest declared root.
7. **Content is interlinked like a wiki.** Every content page should participate in a deliberate internal link web (parent, sibling, related-topic, and reference links), not exist as an isolated leaf.

---

## Folder Structure

```
project-root/
├── src/
│   └── pages/
│       └── maintenance.astro       ← Content tree validator/debug page
├── content/
│   ├── config.json                 ← Optional: declare this as a global root
│   ├── index.md                    ← Global home
│   ├── pharmacology/
│   │   ├── config.json             ← Sort order, optional root declaration
│   │   ├── index.mdx               ← Section home (always first)
│   │   ├── components/             ← Scoped components (excluded from nav)
│   │   │   └── DosageCalculator.astro
│   │   ├── drug-interactions.md
│   │   └── antibiotics.md
│   ├── anatomy/
│   │   ├── config.json
│   │   ├── index.md
│   │   └── ...
│   └── quizzes/
│       ├── config.json
│       ├── index.astro
│       └── ...
```

---

## Metadata Schema (`config.json`)

Each subfolder may contain a `config.json`. Fields:

```json
{
  "root": false,
  "order": [
    "index",
    "drug-interactions",
    "antibiotics"
  ]
}
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `root` | boolean | No | If `true`, this folder is the home anchor for its navigation chain. Default: `false`. |
| `order` | string[] | No | List of filenames (without extensions) in desired display order. Index file is always prepended automatically. |

### Rules
- If `order` is omitted, files are sorted alphabetically (except index, which is always first).
- `index` in the `order` array is optional—it will always be first regardless.
- A folder with no `config.json` is valid and will use defaults.

---

## Navigation Chains

### How Roots Work
When a user is on a content page and presses **Home**, the app:
1. Starts at the current file's folder.
2. Walks up the directory tree, checking each `config.json` for `"root": true`.
3. The first `config.json` found with `root: true` defines the home destination for that chain.
4. If no root is found, the global `content/` root is used.

### Previous / Next Navigation
- Built from the fully resolved, sorted content tree.
- Respects `config.json` order at every level.
- Walks across folder boundaries sequentially (depth-first traversal).
- Navigation stays within the same chain unless you've configured otherwise.

### Multiple Chains
You can have independent navigation chains by declaring roots at different levels. Example:
- `content/pharmacology/config.json` → `"root": true` → Pharmacology has its own Home.
- `content/anatomy/config.json` → `"root": true` → Anatomy has its own Home.

---

## Component Scoping

- Any folder named exactly `components/` is automatically excluded from navigation.
- Content files within the same folder or any descendant folder can import from it.
- If a component is needed at a wider scope, move the `components/` folder higher up the hierarchy.
- There is no special config needed—the name `components` is the convention.

---

## Wiki Link Web Strategy

Treat each content document as a node in a wiki graph.

### Link Types to Maintain

- **Parent links**: Link back to the section `index` page.
- **Sibling links**: Link to adjacent concepts in the same folder when meaningful.
- **Related links**: Link to supporting content in other folders (cross-chain links).
- **Reference links**: Link to canonical definitions, protocols, or source notes.

### Authoring Rules

- Every non-index content page should include at least one parent link and at least two meaningful internal links.
- Section `index` pages should act as hubs and include links to all major child pages in that section.
- Prefer contextual links inside paragraphs over large "see also" dumps.
- Use descriptive anchor text that explains destination context (avoid generic text like "click here").
- Avoid orphan pages: if a page has no inbound links from at least one index or related page, add one.

### Cross-Chain Convention

- Cross-chain links are allowed and encouraged when conceptually relevant (for example, pharmacology to anatomy, or anatomy to quiz review).
- When linking across chains, include a short context phrase around the link so users understand why they are leaving the current chain.
- Preserve local Previous/Next/Home behavior even when cross-chain links exist.

---

## Maintenance Utility (`maintenance.astro`)

A local/staging-only page that:
- Renders the full content tree visually.
- Highlights all declared roots and their chains.
- Flags missing `index` files in subfolders.
- Flags folders with no `config.json` (warns of alphabetical fallback).
- Shows the resolved Previous / Next / Home for every document.
- Identifies any orphaned documents with no clear chain.

> **Build this early.** It is your primary tool for keeping the content structure clean as you develop.

---

## Build & Deployment

- **Static generation** via `astro build`.
- **Deployed to GitHub Pages.**
- Automate deployment with a GitHub Actions workflow on push to `main`.
- Use a `develop` branch for content work in progress; merge to `main` when ready.

### Versioning Strategy
- Use **git branches** as your primary versioning mechanism.
- `main` = current stable content.
- `develop` = active content development.
- Feature branches for major content reorganizations.

---

## Decision Support — Questions to Ask During Development

Use these questions whenever you face a design or architecture decision. They are organized by topic.

---

### Metadata & Config

- Does this new field apply to all content types, or only some?
- Is this better as a per-file frontmatter field or a per-folder `config.json` field?
- Will omitting this field cause a build error, or should there be a safe default?
- Is this field something a content author needs to set, or should the app infer it?

---

### Navigation & Routing

- Should this content be part of an existing chain, or does it need its own root?
- Is there a clear `index` file at this level? If not, what should the entry point be?
- Does the Previous/Next flow make sense when walking across this folder boundary?
- Would a user expect Home to go to the section root or the global root here?

---

### Components

- Is this component specific to one content section, or could it be used more broadly?
- If it needs to be used more broadly, how far up the hierarchy should the `components/` folder live?
- Does this component depend on content data, or is it purely presentational?

---

### Content Structure

- Is this a new top-level section, or does it belong inside an existing one?
- Does adding this folder require a new `config.json` to control sort order?
- Will this content have quizzes, reference material, or journal entries associated with it? Should those live alongside it or in a separate branch?

---

### Wiki Linking

- If this page were read alone, which 2-4 pages should it link to next?
- Does this section `index` function as a true hub for all important child pages?
- Are there at least one or two cross-chain links that improve understanding without disrupting navigation?
- Does every new page have at least one inbound path from an index or related page?

---

### Maintenance & Validation

- After restructuring content, have you run the maintenance page to check for orphans or missing roots?
- Are there any folders missing an `index` file?
- Are there any conflicting root declarations at the same level?
- Are there any orphan pages with no inbound links?
- Do section index pages still reflect their current child pages?
- Do cross-chain links still resolve and provide useful context?

---

## Known Open Items (Resolve During Development)

These are areas intentionally left flexible. Revisit them as your content strategy solidifies:

1. **Metadata schema finalization** — Are there additional fields needed beyond `root` and `order`? (e.g., `title`, `description`, `tags`, `draft`)
2. **Quiz content format** — How will quizzes be structured? Will they use a special MDX component, a dedicated Astro component, or a data file?
3. **Journal entry handling** — Should journal entries be navigable content or a separate system?
4. **Cross-chain linking** — If a pharmacology page needs to link to an anatomy reference, what is the convention?
5. **Maintenance page access control** — Should it be excluded from production builds entirely, or gated behind a flag?

---

## Quick Reference Checklist for New Content Sections

When adding a new subfolder to `content/`:

- [ ] Add an `index.md`, `index.mdx`, or `index.astro` as the entry point.
- [ ] Add a `config.json` if you need custom sort order or want to declare a root.
- [ ] Add a `components/` subfolder if this section needs scoped components.
- [ ] Run the maintenance page to verify the section is correctly wired into the nav tree.
- [ ] Confirm Previous/Next flow makes sense at the folder boundaries.

---

*This document is a living reference. Update it as architectural decisions are made and open items are resolved.*