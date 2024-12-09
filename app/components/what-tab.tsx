'use client'

//Have an issue with the image not loading

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import WordCloudsCard from './chart/WordCloudsCard';
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <WordCloudsCard />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hashtags Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hashtagsData.map((hashtag, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-5">{index + 1}</span>
                    <Badge variant="secondary" className="text-base font-semibold">
                      {hashtag.tag}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{hashtag.count} mentions</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-2">
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