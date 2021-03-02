import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';

import {
  Container,
  AppointmentContainer,
  AppointmentCard,
  InfoContainer,
  Title,
  Avatar,
  Info,
  Name,
  AppointmentMeta,
  AppointmentMetaText,
  AppointmentTitle,
  DateContainer,
  ButtonContainer,
  EditButton,
  EditButtonText,
  DeleteButton,
  DeleteButtonText,
} from './styles';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useToast } from '../../hooks/toast';
import { Alert } from 'react-native';
import NavBar from '../../components/NavBar';

interface RouteParams {
  appointmentId: string;
}

interface Appointment {
  id: string;
  date: Date;
  provider: {
    id: string;
    name: string;
    avatar_url: string;
  };
  user: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const route = useRoute();
  const { addToast } = useToast();
  const routeParams = route.params as RouteParams;
  const { reset, navigate } = useNavigation();
  const [appointment, setAppointment] = useState<Appointment>();

  useEffect(() => {
    api
      .get(`appointments`, {
        params: {
          appointment_id: routeParams.appointmentId,
        },
      })
      .then(response => {
        setAppointment(response.data);
      });
  }, [routeParams, setAppointment]);

  const dateFormatted = useMemo(() => {
    if (appointment) {
      const date = parseISO(appointment.date.toString());
      return {
        hour: format(date, 'HH:00'),
        date: format(date, 'EEEE, dd-MMM-yy', { locale: ptBR }),
      };
    }
  }, [appointment]);

  const handleDeleteAppointment = useCallback(
    (appointment_id: string, date: Date) => {
      Alert.alert('Atenção', 'Deseja realmente cancelar o agendamento?', [
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await api.delete('/appointments', {
                params: {
                  appointment_id: appointment_id,
                },
              });
              const parsedDate = parseISO(date.toString());

              reset({
                routes: [
                  {
                    name: 'Dashboard',
                  },
                  {
                    name: 'AppointmentCreated',
                    params: {
                      date: parsedDate.getTime(),
                      type: 'delete',
                    },
                  },
                ],
                index: 0,
              });
            } catch (err) {
              addToast({
                title: 'Erro ao deletar o agendamento',
                description:
                  'Ocorreu um erro ao deletar o agendamento, tente novamente',
                type: 'error',
              });
            }
          },
        },
        {
          text: 'Não',
          onPress: () => {},
        },
      ]);
    },
    [reset],
  );

  const handleUpdateAppointment = useCallback(
    (providerId: string, appointmentId: string) => {
      try {
        navigate('CreateAppointment', {
          providerId,
          appointmentId,
          type: 'update',
        });
      } catch (err) {
        addToast({
          title: 'Erro ao atualizar o agendamento',
          description:
            'Ocorreu um erro ao atualizar o agendamento, tente novamente',
          type: 'error',
        });
      }
    },
    [],
  );

  return (
    <Container>
      <Header />
      {appointment && (
        <AppointmentContainer>
          <AppointmentTitle>Alterar seu agendamento</AppointmentTitle>
          <AppointmentCard>
            <Title>Barbeiro</Title>
            <InfoContainer>
              <Avatar
                source={{
                  uri: appointment.provider.avatar_url,
                }}
              />
              <Info>
                <Name>{appointment.provider.name}</Name>
              </Info>
            </InfoContainer>
            <Title>Cliente</Title>
            <InfoContainer>
              <Avatar
                source={{
                  uri: appointment.user.avatar_url,
                }}
              />
              <Info>
                <Name>{appointment.user.name}</Name>
              </Info>
            </InfoContainer>
            <DateContainer>
              <AppointmentMeta>
                <Icon name="calendar" size={18} color="#ff9000" />
                <AppointmentMetaText>{dateFormatted?.date}</AppointmentMetaText>
              </AppointmentMeta>
              <AppointmentMeta>
                <Icon name="clock" size={18} color="#ff9000" />
                <AppointmentMetaText>{dateFormatted?.hour}</AppointmentMetaText>
              </AppointmentMeta>
            </DateContainer>
          </AppointmentCard>
          <ButtonContainer>
            <EditButton
              onPress={() =>
                handleUpdateAppointment(appointment.provider.id, appointment.id)
              }
            >
              <EditButtonText>Editar</EditButtonText>
            </EditButton>
            <DeleteButton
              onPress={() =>
                handleDeleteAppointment(appointment.id, appointment.date)
              }
            >
              <DeleteButtonText>Cancelar{'\n'}agendamento</DeleteButtonText>
            </DeleteButton>
          </ButtonContainer>
        </AppointmentContainer>
      )}
      <NavBar />
    </Container>
  );
};

export default Dashboard;
