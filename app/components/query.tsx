'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { DateRange } from "react-day-picker"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Maximize2, AlertTriangle, BarChart2, Tag, ThumbsUp, MessageSquare, Share2, ExternalLink } from 'lucide-react'
import { QueryFilters } from './filter'
import { QueryResultCards } from '@/components/query-result-cards'

type QueryResult = {
  id: number;
  author: string;
  authorHandle: string;
  content: string;
  platform: string;
  date: string;
  time: string;
  sentiment: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  entities: string[];
  likes: number;
  comments: number;
  shares: number;
  url: string;
};

interface Channel {
  name: string;
  included: boolean;
  pages: { name: string; included: boolean }[];
}

export function QueryComponent() {
  const [querySearchTerm, setQuerySearchTerm] = useState("")
  const [queryResults, setQueryResults] = useState<QueryResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectAllChannels, setSelectAllChannels] = useState(true)
  const [channelsError, setChannelsError] = useState(false)
  const [openChannelDialog, setOpenChannelDialog] = useState<string | null>(null)
  const [pendingFilterChanges, setPendingFilterChanges] = useState(false)
  
  const [channels, setChannels] = useState<Channel[]>([
    {
      name: "Facebook",
      included: true,
      pages: ["Page 1", "Page 2", "Page 3"].map(name => ({ name, included: true }))
    },
    {
      name: "Instagram",
      included: true,
      pages: ["Account 1", "Account 2", "Account 3"].map(name => ({ name, included: true }))
    },
    {
      name: "Twitter",
      included: true,
      pages: ["Handle 1", "Handle 2", "Handle 3"].map(name => ({ name, included: true }))
    },
    {
      name: "Online Forum",
      included: true,
      pages: ["Forum 1", "Forum 2", "Forum 3"].map(name => ({ name, included: true }))
    }
  ])

  const [filterPanel, setFilterPanel] = useState({
    resultType: 'all',
    dateRange: undefined as DateRange | undefined,
    riskLevel: {
      all: true,
      high: true,
      medium: true,
      low: true
    },
    sentiment: {
      all: true,
      positive: true,
      negative: true,
      mixed: true,
      neutral: true
    },
  })

  const performSearch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockResults: QueryResult[] = [
        { 
          id: 1, 
          author: "John Doe",
          authorHandle: "@johndoe",
          content: "Just had an amazing experience with @TechCorp's new AI assistant. It's like having a personal genius at your fingertips! @SarahJohnson from their customer support team was incredibly helpful. #AI #CustomerService",
          platform: "Twitter", 
          date: "2023-06-15",
          time: "14:30",
          sentiment: "positive",
          riskLevel: "low",
          riskScore: 15,
          entities: ["TechCorp", "Sarah Johnson", "AI assistant"],
          likes: 1200,
          comments: 89,
          shares: 456,
          url: "https://twitter.com/johndoe/status/1234567890"
        },
        { 
          id: 2, 
          author: "Jane Smith",
          authorHandle: "@janesmith",
          content: "Disappointed with @GlobalTech's latest software update. It's causing major battery drain on my device. Has anyone else experienced this? @MikeBrown, their CTO, promised better performance, but this feels like a step backward. #TechFail #BatteryDrain",
          platform: "Facebook", 
          date: "2023-06-14",
          time: "09:45",
          sentiment: "negative",
          riskLevel: "high",
          riskScore: 75,
          entities: ["GlobalTech", "Mike Brown", "software update", "battery drain"],
          likes: 89,
          comments: 203,
          shares: 56,
          url: "https://facebook.com/janesmith/posts/2345678901"
        },
        { 
          id: 3, 
          author: "Alex Johnson",
          authorHandle: "@alexj",
          content: "Tried @EcoFriendly's new sustainable packaging. It's a step in the right direction, but there's room for improvement. The materials feel a bit flimsy. @EmilyGreen, their sustainability lead, mentioned they're working on stronger alternatives. Interested to see what comes next. #Sustainability #PackagingInnovation",
          platform: "Instagram", 
          date: "2023-06-13",
          time: "11:20",
          sentiment: "neutral",
          riskLevel: "medium",
          riskScore: 50,
          entities: ["EcoFriendly", "Emily Green", "sustainable packaging"],
          likes: 567,
          comments: 78,
          shares: 23,
          url: "https://instagram.com/p/Cg1234567890"
        },
      ];
      const selectedRiskLevels = Object.entries(filterPanel.riskLevel)
        .filter(([key, value]) => key !== 'all' && value)
        .map(([key]) => key);

      const selectedSentiments = Object.entries(filterPanel.sentiment)
        .filter(([key, value]) => key !== 'all' && value)
        .map(([key]) => key);

      console.log('Selected risk levels:', selectedRiskLevels);
      console.log('Selected sentiments:', selectedSentiments);
      setQueryResults(mockResults)
      setHasSearched(true)
      setPendingFilterChanges(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuerySearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await performSearch()
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilterPanel(prev => ({ ...prev, [key]: value }))
    setPendingFilterChanges(true)
  }

  const toggleAllChannels = (checked: boolean) => {
    setSelectAllChannels(checked)
    setChannels(prevChannels =>
      prevChannels.map(channel => ({ ...channel, included: checked }))
    )
    if (!checked) {
      setChannelsError(true)
    } else {
      setChannelsError(false)
    }
    setPendingFilterChanges(true)
  }

  const toggleChannelInclusion = (channelName: string) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? { ...channel, included: !channel.included }
          : channel
      )
    )
    setChannelsError(false)
    
    // Update selectAllChannels state
    const updatedChannels = channels.map(channel =>
      channel.name === channelName ? { ...channel, included: !channel.included } : channel
    )
    setSelectAllChannels(updatedChannels.every(channel => channel.included))
    setPendingFilterChanges(true)
  }

  const togglePageInclusion = (channelName: string, pageName: string) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? {
              ...channel,
              pages: channel.pages.map(page =>
                page.name === pageName
                  ? { ...page, included: !page.included }
                  : page
              )
            }
          : channel
      )
    )
    setPendingFilterChanges(true)
  }

  const toggleAllPages = (channelName: string, included: boolean) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? {
              ...channel,
              pages: channel.pages.map(page => ({ ...page, included }))
            }
          : channel
      )
    )
    setPendingFilterChanges(true)
  }

  const resetFilters = () => {
    setFilterPanel({
      resultType: 'all',
      dateRange: undefined,
      riskLevel: {
        all: true,
        high: true,
        medium: true,
        low: true
      },
      sentiment: {
        all: true,
        positive: true,
        negative: true,
        mixed: true,
        neutral: true
      },
    });
    setChannels(prevChannels =>
      prevChannels.map(channel => ({
        ...channel,
        included: true,
        pages: channel.pages.map(page => ({ ...page, included: true }))
      }))
    );
    setSelectAllChannels(true);
    setChannelsError(false);
    setPendingFilterChanges(true);
  };

  const applyFilters = () => {
    setPendingFilterChanges(false);
    if (hasSearched) {
      performSearch();
    }
  };

  return (
    <div className="space-y-6 p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">Query</h1>
      <form onSubmit={handleQuerySearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter your search query (use AND, OR, NOT for advanced search)"
          value={querySearchTerm}
          onChange={(e) => setQuerySearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="md:self-start md:sticky md:top-6">
          <QueryFilters
            filterPanel={filterPanel}
            channels={channels}
            selectAllChannels={selectAllChannels}
            channelsError={channelsError}
            pendingFilterChanges={pendingFilterChanges}
            onFilterChange={handleFilterChange}
            onChannelToggle={toggleChannelInclusion}
            onAllChannelsToggle={toggleAllChannels}
            onPageToggle={togglePageInclusion}
            onAllPagesToggle={toggleAllPages}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
          />
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-4">
                <p>Loading results...</p>
              </CardContent>
            </Card>
          ) : hasSearched ? (
            <QueryResultCards 
              searchTerm={querySearchTerm}
            />
          ) : (
            <div className="flex flex-col pt-20 items-center justify-center">
              <img src="/img/query.png" alt="Query" className="mb-4 h-16 opacity-70" />
              <p className="pt-4 text-gray-400">Enter a search query and click "Search" to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}