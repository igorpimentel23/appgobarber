import styled, { css } from 'styled-components/native';

interface ButtonProps {
  selected: boolean;
}

export const NavBarContainer = styled.View`
  width: 100%;
  border-top-width: 1px;
  border-color: #232129;
  background: #28262e;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

export const HomeButton = styled.TouchableOpacity<ButtonProps>`
  padding: 18px 0;
  width: 50px;
  align-items: center;
  justify-content: center;

  ${props =>
    props.selected &&
    css`
      border-top-width: 5px;
      border-color: #ff9000;
    `}
`;

export const CreateAppointmentButton = styled.TouchableOpacity<ButtonProps>`
  padding: 18px 0;
  width: 50px;
  align-items: center;
  justify-content: center;
  ${props =>
    props.selected &&
    css`
      border-top-width: 5px;
      border-color: #ff9000;
    `}
`;
