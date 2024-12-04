export type Post = {
  id: string
  group: string
  groupType: string
  URL: string
  channel: string
  summary: string
  fullContent: string
  postDate: string
  engagementIndex: number
  author: string
  mentions: number
  hashtag: string
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed'
  classifiedContent: string[]
  ner: string[]
  linkExtracted: boolean
  imgGroup: Record<string, string>
} 