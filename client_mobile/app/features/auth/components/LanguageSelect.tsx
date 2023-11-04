import {
  ChevronDownIcon,
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
} from '@gluestack-ui/themed';
import i18next from 'i18next';
import React, { useState } from 'react';
import { languageSelectionValues } from '../utils/languageSelection';

const LanguageSelect = () => {
  const { language } = i18next;
  const [languageSelected, setLanguageSelected] = useState(
    language === languageSelectionValues[0].value ? languageSelectionValues[0].value : languageSelectionValues[1].value,
  );

  const handleLanguageChange = (value: string) => {
    setLanguageSelected(value);
    i18next.changeLanguage(value);
  };

  const selectedLanguageLabel = languageSelectionValues.find(lang => lang.value === languageSelected)?.label;

  return (
    <Select width={80} onValueChange={handleLanguageChange} defaultValue={selectedLanguageLabel}>
      <SelectTrigger variant="rounded" size="md" width={80}>
        <SelectInput mt="$1" />
        <SelectIcon mr="$3">
          <Icon as={ChevronDownIcon} />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent borderRadius={12} elevation={4} backgroundColor="$white" height="50%">
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
  );
};

export default LanguageSelect;
