import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Flame, 
  Heart, 
  MessageCircle, 
  Share,
  ExternalLink,
  Images,
  Languages,
  FileText,
  Link2,
  ChevronRight,
  Hash,
  Tag,
  X as CloseIcon,
  Copy,
} from 'lucide-react'
import { Post } from "@/types/post"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useHighlight } from "@/contexts/highlight-context"
import { CommentGallery } from "@/components/commentGallery"
import { PhotoGallery } from "@/components/photo-gallery"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const channelIcons = {
  facebook: "/img/media/ic-mediatype-facebook.png",
  X: "/img/media/ic-mediatype-X.png",
  instagram: "/img/media/ic-mediatype-instagram.png",
  OnlineForum: "/img/media/ic-mediatype-lihkg.png",
  default: "/img/media/ic-mediatype-default.png"
}

interface PostCardProps {
  post: Post
  className?: string
}

// Helper function to highlight text
const highlightText = (text: string, highlightWords: string[]) => {
  if (!highlightWords.length) return text

  const regex = new RegExp(`(${highlightWords.join('|')})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) => {
    if (highlightWords.some(word => part.toLowerCase() === word.toLowerCase())) {
      return <mark key={i} className="bg-yellow-300 px-1">{part}</mark>
    }
    return part
  })
}

// Add this helper function at the top level
const getLinkType = (link: string) => {
  if (link.includes('wa.me') || link.toLowerCase().includes('whatsapp')) {
    return 'WhatsApp'
  }
  if (link.toLowerCase().includes('wechat') || link.toLowerCase().includes('weixin')) {
    return 'WeChat'
  }
  return 'Other'
}

export function PostCard({ post, className }: PostCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false)
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = React.useState(false)
  const { highlightText: highlightWords } = useHighlight()
  const [showLinks, setShowLinks] = React.useState(false)
  const { toast } = useToast()
  const [showTranslation, setShowTranslation] = React.useState(false)
  const [selectedLanguage, setSelectedLanguage] = React.useState<'TC' | 'SC' | 'EN' | null>(null)
  const [showSummary, setShowSummary] = React.useState(false)
  const [selectedSummaryLanguage, setSelectedSummaryLanguage] = React.useState<'TC' | 'SC' | 'EN' | null>(null)

  console.log('Post content:', post.fullContent)
  console.log('Highlight words:', highlightWords)
  console.log('Is array?', Array.isArray(highlightWords))
  console.log('Length:', highlightWords?.length)

  if (!post) return null

  const capitalizedSentiment = post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1)

  // Format numbers for better display
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  // Get images array from post.imgGroup
  const getImages = () => {
    if (!post.imgGroup) return []
    return Object.values(post.imgGroup)
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      description: "Link copied to clipboard",
      duration: 2000
    })
  }

  const translationContent = {
    TC: "根據最新市場動態，加密貨幣交易平台持續優化其服務。該平台提供多樣化的交易對，支援槓桿交易，並實施嚴格的安全措施。平台特色包括自動化交易系統、24小時客戶支援，以及完善的風險管理機制。投資者可以通過多種支付方式進行充值和提現。",
    SC: "根据最新市场动态，加密货币交易平台持续优化其服务。该平台提供多样化的交易对，支持杠杆交易，并实施严格的安全措施。平台特色包括自动化交易系统、24小时客户支持，以及完善的风险管理机制。投资者可以通过多种支付方式进行充值和提现。",
    EN: "According to recent market dynamics, the cryptocurrency trading platform continues to optimize its services. The platform offers diverse trading pairs, supports leverage trading, and implements strict security measures. Platform features include automated trading systems, 24/7 customer support, and comprehensive risk management mechanisms. Investors can deposit and withdraw through multiple payment methods."
  }

  const languageLabels = {
    TC: "Traditional Chinese",
    SC: "Simplified Chinese",
    EN: "English"
  }

  const handleLanguageSelect = (language: 'TC' | 'SC' | 'EN') => {
    setSelectedLanguage(language)
    setShowTranslation(true)
  }

  const handleCopyTranslation = () => {
    if (selectedLanguage) {
      navigator.clipboard.writeText(translationContent[selectedLanguage])
      toast({
        description: "Translation copied to clipboard",
        duration: 2000
      })
    }
  }

  const renderTranslationButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
        >
          <Languages className="h-4 w-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageSelect('TC')}>
          Traditional Chinese
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageSelect('SC')}>
          Simplified Chinese
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageSelect('EN')}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderTranslationBox = () => {
    if (!showTranslation || !selectedLanguage) return null

    return (
      <div className="w-full mt-3 p-3 bg-gray-50 border border-gray-200 relative">
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopyTranslation}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy translation</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowTranslation(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <CloseIcon className="h-4 w-4 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
          <Languages className="h-4 w-4" />
          <span>Translation ({languageLabels[selectedLanguage]})</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {translationContent[selectedLanguage]}
        </p>
      </div>
    )
  }

  const summaryContent = {
    TC: "本帖文討論了加密貨幣交易平台的最新發展。平台提供多種交易選項，包括槓桿交易功能，並強調其安全性措施。文中提到平台支援24小時交易，並具備完善的風險管理系統。此外，平台也提供多種支付方式，方便用戶充值和提現。",
    SC: "本帖文讨论了加密货币交易平台的最新发展。平台提供多种交易选项，包括杠杆交易功能，并强调其安全性措施。文中提到平台支持24小时交易，并具备完善的风险管理系统。此外，平台也提供多种支付方式，方便用户充值和提现。",
    EN: "This post discusses the latest developments in cryptocurrency trading platforms. The platform offers various trading options, including leverage trading features, while emphasizing its security measures. It mentions 24/7 trading support and comprehensive risk management systems. Additionally, the platform provides multiple payment methods for convenient deposits and withdrawals."
  }

  const handleSummaryLanguageSelect = (language: 'TC' | 'SC' | 'EN') => {
    setSelectedSummaryLanguage(language)
    setShowSummary(true)
  }

  const renderSummaryButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
        >
          <FileText className="h-4 w-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSummaryLanguageSelect('TC')}>
          Traditional Chinese
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSummaryLanguageSelect('SC')}>
          Simplified Chinese
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSummaryLanguageSelect('EN')}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderSummaryBox = () => {
    if (!showSummary || !selectedSummaryLanguage) return null

    return (
      <div className="w-full mt-3 p-3 bg-gray-50 border border-gray-200 relative">
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(summaryContent[selectedSummaryLanguage])
                    toast({
                      description: "Summary copied to clipboard",
                      duration: 2000
                    })
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy summary</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowSummary(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <CloseIcon className="h-4 w-4 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
          <FileText className="h-4 w-4" />
          <span>Summary ({languageLabels[selectedSummaryLanguage]})</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {summaryContent[selectedSummaryLanguage]}
        </p>
      </div>
    )
  }

  return (
    <>
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg", 
        "border-gray-200/80 shadow-md",
        className
      )}>
        <CardContent className="p-0">
          <div className="p-4 border-b bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex justify-between items-center">
              {/* Left side with larger icon - add hover effect */}
              <div className="flex items-center gap-4 group">
                <div className="overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-105">
                  <img 
                    src={channelIcons[post.channel] || channelIcons.default}
                    alt={`${post.channel} icon`}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-base leading-tight hover:text-[#00A59A] transition-colors">
                    {post.author}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {new Date(post.postDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right side metrics - improve badge and metrics styling */}
              <div className="flex items-center gap-3">
                <Badge 
                  variant={post.sentiment === 'positive' ? 'success' : 'destructive'}
                  className="capitalize text-xs px-2.5 py-0.5 h-6 font-medium shadow-sm"
                >
                  {capitalizedSentiment}
                </Badge>

                {/* Engagement metrics with improved styling */}
                <div className="flex items-center gap-4 px-3 py-1 bg-gray-50 rounded-full border border-gray-200/80">
                  <div className="flex items-center gap-1.5 min-w-[45px]">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-medium">{formatNumber(post.likes || 0)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 min-w-[45px]">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{formatNumber(post.comments || 0)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 min-w-[45px]">
                    <Share className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium">{formatNumber(post.shares || 0)}</span>
                  </div>

                  <Badge 
                    variant="secondary" 
                    className="bg-[#00A59A] hover:bg-[#00A59A]/90 text-white text-xs px-2.5 py-0.5 h-6 shadow-sm"
                  >
                    <Flame className="h-3.5 w-3.5 mr-1" />
                    {post.engagementIndex || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white">
            <p className="text-sm text-gray-700 line-clamp-3 mb-3 leading-relaxed">
              {highlightText(post.fullContent || '', highlightWords)}
            </p>

            {/* Labels section with improved styling */}
            <TooltipProvider>
              <div className="flex flex-wrap gap-2 items-center">
                {/* Content Classifier Labels */}
                {post.classifiedContent?.map((label, index) => (
                  <Tooltip key={`classifier-${index}`}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100/80 hover:bg-gray-100 rounded-full text-xs text-gray-600 cursor-help transition-colors">
                        <Tag className="h-3 w-3" />
                        {label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Content Classification Label</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* NER Labels */}
                {post.ner?.map((label, index) => (
                  <Tooltip key={`ner-${index}`}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50/80 hover:bg-blue-50 rounded-full text-xs text-blue-600 cursor-help transition-colors">
                        <Hash className="h-3 w-3" />
                        {label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Named Entity Recognition Label</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>

            {/* Add Links Box */}
            {showLinks && post.linkExtracted && (
              <div className="w-full mt-3 p-3 bg-gray-50 border border-gray-200 relative">
                {/* ... links box content ... */}
              </div>
            )}

            {/* Translation Box */}
            {renderTranslationBox()}

            {/* Summary Box */}
            {renderSummaryBox()}
          </div>

          <div className="p-4 border-t bg-gray-50/50">
            <div className="flex justify-between items-center">
              {/* Left side: Navigation Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 shadow-sm hover:bg-gray-50 hover:text-[#00A59A] transition-colors"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <span className="text-sm">See Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 shadow-sm hover:bg-gray-50 hover:text-[#00A59A] transition-colors"
                  onClick={() => window.open(post.URL, '_blank')}
                >
                  <span className="text-sm">Go to Source</span>
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Right side: Action Icons */}
              <TooltipProvider>
                <div className="flex items-center gap-3">
                  {/* Photo Album with count */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setIsPhotoGalleryOpen(true)}
                        >
                          <Images className="h-4 w-4 text-gray-600" />
                        </Button>
                        {post.imgGroup && Object.keys(post.imgGroup).length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[#00A59A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {Object.keys(post.imgGroup).length}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Photo Gallery ({post.imgGroup ? Object.keys(post.imgGroup).length : 0} photos)</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Inspect Links with count */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setShowLinks(!showLinks)}
                        >
                          <Link2 className="h-4 w-4 text-gray-600" />
                        </Button>
                        {post.linkExtracted && (
                          <span className="absolute -top-2 -right-2 bg-[#00A59A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            1
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inspect Links & Groups ({post.linkExtracted ? '1' : '0'} link)</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Translation */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {renderTranslationButton()}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Translate Content</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Summary */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {renderSummaryButton()}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Summary</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Gallery */}
      {isGalleryOpen && (
        <CommentGallery 
          post={post}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}

      {/* Photo Gallery */}
      <PhotoGallery 
        images={getImages()}
        onClose={() => setIsPhotoGalleryOpen(false)}
        isOpen={isPhotoGalleryOpen}
      />
    </>
  )
} 