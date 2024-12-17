export interface Post {
  id: string;
  group: string;
  groupType: string;
  URL: string;
  channel: string;
  summary: string;
  fullContent: string;
  postDate: string;
  engagementIndex: number;
  author: string;
  mentions: number;
  hashtag: string;
  sentiment: string;
  linkExtracted: boolean;
  classifiedContent: string[];
  country: string;
  language: string;
  likes: number;
  comments: number;
  shares: number;
} 