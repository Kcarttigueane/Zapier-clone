import { Button, ButtonText, FormControl, Heading, Toast, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { RootStackParamList } from '../../../App';
import { ActionModelDTO } from '../../../core/models/action';
import { AutomationCreationDTO, AutomationStatus } from '../../../core/models/automation';
import { ServiceModelDTO } from '../../../core/models/service';
import { TriggerModelDTO } from '../../../core/models/trigger';
import showErrorToast from '../../../core/utils/showErrorToast';
import useActionStore from '../../../core/zustand/useActionStore';
import useAutomationStore from '../../../core/zustand/useAutomation';
import useServicesStore from '../../../core/zustand/useServiceStore';
import useTriggerStore from '../../../core/zustand/useTriggerStore';
import useUserStore from '../../../core/zustand/useUserStore';
import CustomSelect from '../components/CustomSelect';

type ZapScreenRouteProp = RouteProp<RootStackParamList, 'CreateZapScreen'>;
type ZapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateZapScreen'>;
type ZapScreenProps = {
  route: ZapScreenRouteProp;
  navigation: ZapScreenNavigationProp;
};

const CreateAutomationScreen = ({ navigation }: ZapScreenProps) => {
  const { t } = useTranslation();

  const [selectedTriggerService1, setSelectedTriggerService1] = useState<ServiceModelDTO['id'] | null>(null);
  const [selectedActionService2, setSelectedActionService2] = useState<ServiceModelDTO['id'] | null>(null);
  const [selectedTriggerId, setSelectedTriggerId] = useState<TriggerModelDTO['id'] | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<ActionModelDTO['id'] | null>(null);

  const { services, compatibleServices, fetchServices, fetchCompatibleServices } = useServicesStore(state => state);
  const { actionsAssociatedToTrigger, fetchActionsByTriggerId, isActionsLoading } = useActionStore(state => state);
  const { triggersAssociatedToService, fetchTriggersByService, isTriggersLoading } = useTriggerStore(state => state);
  const { createAutomation } = useAutomationStore(state => state);
  const { user } = useUserStore(state => state);
  const toast = useToast();

  useEffect(() => {
    if (services.length !== 0) {
      return;
    }
    try {
      fetchServices();
    } catch (error: any) {
      console.log(error);
      showErrorToast(error, toast);
    }
  }, []);

  const onTriggerServiceSelect = async (value: string) => {
    try {
      await fetchCompatibleServices(value).then(() => setSelectedTriggerService1(value));
    } catch (error: any) {
      console.log(error);
      showErrorToast(error, toast);
    }
    // await fetchCompatibleServices(value)
    //   .then(() => setSelectedTriggerService1(value))
    //   .catch((error: any) => {
    //     console.log(error);
    //     toast.show({
    //       placement: 'top',
    //       render: ({ id }) => {
    //         return (
    //           <Toast nativeID={'toast-' + id} action="error" variant="accent">
    //             <VStack space="sm">
    //               <ToastTitle>{error.response.data.detail}</ToastTitle>
    //             </VStack>
    //           </Toast>
    //         );
    //       },
    //     });
    //   });
  };

  const onActionServiceSelect = (value: string) => {
    if (selectedTriggerService1 === null) {
      return;
    }
    fetchTriggersByService(selectedTriggerService1)
      .then(() => setSelectedActionService2(value))
      .catch((error: any) => {
        console.log(error);
        showErrorToast(error, toast);
      });
  };

  const onTriggerSelect = (value: string) => {
    if (selectedActionService2) {
      fetchActionsByTriggerId(selectedActionService2, value)
        .then(() => setSelectedTriggerId(value))
        .catch((error: any) => {
          console.log(error);
          showErrorToast(error, toast);
        });
    }
  };

  const isCreateButtonDisabled =
    selectedTriggerService1 === null ||
    selectedActionService2 === null ||
    selectedTriggerId === null ||
    selectedActionId === null;

  const steps = [
    {
      title: t('zap.create.action1'),
      content: 'Choose your first service',
    },
    {
      title: t('zap.create.reaction1'),
      content: 'Choose your second service',
    },
    {
      title: t('zap.create.action2'),
      content: 'Choose your trigger',
    },
    {
      title: t('zap.create.reaction2'),
      content: 'Choose your reaction',
    },
  ];

  const onCreateAutomationClick = useCallback(async () => {
    if (!selectedTriggerId || !selectedActionId || !user) {
      toast.show({
        placement: 'bottom',
        render: ({ id }) => {
          return (
            <Toast nativeID={'toast-' + id} action="error" variant="accent">
              <VStack space="sm">
                <ToastTitle>{t('zap.createZapScreen.error')}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      return;
    }
    const automationToCreate: AutomationCreationDTO = {
      user_id: user?.id,
      name: 'Fake automation Name for mobile',
      trigger_id: selectedTriggerId,
      action_id: selectedActionId,
      status: AutomationStatus.DISABLED,
    };

    createAutomation(automationToCreate)
      .then(() => {
        toast.show({
          placement: 'bottom',
          render: ({ id }) => {
            return (
              <Toast nativeID={'toast-' + id} action="success" variant="accent">
                <VStack space="sm">
                  <ToastTitle>{t('zap.createZapScreen.success')}</ToastTitle>
                </VStack>
              </Toast>
            );
          },
        });
      })
      .catch(error => {
        console.error('Error creating automation:', error);
        toast.show({
          placement: 'bottom',
          render: ({ id }) => {
            return (
              <Toast nativeID={'toast-' + id} action="error" variant="accent">
                <VStack space="sm">
                  <ToastTitle>{t('zap.createZapScreen.error')}</ToastTitle>
                </VStack>
              </Toast>
            );
          },
        });
      });
  }, [selectedTriggerId, selectedActionId]);

  return (
    <SafeAreaView style={styles.container}>
      <Heading style={styles.title}>{t('zap.createZapScreen.title')}</Heading>
      <FormControl
        size="lg"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        isRequired={false}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 20 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'black',
            textAlign: 'center',
            marginBottom: 4,
          }}>
          {steps[0].title}
        </Text>
        <CustomSelect
          items={services}
          onValueChange={value => onTriggerServiceSelect(value)}
          placeholder="Select option"
        />
        {compatibleServices.length !== 0 && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center',
                marginBottom: 4,
              }}>
              {steps[1].title}
            </Text>
            <CustomSelect
              items={compatibleServices}
              onValueChange={value => onActionServiceSelect(value)}
              placeholder="Select option"
            />
          </>
        )}
        {triggersAssociatedToService.length !== 0 && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center',
                marginBottom: 4,
              }}>
              {steps[2].title}
            </Text>
            <CustomSelect
              items={triggersAssociatedToService}
              onValueChange={value => onTriggerSelect(value)}
              placeholder="Select option"
            />
          </>
        )}
        {actionsAssociatedToTrigger.length !== 0 && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center',
                marginBottom: 4,
              }}>
              {steps[2].title}
            </Text>
            <CustomSelect
              items={actionsAssociatedToTrigger}
              onValueChange={value => setSelectedActionId(value)}
              placeholder="Select option"
            />
          </>
        )}
      </FormControl>
      <Button
        size="lg"
        variant="solid"
        action="secondary"
        isDisabled={isCreateButtonDisabled}
        isFocusVisible={false}
        borderRadius={100}
        width="100%"
        height={50}>
        <ButtonText
          style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}
          onPress={() => onCreateAutomationClick()}>
          {t('zap.createZapScreen.submit')}
        </ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default CreateAutomationScreen;

const styles = StyleSheet.create({
  shadow: {
    elevation: 5,
    shadowColor: 'black',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 24,
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
    width: '100%',
    height: 60,
    borderRadius: 100,
    backgroundColor: '#1F222A',
    elevation: 3,
    shadowColor: 'black',
    marginBottom: 24,
  },
});
