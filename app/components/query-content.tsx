'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PostMonitoringCards } from '@/components/post-monitoring-cards'
import { QueryFilters } from "./filter"
import { X, Filter as FilterIcon } from 'lucide-react'

export default function QueryContent() {
  const [querySearchTerm, setQuerySearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  
  // Filter states
  const [filterPanel, setFilterPanel] = useState({
    resultType: 'all',
    dateRange: undefined,
    classifiedContent: {
      virtualAssets: false,
      encourageInvestment: false,
      encourageAccount: false,
    },
    group: 'all',
    linkExtracted: false,
    sentiment: {
      all: true,
      positive: false,
      negative: false,
      mixed: false,
      neutral: false,
    },
  })
  const [pendingFilterChanges, setPendingFilterChanges] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    setFilterPanel(prev => ({
      ...prev,
      [key]: value
    }))
    setPendingFilterChanges(true)
  }

  const handleApplyFilters = () => {
    console.log("Applying filters:", filterPanel)
    setPendingFilterChanges(false)
  }

  const handleResetFilters = () => {
    setFilterPanel({
      resultType: 'all',
      dateRange: undefined,
      classifiedContent: {
        virtualAssets: false,
        encourageInvestment: false,
        encourageAccount: false,
      },
      group: 'all',
      linkExtracted: false,
      sentiment: {
        all: true,
        positive: false,
        negative: false,
        mixed: false,
        neutral: false,
      },
    })
    setPendingFilterChanges(true)
  }

  const performSearch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasSearched(true)
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

  return (
    <div className="flex">
      <div className="flex-1 space-y-8 p-6">
        <div className="flex items-center gap-2">
          <form onSubmit={handleQuerySearch} className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder="Enter your search query (use AND, OR, NOT for advanced search)"
              value={querySearchTerm}
              onChange={(e) => setQuerySearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading} className="bg-[#008d84] hover:bg-[#007a73] text-white">
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          <Button 
            variant={showFilters ? "default" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-[#00857C] text-white hover:bg-[#00857C]/90" : ""}
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="p-4">
              <p>Loading results...</p>
            </CardContent>
          </Card>
        ) : hasSearched ? (
          <PostMonitoringCards hideSearchBar={true} />
        ) : (
          <div className="flex flex-col pt-20 items-center justify-center">
            <img src="/img/query.png" alt="Query" className="mb-4 h-16 opacity-70" />
            <p className="pt-4 text-gray-400">Enter a search query and click "Search" to see results.</p>
          </div>
        )}
      </div>

      {showFilters && (
        <Card className="h-fill w-[260px] border bg-white rounded-none relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setShowFilters(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <QueryFilters
              filterPanel={{
                ...filterPanel,
                group: "all" // Fix type error by ensuring group is one of "all" | "wechat" | "whatsapp"
              }}
              channels={[]}
              selectAllChannels={true}
              channelsError={false}
              pendingFilterChanges={pendingFilterChanges}
              onFilterChange={handleFilterChange}
              onChannelToggle={() => {}}
              onAllChannelsToggle={() => {}}
              onPageToggle={() => {}}
              onAllPagesToggle={() => {}}
              onResetFilters={handleResetFilters}
              onApplyFilters={handleApplyFilters}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}