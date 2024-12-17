'use client'

import React, { useState, useEffect } from 'react'
import wordCloudData from '@/data/word-cloud.json'
import hashtagData from '@/data/hashtag.json'
import { BaseTreeMap, TreeMapItem } from './chart/base-treemap'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PostMonitoringCards } from './post-monitoring-cards'
import WordCloudsCardJensen from './word-cloud-card'
import { Download, RefreshCw, Settings, Filter, Maximize2, Minimize2 } from 'lucide-react'
import { ManageItemsDialog } from "@/components/ui/manage-items-dialog"
import { ChartDownloadButton } from "@/components/chart/chart-download-button"
import { Checkbox } from "@/components/ui/checkbox"
import { useLayout } from '@/contexts/layout-context'
import { cn } from '@/lib/utils'

// Use the data from hashtags.json
const hashtagsData = hashtagData.hashtag_data

const wordItems = wordCloudData.wordcloud_data.map(item => ({
  id: item.word,
  name: item.word,
  count: item.count,
  metadata: {
    sentiment: item.sentiment,
    pos: item.pos
  }
}))

// Define HashtagTreeMap component
function HashtagTreeMap({ data, selectedHashtags }: { 
  data: Array<{ tag: string; count: number }>;
  selectedHashtags: Set<string>;
}) {
  const filteredData = data.filter(item => selectedHashtags.has(item.tag))
  
  const treeMapData: TreeMapItem[] = filteredData.map(item => ({
    x: item.tag,
    y: item.count,
    raw: item
  }))

  const customTooltip = (data: TreeMapItem) => {
    return `
      <div style="padding: 12px; font-family: system-ui;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">
          ${data.x}
        </div>
        <div style="font-size: 13px; color: #666;">
          Mentions: ${data.y.toLocaleString()}
        </div>
      </div>
    `
  }

  return (
    <BaseTreeMap
      data={treeMapData}
      height={350}
      fontSize="14px"
      limit={selectedHashtags.size}
      tooltipRenderer={customTooltip}
    />
  )
}

export function WhatTab() {
  const { sidebarWidth, headerHeight } = useLayout()
  const [selectedHashtags, setSelectedHashtags] = React.useState(
    new Set(hashtagsData.slice(0, 20).map(item => item.tag))
  );
  const [highlightText, setHighlightText] = useState(false);
  const [manageItemsOpen, setManageItemsOpen] = useState(false);
  
  // Add these new state declarations
  const [sentimentFilters, setSentimentFilters] = useState({
    all: true,
    positive: true,
    negative: true,
    neutral: true,
    mixed: true
  });

  const [posFilters, setPosFilters] = useState({
    all: true,
    nouns: true,
    verbs: true,
    adjectives: true
  });

  // Add these handler functions
  const handleSentimentFilterChange = (id: string) => {
    setSentimentFilters(prev => {
      const newFilters = { ...prev };
      if (id === 'sentiment-all') {
        const allChecked = !prev.all;
        return {
          all: allChecked,
          positive: allChecked,
          negative: allChecked,
          neutral: allChecked,
          mixed: allChecked
        };
      } else {
        const key = id.replace('sentiment-', '') as keyof typeof sentimentFilters;
        newFilters[key] = !prev[key];
        newFilters.all = false;
        return newFilters;
      }
    });
  };

  const handlePosFilterChange = (id: string) => {
    setPosFilters(prev => {
      const newFilters = { ...prev };
      if (id === 'pos-all') {
        const allChecked = !prev.all;
        return {
          all: allChecked,
          nouns: allChecked,
          verbs: allChecked,
          adjectives: allChecked
        };
      } else {
        const key = id.replace('pos-', '') as keyof typeof posFilters;
        newFilters[key] = !prev[key];
        newFilters.all = false;
        return newFilters;
      }
    });
  };

  // Add state for hashtags
  const [selectedWords, setSelectedWords] = useState(
    new Set(wordCloudData.wordcloud_data
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)
      .map(item => item.word))
  )

  // Add these new state variables
  const [isSlideExpanded, setIsSlideExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("impactDesc");
  const [showPostOverlay, setShowPostOverlay] = useState(false);

  // Add this effect to handle word clicks
  useEffect(() => {
    const handleWordClick = (event: CustomEvent) => {
      setSearchTerm(event.detail.word);
      if (event.detail.shouldExpand) {
        setIsSlideExpanded(true);
      }
    };

    window.addEventListener('wordClicked', handleWordClick as EventListener);
    return () => {
      window.removeEventListener('wordClicked', handleWordClick as EventListener);
    };
  }, []);

  return (
    <div className="w-full p-4">
      {/* Word Cloud Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Word Cloud</CardTitle>
              <CardDescription>
                Most frequently mentioned words in conversations
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setManageItemsOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
              <Select>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sentiment</SelectLabel>
                    <div className="space-y-2 p-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-all" 
                          checked={sentimentFilters.all}
                          onCheckedChange={() => handleSentimentFilterChange('sentiment-all')}
                        />
                        <label htmlFor="sentiment-all" className="text-sm">All</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-positive"
                          checked={sentimentFilters.positive}
                          onCheckedChange={() => handleSentimentFilterChange('sentiment-positive')}
                        />
                        <label htmlFor="sentiment-positive" className="text-sm">Positive</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-negative"
                          checked={sentimentFilters.negative}
                          onCheckedChange={() => handleSentimentFilterChange('sentiment-negative')}
                        />
                        <label htmlFor="sentiment-negative" className="text-sm">Negative</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-neutral"
                          checked={sentimentFilters.neutral}
                          onCheckedChange={() => handleSentimentFilterChange('sentiment-neutral')}
                        />
                        <label htmlFor="sentiment-neutral" className="text-sm">Neutral</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-mixed"
                          checked={sentimentFilters.mixed}
                          onCheckedChange={() => handleSentimentFilterChange('sentiment-mixed')}
                        />
                        <label htmlFor="sentiment-mixed" className="text-sm">Mixed</label>
                      </div>
                    </div>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Part of Speech</SelectLabel>
                    <div className="space-y-2 p-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pos-all" 
                          checked={posFilters.all}
                          onCheckedChange={() => handlePosFilterChange('pos-all')}
                        />
                        <label htmlFor="pos-all" className="text-sm">All</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pos-nouns"
                          checked={posFilters.nouns}
                          onCheckedChange={() => handlePosFilterChange('pos-nouns')}
                        />
                        <label htmlFor="pos-nouns" className="text-sm">Nouns</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pos-verbs"
                          checked={posFilters.verbs}
                          onCheckedChange={() => handlePosFilterChange('pos-verbs')}
                        />
                        <label htmlFor="pos-verbs" className="text-sm">Verbs</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pos-adjectives"
                          checked={posFilters.adjectives}
                          onCheckedChange={() => handlePosFilterChange('pos-adjectives')}
                        />
                        <label htmlFor="pos-adjectives" className="text-sm">Adjectives</label>
                      </div>
                    </div>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ChartDownloadButton
                data={wordCloudData.wordcloud_data}
                filename="word_cloud_data"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <WordCloudsCardJensen 
              sentimentFilters={sentimentFilters}
              posFilters={posFilters}
              selectedWords={selectedWords}
            />
            <PostMonitoringCards
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortKey={sortKey}
              onSortChange={setSortKey}
              isExpanded={isSlideExpanded}
              variant="sliding"
              onClose={() => setIsSlideExpanded(false)}
              showOverlay={showPostOverlay}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hashtag TreeMap Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Top Hashtags</CardTitle>
              <CardDescription>
                Most frequently used hashtags in conversations
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                defaultValue="20"
                onValueChange={(value) => {
                  const limit = parseInt(value);
                  setSelectedHashtags(
                    new Set(hashtagsData.slice(0, limit).map(item => item.tag))
                  );
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="20">Top 20</SelectItem>
                  <SelectItem value="30">Top 30</SelectItem>
                  <SelectItem value="40">Top 40</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                </SelectContent>
              </Select>
              <ChartDownloadButton
                data={hashtagsData}
                filename="hashtag_data"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HashtagTreeMap
            data={hashtagsData}
            selectedHashtags={selectedHashtags}
          />
        </CardContent>
      </Card>

      {/* Mentions Section */}
      <Card className="border">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div>
            <CardTitle>Mentions</CardTitle>
            <CardDescription>
              Monitor and analyze social media mentions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px]">
            <PostMonitoringCards 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortKey={sortKey}
              onSortChange={setSortKey}
              isExpanded={false}
              variant="default"
              showOverlay={showPostOverlay}
              onClose={() => setShowPostOverlay(false)}
            />
          </div>
        </CardContent>
      </Card>

      <ManageItemsDialog
        open={manageItemsOpen}
        onOpenChange={setManageItemsOpen}
        title="Manage Words"
        description="Select words to display in the word cloud"
        items={wordItems}
        selectedItems={selectedWords}
        onSelectionChange={setSelectedWords}
        maxItems={50}
        sentimentFilters={{
          all: true,
          positive: true,
          negative: true,
          mixed: true,
          neutral: true
        }}
        posFilters={{
          all: true,
          nouns: true,
          verbs: true,
          adjectives: true
        }}
      />
    </div>
  )
}