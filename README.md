```markdown
# Restaurant Reservation System

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)](https://vuejs.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3-blue)](https://tailwindcss.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive Vue 3 single-page application (SPA) designed for managing restaurant branches and their reservation configurations. This system allows administrators to view active branches, enable inactive ones, edit reservation settings (e.g., duration, available tables, and daily time slots), and toggle reservations globally or per branch. Built with a focus on user experience, accessibility, and maintainability, it integrates seamlessly with a backend REST API for data persistence.

As of October 01, 2025, this project adheres to Vue 3 best practices, including the Composition API, and is production-ready with linting and build optimizations.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Key Implementation Decisions and Rationale](#key-implementation-decisions-and-rationale)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Usage Instructions](#usage-instructions)
- [Development Commands](#development-commands)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features
- **Branch Dashboard**: Displays active branches with key metrics like reference ID, table count, and reservation duration.
- **Branch Activation**: Modal-based multi-select to enable inactive branches for reservations.
- **Reservation Configuration**:
  - Set custom reservation durations (in minutes).
  - Select specific tables per section using a nested multi-select component.
  - Define up to 3 time slots per day (e.g., breakfast, lunch, dinner) with inline editing and "Apply to All Days" propagation.
- **Global Controls**: One-click disable/enable for all reservations.
- **Responsive Design**: Mobile-friendly tables and modals using Tailwind CSS.
- **Accessibility Compliance**: Semantic HTML (`<fieldset>`, `<legend>`), ARIA attributes, keyboard navigation, and focus management (WCAG 2.1 AA).
- **Error Handling**: Optimistic UI updates with console logging for API failures (extensible to toasts).
- **Data Fetching**: Eager loading of nested resources (branches > sections > tables) via API includes.

## Project Structure
The project uses the standard Vue CLI scaffold, emphasizing separation of concerns: views for pages, components for UI reusability, and composables for shared logic. Here's the breakdown:

```
restaurant-reservation-system/
├── public/                          # Static assets served directly
│   ├── index.html                   # App entry template
│   └── favicon.ico                  # App icon
├── src/
│   ├── assets/                      # Global styles and assets
│   │   └── tailwind.css             # Compiled Tailwind utilities
│   ├── components/                  # Reusable Vue components
│   │   ├── Modals/                  # Self-contained modal dialogs
│   │   │   ├── AddBranchesModal.vue # Multi-select for activating branches
│   │   │   ├── EditBranchModal.vue  # Form for branch settings (duration, tables, slots)
│   │   │   ├── Modal.vue            # Base modal wrapper with backdrop
│   │   │   └── TimeSlotField.vue    # Editable time slot inputs per day
│   │   └── MultiSelect.vue          # Custom multi-select dropdown with slots
│   ├── composables/                 # Reusable logic (Vue 3 composables)
│   │   └── api.js                   # API client with fetch and auth token
│   ├── router/                      # Vue Router configuration
│   │   └── index.js                 # Routes (e.g., / for HomeView)
│   ├── views/                       # Route-level components (pages)
│   │   └── HomeView.vue             # Main dashboard with table and modals
│   ├── App.vue                      # Root app component (router-view)
│   └── main.js                      # Bootstrap: Create app, mount, plugins
├── .env.example                     # Template for environment variables
├── .gitignore                       # Git exclusions (e.g., node_modules, dist)
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind theme extensions
├── vite.config.js                   # Build tool config (if using Vite; fallback to vue.config.js)
├── README.md                        # This file
└── ... (other config files like .eslintrc.js)
```

- **Views (`src/views/`)**: Handle page-specific logic, data fetching, and orchestration (e.g., `HomeView` manages branch state and modal toggles).
- **Components (`src/components/`)**: Atomic and focused; use props/emits for communication and slots for customization (e.g., `MultiSelect` renders nested sections/tables).
- **Composables (`src/composables/`)**: Extract API and utility functions for testability and reuse (e.g., `sendRequest` for all HTTP calls).

## Key Implementation Decisions and Rationale
- **Vue 3 with Composition API (`<script setup>`)**: Enables concise, reactive code organization. Computed properties (e.g., `activeBranches`) and reactive objects (e.g., `branches`) ensure efficient re-renders. Chosen over Options API for better tree-shaking and future-proofing with TypeScript.
- **Tailwind CSS for Styling**: Utility classes speed up development and ensure consistency (e.g., `flex flex-wrap` for time slots). PurgeCSS integration minimizes bundle size in production.
- **Modal Architecture**: Dedicated modal components with `<Teleport>` potential (future-proof) and event emissions for parent control. Limits cognitive load by focusing on one task per modal.
- **Multi-Select Component**: Custom-built for flexibility (slots for custom options like sectioned tables) and accessibility (ARIA listbox role, keyboard navigation). Avoids heavy libs like Vue Multiselect for lighter bundle.
- **Time Slot Management**: Inline editing with `nextTick` focus for UX; capped at 3 slots/day to prevent modal overflow and match common reservation patterns (e.g., meal shifts). Uses `reactive` objects for deep mutations.
- **API Design**: Lightweight `fetch` wrapper in `api.js` with Bearer auth. Optimistic updates (local state before API) for snappy feel, with fallbacks for errors. Includes query params (e.g., `?include=sections.tables`) for efficient nested fetches.
- **Accessibility and Semantics**: `<fieldset>/<legend>` for grouped inputs; ARIA labels on slots; `nextTick` for focus traps. Enforced via ESLint plugin for ongoing compliance.
- **No External State Lib**: `reactive`/`computed` suffice for this single-view app; scalable to Pinia if adding user auth or multi-page flows.
- **Security Note**: JWT token moved to `.env` for prod; API endpoints assumed secure (HTTPS).

These decisions balance simplicity (MVP focus) with scalability, resulting in a ~50KB gzipped bundle.

## Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn/pnpm
- A backend API server (e.g., Laravel/PHP) exposing endpoints like `/api/branches` with JWT auth.

## Setup Instructions
1. **Clone the Repository**:
   ```
   git clone https://github.com/maher-saleh/restaurant-reservation-system.git
   cd restaurant-reservation-system
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```
   This installs Vue 3, Tailwind CSS, Vue Router, and dev tools like ESLint.

3. **Environment Configuration**:
   - Copy `.env.example` to `.env.local`:
     ```
     VITE_API_TOKEN=your-jwt-bearer-token-here
     VITE_API_BASE_URL=https://your-api-domain.com  # Optional; defaults to relative paths
     ```
   - Update `src/composables/api.js` if needed: Use `import.meta.env.VITE_API_TOKEN` for the token.
   - **Security**: Never commit `.env` files—add to `.gitignore`.

4. **Run the Development Server**:
   ```
   npm run serve
   ```
   - Access at `http://localhost:5173` (Vite default) or `http://localhost:8080` (Vue CLI).
   - Auto-reloads on file changes.

## Usage Instructions
1. **Launch the App**: Open the dev server URL. You'll see the "Restaurant Reservation System" dashboard.
2. **View Active Branches**: The table shows enabled branches with computed table counts (only reservation-accepting tables).
3. **Add Branches**:
   - Click "Add Branches" button.
   - Select from inactive branches in the modal.
   - Save to enable them (API update triggers).
4. **Edit a Branch**:
   - Click any table row.
   - In the modal:
     - Set reservation duration (e.g., 90 minutes).
     - Select tables (grouped by section; multi-select).
     - Add/edit time slots per day (click to edit; use "Apply on all days" from Saturday).
   - Save to persist changes.
5. **Disable Reservations**:
   - Use the global "Disable Reservations" button.
   - Or, in edit modal, click "Disable reservation" for one branch.
6. **Exit Modals**: Click "Close" or backdrop (future enhancement).

**API Assumptions**: Branches have nested `sections` > `tables`; `accepts_reservations` flag controls visibility.

## Development Commands
| Command               | Description                                |
|-----------------------|--------------------------------------------|
| `npm run serve`       | Start dev server with hot-reload.          |
| `npm run build`       | Build for production (outputs to `dist/`). |
| `npm run preview`     | Preview production build locally.          |
| `npm run lint`        | Lint code (ESLint) and auto-fix issues.    |
| `npm run lint:strict` | Strict lint without auto-fix.              |

## Testing
- **Unit Tests**: Add Vitest/Jest for components (e.g., test `MultiSelect` toggles).
  ```
  npm install --save-dev vitest @vue/test-utils
  npm run test:unit
  ```
- **E2E Tests**: Cypress for flows (e.g., add branch end-to-end).
- **Accessibility Audit**: Run `npm run lint` (includes vuejs-accessibility plugin); use Lighthouse in Chrome DevTools.

No tests included yet—contributions welcome!

## Contributing
1. Fork the repo and create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit changes (`git commit -m 'Add some AmazingFeature'`).
3. Push to the branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request.

**Guidelines**:
- Follow Vue Style Guide.
- Run `npm run lint` before PRs.
- Add tests for new features.
- Update README for public APIs.

Thanks to all contributors!

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
- **Issues**: Report bugs or request features on GitHub.
- **Contact**: [ehabelnahas@outlook.com](mailto:ehabelnahas@outlook.com).
- **Demo**: Deployed at [https://restaurant-reservation-system-amber.vercel.app](https://restaurant-reservation-system-amber.vercel.app).
```