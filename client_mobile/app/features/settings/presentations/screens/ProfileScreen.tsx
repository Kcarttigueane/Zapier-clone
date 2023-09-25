import React from 'react';
import { SafeAreaView } from 'react-native';
import { Input, YStack } from 'tamagui';

const ProfileScreen = () => {
  return (
    <SafeAreaView>
      <YStack minHeight={250} overflow="hidden" space="$2" margin="$3" padding="$2">
        <Input size="$5" borderWidth={2} placeholder="Email" />
        <Input size="$5" borderWidth={2} placeholder="Password" secureTextEntry={true} />
      </YStack>
    </SafeAreaView>
  );
};

export default ProfileScreen;
