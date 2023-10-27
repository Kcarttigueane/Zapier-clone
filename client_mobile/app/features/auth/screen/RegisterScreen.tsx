import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonText,
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  ChevronDownIcon,
  Divider,
  EyeIcon,
  EyeOffIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  HStack,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Link,
  LinkText,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import i18next from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { registerValidationSchema } from '../utils/formValidation';
import { languageSelectionValues } from '../utils/languageSelection';
import { useAuthStore } from '../../../core/zustand/useAuthStore';

const IMAGE_PATH = '../../../core/assets';

const socialButtonLogo = [
  {
    img: require(`${IMAGE_PATH}/spotify.png`),
    color: '#000000',
  },
  {
    img: require(`${IMAGE_PATH}/google.png`),
    color: '#FFFFFF',
  },
  {
    img: require(`${IMAGE_PATH}/apple.png`),
    color: '#000000',
  },
];

interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;
type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
type RegisterScreenProps = {
  route: RegisterScreenRouteProp;
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const { registerFn, isLoading, error } = useAuthStore(state => state);
  const { t } = useTranslation();
  const { language } = i18next;
  const [languageSelected, setLanguageSelected] = useState(
    language === languageSelectionValues[0].value ? languageSelectionValues[0].value : languageSelectionValues[1].value,
  );

  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword(showState => {
      return !showState;
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    setTimeout(() => {
      useAuthStore.setState({ error: null });
    }, 5000);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error} wait 5 seconds</Text>
      </View>
    );
  }

  const onSubmit = async (values: RegisterDTO) => {
    const { firstName, lastName, email, password } = values;
    await registerFn(firstName, lastName, email, password);
  };

  const handleLanguageChange = (value: string) => {
    setLanguageSelected(value);
    i18next.changeLanguage(value);
  };

  const selectedLanguageLabel = languageSelectionValues.find(lang => lang.value === languageSelected)?.label;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HStack justifyContent="space-between" alignItems="center" width="100%">
          <Text style={styles.title}>Area.</Text>

          <Select width={80} onValueChange={handleLanguageChange} defaultValue={selectedLanguageLabel}>
            <SelectTrigger variant="rounded" size="md" width={80}>
              <SelectInput mt="$1" />
              <SelectIcon mr="$3">
                <Icon as={ChevronDownIcon} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent borderRadius={12} elevation={4} backgroundColor="$white" height="100%">
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {languageSelectionValues.map((lang, index) => (
                  <SelectItem
                    key={index}
                    label={lang.label}
                    value={lang.value}
                    justifyContent="center"
                    alignItems="center"
                    height={60}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </HStack>
        <VStack justifyContent="center" space="sm" alignItems="center">
          <Text style={styles.title}>{t('auth.register.title')}</Text>
          <Text style={styles.subTitle}>{t('auth.register.welcome')}</Text>
          <HStack justifyContent="center" alignItems="center" gap={48} mt="$3">
            {socialButtonLogo.map((item, index) => {
              return (
                <Box key={index} bg={item.color} p="$4" borderRadius={12} height={60} width={60} elevation={4}>
                  <Image source={item.img} style={{ height: '100%', width: '100%' }} resizeMode="cover" />
                </Box>
              );
            })}
          </HStack>
          <HStack space="sm" mt="$2" justifyContent="center" alignItems="center">
            <Divider orientation="horizontal" bg="$trueGray300" width="24%" />
            <Text size="md" marginHorizontal={8}>
              {t('basic.actions.or')}
            </Text>
            <Divider orientation="horizontal" bg="$trueGray300" width="24%" />
          </HStack>
          <Formik
            initialValues={{
              firstName: 'Oliver',
              lastName: 'Lewis',
              email: 'oliver.lewis@masurao.jp',
              password: 'password',
            }}
            onSubmit={values => onSubmit(values)}
            validationSchema={registerValidationSchema}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <FormControl
                width="100%"
                isInvalid={!!errors.email || !!errors.password || !!errors.firstName || !!errors.lastName}>
                <VStack space="xl">
                  <VStack space="sm">
                    <Text lineHeight="$md" color="#484848" fontWeight="bold">
                      FirstName
                    </Text>
                    <Input variant="outline" size="xl" borderWidth={2} borderRadius={8} isInvalid={!!errors.email}>
                      <InputField
                        placeholder="Oliver"
                        size="md"
                        onBlur={handleBlur('firstName')}
                        onChangeText={handleChange('firstName')}
                        value={values.firstName}
                      />
                    </Input>
                    {errors.firstName && (
                      <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>{errors.firstName}</FormControlErrorText>
                      </FormControlError>
                    )}
                  </VStack>
                  <VStack space="sm">
                    <Text lineHeight="$md" color="#484848" fontWeight="bold">
                      LastName
                    </Text>
                    <Input variant="outline" size="xl" borderWidth={2} borderRadius={8} isInvalid={!!errors.email}>
                      <InputField
                        placeholder="Lewis"
                        size="md"
                        onBlur={handleBlur('lastName')}
                        onChangeText={handleChange('lastName')}
                        value={values.lastName}
                      />
                    </Input>
                    {errors.lastName && (
                      <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>{errors.lastName}</FormControlErrorText>
                      </FormControlError>
                    )}
                  </VStack>
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
                  </VStack>
                  <Checkbox size="md" isInvalid={false} isDisabled={false} value="off" aria-label="Keep me signed in">
                    <CheckboxIndicator mr="$2" aria-label="Keep me signed in">
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel fontSize={14}>{t('auth.terms')}</CheckboxLabel>
                  </Checkbox>
                  <Button height={48} borderRadius={25} backgroundColor="#2F4EFF" onPress={() => handleSubmit()}>
                    <ButtonText color="$white">{t('auth.register.title')}</ButtonText>
                  </Button>
                </VStack>
              </FormControl>
            )}
          </Formik>
          <HStack space="sm" justifyContent="center" alignItems="center">
            <Text fontSize={16}>{t('auth.haveAccount')}</Text>
            <Link justifyContent="center" alignItems="center" onPress={() => navigation.navigate('Login')}>
              <LinkText color="#2F4EFF" fontWeight="bold" fontSize={16}>
                {t('auth.login.title')}
              </LinkText>
            </Link>
          </HStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
