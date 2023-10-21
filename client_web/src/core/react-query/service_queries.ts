import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'http://localhost:8000/api/v2';

const fetchServices = async () => {
	const response = await fetch(`${BASE_URL}/services/`);
	// add timeout to test loading state
	await new Promise((resolve) => setTimeout(resolve, 2000));
	if (!response.ok) {
		throw new Error('Network response was not ok ' + response.statusText);
	}

	return response.json();
};

export const useServices = () => {
	return useQuery({ queryKey: ['services'], queryFn: fetchServices });
};
