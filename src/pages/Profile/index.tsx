import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import api from '../../services/api';

import { FormHandles } from '@unform/core';

import getValidationErrors from '../../util/getValidadtionErrors';
import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  FormStyled,
  UserAvatarButton,
  UserAvatar,
  ButtonContainer,
  BackButton,
  LogoutButton,
  AnimatedDiv,
} from './styles';
import { useAuth } from '../../hooks/Auth';
import { useSpring } from 'react-spring';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const SignUp: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();

  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const [isNameFilled, setIsNameFilled] = useState(false);
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const { addToast } = useToast();

  useEffect(() => {
    setIsNameFilled(!!formRef.current?.getFieldValue('name'));
    setIsEmailFilled(!!formRef.current?.getFieldValue('email'));
  }, []);

  const handlePasswordInputFocus = useCallback(() => {
    setIsPasswordFocused(true);
  }, []);

  const handlePasswordInputBlur = useCallback(() => {
    setIsPasswordFocused(false);

    setIsPasswordFilled(!!formRef.current?.getFieldValue('password'));
  }, []);

  const handleProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: string) => (val !== undefined ? !!val.length : false),
            then: Yup.string()
              .min(6, 'A senha deve conter no mínimo 6 caracteres')
              .required('Campo obrigatório'),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val: string) => (val !== undefined ? !!val.length : false),
              then: Yup.string().required('Campo obrigatório'),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('profile', formData);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description:
            'Suas informações do perfil foram atualizados com sucesso!',
        });

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          err.inner.forEach(error => {
            if (!!error.path) {
              addToast({
                type: 'error',
                title: error.message,
              });
            }
          });

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização do perfil',
          description: 'Erro na atualização, tente novamente.',
        });
      }
    },
    [navigation],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const { height, opacity } = useSpring({
    from: { height: 0, opacity: 0 },
    height: isPasswordFilled || isPasswordFocused ? 128 : 0,
    opacity: isPasswordFilled || isPasswordFocused ? 1 : 0,
  });

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <ButtonContainer>
              <BackButton onPress={handleGoBack}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>
              <LogoutButton onPress={signOut}>
                <Icon name="power" size={24} color="#999591" />
              </LogoutButton>
            </ButtonContainer>

            <UserAvatarButton onPress={() => {}}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <FormStyled
              initialData={user}
              ref={formRef}
              onSubmit={handleProfile}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                filled={isNameFilled}
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                  handleProfile;
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                filled={isEmailFilled}
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                  handleProfile;
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                onFocus={handlePasswordInputFocus}
                onBlur={handlePasswordInputBlur}
                filled={isPasswordFilled}
                focused={isPasswordFocused}
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                  handleProfile;
                }}
              />
              <AnimatedDiv
                style={{
                  height: height.interpolate({ range: [0, 1], output: [0, 1] }),
                  opacity: opacity.interpolate({
                    range: [0, 1],
                    output: [0, 1],
                  }),
                }}
              >
                <Input
                  ref={confirmPasswordInputRef}
                  secureTextEntry
                  name="password_confirmation"
                  icon="lock"
                  placeholder="Confirmar nova senha"
                  textContentType="newPassword"
                  returnKeyType="send"
                  onSubmitEditing={() => {
                    oldPasswordInputRef.current?.focus();
                    handleProfile;
                  }}
                />
                <Input
                  ref={oldPasswordInputRef}
                  secureTextEntry
                  name="old_password"
                  icon="lock"
                  placeholder="Senha atual"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    formRef.current?.submitForm();
                    handleProfile;
                  }}
                />
              </AnimatedDiv>

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar mudanças
              </Button>
            </FormStyled>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
