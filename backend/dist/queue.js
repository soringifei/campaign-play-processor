'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.enqueue = enqueue;
exports.setProcessing = setProcessing;
exports.isProcessing = isProcessing;
exports.getQueueStats = getQueueStats;
exports.startWorker = startWorker;
const store_1 = require('./store');
const queue = [];
let processing = true;
let processedCount = 0;
function enqueue(event) {
	queue.push(event);
	console.log(
		`Event ${event.campaign_id} push coada. Coada are ${queue.length} evenimente.`
	);
}
function setProcessing(state) {
	processing = state;
	console.log(`Procesare ${state ? 'activata' : 'dezactivata'}`);
}
function isProcessing() {
	return processing;
}
function getQueueStats() {
	return {
		pending: queue.length,
		processed: processedCount,
		processing,
	};
}
function startWorker() {
	setInterval(() => {
		if (!processing || queue.length === 0) return;
		const event = queue.shift();
		if (event) {
			console.log(`Workerul proceseaza eveniment ${event.campaign_id}`);
			(0, store_1.applyEvent)(event);
			processedCount++;
		}
	}, 1000);
}
