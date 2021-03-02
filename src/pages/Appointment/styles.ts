import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const AppointmentContainer = styled.View`
  padding: 24px;
  flex: 1;
`;

export const AppointmentCard = styled.View`
  background: #3e3b47;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
`;

export const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 12px 0 24px 0;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
`;

export const Avatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const Info = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const Name = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
`;

export const AppointmentMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const AppointmentMetaText = styled.Text`
  margin-left: 8px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
`;

export const AppointmentTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
`;

export const DateContainer = styled.View``;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

export const EditButton = styled.TouchableOpacity`
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
`;

export const EditButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #232129;
`;

export const DeleteButton = styled.TouchableOpacity`
  background: #232129;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  max-width: 170px;
  padding: 12px 24px;
`;

export const DeleteButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
  text-align: center;
`;
