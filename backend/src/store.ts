import type { PlayEvent } from './types';

export type CampaignStats = {
	campaign_id: string;
	playCount: number;
	perScreen: Record<string, number>;
};

const campaignMap = new Map<string, CampaignStats>();

export function applyEvent(e: PlayEvent) {
	const current = campaignMap.get(e.campaign_id) ?? {
		campaign_id: e.campaign_id,
		playCount: 0,
		perScreen: {},
	};

	current.playCount += 1;
	current.perScreen[e.screen_id] = (current.perScreen[e.screen_id] ?? 0) + 1;

	campaignMap.set(e.campaign_id, current);
}

export function getAllCampaigns(): CampaignStats[] {
	return Array.from(campaignMap.values()).sort(
		(a, b) => b.playCount - a.playCount
	);
}
