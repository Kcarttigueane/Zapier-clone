import i18n from '../../../i18n/i18next';

const calculateTimeAgo = (timestamp: string) => {
	const currentTime = new Date();
	const parsedTimestamp = new Date(timestamp);

	const timeDifferenceInSeconds: number = Math.floor((currentTime.getTime() - parsedTimestamp.getTime()) / 1000);

	if (timeDifferenceInSeconds < 60) {
		const time = `${timeDifferenceInSeconds} ${i18n.t('basic.date.minute')}${timeDifferenceInSeconds > 1 ? 's' : ''}`;
		return i18n.t('dashboard.time', { time: time });
	} else if (timeDifferenceInSeconds < 3600) {
		const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
		const time = `${minutesAgo} ${i18n.t('basic.date.minute')}${minutesAgo > 1 ? 's' : ''}`;
		return i18n.t('dashboard.time', { time: time });
	} else if (timeDifferenceInSeconds < 86400) {
		const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
		const time = `${hoursAgo} ${i18n.t('basic.date.hour')}${hoursAgo > 1 ? 's' : ''}`;
		return i18n.t('dashboard.time', { time: time });
	} else {
		const weeksAgo = Math.floor(timeDifferenceInSeconds / 604800);
		const time = `${weeksAgo} ${i18n.t('basic.date.hour')}${weeksAgo > 1 ? 's' : ''}`;
		return i18n.t('dashboard.time', { time: time });
	}
};

const transformAutomationsToDataTable = (automations: any[]): any[] => {
	return automations.map((automation, index) => ({
		name: automation.name,
		lastPolled: calculateTimeAgo(automation.last_polled),
		key: index.toString(),
	}));
};

export { calculateTimeAgo, transformAutomationsToDataTable };
