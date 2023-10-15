const calculateTimeAgo = (timestamp: string) => {
	const currentTime = new Date();
	const parsedTimestamp = new Date(timestamp);

	const timeDifferenceInSeconds: number = Math.floor((currentTime.getTime() - parsedTimestamp.getTime()) / 1000);

	if (timeDifferenceInSeconds < 60) {
		return `${timeDifferenceInSeconds} seconds ago`;
	} else if (timeDifferenceInSeconds < 3600) {
		const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
		return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
	} else if (timeDifferenceInSeconds < 86400) {
		const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
		return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
	} else {
		const weeksAgo = Math.floor(timeDifferenceInSeconds / 604800);
		return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
	}
};

const transformAutomationsToDataTable = (automations: any[]): any[] => {
	return automations.map((automation, index) => ({
		name: automation.name,
		lastPolled: calculateTimeAgo(automation.last_polled),
		running: 'True',
		key: index.toString(),
	}));
};

export { calculateTimeAgo, transformAutomationsToDataTable };
