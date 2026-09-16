import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, FilterState, View, Item, BorrowRequest } from '../types';
import { currentUser as mockCurrentUser } from '../data/users';
import { items as defaultMockItems } from '../data/items';
import { api } from '../lib/api';

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

  // Catalog State
  itemsList: Item[];
  refreshItems: () => Promise<void>;
  addItemToList: (item: Item) => void;

  // Auth
  user: User | null;
  isLoggedIn: boolean;
  login: (customUser?: User) => void;
  loginWithCredentials: (email: string, pass: string) => Promise<boolean>;
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
  const [itemsList, setItemsList] = useState<Item[]>(defaultMockItems);

  const [user, setUser] = useState<User | null>(mockCurrentUser); // logged in as Alex Moreau by default for demo
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isListItemModalOpen, setListItemModalOpen] = useState(false);
  const [isBorrowModalOpen, setBorrowModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshItems = async () => {
    try {
      const serverItems = await api.getItems();
      if (serverItems && serverItems.length > 0) {
        setItemsList(serverItems);
      }
    } catch (e) {
      // Graceful fallback to rich offline dataset if backend is offline
    }
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const addItemToList = (newItem: Item) => {
    setItemsList((prev) => [newItem, ...prev]);
  };

  const navigate = (view: View, itemId?: string) => {
    setCurrentView(view);
    if (itemId !== undefined) {
      setSelectedItemId(itemId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginWithCredentials = async (email: string, pass: string): Promise<boolean> => {
    try {
      const { user: serverUser } = await api.login(email, pass);
      setUser(serverUser);
      setAuthModalOpen(false);
      addToast(`Welcome back, ${serverUser.name}!`, 'success');
      return true;
    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const login = (customUser?: User) => {
    setUser(customUser || mockCurrentUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    navigate('landing');
    addToast('You have been logged out.', 'info');
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
        itemsList,
        refreshItems,
        addItemToList,
        user,
        isLoggedIn: !!user,
        login,
        loginWithCredentials,
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
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
