import { Button, ButtonText, HStack, Spinner, Switch, Toast, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import Base64SvgDisplay from '../../../core/components/Base64SvgDisplay';
import useServicesStore from '../../../core/zustand/useServiceStore';

const ConnectedServices = () => {
  const toast = useToast();
  const { userAuthorizedServices, fetchUserAuthorizedServices, isLoading } = useServicesStore(state => state);

  useEffect(() => {
    if (userAuthorizedServices.length > 0) {
      return;
    }
    try {
      fetchUserAuthorizedServices();
    } catch (error: any) {
      console.error('Error fetching automations', error);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast nativeID={'toast-' + id} action="error" variant="accent">
              <VStack space="sm">
                <ToastTitle>{error.response.data.detail}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    }
  }, []);

  if (isLoading) {
    return (
      <VStack justifyContent="center" alignItems="center" flex={1}>
        <Spinner size="large" />
      </VStack>
    );
  }

  // TODO: To check
  if (userAuthorizedServices.length === 0) {
    return (
      <VStack justifyContent="center" alignItems="center" flex={1}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>No connected services</Text>
        <Text style={{ fontSize: 14, marginBottom: 16 }}>You can connect services to create automations</Text>
        <Button
          // onPress={() => navigation.navigate('Services')}
          backgroundColor="#2E3A59"
          borderRadius={12}
          width={200}
          height={40}>
          <ButtonText>Connect services</ButtonText>
        </Button>
      </VStack>
    );
  }

  return (
    <FlatList
      style={{ margin: 12 }}
      data={userAuthorizedServices}
      keyExtractor={item => item.name}
      renderItem={({ item }) => (
        <HStack
          justifyContent="space-between"
          alignItems="center"
          height={60}
          flexDirection="row"
          marginVertical={8}
          borderRadius={12}
          backgroundColor="#F4F5F6"
          borderColor="#D8DADC"
          borderWidth={1}
          elevation={4}
          padding={16}
          marginHorizontal={12}>
          <HStack alignItems="center" justifyContent="flex-start" flexDirection="row">
            <Base64SvgDisplay base64Svg={item.icon_svg_base64} width={30} height={30} />

            <Text style={styles.title}>{item.name}</Text>
          </HStack>
          <Switch size="md" isDisabled={false} />
        </HStack>
      )}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 20,
    fontSize: 14.5,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.7)',
  },
});

export default ConnectedServices;
