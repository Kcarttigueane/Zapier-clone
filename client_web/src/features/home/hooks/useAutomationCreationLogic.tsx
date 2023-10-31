import { message } from 'antd';
import { useCallback, useState } from 'react';
import { ActionModelDTO } from '../../../core/models/action';
import { AutomationCreationDTO, AutomationStatus } from '../../../core/models/automation';
import { ServiceModelDTO } from '../../../core/models/service';
import { TriggerModelDTO } from '../../../core/models/trigger';
import useActionStore from '../../../core/zustand/useActionStore';
import useAutomationStore from '../../../core/zustand/useAutomation';
import useServicesStore from '../../../core/zustand/useServiceStore';
import useTriggerStore from '../../../core/zustand/useTriggerStore';
import useUserStore from '../../../core/zustand/useUserStore';

const useAutomationCreationLogic = () => {
	const [selectedTriggerService1, setSelectedTriggerService1] = useState<ServiceModelDTO['id'] | null>(null);
	const [selectedActionService2, setSelectedService2] = useState<ServiceModelDTO['id'] | null>(null);
	const [selectedTriggerId, setSelectedTriggerId] = useState<TriggerModelDTO['id'] | null>(null);
	const [selectedActionId, setSelectedActionId] = useState<ActionModelDTO['id'] | null>(null);

	const [automationName, setAutomationName] = useState<string>('');

	const { services, isLoading, fetchCompatibleServices, compatibleServices } = useServicesStore((state) => state);
	const { fetchTriggersByService, triggersAssociatedToService } = useTriggerStore((state) => state);
	const { fetchActionsByTriggerId, actionsAssociatedToTrigger } = useActionStore((state) => state);
	const { createAutomation, isAutomationsLoading } = useAutomationStore((state) => state);
	const { user } = useUserStore((state) => state);

	const [current, setCurrent] = useState(0);

	console.log("Regenerated");

	if (user == null) {
		message.open({
			type: 'error',
			content: 'You must be logged in to create an automation',
		});
		throw new Error('User is null');
	}

	const next = useCallback(() => {
		switch (current) {
			case 0:
				if (selectedTriggerService1) {
					fetchCompatibleServices(selectedTriggerService1)
						.then(() => setCurrent((prevCurrent) => prevCurrent + 1))
						.catch((error) => {
							console.error('Error fetching compatible services:', error);
							message.open({
								type: 'error',
								content: error.response.data.detail || 'Something went wrong',
							});
						});
				}
				break;
			case 1:
				if (selectedTriggerService1) {
					fetchTriggersByService(selectedTriggerService1)
						.then(() => setCurrent((prevCurrent) => prevCurrent + 1))
						.catch((error) => {
							console.error('Error fetching compatible services:', error);
							message.open({
								type: 'error',
								content: error.response.data.detail || 'Something went wrong',
							});
						});
				}
				break;
			case 2:
				if (selectedActionService2 && selectedTriggerId) {
					fetchActionsByTriggerId(selectedActionService2, selectedTriggerId)
						.then(() => setCurrent((prevCurrent) => prevCurrent + 1))
						.catch((error) => {
							console.error('Error fetching compatible services:', error);
							message.open({
								type: 'error',
								content: error.response.data.detail || 'Something went wrong',
							});
						});
				}
				break;
			case 3:
				if (selectedActionId) {
					setCurrent((prevCurrent) => prevCurrent + 1);
				}
				break;
			default:
				break;
		}
	}, [current, selectedTriggerService1, selectedActionService2, selectedTriggerId]);

	const prev = useCallback(() => {
		setCurrent((prevCurrent) => prevCurrent - 1);
	}, []);

	const onCreateAutomationClick = useCallback(async () => {
		if (!selectedTriggerId || !selectedActionId) {
			message.error('Please select a trigger and an action');
			return;
		}
		const automationToCreate: AutomationCreationDTO = {
			user_id: user?.id,
			name: automationName,
			trigger_id: selectedTriggerId,
			action_id: selectedActionId,
			status: AutomationStatus.DISABLED,
		};

		createAutomation(automationToCreate)
			.then(() => message.success('Automation created successfully'))
			.catch((error) => {
				console.error('Error creating automation:', error);
				message.open({
					type: 'error',
					content: error.response.data.detail || 'Something went wrong',
				});
			});
	}, [selectedTriggerId, selectedActionId, automationName]);

	return {
		services,
		selectedTriggerService1,
		setSelectedTriggerService1,
		selectedActionService2,
		setSelectedService2,
		selectedTriggerId,
		setSelectedTriggerId,
		selectedActionId,
		setSelectedActionId,
		automationName,
		setAutomationName,
		isLoading,
		compatibleServices,
		triggersAssociatedToService,
		actionsAssociatedToTrigger,
		current,
		setCurrent,
		next,
		prev,
		onCreateAutomationClick,
		isAutomationsLoading,
	};
};

export default useAutomationCreationLogic;
