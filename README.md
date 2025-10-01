# Restaurant Reservation System

<p align="center">
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/Vue.js-3.x-brightgreen" alt="Vue.js">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-v3-blue" alt="Tailwind CSS">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  </a>
</p>

A modern, responsive Vue 3 single-page application (SPA) designed for managing restaurant branches and their reservation configurations. This system allows administrators to view active branches, enable inactive ones, edit reservation settings (e.g., duration, available tables, and daily time slots), and toggle reservations globally or per branch. Built with a focus on user experience, accessibility, and maintainability, it integrates seamlessly with a backend REST API for data persistence.

As of October 01, 2025, this project adheres to Vue 3 best practices, including the Composition API, and is production-ready with linting and build optimizations.

---

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

---

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

---

## Project Structure

The project uses the standard Vue CLI scaffold, emphasizing separation of concerns: views for pages, components for UI reusability, and composables for shared logic. Here's the breakdown:

```
restaurant-reservation-system/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── tailwind.css
│   ├── components/
│   │   ├── Modals/
│   │   │   ├── AddBranchesModal.vue
│   │   │   ├── EditBranchModal.vue
│   │   │   ├── Modal.vue
│   │   │   └── TimeSlotField.vue
│   │   └── MultiSelect.vue
│   ├── composables/
│   │   └── api.js
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   └── HomeView.vue
│   ├── App.vue
│   └── main.js
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vue.config.js
├── README.md
└── ... (other config files like .eslintrc.js)
```

- **Views (`src/views/`)**: Handle page-specific logic, data fetching, and orchestration.
- **Components (`src/components/`)**: Atomic and focused; use props/emits for communication and slots for customization.
- **Composables (`src/composables/`)**: Extract API and utility functions for testability and reuse.

---

## Key Implementation Decisions and Rationale

- **Vue 3 with Composition API (`<script setup>`)**: Concise, reactive code organization; better tree-shaking; future-proof.
- **Tailwind CSS**: Fast styling, consistency, PurgeCSS to minimize bundle size.
- **Modal Architecture**: Dedicated components, `<Teleport>` potential, event emissions for parent control.
- **Multi-Select Component**: Custom-built for flexibility and accessibility; avoids heavy external libraries.
- **Time Slot Management**: Inline editing with `nextTick` focus for UX; capped at 3 slots/day; uses `reactive` for deep mutations.
- **API Design**: Lightweight fetch wrapper with Bearer auth; optimistic updates for fast UI feedback.
- **Accessibility and Semantics**: `<fieldset>/<legend>`, ARIA labels, `nextTick` focus traps, ESLint plugin enforcement.
- **No External State Library**: `reactive`/`computed` sufficient; scalable to Pinia if needed.
- **Security**: JWT token in `.env`; API endpoints assumed secure (HTTPS).

---

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn/pnpm
- A backend API server exposing endpoints like `/api/branches` with JWT auth

---

## Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/maher-saleh/restaurant-reservation-system.git
cd restaurant-reservation-system
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Configuration**

```bash
cp .env.example .env.local
```

Update `.env.local`:

```bash
VUE_APP_API_TOKEN=your-jwt-bearer-token-here
VUE_APP_API_BASE_URL=https://your-api-domain.com
```

> **Security**: Never commit `.env` files; they are ignored by `.gitignore`.

4. **Run Development Server**

```bash
npm run serve
```

Access at `http://localhost:8080` (Vue CLI).

---

## Usage Instructions

1. **Launch the App** via the dev server URL.
2. **View Active Branches** in the table with computed table counts.
3. **Add Branches**
   - Click "Add Branches".
   - Select inactive branches in modal.
   - Save to enable (API update triggers).
4. **Edit a Branch**
   - Click any table row.
   - Set reservation duration.
   - Select tables (grouped by section).
   - Add/edit time slots per day ("Apply to All Days").
   - Save changes.
5. **Disable Reservations**
   - Global "Disable Reservations" button.
   - Or per-branch toggle in edit modal.
6. **Exit Modals**: Click "Close" or backdrop.

---

## Development Commands

| Command               | Description                                |
|-----------------------|--------------------------------------------|
| `npm run serve`       | Start dev server with hot-reload           |
| `npm run build`       | Build for production (`dist/`)             |
| `npm run lint`        | Lint code and auto-fix issues              |
| `npm run lint:strict` | Lint without auto-fix                        |

---

## Testing

- **Unit Tests**: Vitest/Jest for components

```bash
npm install --save-dev vitest @vue/test-utils
npm run test:unit
```

- **E2E Tests**: Cypress for flows
- **Accessibility Audit**: Lighthouse in Chrome DevTools

---

## Contributing

1. Fork the repo and create a feature branch:

```bash
git checkout -b feature/amazing-feature
```

2. Commit changes:

```bash
git commit -m "Add some AmazingFeature"
```

3. Push to branch:

```bash
git push origin feature/amazing-feature
```

4. Open a Pull Request.

**Guidelines**:

- Follow Vue Style Guide
- Run `npm run lint` before PRs
- Add tests for new features
- Update README for public APIs

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Issues**: Report bugs or request features on GitHub
- **Contact**: [ehabelnahas@outlook.com](mailto:ehabelnahas@outlook.com)
- **Demo**: [https://restaurant-reservation-system-amber.vercel.app](https://restaurant-reservation-system-amber.vercel.app)

