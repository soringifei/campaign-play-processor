'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const queue_1 = require('./queue');
const store_1 = require('./store');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.get('/health', (_req, res) => {
	res.json({ ok: true, service: 'Procesor Campanii' });
});
app.post('/events', (req, res) => {
	const { screen_id, campaign_id, timestamp } = req.body;
	if (!screen_id || !campaign_id || !timestamp) {
		return res.status(400).json({ error: 'Lipsa campuri necesare.' });
	}
	if (Number.isNaN(Date.parse(timestamp))) {
		return res.status(400).json({ error: 'Timestamp invalid' });
	}
	(0, queue_1.enqueue)({ screen_id, campaign_id, timestamp });
	return res.status(202).json({ queued: true });
});
app.get('/campaigns', (_req, res) => {
	res.json((0, store_1.getAllCampaigns)());
});
app.post('/processing/:action', (req, res) => {
	(0, queue_1.setProcessing)(req.params.action === 'start');
	res.json({ processing: (0, queue_1.isProcessing)() });
});
app.get('/stats', (_req, res) => {
	res.json((0, queue_1.getQueueStats)());
});
app.post('/simulate', (_req, res) => {
	const campaigns = [
		"Campanie McDonald's 2025",
		'Campanie Coca-Cola 2025',
		'Campanie Nike 2025',
		'Campanie Adidas 2025',
	];
	const screens = [
		'Ecran Unirii',
		'Ecran Victoriei',
		'Ecran Mall',
		'Ecran Baneasa',
		'Ecran Piata Romana',
	];
	const event = {
		screen_id: screens[Math.floor(Math.random() * screens.length)],
		campaign_id: campaigns[Math.floor(Math.random() * campaigns.length)],
		timestamp: new Date().toISOString(),
	};
	(0, queue_1.enqueue)(event);
	res.json({ simulated: true, event });
});
(0, queue_1.startWorker)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server port : ${PORT}`);
});
