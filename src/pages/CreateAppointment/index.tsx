import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { useToast } from '../../hooks/toast';
import Header from '../../components/Header';

import {
  Container,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';
import api from '../../services/api';
import NavBar from '../../components/NavBar';

interface RouteParams {
  providerId: string;
  appointmentId?: string;
  type: 'create' | 'update' | 'delete';
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const { addToast } = useToast();
  const { navigate, reset } = useNavigation();
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [type, setType] = useState<'create' | 'update' | 'delete'>('create');
  const [appointment_id, setAppointment_id] = useState(
    routeParams.appointmentId,
  );
  useEffect(() => {
    setSelectedProvider(routeParams.providerId);
    setAppointment_id(routeParams.appointmentId);
    if (routeParams.type) {
      setType(routeParams.type);
    }
  }, [routeParams]);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleSelectedHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleSelectedAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      if (type === 'update') {
        await api.put('appointments', {
          appointment_id: appointment_id,
          provider_id: selectedProvider,
          date,
        });
      } else if (type === 'create') {
        await api.post('appointments', {
          provider_id: selectedProvider,
          date,
        });
      }

      reset({
        routes: [
          {
            name: 'Dashboard',
          },
          {
            name: 'AppointmentCreated',
            params: {
              date: date.getTime(),
              type: type,
            },
          },
        ],
        index: 0,
      });
    } catch (err) {
      addToast({
        title: 'Erro ao criar o agendamento',
        description: 'Ocorreu um erro ao criar o agendamento, tente novamente',
        type: 'error',
      });
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider, reset]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  return (
    <Container>
      <Header />

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChanged}
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={available && selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectedHour(hour)}
                >
                  <HourText selected={available && selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={available && selectedHour === hour}
                    available={available}
                    key={hourFormatted}
                    onPress={() => handleSelectedHour(hour)}
                  >
                    <HourText selected={available && selectedHour === hour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleSelectedAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
      <NavBar />
    </Container>
  );
};

export default CreateAppointment;
