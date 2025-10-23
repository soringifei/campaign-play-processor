import type { PlayEvent } from './types';
import { applyEvent } from './store';

const queue: PlayEvent[] = [];
let processing = true;
let processedCount = 0;

export function enqueue(event: PlayEvent) {
	queue.push(event);
	console.log(`Queued event for campaign ${event.campaign_id}`);
}

export function setProcessing(state: boolean) {
	processing = state;
	console.log(`Processing ${state ? 'enabled' : 'disabled'}`);
}

export function isProcessing() {
	return processing;
}

export function getQueueStats() {
	return {
		pending: queue.length,
		processed: processedCount,
		processing
	};
}

export function startWorker() {
	setInterval(() => {
		if (!processing || queue.length === 0) return;

		const event = queue.shift();
		if (event) {
			console.log(`Processing event for campaign ${event.campaign_id}`);
			applyEvent(event);
			processedCount++;
		}
	}, 1000);
}
