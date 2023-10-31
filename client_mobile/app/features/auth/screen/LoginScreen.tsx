import {
  AlertCircleIcon,
  Button,
  ButtonSpinner,
  ButtonText,
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  Divider,
  EyeIcon,
  EyeOffIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  HStack,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Link,
  LinkText,
  Text,
  Toast,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../../App';
import { useAuthStore } from '../../../core/zustand/useAuthStore';
import LanguageSelect from '../components/LanguageSelect';
import ProviderAuth from '../components/ProviderAuth';
import { loginValidationSchema } from '../utils/formValidation';

type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenProps = {
  route: LoginScreenRouteProp;
  navigation: LoginScreenNavigationProp;
};

interface LoginDTO {
  email: string;
  password: string;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { loginFn, isLoading } = useAuthStore(state => state);
  const toast = useToast();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const handleState = () => setShowPassword(showState => !showState);

  const onLoginSubmit = async (values: LoginDTO) => {
    const { email, password } = values;

    try {
      await loginFn(email, password);
    } catch (error: any) {
      console.error('Error registering user:', error.response.data.detail);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast nativeID={'toast-' + id} action="error" variant="accent">
              <VStack space="sm">
                <ToastTitle>{error.response.data.detail}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HStack justifyContent="space-between" alignItems="center" width="100%">
        <Text style={styles.title}>Area.</Text>
        <LanguageSelect />
      </HStack>
      <VStack justifyContent="center" space="sm" alignItems="center">
        <Text style={styles.title}>{t('auth.login.title')}</Text>
        <Text style={styles.subTitle}>{t('auth.login.welcome')}</Text>
        <ProviderAuth />
        <HStack space="sm" mt="$2" justifyContent="center" alignItems="center">
          <Divider orientation="horizontal" bg="$trueGray300" width="24%" />
          <Text size="md" marginHorizontal={8}>
            {t('basic.actions.or')}
          </Text>
          <Divider orientation="horizontal" bg="$trueGray300" width="24%" />
        </HStack>
        <Formik
          initialValues={{ email: 'oliver.lewis@masurao.jp', password: 'password' }}
          onSubmit={values => onLoginSubmit(values)}
          validationSchema={loginValidationSchema}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <FormControl width="100%" isInvalid={!!errors.email || !!errors.password}>
              <VStack space="xl">
                <VStack space="sm">
                  <Text lineHeight="$md" color="#484848" fontWeight="bold">
                    {t('basic.fields.email')}
                  </Text>
                  <Input variant="outline" size="xl" borderWidth={2} borderRadius={8} isInvalid={!!errors.email}>
                    <InputField
                      placeholder="johnDoe@gmail.com"
                      size="md"
                      onBlur={handleBlur('email')}
                      onChangeText={handleChange('email')}
                      value={values.email}
                    />
                  </Input>
                  {errors.email && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>{errors.email}</FormControlErrorText>
                    </FormControlError>
                  )}
                </VStack>
                <VStack space="sm">
                  <Text lineHeight="$md" color="#484848" fontWeight="bold">
                    {t('basic.fields.password')}
                  </Text>
                  <Input variant="outline" size="xl" borderWidth={2} borderRadius={8} isInvalid={!!errors.password}>
                    <InputField
                      type={showPassword ? 'text' : 'password'}
                      placeholder="password"
                      size="md"
                      onBlur={handleBlur('password')}
                      onChangeText={handleChange('password')}
                      value={values.password}
                    />
                    <InputSlot pr="$3" onPress={handleState}>
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color="gray" />
                    </InputSlot>
                  </Input>
                  {touched.password && errors.password && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>{errors.password}</FormControlErrorText>
                    </FormControlError>
                  )}
                  <Link alignSelf="flex-end" onPress={() => navigation.navigate('ForgotPassword')}>
                    <LinkText color="#2F4EFF" fontWeight="bold" fontSize={14}>
                      {t('auth.passwordForgotten')}
                    </LinkText>
                  </Link>
                </VStack>
                <Checkbox size="md" isInvalid={false} isDisabled={false} value="off" aria-label="Keep me signed in">
                  <CheckboxIndicator mr="$2" aria-label="Keep me signed in">
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{t('basic.fields.keepMeLoggedIn')}</CheckboxLabel>
                </Checkbox>
                <Button
                  height={48}
                  borderRadius={25}
                  backgroundColor="#2F4EFF"
                  onPress={() => handleSubmit()}
                  isDisabled={isLoading}>
                  {isLoading && <ButtonSpinner mr="$1" />}
                  <ButtonText color="$white">{t('auth.login.title')}</ButtonText>
                </Button>
              </VStack>
            </FormControl>
          )}
        </Formik>
        <HStack space="sm" justifyContent="center" alignItems="center" mt={8}>
          <Text fontSize={16}>{t('auth.noAccount')}</Text>
          <Link justifyContent="center" alignItems="center" onPress={() => navigation.navigate('Register')}>
            <LinkText color="#2F4EFF" fontWeight="bold" fontSize={16}>
              {t('auth.register.title')}
            </LinkText>
          </Link>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    flex: 1,
    gap: 24,
  },
  image: {
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 45,
    letterSpacing: 0,
    textAlign: 'left',
    color: 'black',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#8b8b8b',
  },
});
