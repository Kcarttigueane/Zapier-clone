import {
  Button,
  ButtonSpinner,
  ButtonText,
  EyeIcon,
  EyeOffIcon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword(showState => {
      return !showState;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text lineHeight="$xs" color="#484848" fontWeight="bold">
        Account Information
      </Text>
      <VStack space="md" margin="$2" padding="$2">
        <Text lineHeight="$xs" color="#484848" fontWeight="bold">
          Email
        </Text>
        <Input variant="outline" size="xl" borderWidth={2} isDisabled>
          <InputField placeholder="Enter Text here" />
        </Input>
        <Text lineHeight="$xs" color="#484848" fontWeight="bold">
          Password
        </Text>
        <Input variant="outline" size="xl" borderWidth={2} isDisabled>
          <InputField type={showPassword ? 'text' : 'password'} />
          <InputSlot pr="$3" onPress={handleState}>
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color="gray" />
          </InputSlot>
        </Input>
        <Button isDisabled={false} bg="$darkBlue600" gap={6}>
          <ButtonSpinner mr="$1" />
          <ButtonText fontWeight="$medium" fontSize="$sm">
            Please wait...
          </ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
