import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import type { CampaignStats, QueueStats } from './types';
import BarChart from './BarChart';
import './App.css';

function App() {
	const [campaigns, setCampaigns] = useState<CampaignStats[]>([]);
	const [stats, setStats] = useState<QueueStats>({
		pending: 0,
		processed: 0,
		processing: true,
	});
	const [loading, setLoading] = useState(true);
	const [connectionError, setConnectionError] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			const [campaignData, statsData] = await Promise.all([
				api.getCampaigns(),
				api.getStats(),
			]);
			setCampaigns(campaignData);
			setStats(statsData);
			setConnectionError(false);
		} catch (error) {
			console.error('Error fetch', error);
			setConnectionError(true);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSimulate = async () => {
		try {
			await api.simulateEvent();
			await fetchData();
		} catch (error) {
			console.error('Error simulate', error);
		}
	};

	const handleToggleProcessing = async () => {
		try {
			await api.toggleProcessing(!stats.processing);
			await fetchData();
		} catch (error) {
			console.error('Error toggle', error);
		}
	};

	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 2000);
		return () => clearInterval(interval);
	}, [fetchData]);

	if (loading) {
		return (
			<div className='app'>
				<div className='loading'>
					<div className='spinner'></div>
					<span>Incarca campanie</span>
				</div>
			</div>
		);
	}

	return (
		<div className='app'>
			<header className='header'>
				<div className='header-container'>
					<div className='logo'>
						<span>Procesor campanii DOOH</span>
					</div>
					<div className='header-actions'>
						<div
							className={`connection-status ${
								connectionError ? 'disconnected' : 'connected'
							}`}
						>
							<span className='status-dot'></span>
							{connectionError ? 'Disconnected' : 'Connected'}
						</div>
						<button
							onClick={handleSimulate}
							className='btn btn-primary'
						>
							Creeaza event
						</button>
						<button
							onClick={handleToggleProcessing}
							className={`btn ${stats.processing ? 'btn-warning' : 'btn-success'}`}
						>
							{stats.processing ? 'Pauza procesare' : 'Resume'}
						</button>
					</div>
				</div>
			</header>

			<main className='main-content'>
				<div className='container'>
					<div className='metrics-grid'>
						<div className='metric-card'>
							<h3 className='metric-title'>Marime Queue</h3>
							<div className='metric-value'>{stats.pending}</div>
						</div>

						<div className='metric-card'>
							<h3 className='metric-title'>Procesat</h3>
							<div className='metric-value'>{stats.processed}</div>
						</div>

						<div className='metric-card'>
							<h3 className='metric-title'>Campanii actuale</h3>
							<div className='metric-value'>{campaigns.length}</div>
						</div>
					</div>
				</div>

				{campaigns.length > 0 && (
					<div className='charts-section'>
						<div className='charts-grid'>
							<BarChart
								campaigns={campaigns}
								title='Numar Redari'
								type='bar'
							/>
							<BarChart
								campaigns={campaigns}
								title='Distributie ecrane'
								type='doughnut'
							/>
						</div>
					</div>
				)}
				<div className='campaigns'>
					<div className='section-header'>
						<h2 className='section-title'>Performanta campanie</h2>
					</div>

					{campaigns.length === 0 ? (
						<div className='empty-state'>
							<h3 className='empty-title'>Date insuficiente</h3>
							<p className='description'>Simuleaza evenimente</p>
							<button
								onClick={handleSimulate}
								className='btn btn-primary'
							>
								Genereaza date
							</button>
						</div>
					) : (
						<div className='campaigns-grid'>
							{campaigns.map((campaign) => (
								<div
									key={campaign.campaign_id}
									className='campaign-card'
								>
									<div className='campaign-header'>
										<div>
											<h3 className='campaign-title'>{campaign.campaign_id}</h3>
											<span className='badge'>Activ</span>
										</div>
									</div>

									<div className='campaign-metrics'>
										<div className='campaign-play-count'>
											{campaign.playCount.toLocaleString()}
										</div>
										<p className='campaign-play-label'>Playuri totale</p>
									</div>

									<div className='screen-breakdown'>
										<h4 className='screen-title'>Metrici Ecran</h4>
										<div className='screen-list'>
											{Object.entries(campaign.perScreen)
												.sort(([, a], [, b]) => b - a)
												.map(([screen, count]) => (
													<div
														key={screen}
														className='screen-item'
													>
														<div className='informatii-ecran'>
															<span className='nume-ecran'>{screen}</span>
															<div className='statistici-ecran'>
																<span className='count-ecran'>{count}</span>
																<span className='procentaj-ecran'>
																	{Math.round((count / campaign.playCount) * 100)}%
																</span>
															</div>
														</div>
														<div className='progres-ecran'>
															<div
																className='progres'
																style={{ width: `${(count / campaign.playCount) * 100}%` }}
															/>
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default App;
