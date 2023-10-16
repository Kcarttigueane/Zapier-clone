import { Button, ButtonText, VStack } from '@gluestack-ui/themed';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const TriggerButton = ({ message }: { message: string }) => {
  const handleClickAction = () => {
    console.log('click on button with trigger or reaction : ' + message);
  };

  return (
    <Button
      size="md"
      variant="outline"
      action="secondary"
      isDisabled={false}
      isFocusVisible={false}
      style={{ width: '90%', height: 50, borderRadius: 30, borderWidth: 2 }}
      onPress={handleClickAction}>
      <ButtonText>{message} </ButtonText>
    </Button>
  );
};

const TriggerZap = ({ url }: { url: any }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.card}>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 24,
            color: 'black',
            fontWeight: 'bold',
          }}>
          Choose a Trigger
        </Text>
        <View style={{ width: 100, height: 90 }}>
          <Image style={{ width: '100%', height: '100%', marginBottom: 30 }} source={url} resizeMode="cover" />
        </View>
        <Text style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 18, color: 'black' }}>
          neque egestas congue quisque egestas diam in arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc
          sed blandit libero
        </Text>
      </View>
      <VStack space="lg" alignItems="center" justifyContent="center" style={{ width: '100%' }}>
        <TriggerButton message="New comment on tweet" />
        <TriggerButton message="New like on tweet" />
      </VStack>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 300,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonTrigger: {
    width: '80%',
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
export default TriggerZap;