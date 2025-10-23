import type { CampaignStats, QueueStats, PlayEvent } from './types';

const BASE_URL = 'http://localhost:3000';

export const api = {
  async getCampaigns(): Promise<CampaignStats[]> {
    const response = await fetch(`${BASE_URL}/campaigns`);
    return response.json();
  },

  async getStats(): Promise<QueueStats> {
    const response = await fetch(`${BASE_URL}/stats`);
    return response.json();
  },

  async simulateEvent(): Promise<{ simulated: boolean; event: PlayEvent }> {
    const response = await fetch(`${BASE_URL}/simulate`, { method: 'POST' });
    return response.json();
  },

  async toggleProcessing(start: boolean): Promise<{ processing: boolean }> {
    const action = start ? 'start' : 'stop';
    const response = await fetch(`${BASE_URL}/processing/${action}`, { method: 'POST' });
    return response.json();
  },

  async addEvent(event: PlayEvent): Promise<{ queued: boolean }> {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return response.json();
  }
};