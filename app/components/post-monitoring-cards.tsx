"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Flame, Clock, Search, Globe, Link, RefreshCw, Loader2, ArrowRight, ChevronDown, X, Plus, Image as ImageIcon } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { PhotoGallery } from "./photo-gallery"
import postsData from './data-post.json'
import topicSettings from './data-topic-setting.json'
import { Post } from "@/types/post"

export function PostMonitoringCardsComponent({ 
  onClose,
  selectedEntity 
}: { 
  onClose?: () => void
  selectedEntity?: string | null 
}) {
  const [fullText, setFullText] = React.useState(true)
  const [highlightText, setHighlightText] = React.useState<string[]>(topicSettings.highlightText)
  const [isHighlightEnabled, setIsHighlightEnabled] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortKey, setSortKey] = React.useState<keyof Post | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [showAISummary, setShowAISummary] = React.useState(false)
  const [expandedPostIds, setExpandedPostIds] = React.useState<Set<string>>(new Set())
  const [isMainSummaryLoading, setIsMainSummaryLoading] = React.useState(false)
  const [isRegeneratingLoading, setIsRegeneratingLoading] = React.useState(false)
  const [postSummaryLoading, setPostSummaryLoading] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [postsPerPage, setPostsPerPage] = React.useState(5)
  const [showHighlightTags, setShowHighlightTags] = React.useState(false)
  const [newHighlightTag, setNewHighlightTag] = React.useState('')
  const [showGallery, setShowGallery] = React.useState(false)

  const sortedData = React.useMemo(() => {
    let sorted = [...postsData.posts]
    
    if (selectedEntity) {
      sorted = sorted.filter(post => {
        const platformName = selectedEntity.toLowerCase();
        
        if (platformName === "x") {
          return post.ner.some(entity => 
            entity.toLowerCase() === "x" || 
            entity.toLowerCase() === "twitter"
          );
        }
        
        if (platformName === "online forum") {
          return post.ner.some(entity => 
            entity.toLowerCase().includes("forum")
          );
        }
        
        return post.ner.some(entity => 
          entity.toLowerCase().includes(platformName)
        );
      });
    }

    if (sortKey) {
      sorted.sort((a, b) => {
        if (sortKey === "postDate") {
          return new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
        }
        if (sortKey === "group") {
          return a.group.localeCompare(b.group)
        }
        return (b[sortKey] as number) - (a[sortKey] as number)
      })
    }
    return sorted.filter(post =>
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.fullContent.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [sortKey, searchTerm, selectedEntity])

  const currentPosts = React.useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    return sortedData.slice(indexOfFirstPost, indexOfLastPost)
  }, [sortedData, currentPage, postsPerPage])

  const toggleAISummary = async () => {
    setIsMainSummaryLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setShowAISummary(!showAISummary)
    } catch (err) {
      setError("Failed to toggle AI Summary. Please try again.")
    } finally {
      setIsMainSummaryLoading(false)
    }
  }

  const regenerateAISummary = async () => {
    setIsRegeneratingLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    } catch (err) {
      setError("Failed to regenerate AI Summary. Please try again.")
    } finally {
      setIsRegeneratingLoading(false)
    }
  }

  const togglePostSummary = async (postId: string) => {
    setPostSummaryLoading(postId)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setExpandedPostIds(prev => {
        const newSet = new Set(prev)
        if (newSet.has(postId)) {
          newSet.delete(postId)
        } else {
          newSet.add(postId)
        }
        return newSet
      })
    } catch (err) {
      setError("Failed to load post summary. Please try again.")
    } finally {
      setPostSummaryLoading(null)
    }
  }

  const getSentimentColor = (sentiment: Post['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'neutral': return 'bg-gray-100 text-gray-800'
      case 'negative': return 'bg-red-100 text-red-800'
      case 'mixed': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between space-x-4 p-4">
        <div className="flex items-center space-x-4">
          <div className="relative max-w-sm">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="full-text"
              checked={fullText}
              onCheckedChange={setFullText}
              className="data-[state=checked]:bg-[#00857C]"
            />
            <Label htmlFor="full-text">Full Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="highlight-text"
              checked={isHighlightEnabled}
              onCheckedChange={setIsHighlightEnabled}
              className="data-[state=checked]:bg-[#00857C]"
            />
            <Label htmlFor="highlight-text">Highlight Text</Label>
          </div>
          <select
            onChange={(e) => setSortKey(e.target.value as keyof Post)}
            className="border rounded p-1"
          >
            <option value="">Sort by</option>
            <option value="engagementIndex">Engagement Index</option>
            <option value="mentions">Mentions</option>
            <option value="postDate">Date</option>
            <option value="group">With Groups</option>
          </select>
          <Button 
            onClick={toggleAISummary} 
            variant="outline" 
            size="sm"
            disabled={isMainSummaryLoading}
            className={cn(
              "relative",
              showAISummary && "bg-[#00857C] text-white hover:bg-[#00857C]/90"
            )}
          >
            {isMainSummaryLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="19" viewBox="0 0 24 19" fill="none" className="mr-2">
                <path d="M0.623518 18.323C-0.207839 17.493 -0.207839 16.1442 0.623518 15.3142L12.0178 3.91991C12.2945 3.64323 12.7441 3.64323 13.0208 3.91991L15.028 5.9258C15.3047 6.20381 15.3047 6.65207 15.028 6.93008L3.63369 18.323C2.80233 19.1544 1.45487 19.1544 0.623518 18.323Z" fill="#6D6D6D"/>
                <path d="M18.3245 0.623518C19.1559 1.45487 19.1559 2.80233 18.3245 3.63236L17.5357 4.42115C17.259 4.69783 16.8108 4.69783 16.5328 4.42115L14.5269 2.41393C14.2489 2.13725 14.2489 1.68766 14.5269 1.41098L15.3143 0.623518C16.1457 -0.207839 17.4931 -0.207839 18.3245 0.623518Z" fill="#6D6D6D"/>
                <path d="M21.8173 4.48384C21.7893 4.31225 21.651 4.16992 21.4767 4.16992C21.3025 4.16992 21.1641 4.31225 21.1389 4.48517C21.0019 5.4083 20.2716 6.13859 19.3485 6.27558C19.1755 6.30086 19.0332 6.43919 19.0332 6.61345C19.0332 6.7877 19.1755 6.92604 19.3471 6.95397C20.2716 7.10162 21.0032 7.88643 21.1389 8.82155C21.1641 8.99447 21.3025 9.1368 21.4767 9.1368C21.651 9.1368 21.7907 8.99447 21.8146 8.82155C21.9529 7.85452 22.7178 7.08967 23.6848 6.95132C23.8577 6.92737 24.0001 6.7877 24.0001 6.61345C24.0001 6.4392 23.8577 6.30086 23.6848 6.27559C22.7497 6.13991 21.9649 5.40963 21.8173 4.48384Z" fill="#6D6D6D"/>
                <path d="M17.72 9.56901C17.6908 9.33091 17.4992 9.13672 17.2598 9.13672C17.0203 9.13672 16.8288 9.33092 16.7995 9.56901C16.604 11.1386 15.3603 12.3823 13.7907 12.5779C13.5526 12.6071 13.3584 12.7987 13.3584 13.0381C13.3584 13.2776 13.5526 13.4691 13.7907 13.4984C15.3603 13.6939 16.604 14.9376 16.7995 16.5072C16.8288 16.7453 17.0203 16.9395 17.2598 16.9395C17.4992 16.9395 17.6908 16.7453 17.72 16.5072C17.9156 14.9376 19.1593 13.6939 20.7289 13.4984C20.967 13.4691 21.1612 13.2776 21.1612 13.0381C21.1612 12.7987 20.967 12.6071 20.7289 12.5779C19.1593 12.3823 17.9156 11.1386 17.72 9.56901Z" fill="#6D6D6D"/>
              </svg>
            )}
            AI Summary
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <div className="flex flex-grow overflow-hidden">
        {showAISummary && (
          <Card className="w-100px p-4 m-2 overflow-auto relative">
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">AI Summary</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mb-4 text-sm">
                This summary is extracted from top 10 posts on this page
              </div>
              <div className="space-y-4 mb-16">
                <h2 className="font-semibold">1. CoinUnited.io Adds NEXO Trading - NEXO/USDT, 2000x leverage, 105% APY</h2>
                <p>CoinUnited.io has listed NEXO/USDT with up to 2000x leverage available for traders. Users can also stake NEXO and earn an impressive 105% APY. Recent performance shows a 24-hour price increase of +5.55% and a 7-day rise of +16.62%, offering great opportunities for profit.</p>
                <h2 className="font-semibold">2. Bitcoin Asia Summit 2024 in Hong Kong - Bitcoin Asia Summit 2024, 10,000 attendees</h2>
                <p>The Bitcoin Asia Summit 2024 launched at Kai Tak Cruise Terminal, attracting over 10,000 attendees on the first day. This global Web3 event highlighted Bitcoin, blockchain innovations, and Hong Kong's emergence as a crypto hub. It also celebrated the approval of Bitcoin and Ethereum ETFs, with experts and exhibitors exploring the future of blockchain.</p>
                <h2 className="font-semibold">3. Telegram-Based Crypto and Marketing Tools - Telegram services</h2>
                <p>Telegram services offer TRX energy rentals, automated bots, AI-powered face-swapping, and binary options trading. For businesses, TikTok, Instagram, and Facebook tools enable mass messaging, targeted lead generation, and group control systems, perfect for scaling overseas e-commerce and crypto campaigns.</p>
                <h2 className="font-semibold">4. Web3 Talent Development Program Launched - Hong Kong's Web3 Association, 6-month intensive training course</h2>
                <p>Hong Kong's Web3 Association announced a "Web3 Future Stars" program in collaboration with top universities. This initiative includes a 6-month intensive training course, internships, and project incubation, aiming to develop blockchain, smart contract, and decentralized application expertise for the growing Web3 industry.</p>
                <h2 className="font-semibold">5. Crypto Market Updates and Security Concerns - Bitcoin</h2>
                <p>Bitcoin surged from $15,000 last year to $55,000 this year, with Ethereum reaching $3,200. However, a major crypto exchange hacking incident has raised security concerns, potentially impacting millions of dollars in user funds. Experts urge users to enable two-factor authentication and update passwords as regulatory scrutiny increases.</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={regenerateAISummary}
                  variant="outline"
                  size="sm"
                  disabled={isRegeneratingLoading}
                >
                  {isRegeneratingLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex-grow overflow-auto p-4">
          {currentPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 shadow-sm mb-4 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                  <path d="M24.1466 12.0733C24.1466 5.40543 18.7413 0 12.0733 0C5.40543 0 0 5.40543 0 12.0733C0 18.0995 4.41504 23.0943 10.1869 24V15.5633H7.12139V12.0733H10.1869V9.41344C10.1869 6.38753 11.9893 4.71616 14.7472 4.71616C16.0681 4.71616 17.4498 4.95195 17.4498 4.95195V7.92312H15.9273C14.4275 7.92312 13.9598 8.8538 13.9598 9.8086V12.0733H17.3083L16.773 15.5633H13.9598V24C19.7316 23.0943 24.1466 18.0995 24.1466 12.0733Z" fill="#1877F2"/>
                </svg>
                  <span>{post.group}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getSentimentColor(post.sentiment as "positive" | "negative" | "neutral" | "mixed")} cursor-default`}>
                    {post.sentiment}
                  </Badge>
                  <Flame className="h-4 w-4 text-red-500" />
                  <span>{post.engagementIndex}</span>
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{post.mentions}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-500">{post.postDate}</div>
                <div className="mt-1">
                  {isHighlightEnabled && highlightText ? (
                    (fullText ? post.fullContent : post.summary)
                        .split(new RegExp(`(${highlightText.join('|')})`, 'i'))
                        .map((part, i) => 
                          highlightText.some(tag => part.toLowerCase() === tag.toLowerCase())
                            ? <span key={i} className="bg-yellow-200">{part}</span>
                            : part
                        )
                    ) : fullText ? post.fullContent : post.summary
                  }
                </div>
                {expandedPostIds.has(post.id) && (
                  <div className="mt-4 p-4 bg-[#F2F5F0] rounded-lg relative">
                    <h4 className="font-semibold mb-2">AI Summary</h4>
                    <p>This is a short summary of the post generated by AI. It highlights key points and provides a concise overview of the content.</p>
                    <Button
                      onClick={regenerateAISummary}
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      disabled={isRegeneratingLoading}
                    >
                      {isRegeneratingLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="sr-only">Regenerate AI Summary</span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {post.classifiedContent.map((content, index) => (
                  <Badge 
                    key={`classified-${index}`} 
                    className="bg-[#EDFBF9] text-[#32504C] border-none mr-1"
                  >
                    {content}
                  </Badge>
                ))}
                {post.ner.map((entity, index) => (
                  <Badge key={`ner-${index}`} variant="outline">
                    {entity}
                  </Badge>
                ))}
              </div>
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                {post.imgGroup && Object.keys(post.imgGroup).length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowGallery(true)}
                  >
                    <div className="relative">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      {Object.keys(post.imgGroup).length > 1 && (
                        <span className="absolute -top-2 -right-2 text-xs bg-[#00857C] text-white rounded-full w-4 h-4 flex items-center justify-center">
                          {Object.keys(post.imgGroup).length}
                        </span>
                      )}
                    </div>
                  </Button>
                )}
                {post.linkExtracted && (
                  <a href={post.URL} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <Link className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-gray-400 hover:text-gray-600",
                    expandedPostIds.has(post.id) ? "opacity-100" : "opacity-60"
                  )}
                  onClick={() => togglePostSummary(post.id)}
                  disabled={postSummaryLoading === post.id}
                >
                  {postSummaryLoading === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="19" viewBox="0 0 24 19" fill="none">
                      <path d="M0.623518 18.323C-0.207839 17.493 -0.207839 16.1442 0.623518 15.3142L12.0178 3.91991C12.2945 3.64323 12.7441 3.64323 13.0208 3.91991L15.028 5.9258C15.3047 6.20381 15.3047 6.65207 15.028 6.93008L3.63369 18.323C2.80233 19.1544 1.45487 19.1544 0.623518 18.323Z" fill="#6D6D6D"/>
                      <path d="M18.3245 0.623518C19.1559 1.45487 19.1559 2.80233 18.3245 3.63236L17.5357 4.42115C17.259 4.69783 16.8108 4.69783 16.5328 4.42115L14.5269 2.41393C14.2489 2.13725 14.2489 1.68766 14.5269 1.41098L15.3143 0.623518C16.1457 -0.207839 17.4931 -0.207839 18.3245 0.623518Z" fill="#6D6D6D"/>
                      <path d="M21.8173 4.48384C21.7893 4.31225 21.651 4.16992 21.4767 4.16992C21.3025 4.16992 21.1641 4.31225 21.1389 4.48517C21.0019 5.4083 20.2716 6.13859 19.3485 6.27558C19.1755 6.30086 19.0332 6.43919 19.0332 6.61345C19.0332 6.7877 19.1755 6.92604 19.3471 6.95397C20.2716 7.10162 21.0032 7.88643 21.1389 8.82155C21.1641 8.99447 21.3025 9.1368 21.4767 9.1368C21.651 9.1368 21.7907 8.99447 21.8146 8.82155C21.9529 7.85452 22.7178 7.08967 23.6848 6.95132C23.8577 6.92737 24.0001 6.7877 24.0001 6.61345C24.0001 6.4392 23.8577 6.30086 23.6848 6.27559C22.7497 6.13991 21.9649 5.40963 21.8173 4.48384Z" fill="#6D6D6D"/>
                      <path d="M17.72 9.56901C17.6908 9.33091 17.4992 9.13672 17.2598 9.13672C17.0203 9.13672 16.8288 9.33092 16.7995 9.56901C16.604 11.1386 15.3603 12.3823 13.7907 12.5779C13.5526 12.6071 13.3584 12.7987 13.3584 13.0381C13.3584 13.2776 13.5526 13.4691 13.7907 13.4984C15.3603 13.6939 16.604 14.9376 16.7995 16.5072C16.8288 16.7453 17.0203 16.9395 17.2598 16.9395C17.4992 16.9395 17.6908 16.7453 17.72 16.5072C17.9156 14.9376 19.1593 13.6939 20.7289 13.4984C20.967 13.4691 21.1612 13.2776 21.1612 13.0381C21.1612 12.7987 20.967 12.6071 20.7289 12.5779C19.1593 12.3823 17.9156 11.1386 17.72 9.56901Z" fill="#6D6D6D"/>
                    </svg>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>English</DropdownMenuItem>
                    <DropdownMenuItem>繁體中文</DropdownMenuItem>
                    <DropdownMenuItem>简中文</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <Select value={postsPerPage.toString()} onValueChange={(value) => setPostsPerPage(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(sortedData.length / postsPerPage) }, (_, i) => (
            <Button
              key={i}
              onClick={() => paginate(i + 1)}
              variant={currentPage === i + 1 ? "default" : "outline"}
              className={cn(
                "mx-1",
                currentPage === i + 1 && "bg-[#00857C] text-white hover:bg-[#00857C]/90"
              )}
            >
              {i + 1}            </Button>
          ))}
        </div>
      </div>
      {showGallery && (
        <PhotoGallery 
          images={Object.values(currentPosts[0].imgGroup || {})}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  )
}