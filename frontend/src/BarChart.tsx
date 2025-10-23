import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { CampaignStats } from './types';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

interface BarChartProps {
	campaigns: CampaignStats[];
	title?: string;
	type?: 'bar' | 'doughnut';
}

const BarChart: React.FC<BarChartProps> = ({
	campaigns,
	title = 'Numar redari',
	type = 'bar',
}) => {
	if (campaigns.length === 0) {
		return (
			<div className='container-grafic'>
				<h3 className='chart-title'>{title}</h3>
				<div className='chart-empty'>
					<p>Asteapta date</p>
					<p className='subtitle'>Genereaza evenimente pentru grafic</p>
				</div>
			</div>
		);
	}

	const sortedCampaigns = [...campaigns].sort(
		(a, b) => b.playCount - a.playCount
	);
	const labels = sortedCampaigns.map((c) =>
		c.campaign_id.replace('Campanie', '')
	);
	const data = sortedCampaigns.map((c) => c.playCount);

	const colors = [
		'#f64747',
		'#000000',
		'#F40009',
		'#FFC72C',
		'#6B7280',
		'#1E3A8A',
		'#ff6900',
		'#0693e3',
	];

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Numar redari',
				data,
				backgroundColor:
					type === 'bar' ? colors[0] + '80' : colors.slice(0, data.length),
				borderColor: type === 'bar' ? colors[0] : colors.slice(0, data.length),
				borderWidth: 2,
				borderRadius: type === 'bar' ? 6 : 0,
				hoverBackgroundColor:
					type === 'bar'
						? colors[0]
						: colors.slice(0, data.length).map((c) => c + 'CC'),
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: type === 'doughnut',
				position: 'bottom' as const,
				labels: {
					usePointStyle: true,
					padding: 20,
					font: {
						size: 12,
					},
				},
			},
			tooltip: {
				backgroundColor: '#3B3B3B',
				titleColor: '#ffffff',
				bodyColor: '#ffffff',
				borderColor: '#ff6900',
				borderWidth: 2,
				cornerRadius: 8,
				displayColors: true,
				callbacks: {
					label: (context: any) => {
						const value = context.parsed.y || context.parsed;
						return `${context.dataset.label}: ${value.toLocaleString()} redari`;
					},
				},
			},
		},
		scales:
			type === 'bar'
				? {
						x: {
							grid: {
								display: false,
							},
							ticks: {
								color: '#6b7280',
								font: {
									size: 11,
								},
							},
						},
						y: {
							beginAtZero: true,
							grid: {
								color: '#f3f4f6',
								drawBorder: false,
							},
							ticks: {
								color: '#6b7280',
								font: {
									size: 11,
								},
								callback: (value: any) => value.toLocaleString(),
							},
						},
				  }
				: {},
		animation: {
			duration: 1000,
			easing: 'easeInOutQuart' as const,
		},
	};

	return (
		<div className='chart-container'>
			<h3 className='chart-title'>{title}</h3>
			<div className='chart-wrapper'>
				{type === 'bar' ? (
					<Bar
						data={chartData}
						options={options}
					/>
				) : (
					<Doughnut
						data={chartData}
						options={options}
					/>
				)}
			</div>
		</div>
	);
};

export default BarChart;
