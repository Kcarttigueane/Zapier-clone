import { HStack, VStack, View } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Base64SvgDisplay from '../../../core/components/Base64SvgDisplay';
import { DetailedAutomationDTO } from '../../../core/models/automation';

interface AutomationCardProps {
  item: DetailedAutomationDTO;
  key: number;
}

const AutomationCard: React.FC<AutomationCardProps> = ({ item }) => {
  const handleCardClick = (selectedItem: DetailedAutomationDTO) => {
    console.log('click with message ' + selectedItem.name);
  };

  return (
    <TouchableOpacity onPress={() => handleCardClick(item)}>
      <View style={styles.card}>
        <VStack gap={12}>
          <HStack alignItems="center" gap={12}>
            <Base64SvgDisplay base64Svg={item.trigger_service.icon_svg_base64} width={32} height={32} />
            <Base64SvgDisplay base64Svg={item.action_service.icon_svg_base64} width={32} height={32} />
          </HStack>
          <Text>{item.name}</Text>
        </VStack>
      </View>
    </TouchableOpacity>
  );
};

export default AutomationCard;

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    margin: 8,
    backgroundColor: 'white',
    height: 140,
    borderRadius: 20,
    padding: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
