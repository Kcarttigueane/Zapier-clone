/* eslint-disable react-hooks/exhaustive-deps */
import { Button, ButtonText, ScrollView, Spinner, Toast, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { ActionModelDTO } from '../../../core/models/action';
import { ServiceModeWithAuthorizationDTO } from '../../../core/models/service';
import { TriggerModelDTO } from '../../../core/models/trigger';
import { capitalizeFirstLetter } from '../../../core/utils/capitalizeFirstLetter';
import { handleConnectService } from '../../../core/utils/handleConnectService';
import useActionStore from '../../../core/zustand/useActionStore';
import { useAuthStore } from '../../../core/zustand/useAuthStore';
import useServicesStore from '../../../core/zustand/useServiceStore';
import useTriggerStore from '../../../core/zustand/useTriggerStore';
import ItemModalDescription from '../components/ItemModalDescription';

type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServiceDetailScreen'>;

const ServiceDetailScreen = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const { service } = route.params;
  const { t } = useTranslation();
  const { triggersAssociatedToService, fetchTriggersByService, isTriggersLoading } = useTriggerStore(state => state);
  const { actionsAssociatedToService, isActionsLoading, fetchActionsByServiceId } = useActionStore(state => state);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<TriggerModelDTO | ActionModelDTO | null>(null);
  const { authorizeService } = useAuthStore(state => state);
  const { userAuthorizedServices, fetchUserAuthorizedServices } = useServicesStore(state => state);
  const [isAuthorized, setisAuthorized] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const getTriggers = async () => {
      try {
        await fetchTriggersByService(service.id);
      } catch (error: any) {
        console.error('Error fetching compatible services:', error);
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
    };

    const getActions = async () => {
      try {
        await fetchActionsByServiceId(service.id);
      } catch (error: any) {
        console.error('Error fetching compatible services:', error);
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
    };
    const getAuthorizedServices = async () => {
      try {
        await fetchUserAuthorizedServices();
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
    };
    getTriggers();
    getActions();
    if (userAuthorizedServices && userAuthorizedServices.length > 0) {
      const authorizedService = getServiceByName(userAuthorizedServices, service.name);
      if (authorizedService) {
        setisAuthorized(authorizedService.is_authorized);
      }
    } else {
      getTriggers();
      getActions();
      getAuthorizedServices();
    }
  }, [userAuthorizedServices]);

  const getServiceByName = (services: ServiceModeWithAuthorizationDTO[], serviceName: string) => {
    const serviceFound = services.find((item: ServiceModeWithAuthorizationDTO) => item.name === serviceName);
    return serviceFound;
  };

  const handleConnect = (serviceName: string) => handleConnectService(serviceName, authorizeService);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          paddingBottom: 50,
        }}>
        <View style={styles.cardsContainer}>
          <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
            {capitalizeFirstLetter(service.name)} {t('zap.create.integration')}
          </Text>
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' }}>
            {t(service.description)}
          </Text>
          <Button
            size="md"
            variant="solid"
            action="primary"
            isDisabled={service.name !== 'open meteo' ? isAuthorized : true}
            isFocusVisible={false}
            style={{ borderRadius: 30, width: 169, height: 40, backgroundColor: '#FFF', marginBottom: 10 }}
            onPress={() => handleConnect(service.name)}>
            <ButtonText style={{ color: 'black', fontSize: 16 }}>
              {isAuthorized ? t('zap.create.connected') : t('zap.create.authorize')}
            </ButtonText>
          </Button>
        </View>

        {isTriggersLoading && <Spinner size="large" />}
        {isActionsLoading && <Spinner size="large" />}
        {!isTriggersLoading && !isActionsLoading && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              width: '100%',
              gap: 16,
            }}>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'Inter',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginVertical: 10,
                }}>
                {t('basic.actions.names.trigger')}
              </Text>
              {triggersAssociatedToService.length === 0 ? (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textAlign: 'center',
                  }}>
                  {t('zap.create.noTrigger')}
                </Text>
              ) : (
                <VStack space="md" style={{ width: '100%' }} alignItems="center">
                  {triggersAssociatedToService.map(trigger => (
                    <Button
                      key={trigger.id}
                      size="md"
                      variant="outline"
                      action="secondary"
                      isDisabled={false}
                      isFocusVisible={false}
                      onPress={() => {
                        setSelectedItem(trigger);
                        setShowModal(true);
                      }}
                      style={{ width: '90%', height: 50, borderRadius: 30, borderWidth: 2, borderColor: '#613EEA' }}>
                      <ButtonText>{trigger.name}</ButtonText>
                    </Button>
                  ))}
                </VStack>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'Inter',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginVertical: 10,
                }}>
                {t('basic.actions.names.action')}
              </Text>
              {actionsAssociatedToService.length === 0 ? (
                <Text style={{ color: 'black', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' }}>
                  {t('zap.create.noAction')}
                </Text>
              ) : (
                <VStack space="md" style={{ width: '100%' }} alignItems="center">
                  {actionsAssociatedToService.map(action => (
                    <Button
                      key={action.id}
                      size="md"
                      variant="outline"
                      action="secondary"
                      isDisabled={false}
                      isFocusVisible={false}
                      onPress={() => {
                        setSelectedItem(action);
                        setShowModal(true);
                      }}
                      style={{
                        width: '90%',
                        height: 50,
                        borderRadius: 30,
                        borderWidth: 2,
                        borderColor: '#613EEA',
                      }}>
                      <ButtonText>{action.name}</ButtonText>
                    </Button>
                  ))}
                </VStack>
              )}
            </View>
          </View>
        )}
        {selectedItem && <ItemModalDescription item={selectedItem} showModal={showModal} setShowModal={setShowModal} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    backgroundColor: '#424242',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 250,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default ServiceDetailScreen;
