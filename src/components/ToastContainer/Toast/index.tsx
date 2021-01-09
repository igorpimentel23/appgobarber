import React, { useEffect } from 'react';

import {
  Container,
  ToastCloseButton,
  ToastTextContainer,
  ToastTitle,
  ToastText,
  ToastIcon,
  ToastCloseIcon,
} from './styles';

import { useToast } from '../../../hooks/toast';

export interface ToastMessage {
  id: number;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: 'info',
  error: 'alert-circle',
  success: 'check-circle',
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container
      type={message.type}
      hasDescription={!!message.description}
      style={style}
    >
      <ToastIcon
        name={icons[message.type || 'info']}
        size={20}
        type={message.type}
      />
      <ToastTextContainer>
        <ToastTitle type={message.type}>{message.title}</ToastTitle>
        {message.description && (
          <ToastText type={message.type}>{message.description}</ToastText>
        )}
      </ToastTextContainer>
      <ToastCloseButton>
        <ToastCloseIcon
          onPress={() => removeToast(message.id)}
          name="x-circle"
          size={20}
          type={message.type}
        />
      </ToastCloseButton>
    </Container>
  );
};

export default Toast;
