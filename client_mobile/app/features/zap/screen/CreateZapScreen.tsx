import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type ZapScreenRouteProp = RouteProp<RootStackParamList, 'CreateZapScreen'>;
export type ZapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateZapScreen'>;
type ZapScreenProps = {
  route: ZapScreenRouteProp;
  navigation: ZapScreenNavigationProp;
};

const CreateZapScreen = ({ navigation }: ZapScreenProps) => {
  const isTrigger = true; // Définissez votre valeur de boolean ici
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('ServicesZapScreen')}>
        <Text>CreateZapScreen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateZapScreen;
