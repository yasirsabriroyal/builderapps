# Home Builder Design Center PWA

A Progressive Web App (PWA) that empowers customers to design and customize their dream home through an interactive, multi-stage process.

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

### Installation

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

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

All rights reserved.

## Contact

For questions or support, please contact the development team.
