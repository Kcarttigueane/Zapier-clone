import { Button, ButtonText, VStack } from '@gluestack-ui/themed';
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { ZapScreenNavigationProp } from '../screen/CreateZapScreen';

type ZapReactionRouteProp = RouteProp<RootStackParamList, 'ZapReactionScreen'>;

const ReactionButton = ({ message, navigation }: { message: string; navigation: ZapScreenNavigationProp }) => {
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

const ReactionZap = ({ navigation }: { navigation: ZapScreenNavigationProp }) => {
  const route = useRoute<ZapReactionRouteProp>();
  const { logo } = route.params;
  return (
    <View style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <View style={styles.card}>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 24,
            color: 'black',
            fontWeight: 'bold',
          }}>
          Choose a Reaction
        </Text>
        <View style={{ width: 100, height: 90 }}>
          <Image style={{ width: '100%', height: '100%', marginBottom: 30 }} source={logo} resizeMode="cover" />
        </View>
        <Text style={{ textAlign: 'center', fontSize: 18, color: 'black' }}>
          A free email service developed by Google. Users can access Gmail on the web and using third-party programs
          that synchronize email content through POP or IMAP protocols.
        </Text>
      </View>
      <VStack space="lg" alignItems="center" justifyContent="center" style={{ width: '100%' }}>
        <ReactionButton message="Post a message to a channel" navigation={navigation} />
        <ReactionButton message="Post a message to a channel" navigation={navigation} />
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
  },
});
export default ReactionZap;
