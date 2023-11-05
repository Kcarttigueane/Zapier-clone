import { HStack, Text, VStack, View } from '@gluestack-ui/themed';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Base64SvgDisplay from '../../../core/components/Base64SvgDisplay';
import { DetailedAutomationDTO } from '../../../core/models/automation';

interface ArchivedCardProps {
  item: DetailedAutomationDTO;
  key: number;
}

const ArchivedCard: React.FC<ArchivedCardProps> = ({ item }) => {
  const handleCardClick = (selectedItem: DetailedAutomationDTO) => {
    console.log('click with message ' + selectedItem.name);
  };

  return (
    <View style={styles.card}>
      <VStack gap={12}>
        <HStack alignItems="center" gap={12}>
          <Base64SvgDisplay base64Svg={item.trigger_service.icon_svg_base64} width={32} height={32} />
          <Base64SvgDisplay base64Svg={item.action_service.icon_svg_base64} width={32} height={32} />
        </HStack>
        <Text fontSize="$lg" fontWeight="bold" color="black">
          {item.name}
        </Text>
      </VStack>
      <Pressable onPress={() => handleCardClick(item)} style={styles.button}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>Restore</Text>
      </Pressable>
    </View>
  );
};

export default ArchivedCard;

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    margin: 8,
    backgroundColor: 'white',
    height: 200,
    borderRadius: 20,
    padding: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: '#FFF',
    width: 100,
    height: 40,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 30,
    paddingVertical: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});
