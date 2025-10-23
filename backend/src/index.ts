import express from 'express';
import cors from 'cors';
import {
	enqueue,
	startWorker,
	setProcessing,
	isProcessing,
	getQueueStats,
} from './queue';
import { getAllCampaigns } from './store';
import type { PlayEvent } from './types';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/health', (_req, res) => {
	res.json({ ok: true, service: 'Campaign Play Processor' });
});

app.post('/events', (req, res) => {
	const { screen_id, campaign_id, timestamp } = req.body as PlayEvent;
	if (!screen_id || !campaign_id || !timestamp) {
		return res.status(400).json({ error: 'Missing required fields.' });
	}
	if (Number.isNaN(Date.parse(timestamp))) {
		return res.status(400).json({ error: 'Invalid timestamp.' });
	}
	enqueue({ screen_id, campaign_id, timestamp });
	return res.status(202).json({ queued: true });
});

app.get('/campaigns', (_req, res) => {
	res.json(getAllCampaigns());
});

app.post('/processing/:action', (req, res) => {
	setProcessing(req.params.action === 'start');
	res.json({ processing: isProcessing() });
});

app.get('/stats', (_req, res) => {
	res.json(getQueueStats());
});

app.post('/simulate', (_req, res) => {
	const campaigns = [
		'Campanie McDonalds',
		'Campanie Coca-Cola',
		'Campanie Nike',
		'Campanie adidas',
	];
	const screens = ['ecran1', 'ecran2', 'ecran3', 'ecran4', 'ecran5'];

	const event: PlayEvent = {
		screen_id: screens[Math.floor(Math.random() * screens.length)],
		campaign_id: campaigns[Math.floor(Math.random() * campaigns.length)],
		timestamp: new Date().toISOString(),
	};

	enqueue(event);
	res.json({ simulated: true, event });
});

startWorker();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
