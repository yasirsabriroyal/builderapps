# Home Builder Design Center PWA

[![Deploy to GitHub Pages](https://github.com/yasirsabriroyal/builderapps/actions/workflows/gh-pages-deploy.yml/badge.svg)](https://github.com/yasirsabriroyal/builderapps/actions/workflows/gh-pages-deploy.yml)

A full-stack Progressive Web App (PWA) that empowers customers to design and customize their dream home through an interactive, multi-stage process.

## 🚀 Live Demo

**[Try the Live Demo →](https://yasirsabriroyal.github.io/builderapps/)**

Experience the full frontend application without any installation required!

## 📊 Project Status

**80% Complete** - Frontend deployed, backend ready for setup

- ✅ **Frontend:** Live and fully functional
- ✅ **Backend API:** Complete codebase (52 files, 2,900+ lines)
- ⏳ **Database:** Needs PostgreSQL setup
- 📝 **Features:** Some pages need implementation

**👉 See [STATUS_AND_NEXT_STEPS.md](STATUS_AND_NEXT_STEPS.md) for detailed status and setup instructions**

## ⚡ Quick Start

### For Development Setup:

```bash
# Clone the repository
git clone https://github.com/yasirsabriroyal/builderapps.git
cd builderapps

# Run the quick start script
./quick-start.sh      # macOS/Linux
quick-start.bat       # Windows
```

Or see **[STATUS_AND_NEXT_STEPS.md](STATUS_AND_NEXT_STEPS.md)** for detailed setup instructions.

> **📘 Setting up GitHub Pages?** See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for easy setup instructions!

## Features

- **Three-Stage Customer Journey**
  - Stage 1: Foundation (Budget, Home Type, Room Count)
  - Stage 2: Upgrades & Enhancements (Basement, Landscaping, Finish Levels)
  - Stage 3: Interior Finishes (Design Packages, Room-by-Room Customization)

- **Real-Time Price Calculator**
  - Live price updates as selections are made
  - Detailed price breakdown by stage

- **Progressive Web App**
  - Installable on mobile and desktop
  - Offline capability with service workers
  - Responsive design for all screen sizes

- **Data Persistence**
  - Automatic save to local storage
  - Resume progress anytime

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + Material-UI
- **State Management**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite
- **PWA**: Service Workers & Web App Manifest
- **3D Graphics**: Three.js + React Three Fiber
- **Canvas**: Fabric.js for floor plans

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + Sequelize ORM
- **Authentication**: JWT + bcryptjs
- **Real-time**: Socket.io
- **Language**: TypeScript (strict mode)
- **Security**: Rate limiting, input validation

## Getting Started

### Quick Setup (Recommended)

```bash
# Run the automated setup script
./quick-start.sh      # macOS/Linux
quick-start.bat       # Windows
```

Then follow the on-screen instructions!

### Manual Setup

#### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (for backend)

#### Frontend Only

1. Clone and install:
```bash
git clone https://github.com/yasirsabriroyal/builderapps.git
cd builderapps
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

#### Full Stack Setup

See **[STATUS_AND_NEXT_STEPS.md](STATUS_AND_NEXT_STEPS.md)** for complete setup instructions including:
- PostgreSQL database setup
- Environment configuration
- Backend initialization
- Feature implementation guide

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/src
  /components
    /stage1          # Foundation selection components
    /stage2          # Upgrades selection components
    /stage3          # Interior finishes components
    /shared          # Reusable UI components (Button, PriceDisplay, etc.)
  /contexts          # React Context for state management
  /hooks             # Custom hooks (usePriceCalculator)
  /types             # TypeScript interfaces and types
  /data              # Mock data for pricing and options
  /pages             # Main pages (Landing, Summary)
  App.tsx            # Main app component with routing
  main.tsx           # App entry point
  index.css          # Global CSS with Tailwind directives
/public
  manifest.json      # PWA manifest
  service-worker.js  # Service worker for offline support
```

## Usage

1. **Start on the Landing Page**: Get an overview of the process
2. **Stage 1 - Foundation**: Select your budget range, home type, and room count
3. **Stage 2 - Upgrades**: Choose major upgrades like finished basement and landscaping
4. **Stage 3 - Interior**: Pick a design package or customize room by room
5. **Review Summary**: See all selections and final estimated price
6. **Submit**: Save, share, or submit your design

## Key Features Detail

### Real-Time Price Calculation
- Base price determined by home type
- Dynamic price updates for each selection
- Additional costs for extra rooms
- Transparent pricing throughout the journey

### Responsive Design
- Mobile-first approach
- Optimized for tablets and desktops
- Touch-friendly interface
- Smooth transitions and animations

### PWA Capabilities
- Install to home screen on mobile devices
- Offline access to saved designs
- Fast loading with service worker caching
- Native app-like experience

## Mock Data

The app uses realistic mock data for:
- Home types with base prices ($220K-$300K)
- Upgrade options ($8K-$75K range)
- Design packages ($0-$15K)
- Room customization materials (various price points)

All pricing is for demonstration purposes only.

## 📚 Documentation

- **[STATUS_AND_NEXT_STEPS.md](STATUS_AND_NEXT_STEPS.md)** - 📊 Complete project status and detailed setup guide
- **[BACKEND_COMPLETE.md](BACKEND_COMPLETE.md)** - Backend implementation details
- **[FRONTEND_SERVICES.md](FRONTEND_SERVICES.md)** - Frontend services and authentication
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - GitHub Pages deployment guide
- **[backend/README.md](backend/README.md)** - Backend API reference

## What's Implemented

✅ **Frontend Application:**
- Complete 3-stage home design workflow
- Real-time price calculator
- PWA with offline support
- Authentication UI (Login, Register, Profile)
- Dashboard and navigation
- Material-UI components
- Responsive design

✅ **Backend API:**
- 30+ RESTful endpoints
- 13 database models
- JWT authentication & authorization
- Rate limiting & security
- Real-time messaging (Socket.io)
- Database seeders (70+ materials)
- Complete TypeScript implementation

⏳ **Needs Setup:**
- PostgreSQL database
- Environment configuration
- Backend deployment

📝 **Placeholder Pages (Ready for Implementation):**
- Floor plan designer
- 3D viewer
- Materials browser
- Budget tracker
- Timeline/Gantt chart
- Document management
- Real-time collaboration

## Future Enhancements

- Backend API integration
- User authentication
- Multiple saved designs per user
- 3D home visualization
- PDF/Email export functionality
- Integration with actual inventory systems
- Appointment booking
- Real-time collaboration with design team

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` or `copilot/create-home-builder-pwa` branch triggers a new deployment.

### 📘 Simple GitHub Pages Setup

**See the complete guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

Quick summary:
1. **Configure Pages**: Settings → Pages → Source: **"GitHub Actions"**
2. **Trigger workflow**: Push code or go to Actions tab → Run "Deploy to GitHub Pages" workflow
3. **Wait**: 2-3 minutes for deployment to complete
4. **Access site**: https://yasirsabriroyal.github.io/builderapps/

The workflow uses the official GitHub Actions deployment method for seamless integration with GitHub Pages.

### Troubleshooting

**Site showing 404?**
- Verify "GitHub Actions" is selected in Settings → Pages → Source
- Check Actions tab for successful workflow completion
- Wait 2-3 minutes after deployment

**Need more help?**
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions
- See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for additional troubleshooting

### Manual Deployment

To deploy manually to other hosting services:

```bash
npm run build
# Then deploy the dist/ folder to your hosting service
```

The app is configured to work with GitHub Pages at `/builderapps/` base path.

For other hosting providers (Vercel, Netlify, etc.), you may need to:
1. Update `vite.config.ts` - set `base: '/'` 
2. Remove the `basename` prop from `<Router>` in `src/App.tsx`
3. Rebuild: `npm run build`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

All rights reserved.

## Contact

For questions or support, please contact the development team.
