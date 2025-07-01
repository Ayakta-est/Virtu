import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from 'react';
import storeReducer, { initialStore } from '../store';

// Infer Store and Action types from storeReducer and initialStore
type Store = ReturnType<typeof initialStore>;
type Action = Parameters<typeof storeReducer>[1];
type DispatchType = Dispatch<Action>;

// Context value interface
interface StoreContextType {
  store: Store;
  dispatch: DispatchType;
}

// Create context with undefined default to enforce usage within provider
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Provider props interface
interface StoreProviderProps {
  children: ReactNode;
}

// StoreProvider component
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [store, dispatch] = useReducer<typeof storeReducer>(
    storeReducer,
    initialStore()
  );

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to consume the store
export default function useGlobalReducer(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error(
      'useGlobalReducer must be used within a StoreProvider'
    );
  }
  return context;
}
