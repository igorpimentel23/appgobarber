import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {
  Container,
  Title,
  Description,
  OKButton,
  OKButtonText,
} from './styles';

interface RouteParams {
  date: number;
  type: 'create' | 'update' | 'delete';
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const [type, setType] = useState<'create' | 'update' | 'delete'>('create');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const routeParams = params as RouteParams;

  useEffect(() => {
    if (routeParams.type) {
      setType(routeParams.type);
    }
  }, [routeParams]);

  const handleOKPressed = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      {
        locale: ptBR,
      },
    );
  }, [routeParams.date]);

  const pageText = useMemo(() => {
    return {
      create: {
        title: 'Agendamento concluído',
        description: `${formattedDate}`,
      },
      delete: {
        title: 'Agendamento cancelado',
        description: `O agendamento de ${formattedDate}, foi cancelado com sucesso`,
      },
      update: {
        title: 'Agendamento atualizado',
        description: `O agendamento de ${formattedDate}, foi atualizado com sucesso`,
      },
    };
  }, []);

  useEffect(() => {
    setTitle(pageText[type].title);
    setDesc(pageText[type].description);
  }, [pageText, type]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>{title}</Title>
      <Description>{desc}</Description>

      <OKButton onPress={handleOKPressed}>
        <OKButtonText>OK</OKButtonText>
      </OKButton>
    </Container>
  );
};

export default AppointmentCreated;
