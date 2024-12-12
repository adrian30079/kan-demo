'use client'

//Have an issue with the image not loading

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import WordCloudsCard from './chart/WordCloudsCard';
import WordCloudsCardJensen from './WordCloudsCard2';
import HashtagRankingsCard from './chart/HashtagRankingsCard';
import { PostMonitoringCardsComponent } from './post-monitoring-cards'

const hashtagsData = [
  { tag: '#crypto', count: 1234 },
  { tag: '#bitcoin', count: 987 },
  { tag: '#blockchain', count: 765 },
  { tag: '#ethereum', count: 654 },
  { tag: '#defi', count: 543 },
]

const topMentionsData = [
  { name: 'CryptoNews', handle: '@CryptoNews', mentions: 532, avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'BlockchainDaily', handle: '@BlockchainDaily', mentions: 423, avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'CoinMarketCap', handle: '@CoinMarketCap', mentions: 387, avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'Binance', handle: '@binance', mentions: 356, avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'CoinDesk', handle: '@CoinDesk', mentions: 312, avatar: '/placeholder.svg?height=40&width=40' },
]

export function WhatTab() {
  return (
    <div className="space-y-6">
      <Card>
        <WordCloudsCardJensen />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Hashtags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hashtagsData.map((hashtag) => (
              <div key={hashtag.tag} className="flex items-center justify-between">
                <Badge variant="secondary">{hashtag.tag}</Badge>
                <span className="text-sm text-muted-foreground">{hashtag.count} mentions</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <PostMonitoringCardsComponent />
        </CardContent>
      </Card>
    </div>
  )
}