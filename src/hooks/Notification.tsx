import { parseISO, subMinutes } from 'date-fns';
import React, { createContext, useContext, useCallback } from 'react';
import PushNotification from 'react-native-push-notification';

interface NotificationContextData {
  showNotification(title: string, message: string): void;
  handleScheduleNotification(title: string, message: string, date: Date): void;
  handleCancelNotification(): void;
}

const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData,
);

const NotificationProvider: React.FC = ({ children }) => {
  const showNotification = useCallback((title: string, message: string) => {
    PushNotification.localNotification({
      title,
      message,
      channelId: 'channel-id',
    });
  }, []);

  const handleScheduleNotification = useCallback(
    (title: string, message: string, date: Date) => {
      PushNotification.localNotificationSchedule({
        title,
        message,
        date: subMinutes(date, 15),
        channelId: 'channel-id',
      });
    },
    [],
  );

  const handleCancelNotification = useCallback(() => {
    PushNotification.cancelAllLocalNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        handleScheduleNotification,
        handleCancelNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

function useNotification(): NotificationContextData {
  const context = useContext(NotificationContext);

  if (!context)
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );

  return context;
}

export { NotificationProvider, useNotification };
