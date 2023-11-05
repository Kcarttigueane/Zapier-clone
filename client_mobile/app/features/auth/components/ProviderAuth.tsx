import { Box, HStack } from '@gluestack-ui/themed';
import React from 'react';
import { Image, Pressable } from 'react-native';
import { useAuthStore } from '../../../core/zustand/useAuthStore';

const socialButtonLogo = [
  {
    img: require('../../../core/assets/providerAuthLogo/github.png'),
    color: '#FFFFFF',
  },
  {
    img: require('../../../core/assets/providerAuthLogo/Google.png'),
    color: '#FFFFFF',
  },
  {
    img: require('../../../core/assets/providerAuthLogo/Spotify.png'),
    color: '#FFFFFF',
  },
];

const ProviderAuth = () => {
  const { loginWithGoogle, loginWithSpotify, loginWithGitHub } = useAuthStore(state => state);

  const handleProviders = async (key: number) => {
    if (key === 0) {
      loginWithGitHub();
    } else if (key === 1) {
      loginWithGoogle();
    } else {
      loginWithSpotify();
    }
  };

  return (
    <HStack justifyContent="center" alignItems="center" gap={48} mt="$3">
      {socialButtonLogo.map((item, index) => {
        return (
          <Pressable key={index} onPress={() => handleProviders(index)}>
            <Box
              key={index}
              bg={item.color}
              p="$4"
              borderRadius={12}
              height={60}
              width={60}
              elevation={4}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={item.img} style={{ height: 32, width: 32 }} resizeMode="cover" />
            </Box>
          </Pressable>
        );
      })}
    </HStack>
  );
};

export default ProviderAuth;
