import {
  AlertCircleIcon,
  Button,
  ButtonText,
  ChevronDownIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  HStack,
  Icon,
  Input,
  InputField,
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
import { Formik } from 'formik';
import i18next from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import { emailValidationSchema } from '../../utils/formValidation';
import { languageSelectionValues } from '../../utils/languageSelection';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const { language } = i18next;
  const [languageSelected, setLanguageSelected] = useState(
    language === languageSelectionValues[0].value ? languageSelectionValues[0].value : languageSelectionValues[1].value,
  );

  const handleLanguageChange = (value: string) => {
    setLanguageSelected(value);
    i18next.changeLanguage(value);
  };

  const onSubmit = async (values: string) => {
    console.log(values);
  };

  const selectedLanguageLabel = languageSelectionValues.find(lang => lang.value === languageSelected)?.label;

  return (
    <SafeAreaView style={styles.container}>
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
      <VStack justifyContent="center" space="4xl" alignItems="center" mt="$4">
        <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
        <Text style={styles.subTitle}>{t('auth.forgotPassword.welcome')}</Text>

        <Formik
          initialValues={{ email: 'oliver.lewis@masurao.jp' }}
          onSubmit={value => onSubmit(value.email)}
          validationSchema={emailValidationSchema}>
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <FormControl width="100%" isInvalid={!!errors.email}>
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
                <Button height={48} borderRadius={25} backgroundColor="#2F4EFF" onPress={() => handleSubmit()}>
                  <ButtonText color="$white">{t('basic.actions.confirm')}</ButtonText>
                </Button>
              </VStack>
            </FormControl>
          )}
        </Formik>
      </VStack>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    flex: 1,
    gap: 48,
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
