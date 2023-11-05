import { ServiceModeWithAuthorizationDTO } from './service';

export interface AutomationLogDTO {
	triggered_at: Date;
}

export enum AutomationStatus {
	ENABLED = 'enabled',
	DISABLED = 'disabled',
}

export interface AutomationDTO {
	id: string;
	user_id: string;
	name: string;
	trigger_id: string;
	action_id: string;
	status: AutomationStatus;
	first_poll: boolean;
	last_polled: string;
	created_at?: string; // ! The ? should be removed when the API is fixed in the file automation_schema.py
	logs: AutomationLogDTO[];
}

export type AutomationCreationDTO = Omit<AutomationDTO, 'id' | 'first_poll' | 'last_polled' | 'logs'>;

export interface DetailedAutomationDTO extends AutomationDTO {
	trigger_service: ServiceModeWithAuthorizationDTO;
	action_service: ServiceModeWithAuthorizationDTO;
}
