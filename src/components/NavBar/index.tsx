import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import { NavBarContainer, HomeButton, CreateAppointmentButton } from './styles';

const Navbar: React.FC = () => {
  const { navigate } = useNavigation();
  const route = useRoute();

  const navigateToProviderSelect = useCallback(() => {
    navigate('ProviderSelect');
  }, [navigate]);

  const navigateToDashboard = useCallback(() => {
    navigate('Dashboard');
  }, [navigate]);

  return (
    <NavBarContainer>
      <HomeButton
        onPress={navigateToDashboard}
        selected={route.name === 'Dashboard'}
      >
        <Icon
          name="home"
          size={26}
          color={route.name === 'Dashboard' ? '#ff9000' : '#f4ede8'}
        />
      </HomeButton>
      <CreateAppointmentButton
        onPress={navigateToProviderSelect}
        selected={
          route.name === 'ProviderSelect' || route.name === 'CreateAppointment'
        }
      >
        <Icon
          name="plus-square"
          size={26}
          color={
            route.name === 'ProviderSelect' ||
            route.name === 'CreateAppointment'
              ? '#ff9000'
              : '#f4ede8'
          }
        />
      </CreateAppointmentButton>
    </NavBarContainer>
  );
};

export default Navbar;
