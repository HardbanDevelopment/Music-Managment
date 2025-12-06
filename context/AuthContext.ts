import { createContext } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  showTutorialFor: Role | null;
  setShowTutorialFor: (role: Role | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  showTutorialFor: null,
  setShowTutorialFor: () => {},
});


export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});
