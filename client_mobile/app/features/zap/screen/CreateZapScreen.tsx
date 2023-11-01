import { FormControl, Heading, Toast, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../../App';
import { ActionModelDTO } from '../../../core/models/action';
import { ServiceModelDTO } from '../../../core/models/service';
import { TriggerModelDTO } from '../../../core/models/trigger';
import useActionStore from '../../../core/zustand/useActionStore';
import useServicesStore from '../../../core/zustand/useServiceStore';
import useTriggerStore from '../../../core/zustand/useTriggerStore';
import CustomSelect from '../components/CustomSelect';

type ZapScreenRouteProp = RouteProp<RootStackParamList, 'CreateZapScreen'>;
type ZapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateZapScreen'>;
type ZapScreenProps = {
  route: ZapScreenRouteProp;
  navigation: ZapScreenNavigationProp;
};

const CreateZapScreen = ({ navigation }: ZapScreenProps) => {
  const { t } = useTranslation();

  const [selectedTriggerService1, setSelectedTriggerService1] = useState<ServiceModelDTO['id'] | null>(null);
  const [selectedActionService2, setSelectedActionService2] = useState<ServiceModelDTO['id'] | null>(null);
  const [selectedTriggerId, setSelectedTriggerId] = useState<TriggerModelDTO['id'] | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<ActionModelDTO['id'] | null>(null);

  const { services, compatibleServices, fetchServices, fetchCompatibleServices } = useServicesStore(state => state);
  const { actionsAssociatedToTrigger, fetchActionsByTriggerId, isActionsLoading } = useActionStore(state => state);
  const { triggersAssociatedToService, fetchTriggersByService, isTriggersLoading } = useTriggerStore(state => state);

  const toast = useToast();

  useEffect(() => {
    if (services.length !== 0) {
      return;
    }
    try {
      fetchServices();
    } catch (error: any) {
      console.log(error);
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

  const onTriggerServiceSelect = (value: string) => {
    fetchCompatibleServices(value)
      .then(() => {
        console.log('triggerService ->', value);
        setSelectedTriggerService1(value);
      })
      .catch((error: any) => {
        console.log(error);
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
      });
  };

  const onActionServiceSelect = (value: string) => {
    fetchTriggersByService(value)
      .then(() => {
        console.log('action Service ->', value);
        setSelectedActionService2(value);
      })
      .catch((error: any) => {
        console.log(error);
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
      });
  };

  const onTriggerSelect = (value: string) => {
    if (selectedActionService2) {
      fetchActionsByTriggerId(selectedActionService2, value)
        .then(() => {
          console.log('selectedActionService2', selectedActionService2);
          console.log('trigger id selected ->', value);
          setSelectedTriggerId(value);
        })
        .catch((error: any) => {
          console.log(error);
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
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Heading style={styles.title}>{t('zap.createZapScreen.title')}</Heading>
      <FormControl
        size="lg"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        isRequired={false}
        style={{ width: '100%' }}>
        <CustomSelect
          items={services}
          onValueChange={value => {
            console.log(value);
            onTriggerServiceSelect(value);
          }}
          placeholder="Select option"
        />
        {compatibleServices.length !== 0 && (
          <CustomSelect
            items={compatibleServices}
            onValueChange={value => {
              console.log(value);
              onActionServiceSelect(value);
            }}
            placeholder="Select option"
          />
        )}
        {triggersAssociatedToService.length !== 0 && (
          <CustomSelect
            items={triggersAssociatedToService}
            onValueChange={value => {
              console.log(value);
              onTriggerSelect(value);
            }}
            placeholder="Select option"
          />
        )}
        {actionsAssociatedToTrigger.length !== 0 && (
          <CustomSelect
            items={triggersAssociatedToService}
            onValueChange={value => {
              console.log(value);
              setSelectedActionId(value);
            }}
            placeholder="Select option"
          />
        )}
      </FormControl>
    </SafeAreaView>
  );
};

export default CreateZapScreen;

const styles = StyleSheet.create({
  shadow: {
    elevation: 5,
    shadowColor: 'black',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    marginVertical: 40,
    fontSize: 32,
  },
  bigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    height: 90,
    borderRadius: 10,
    backgroundColor: '#1F222A',
  },
  smallButton: {
    borderRadius: 50,
    backgroundColor: 'white',
  },
  smallButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  verticalLine: {
    width: 3,
    height: 30,
    backgroundColor: 'black',
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: 70,
    borderRadius: 50,
    backgroundColor: '#1F222A',
    elevation: 3,
    shadowColor: 'black',
  },
});
