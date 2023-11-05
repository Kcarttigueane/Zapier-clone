interface AboutData {
	client: {
		host: string;
		services: number;
		triggers: number;
		actions: number;
	};
	server: {
		services: Service[];
	};
}

interface Service {
	name: string;
	description: string;
	icon_svg_base64: string;
	actions: Action[];
	reactions: Reaction[];
}

interface Action {
	name: string;
	description: string;
}

interface Reaction {
	name: string;
	description: string;
}
