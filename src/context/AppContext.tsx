import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, FilterState, View } from '../types';
import { currentUser as mockCurrentUser } from '../data/users';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface AppContextType {
  // Navigation
  currentView: View;
  navigate: (view: View, itemId?: string) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;

  // Auth
  user: User | null;
  isLoggedIn: boolean;
  login: (customUser?: User) => void;
  logout: () => void;

  // Modals
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isListItemModalOpen: boolean;
  setListItemModalOpen: (open: boolean) => void;
  isBorrowModalOpen: boolean;
  setBorrowModalOpen: (open: boolean) => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'all',
  campus: 'all',
  availableOnly: false,
  maxDuration: 120,
  freeOnly: false,
  minTrustScore: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedItemId, setSelectedItemId] = useState<string | null>('i_1');

  const [user, setUser] = useState<User | null>(mockCurrentUser); // logged in as Alex Moreau by default for demo
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isListItemModalOpen, setListItemModalOpen] = useState(false);
  const [isBorrowModalOpen, setBorrowModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const navigate = (view: View, itemId?: string) => {
    setCurrentView(view);
    if (itemId !== undefined) {
      setSelectedItemId(itemId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (customUser?: User) => {
    setUser(customUser || mockCurrentUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    navigate('landing');
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigate,
        selectedItemId,
        setSelectedItemId,
        user,
        isLoggedIn: !!user,
        login,
        logout,
        isAuthModalOpen,
        setAuthModalOpen,
        isListItemModalOpen,
        setListItemModalOpen,
        isBorrowModalOpen,
        setBorrowModalOpen,
        filters,
        setFilters,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
