export interface PlayEvent {
  screen_id: string;
  campaign_id: string;
  timestamp: string;
}

export interface CampaignStats {
  campaign_id: string;
  playCount: number;
  perScreen: Record<string, number>;
}

export interface QueueStats {
  pending: number;
  processed: number;
  processing: boolean;
}