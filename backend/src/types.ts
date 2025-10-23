export interface PlayEvent {
  screen_id: string;
  campaign_id: string;
  timestamp: string;
}

export interface CampaignStats {
  play_count: number;
  last_played?: string;
  screens: Record<string, number>;
}

export interface QueueStats {
  pending: number;
  processed: number;
  processing: boolean;
}
