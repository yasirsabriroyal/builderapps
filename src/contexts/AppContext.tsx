import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { AppState, Stage1Selections, Stage2Selections, Stage3Selections } from '../types';

// Initial state
const initialState: AppState = {
  currentStage: 1,
  stage1: {
    budgetRange: null,
    homeType: null,
    bedrooms: 3,
    bathrooms: 2,
    additionalRooms: [],
  },
  stage2: {
    finishedBasement: false,
    landscapingPackage: 'basic',
    finishLevel: 'standard',
    garage: '2-car',
    deckPatio: false,
    smartHome: false,
    energyEfficiency: false,
  },
  stage3: {
    designPackage: null,
    customizations: {
      kitchen: {
        countertops: 'laminate',
        cabinetry: 'stock',
        flooring: 'vinyl',
        appliances: 'standard',
        backsplash: 'basic',
      },
      bathrooms: {
        vanity: 'standard',
        countertop: 'cultured-marble',
        flooring: 'vinyl',
        showerTub: 'standard',
        fixtures: 'standard',
      },
      living: {
        flooring: 'carpet',
        paint: 'standard',
        trim: 'standard',
        lighting: 'standard',
      },
      bedrooms: {
        flooring: 'carpet',
        paint: 'standard',
        closet: 'standard',
      },
    },
    isCustomized: false,
  },
  totalPrice: 0,
};

// Action types
type Action =
  | { type: 'SET_STAGE'; payload: number }
  | { type: 'UPDATE_STAGE1'; payload: Partial<Stage1Selections> }
  | { type: 'UPDATE_STAGE2'; payload: Partial<Stage2Selections> }
  | { type: 'UPDATE_STAGE3'; payload: Partial<Stage3Selections> }
  | { type: 'UPDATE_ROOM_CUSTOMIZATION'; payload: { room: string; field: string; value: string } }
  | { type: 'RESET_ROOM_TO_PACKAGE'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'UPDATE_PRICE'; payload: number };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };
    
    case 'UPDATE_STAGE1':
      return { ...state, stage1: { ...state.stage1, ...action.payload } };
    
    case 'UPDATE_STAGE2':
      return { ...state, stage2: { ...state.stage2, ...action.payload } };
    
    case 'UPDATE_STAGE3':
      return { ...state, stage3: { ...state.stage3, ...action.payload } };
    
    case 'UPDATE_ROOM_CUSTOMIZATION': {
      const { room, field, value } = action.payload;
      return {
        ...state,
        stage3: {
          ...state.stage3,
          customizations: {
            ...state.stage3.customizations,
            [room]: {
              ...state.stage3.customizations[room as keyof typeof state.stage3.customizations],
              [field]: value,
            },
          },
          isCustomized: true,
        },
      };
    }
    
    case 'RESET_ROOM_TO_PACKAGE': {
      const room = action.payload;
      const defaultValues = initialState.stage3.customizations[room as keyof typeof initialState.stage3.customizations];
      return {
        ...state,
        stage3: {
          ...state.stage3,
          customizations: {
            ...state.stage3.customizations,
            [room]: defaultValues,
          },
        },
      };
    }
    
    case 'LOAD_STATE':
      return action.payload;
    
    case 'UPDATE_PRICE':
      return { ...state, totalPrice: action.payload };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  setStage: (stage: number) => void;
  updateStage1: (data: Partial<Stage1Selections>) => void;
  updateStage2: (data: Partial<Stage2Selections>) => void;
  updateStage3: (data: Partial<Stage3Selections>) => void;
  updateRoomCustomization: (room: string, field: string, value: string) => void;
  resetRoomToPackage: (room: string) => void;
  updatePrice: (price: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // Load state from localStorage on mount
  const loadedState = typeof window !== 'undefined' ? localStorage.getItem('homeBuilderState') : null;
  const parsedState = loadedState ? JSON.parse(loadedState) : initialState;
  
  const [state, dispatch] = useReducer(appReducer, parsedState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('homeBuilderState', JSON.stringify(state));
  }, [state]);

  const setStage = useCallback((stage: number) => dispatch({ type: 'SET_STAGE', payload: stage }), []);
  const updateStage1 = useCallback((data: Partial<Stage1Selections>) => dispatch({ type: 'UPDATE_STAGE1', payload: data }), []);
  const updateStage2 = useCallback((data: Partial<Stage2Selections>) => dispatch({ type: 'UPDATE_STAGE2', payload: data }), []);
  const updateStage3 = useCallback((data: Partial<Stage3Selections>) => dispatch({ type: 'UPDATE_STAGE3', payload: data }), []);
  const updateRoomCustomization = useCallback((room: string, field: string, value: string) => 
    dispatch({ type: 'UPDATE_ROOM_CUSTOMIZATION', payload: { room, field, value } }), []);
  const resetRoomToPackage = useCallback((room: string) => dispatch({ type: 'RESET_ROOM_TO_PACKAGE', payload: room }), []);
  const updatePrice = useCallback((price: number) => dispatch({ type: 'UPDATE_PRICE', payload: price }), []);

  const contextValue: AppContextType = {
    state,
    dispatch,
    setStage,
    updateStage1,
    updateStage2,
    updateStage3,
    updateRoomCustomization,
    resetRoomToPackage,
    updatePrice,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
