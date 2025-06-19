# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Serendie Web is the documentation website for the Serendie Design System (SDS), an open design system by Mitsubishi Electric. Built with Astro, React, and TypeScript, it showcases UI components and design guidelines.

**Key URLs:**

- Production: https://serendie.design/
- Staging: https://dev.serendie-web.pages.dev/ (Basic Auth protected)
- Storybook: https://storybook.serendie.design/ (separate repository)

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (builds Panda CSS first)

# Building
npm run build            # Full production build
npm run build:panda      # Regenerate Panda CSS styles and types
npm run build:tokens     # Rebuild design tokens from Style Dictionary

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format code with Prettier
```

## Architecture & Key Concepts

### Tech Stack

- **Framework**: Astro 4.x with React 18 integration
- **Styling**: PandaCSS with @serendie/ui preset
- **Content**: MDX for component documentation
- **Build**: Vite with custom SVG handling
- **Deployment**: Cloudflare Pages

### Project Structure

```
src/
├── components/         # React/Astro components
├── content/           # MDX documentation files
│   ├── components/    # UI component docs
│   └── pages/        # General documentation
├── layouts/          # Page layouts
├── pages/            # Astro routes
└── sampleCode/       # Component code examples

styled-system/         # Generated PandaCSS output
tokens/               # Design token configuration
```

### Design System Integration

- **Components**: Import from `@serendie/ui`
- **Icons**: Import from `@serendie/symbols`
- **Tokens**: Managed via Style Dictionary, accessible through PandaCSS
- **Themes**: Multiple themes (asagi, konjo, kurikawa, sumire, tsutsuji)

### Development Workflow

1. **Adding/Modifying Components Documentation**:

   - Edit MDX files in `src/content/components/`
   - Add code examples in `src/sampleCode/`
   - Component demos use the actual `@serendie/ui` components

2. **Working with Styles**:

   - Use PandaCSS patterns (`css()`, `styled()`)
   - Tokens are available through the styled-system
   - Run `npm run build:panda` after config changes

3. **Managing Design Tokens**:

   - Edit token files in `tokens/data/`
   - Run `npm run build:tokens` to regenerate
   - Tokens are transformed for both CSS and PandaCSS

4. **Content Management**:
   - Content collections defined in `src/content/config.ts`
   - Frontmatter controls navigation and metadata
   - MDX allows React components in documentation

### Important Configuration Files

- `astro.config.mjs` - Astro setup with React/MDX
- `panda.config.ts` - PandaCSS with Serendie preset
- `tokens/build.js` - Style Dictionary token build
- `vite.config.ts` - Vite plugins for SVG handling

### Environment Variables

- `BASE_PATH` - For subpath deployment
- `SITE_DOMAIN` - Custom domain override
- `CF_PAGES_BRANCH` - Cloudflare deployment branch
- `CF_PAGES_URL` - Cloudflare deployment URL

### Key Dependencies

- `@serendie/ui` - Component library (v1.0.1)
- `@serendie/design-token` - Design tokens
- `@ark-ui/react` - Headless UI primitives
- `framer-motion` - Animations
- `embla-carousel-react` - Carousel component

### Deployment Notes

- Main branch → Production (serendie.design)
- Dev branch → Staging (dev.serendie-web.pages.dev)
- `_redirects` file controls Cloudflare Pages redirects
- No test suite currently implemented

### Development Server

The user typically runs `npm run dev` in a separate terminal window. You don't need to start the dev server unless specifically asked.

### Task Completion Notification

When you complete a task, run this command to notify the user with a loud ping sound:

```bash
afplay /System/Library/Sounds/Hero.aiff
```
