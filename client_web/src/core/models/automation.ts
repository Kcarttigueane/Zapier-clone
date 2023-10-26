export interface AutomationLogDTO {
	triggered_at: Date;
}

export interface AutomationDTO {
	id: string;
	user_id: string;
	name: string;
	trigger_id: string;
	action_id: string;
	status: 'enabled' | 'disabled';
	first_poll: boolean;
	last_polled: string;
	logs: AutomationLogDTO[];
}

export type AutomationCreationDTO = Omit<AutomationDTO, 'id' | 'first_poll' | 'last_polled' | 'logs'>;
