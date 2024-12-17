'use client'

import { useState } from 'react'
import { PostMonitoringCards } from "./post-monitoring-cards"

type Post = {
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
  ner: string[]
  sentiment: string
  linkExtracted: string
  classifiedContent: string[]
  country: string
  language: string
}

export function TableOverlayNoLimit({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
} 