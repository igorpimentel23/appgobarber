import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { useAuth } from '../../hooks/Auth';

import {
  HeaderContainer,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
} from './styles';

const Header: React.FC = () => {
  const { navigate } = useNavigation();
  const { user, signOut } = useAuth();

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <HeaderContainer>
      <HeaderTitle>
        Bem vindo, {'\n'}
        <UserName>{user.name}</UserName>
      </HeaderTitle>

      <ProfileButton onPress={navigateToProfile}>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </ProfileButton>
    </HeaderContainer>
  );
};

export default Header;
