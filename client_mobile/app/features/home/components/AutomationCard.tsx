import { HStack, Image, Text, VStack, View } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MockupAutomationData } from '../screen/HomeScreen';

interface AutomationCardProps {
  item: MockupAutomationData;
  key: number;
}

const AutomationCard: React.FC<AutomationCardProps> = ({ item }) => {
  const handleCardClick = (selectedItem: MockupAutomationData) => {
    console.log('click with message ' + selectedItem.title);
  };

  return (
    <TouchableOpacity onPress={() => handleCardClick(item)}>
      <View style={styles.card}>
        <VStack gap={12}>
          <HStack alignItems="center" gap={12}>
            <Image source={item.serviceLogo1} width={30} height={30} alt="service logo" />
            <Image source={item.serviceLogo2} width={30} height={30} alt="service logo" />
          </HStack>
          <Text fontSize="$lg" fontWeight="bold" color="black">
            {item.title}
          </Text>
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
