# Builder App - Frontend

React frontend application for the Builder App.

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
# Create .env file with:
REACT_APP_API_URL=http://localhost:3001/api/v1
```

3. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

- User Authentication (Login/Register)
- Project Management Dashboard
- Create and manage projects
- Material-UI design system
- Responsive layout

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Tech Stack

- React 18 with TypeScript
- Material-UI (MUI)
- React Router v6
- Axios for API calls
- Context API for state management

## Project Structure

```
src/
├── components/     - Reusable UI components
├── pages/          - Page components
├── contexts/       - React contexts
├── services/       - API services
├── types/          - TypeScript types
└── utils/          - Utility functions
```
