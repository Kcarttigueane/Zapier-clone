import {
  Box,
  ChevronDownIcon,
  FormControl,
  Icon,
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
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const items = [
  { name: 'settings.settingScreen.help.bug', value: 'bug' },
  { name: 'settings.settingScreen.help.issue', value: 'issue' },
  { name: 'settings.settingScreen.help.feature', value: 'feature' },
  { name: 'settings.settingScreen.help.question', value: 'question' },
  { name: 'settings.settingScreen.help.other', value: 'other' },
];

const Help = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <FormControl size="md" isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={false}>
        <Select>
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Select option" />
            <SelectIcon mr="$3">
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent height="100%">
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {items.map((item, index) => (
                <SelectItem key={index} label={t(item.name)} value={item.name} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
        <Box height={8} />
        <Text>Message</Text>
        <Box height={8} />
        <Textarea>
          <TextareaInput />
        </Textarea>
      </FormControl>
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
});
