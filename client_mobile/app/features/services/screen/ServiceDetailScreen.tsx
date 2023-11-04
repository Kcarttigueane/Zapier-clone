/* eslint-disable react-hooks/exhaustive-deps */
import { Button, ButtonText, ScrollView, Spinner, Toast, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { ActionModelDTO } from '../../../core/models/action';
import { TriggerModelDTO } from '../../../core/models/trigger';
import { capitalizeFirstLetter } from '../../../core/utils/capitalizeFirstLetter';
import useActionStore from '../../../core/zustand/useActionStore';
import useTriggerStore from '../../../core/zustand/useTriggerStore';
import ItemModalDescription from '../components/ItemModalDescription';

type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServiceDetailScreen'>;

const ServiceDetailScreen = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const { service } = route.params;
  const { triggersAssociatedToService, fetchTriggersByService, isTriggersLoading } = useTriggerStore(state => state);
  const { actionsAssociatedToService, isActionsLoading, fetchActionsByServiceId } = useActionStore(state => state);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<TriggerModelDTO | ActionModelDTO | null>(null);

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
    getTriggers();
    getActions();
  }, []);

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
            {capitalizeFirstLetter(service.name)} Integrations
            {/* TODO : Translation */}
          </Text>
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' }}>
            {service.description}
          </Text>
          <Button
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            style={{ borderRadius: 30, width: 119, height: 40, backgroundColor: '#FFF', marginBottom: 10 }}
            onPress={() => console.log('Connect')}>
            <ButtonText style={{ color: 'black', fontSize: 16 }}>Authorize</ButtonText>
            {/* TODO : Translation */}
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
                Trigger
                {/* TODO : Translation */}
              </Text>
              {triggersAssociatedToService.length === 0 ? (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textAlign: 'center',
                  }}>
                  No trigger available for this service
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
                Actions
                {/* TODO : Translation */}
              </Text>
              {actionsAssociatedToService.length === 0 ? (
                <Text style={{ color: 'black', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' }}>
                  No trigger available for this service
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
