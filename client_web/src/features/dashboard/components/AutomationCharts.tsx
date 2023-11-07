import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { DetailedAutomationDTO } from '../../../core/models/automation';
import useAutomationStore from '../../../core/zustand/useAutomation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const AutomationUsageCharts = () => {
	const { automationWithDetails } = useAutomationStore((state) => state);
	const [barChartData, setBarChartData] = useState({});
	const [lineChartData, setLineChartData] = useState({});

	useEffect(() => {
		const usagePerDay: Record<string, number> = {};
		const usageOverTime: { day: string; count: number }[] = [];

		automationWithDetails.forEach((automation: DetailedAutomationDTO) => {
			automation.logs.forEach((log) => {
				const day = new Date(log.triggered_at).toISOString().split('T')[0];
				if (!usagePerDay[day]) {
					usagePerDay[day] = 0;
				}
				usagePerDay[day] += 1;
			});
		});

		const sortedDays = Object.keys(usagePerDay).sort();
		sortedDays.forEach((day) => {
			usageOverTime.push({ day, count: usagePerDay[day] });
		});

		setBarChartData({
			labels: sortedDays,
			datasets: [
				{
					label: 'Daily Usage',
					data: Object.values(usagePerDay),
					backgroundColor: 'rgba(53, 162, 235, 0.5)',
					borderColor: 'rgba(53, 162, 235, 0.8)',
					borderWidth: 1,
				},
			],
		});

		setLineChartData({
			labels: usageOverTime.map((u) => u.day),
			datasets: [
				{
					label: 'Usage Over Time',
					data: usageOverTime.map((u) => u.count),
					fill: false,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.1,
				},
			],
		});
	}, [automationWithDetails]);

	return (
		<div>
			{Object.keys(barChartData).length > 0 && (
				<>
					<h2>Daily Automation Usage</h2>
					<Bar data={barChartData} options={{ responsive: true }} />
				</>
			)}

			{Object.keys(lineChartData).length > 0 && (
				<>
					<h2>Automation Usage Over Time</h2>
					<Line data={lineChartData} options={{ responsive: true }} />
				</>
			)}
		</div>
	);
};

export default AutomationUsageCharts;
