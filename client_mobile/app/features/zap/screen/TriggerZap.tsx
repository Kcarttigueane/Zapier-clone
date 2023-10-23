import { Button, ButtonText, VStack } from '@gluestack-ui/themed';
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { ZapScreenNavigationProp } from '../screen/CreateZapScreen';
import { useTranslation } from 'react-i18next';

type ZapReactionRouteProp = RouteProp<RootStackParamList, 'ZapReactionScreen'>;

const TriggerButton = ({ message, navigation }: { message: string; navigation: ZapScreenNavigationProp }) => {
  const handleClickAction = () => {
    console.log('click on button with trigger or reaction : ' + message);
    navigation.navigate('CreateZapScreen');
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

const TriggerZap = ({ navigation }: { navigation: ZapScreenNavigationProp }) => {
  const route = useRoute<ZapReactionRouteProp>();
  const { logo } = route.params;
  const { t } = useTranslation();
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
          {t('zap.triggerScreen.title')}
        </Text>
        <View style={{ width: 100, height: 90 }}>
          <Image style={{ width: '100%', height: '100%', marginBottom: 30 }} source={logo} resizeMode="cover" />
        </View>
        <Text style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 18, color: 'black' }}>
          neque egestas congue quisque egestas diam in arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc
          sed blandit libero
        </Text>
      </View>
      <VStack space="lg" alignItems="center" justifyContent="center" style={{ width: '100%' }}>
        <TriggerButton message="New comment on tweet" navigation={navigation} />
        <TriggerButton message="New like on tweet" navigation={navigation} />
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
