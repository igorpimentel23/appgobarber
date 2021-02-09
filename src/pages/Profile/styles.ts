import styled from 'styled-components/native';
import { animated } from 'react-spring/native';
import { Form } from '@unform/mobile';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const FormStyled = styled(Form)`
  width: 100%;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const BackButton = styled.TouchableOpacity``;

export const LogoutButton = styled.TouchableOpacity``;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 93px;
  align-self: center;
`;

export const AnimatedDivBefore = styled.View`
  height: 0;
  opacity: 0;
`;

export const AnimatedDiv = animated(AnimatedDivBefore);
