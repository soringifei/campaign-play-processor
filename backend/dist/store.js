'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.applyEvent = applyEvent;
exports.getAllCampaigns = getAllCampaigns;
const campaignMap = new Map();
function applyEvent(e) {
	const current = campaignMap.get(e.campaign_id) ?? {
		campaign_id: e.campaign_id,
		playCount: 0,
		perScreen: {},
	};
	current.playCount += 1;
	current.perScreen[e.screen_id] = (current.perScreen[e.screen_id] ?? 0) + 1;
	campaignMap.set(e.campaign_id, current);
}
function getAllCampaigns() {
	return Array.from(campaignMap.values()).sort(
		(a, b) => b.playCount - a.playCount
	);
}
