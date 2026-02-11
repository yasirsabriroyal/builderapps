# Home Builder Design Center PWA

[![Deploy to GitHub Pages](https://github.com/yasirsabriroyal/builderapps/actions/workflows/gh-pages-deploy.yml/badge.svg)](https://github.com/yasirsabriroyal/builderapps/actions/workflows/gh-pages-deploy.yml)

A Progressive Web App (PWA) that empowers customers to design and customize their dream home through an interactive, multi-stage process.

## 🚀 Live Demo

**[Try the Live Demo →](https://yasirsabriroyal.github.io/builderapps/)**

Experience the full application without any installation required!

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

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite
- **PWA**: Service Workers & Web App Manifest

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (for backend development)

### Quick Setup (Recommended)

For a complete development setup with backend and frontend:

#### Unix/Linux/macOS:
```bash
git clone https://github.com/yasirsabriroyal/builderapps.git
cd builderapps
chmod +x setup-dev.sh
./setup-dev.sh
```

#### Windows:
```batch
git clone https://github.com/yasirsabriroyal/builderapps.git
cd builderapps
setup-dev.bat
```

This automated script will:
- ✅ Install all dependencies
- ✅ Create environment files with secure defaults
- ✅ Setup PostgreSQL database
- ✅ Seed database with materials and categories
- ✅ Build the frontend

📚 **See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed manual setup instructions**

### Frontend-Only Setup

If you only want to run the frontend (without backend):

1. Clone the repository:
```bash
git clone https://github.com/yasirsabriroyal/builderapps.git
cd builderapps
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Full-Stack Development

After running the setup script, start both servers:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Verify Setup

Check that everything is configured correctly:
```bash
npm run verify
```

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
