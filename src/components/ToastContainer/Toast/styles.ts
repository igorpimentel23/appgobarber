import styled, { css } from 'styled-components/native';
import { animated } from 'react-spring/native';

import Icon from 'react-native-vector-icons/Feather';

interface ContainerProps {
  type?: 'info' | 'success' | 'error';
  hasDescription?: boolean;
}

interface TimeBarProps {
  type?: 'success' | 'error' | 'info';
}

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

const toastTypeVariationsColors = {
  info: css`
    background-color: #3172b7 /* linear-gradient(130deg, #4f8dd0, #3172b7) */;
  `,

  success: css`
    background-color: #2e656a /* linear-gradient(130deg, #43949b, #2e656a) */;
  `,

  error: css`
    background-color: #c53030 /* linear-gradient(130deg, #d55454, #c53030) */;
  `,
};

const toastTypeVariationsFont = {
  info: css`
    color: #3172b7;
  `,
  success: css`
    color: #2e656a;
  `,
  error: css`
    color: #c53030;
  `,
};

const ContainerBefore = styled.View<ContainerProps>`
  width: 340px;
  position: relative;
  padding: 16px 16px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  flex-direction: row;
  margin-bottom: 8px;
  overflow: hidden;

  ${props => toastTypeVariations[props.type || 'info']}

  ${props =>
    !props.hasDescription &&
    css`
      align-items: center;
    `}
`;

export const Container = animated(ContainerBefore);

export const ToastIcon = styled(Icon)<ContainerProps>`
  margin-right: 12px;

  ${props => toastTypeVariationsFont[props.type || 'info']}
`;

export const ToastCloseIcon = styled(Icon)<ContainerProps>`
  margin-left: 12px;
  ${props => toastTypeVariationsFont[props.type || 'info']}
`;

export const ToastTextContainer = styled.View`
  flex: 1;
`;

export const ToastTitle = styled.Text<ContainerProps>`
  font-size: 16px;
  font-family: 'RobotoSlab-Medium';
  opacity: 0.8;
  line-height: 20px;

  ${props => toastTypeVariationsFont[props.type || 'info']}
`;

export const ToastText = styled.Text<ContainerProps>`
  margin-top: 4px;
  font-size: 14px;
  font-family: 'RobotoSlab-Regular';

  ${props => toastTypeVariationsFont[props.type || 'info']}
`;

export const ToastCloseButton = styled.TouchableOpacity`
  opacity: 0.6;
`;

const TimerBarBefore = styled.View<TimeBarProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 5px;

  ${props => toastTypeVariationsColors[props.type || 'info']}
`;

export const TimerBar = animated(TimerBarBefore);
