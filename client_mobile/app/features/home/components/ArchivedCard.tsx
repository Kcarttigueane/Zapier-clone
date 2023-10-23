import { HStack, Image, Text, VStack, View } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { MockupAutomationData } from '../screen/HomeScreen';

interface ArchivedCardProps {
  item: MockupAutomationData;
  key: number;
}

const ArchivedCard: React.FC<ArchivedCardProps> = ({ item }) => {
  const handleCardClick = (selectedItem: MockupAutomationData) => {
    console.log('click with message ' + selectedItem.title);
  };

  return (
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
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 30,
    paddingVertical: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});
