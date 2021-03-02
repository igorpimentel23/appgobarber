import React from 'react';

import { ToastProvider } from './toast';
import { AuthProvider } from './Auth';
import { NotificationProvider } from './Notification';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <NotificationProvider>
      <ToastProvider>{children}</ToastProvider>
    </NotificationProvider>
  </AuthProvider>
);

export default AppProvider;
