import * as React from "react"
import { Search, Sparkles, TrendingUp, TrendingDown, Clock, Copy, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderControlsProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortKey: string
  onSortChange: (value: string) => void
  onAISummary?: () => void
  pageSize: number
  onPageSizeChange?: (value: number) => void
  isHighlightEnabled: boolean
  onHighlightChange: (enabled: boolean) => void
  showAISummary: boolean
  setShowAISummary: (show: boolean) => void
}

export function HeaderControls({ 
  searchTerm, 
  onSearchChange, 
  sortKey, 
  onSortChange,
  onAISummary,
  pageSize,
  onPageSizeChange = () => {},
  isHighlightEnabled,
  onHighlightChange,
  showAISummary,
  setShowAISummary,
}: HeaderControlsProps) {
  const [copied, setCopied] = React.useState(false)
  const [selectedSummaryLanguage, setSelectedSummaryLanguage] = React.useState<'TC' | 'SC' | 'EN' | null>(null)

  const summaryContent = {
    TC: "根據過去7天的數據分析，加密貨幣市場呈現穩定上升趨勢。比特幣價格突破45,000美元關口，較上週上漲12%。以太坊同步走強，交易量增加30%。值得注意的是，Layer 2解決方案和DeFi項目獲得顯著關注，相關代幣價格普遍上漲15-25%。監管方面，多個國家釋放積極信號，機構投資者入場意願增強。社交媒體情緒分析顯示，市場信心指數處於近3個月高位，看多情緒占主導。",
    SC: "根据过去7天的数据分析，加密货币市场呈现稳定上升趋势。比特币价格突破45,000美元关口，较上周上涨12%。以太坊同步走强，交易量增加30%。值得注意的是，Layer 2解决方案和DeFi项目获得显著关注，相关代币价格普遍上涨15-25%。监管方面，多个国家释放积极信号，机构投资者入场意愿增强。社交媒体情绪分析显示，市场信心指数处于近3个月高位，看多情绪占主导。",
    EN: "Based on data analysis from the past 7 days, the cryptocurrency market shows a stable upward trend. Bitcoin price broke through $45,000, up 12% from last week. Ethereum strengthened in tandem with a 30% increase in trading volume. Notably, Layer 2 solutions and DeFi projects have gained significant attention, with related token prices generally rising 15-25%. On the regulatory front, multiple countries have released positive signals, strengthening institutional investors' willingness to enter the market. Social media sentiment analysis shows market confidence index at a 3-month high, with bullish sentiment dominating."
  }

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10)
    if (!isNaN(newSize) && onPageSizeChange) {
      onPageSizeChange(newSize)
    }
  }

  const handleAISummaryClick = () => {
    setShowAISummary(!showAISummary)
    onAISummary?.()
  }

  const handleLanguageSelect = (language: 'TC' | 'SC' | 'EN') => {
    setSelectedSummaryLanguage(language)
    setShowAISummary(true)
  }

  const handleCopy = () => {
    if (selectedSummaryLanguage) {
      navigator.clipboard.writeText(summaryContent[selectedSummaryLanguage])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative transition-all duration-200">
      {/* Top section with shadow */}
      <div className="bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {/* Top row: Search and AI Summary */}
        <div className="flex justify-between items-center gap-4 mb-4 px-4 pt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                className={cn(
                  "bg-[#00A59A] hover:bg-[#00A59A]/90",
                  showAISummary && "bg-[#00857C] text-white"
                )}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Summary
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
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-4 mb-4 px-4">
          <div className="flex items-center gap-2">
            <Select value={sortKey} onValueChange={onSortChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impactDesc">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Impact: High to Low</span>
                  </div>
                </SelectItem>
                <SelectItem value="impactAsc">
                  <div className="flex items-center">
                    <TrendingDown className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Impact: Low to High</span>
                  </div>
                </SelectItem>
                <SelectItem value="dateDesc">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 rotate-270 text-gray-500" />
                    <span>Date: Newest First</span>
                  </div>
                </SelectItem>
                <SelectItem value="dateAsc">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 rotate-90 text-gray-500" />
                    <span>Date: Oldest First</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={String(pageSize || 10)} 
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Show 10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Show 10</SelectItem>
                <SelectItem value="20">Show 20</SelectItem>
                <SelectItem value="30">Show 30</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-2">
              <Switch
                id="highlight"
                checked={isHighlightEnabled}
                onCheckedChange={onHighlightChange}
                className="data-[state=checked]:bg-[#00A59A] data-[state=checked]:hover:bg-[#00A59A]/90"
              />
              <Label htmlFor="highlight" className="text-sm">Highlight Keywords</Label>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Container */}
      {showAISummary && selectedSummaryLanguage && (
        <div className="border border-[#00A59A]/20 bg-[#F8FFFE] mx-4">
          <div className="flex justify-between items-center px-4 py-2 border-b border-[#00A59A]/20">
            <h3 className="text-sm font-medium text-[#00857C]">
              AI Summary ({selectedSummaryLanguage === 'TC' ? 'Traditional Chinese' : 
                         selectedSummaryLanguage === 'SC' ? 'Simplified Chinese' : 'English'})
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-[#00A59A]/10"
                onClick={handleCopy}
              >
                <Copy className={cn(
                  "h-4 w-4",
                  copied ? "text-[#00A59A]" : "text-gray-500"
                )} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-[#00A59A]/10"
                onClick={() => setShowAISummary(false)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="px-4 py-2">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {summaryContent[selectedSummaryLanguage]}
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 