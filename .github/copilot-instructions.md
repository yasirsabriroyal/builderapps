# Copilot Custom Instructions

## Project Overview

Home Builder Design Center is a Progressive Web App (PWA) that empowers customers to design and customize their dream home through an interactive, multi-stage process. The application guides users through three stages: Foundation selection (budget, home type, room count), Upgrades & Enhancements (basement, landscaping, finish levels), and Interior Finishes (design packages, room-by-room customization). The app features real-time price calculation, data persistence, and offline capabilities.

**Target Users**: Customers of home building companies looking to design and price their custom homes.

**Live Demo**: https://yasirsabriroyal.github.io/builderapps/

## Tech Stack

### Frontend
- **React 18+** with **TypeScript**
- **Vite** as build tool
- **Tailwind CSS 4.x** for styling
- **React Router v7** for routing
- **React Context API** for state management
- **Service Workers** for PWA functionality
- Additional libraries: Material-UI, React Three Fiber, DND Kit, Recharts

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **PostgreSQL** with **Sequelize** ORM
- **Socket.io** for real-time features
- **JWT** for authentication

### Development Tools
- **ESLint** for linting (TypeScript ESLint, React Hooks plugin)
- **Prettier** for code formatting (backend only, configuration in `backend/.prettierrc`)
- **Git** for version control

## Coding Standards

### TypeScript
- Use TypeScript for all new code (`.ts` or `.tsx` files)
- Define interfaces and types in `/src/types` for frontend, `/src/types` or inline for backend
- Prefer explicit types over `any`
- Use proper type annotations for function parameters and return values

### React
- Use **function components only** - no class components
- Use **React Hooks** for state and side effects
- Use **React Context API** for global state management (no Redux)
- Keep components focused and single-purpose
- Place reusable components in `/src/components/shared`

### Styling
- Use **Tailwind CSS** utility classes for styling
- Follow mobile-first responsive design approach
- Avoid inline styles unless absolutely necessary
- Use Tailwind configuration in `tailwind.config.js`

### Code Formatting (Backend)
- Backend code follows Prettier configuration in `backend/.prettierrc`:
  - Use semicolons
  - Single quotes for strings
  - Tab width: 2 spaces
  - No trailing commas
  - Print width: 100 characters
  - Arrow function parens: avoid when possible

### ESLint
- Frontend uses ESLint configuration in `eslint.config.js`
- Follow TypeScript ESLint recommendations
- React Hooks rules are enforced
- Run `npm run lint` before committing

### File Organization
```
/src
  /components
    /stage1          # Foundation selection components
    /stage2          # Upgrades selection components
    /stage3          # Interior finishes components
    /shared          # Reusable UI components
  /contexts          # React Context for state management
  /hooks             # Custom hooks
  /types             # TypeScript interfaces and types
  /data              # Mock data for pricing and options
  /pages             # Main pages
  /services          # API services
  App.tsx            # Main app with routing
  main.tsx           # App entry point
```

### Backend Structure
```
backend/
  /src
    /controllers     # Request handlers
    /models          # Database models
    /routes          # API routes
    /middleware      # Express middleware
    /config          # Configuration files
    server.ts        # Server entry point
```

## Key Commands

### Frontend
```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run production server
npm start

# Seed database
npm run seed
```

## Architecture and Patterns

### State Management
- Use React Context API for global state (see `/src/contexts`)
- Local component state with `useState` for component-specific data
- Custom hooks in `/src/hooks` for reusable stateful logic

### Routing
- React Router v7 is used for navigation
- App is configured for GitHub Pages with base path `/builderapps/`
- For other hosting, update `vite.config.ts` base and remove basename from Router

### PWA Configuration
- Service worker: `/public/service-worker.js`
- Web app manifest: `/public/manifest.json`
- Offline-first approach with cache-first strategy

### API Integration
- API services are in `/src/services`
- Use Axios for HTTP requests
- Backend API runs on Express with RESTful endpoints

### Price Calculation
- Centralized in custom hook `usePriceCalculator`
- Real-time updates based on selections
- Transparent pricing breakdown by stage

## Special Patterns

### Component Structure
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props
- Prefer composition over prop drilling

### Data Flow
- State flows down through Context providers
- Actions flow up through callbacks
- Minimize prop drilling by using Context when needed

### Error Handling
- Handle errors gracefully with user-friendly messages
- Use try-catch blocks for async operations
- Log errors appropriately for debugging

## Testing

Currently, the project does not have a formal test suite configured. When adding tests:
- Follow React Testing Library best practices
- Test user interactions and behavior, not implementation details
- Focus on integration tests over unit tests

## Deployment

- **GitHub Pages**: Automated deployment via GitHub Actions (`.github/workflows/gh-pages-deploy.yml`)
- Deployment triggered on push to `main` branch
- Build artifacts are in `dist/` folder
- See `DEPLOYMENT_GUIDE.md` for detailed instructions

## Maintainers

- Repository owner: @yasirsabriroyal
- Review and update these instructions when:
  - Major dependencies are updated
  - Architecture patterns change
  - New coding standards are adopted
  - Project structure is reorganized

## Additional Resources

- [Project README](../README.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Backend Summary](../BACKEND_SUMMARY.md)
- [Frontend Services](../FRONTEND_SERVICES.md)
