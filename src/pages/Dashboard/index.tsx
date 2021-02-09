import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Header from '../../components/Header';

import {
  Container,
  AppointmentsList,
  AppointmentContainer,
  ProviderAvatar,
  AppointmentInfo,
  ProviderName,
  AppointmentMeta,
  AppointmentMetaText,
  AppointmentsListTitle,
} from './styles';
import api from '../../services/api';
import NavBar from '../../components/NavBar';

interface Appointment {
  id: string;
  date: string;
  provider: {
    name: string;
    avatar_url: string;
  };
}

export interface AppointmentFormatted {
  id: string;
  name: string;
  avatar_url: string;
  hourFormatted: string;
  dayFormatted: string;
}

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { navigate } = useNavigation();

  useEffect(() => {
    api.get('/appointments/user').then(response => {
      setAppointments(response.data);
    });
  }, []);

  const navigateToProviderSelect = useCallback(() => {
    navigate('ProviderSelect');
  }, [navigate]);

  const navigateToAppointment = useCallback(
    (appointmentId: string) => {
      navigate('Appointment', { appointmentId });
    },
    [navigate],
  );

  const appointmentsFormated = useMemo(() => {
    return appointments.map((appointment: Appointment) => {
      const date = parseISO(appointment.date);

      return {
        id: appointment.id,
        name: appointment.provider.name,
        avatar_url: appointment.provider.avatar_url,
        hourFormatted: format(date, 'HH:00'),
        dayFormatted: format(date, 'EEEE, dd-MMM-yy', { locale: ptBR }),
      };
    });
  }, [appointments]);

  return (
    <Container>
      <Header />

      <AppointmentsList
        data={appointmentsFormated}
        keyExtractor={appointment => appointment.id}
        ListHeaderComponent={
          <AppointmentsListTitle>Meus horários agendados</AppointmentsListTitle>
        }
        renderItem={({ item: appointment }) => (
          <AppointmentContainer
            onPress={() => navigateToAppointment(appointment.id)}
          >
            <ProviderAvatar source={{ uri: appointment.avatar_url }} />

            <AppointmentInfo>
              <ProviderName>{appointment.name}</ProviderName>

              <AppointmentMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <AppointmentMetaText>
                  {appointment.dayFormatted}
                </AppointmentMetaText>
              </AppointmentMeta>

              <AppointmentMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <AppointmentMetaText>
                  {appointment.hourFormatted}
                </AppointmentMetaText>
              </AppointmentMeta>
            </AppointmentInfo>
          </AppointmentContainer>
        )}
      />

      <NavBar />
    </Container>
  );
};

export default Dashboard;
