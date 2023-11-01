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
import React from 'react';
import { ActionModelDTO } from '../../../core/models/action';
import { ServiceModelDTO } from '../../../core/models/service';
import { TriggerModelDTO } from '../../../core/models/trigger';
import { capitalizeFirstLetter } from '../../../core/utils/capitalizeFirstLetter';

type CustomSelectProps = {
  items: Array<ServiceModelDTO | TriggerModelDTO | ActionModelDTO>;
  onValueChange: (value: string) => void;
  placeholder: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ items, onValueChange, placeholder }) => (
  <Select onValueChange={onValueChange}>
    <SelectTrigger variant="outline" size="lg">
      <SelectInput placeholder={placeholder} />
      <SelectIcon mr="$3">
        <Icon as={ChevronDownIcon} />
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
        {items.map((item, index) => (
          <SelectItem key={index} label={capitalizeFirstLetter(item.name)} value={item.id} />
        ))}
      </SelectContent>
    </SelectPortal>
  </Select>
);

export default CustomSelect;
