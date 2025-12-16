import React, { useState, useCallback, ReactNode } from 'react';
import { AuthContext, ToastContext, Toast } from '@/context/AuthContext';
import { Role, User } from '@/types';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showTutorialFor, setShowTutorialFor] = useState<Role | null>(null);

  const login = useCallback((role: Role) => {
    if (role === Role.ADMIN) {
      setUser({
        id: 'admin-001',
        name: 'Alex Admin',
        role: Role.ADMIN,
        avatar: 'https://i.pravatar.cc/150?u=admin-alex',
        email: 'alex.admin@hardbanrecords.com',
        bio: 'Administrator overseeing the entire HardbanRecords platform operations.',
        location: 'Warsaw, Poland',
        website: 'https://hardbanrecords.com'
      });
    } else if (role === Role.MUSIC_CREATOR) {
      setUser({
        id: 'creator-001',
        name: 'Casey Creator',
        role: Role.MUSIC_CREATOR,
        avatar: 'https://i.pravatar.cc/150?u=casey-creator',
        email: 'casey@synthwave.com',
        bio: 'Electronic music producer specializing in Synthwave and Chillwave. Creating dreamscapes through sound.',
        location: 'Los Angeles, USA',
        website: 'https://caseycreator.com'
      });
    } else { // BOOK_AUTHOR
      setUser({
        id: 'author-001',
        name: 'Pat Publisher',
        role: Role.BOOK_AUTHOR,
        avatar: 'https://i.pravatar.cc/150?u=pat-publisher',
        email: 'pat@publishing.com',
        bio: 'Bestselling author of Sci-Fi and Fantasy novels. Creating new worlds one page at a time.',
        location: 'London, UK',
        website: 'https://patpublisher.com'
      });
    }
    setShowTutorialFor(role);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setShowTutorialFor(null);
  }, []);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser(currentUser => currentUser ? { ...currentUser, ...updatedData } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, showTutorialFor, setShowTutorialFor }}>
      {children}
    </AuthContext.Provider>
  );
};

let toastCount = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = toastCount++;
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
