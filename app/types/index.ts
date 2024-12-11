export interface Topic {
  id: string;
  name: string;
  keywords: string[];
  mentions: number;
  peopleTalking: number;
  engagement: string;
  sentiment: number;
  riskLevel: 'low' | 'medium' | 'high';
  period: {
    start: string;
    end: string;
  };
} 