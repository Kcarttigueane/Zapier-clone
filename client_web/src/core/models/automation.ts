export interface AutomationModel {
	id: number;
	userId: number;
	triggerId: number;
	actionId: number;
	status: 'enabled' | 'disabled';
}
