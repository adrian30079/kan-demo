import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Post } from "@/types/post"
import { PostCard } from "./post-card"
import { HeaderControls } from "./header-controls"
import { Button } from "@/components/ui/button"
import { TableOverlayNoLimit } from "../table-overlay"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HighlightContext } from "@/contexts/highlight-context"
import defaultSettings from "@/components/data-topic-setting.json"

interface PostMonitoringViewProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortKey: string
  onSortChange: (value: string) => void
  currentPosts: Post[]
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  variant?: 'default' | 'sliding'
  isExpanded?: boolean
  onClose?: () => void
  showOverlay?: boolean
  isOverlay?: boolean
  renderInOverlay?: () => React.ReactNode
  onAISummary?: () => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  isHighlightEnabled: boolean
  onHighlightChange: (enabled: boolean) => void
  totalItems: number
}

const slideInStyles = {
  position: 'fixed' as const,
  top: 0,
  right: '-60%',
  width: '60%',
  height: '100vh',
  backgroundColor: 'white',
  transition: 'right 0.3s ease-in-out',
  zIndex: 50,
  boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.1)',
  padding: '3rem 1rem 1rem',
  overflowY: 'auto' as const,
} as const

const BASE_HEADER_HEIGHT = 140 // Base height without AI summary
const AI_SUMMARY_HEIGHT = 120 // Additional height when AI summary is shown
const FOOTER_HEIGHT = 64

const Pagination = ({ 
  currentPage, 
  pageCount, 
  onPageChange,
  pageSize,
  totalItems
}: {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  pageSize: number
  totalItems: number
}) => {
  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between h-full">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
      </div>
      <div className="flex-1 text-sm text-muted-foreground text-center">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={currentPage >= pageCount - 1}
        >
          Last
        </Button>
      </div>
    </div>
  )
}

export function PostMonitoringView({
  currentPosts,
  searchTerm,
  onSearchChange,
  sortKey,
  onSortChange,
  currentPage,
  pageCount,
  onPageChange,
  variant = 'default',
  isExpanded = false,
  onClose,
  showOverlay = false,
  isOverlay = false,
  renderInOverlay,
  onAISummary,
  pageSize,
  onPageSizeChange,
  isHighlightEnabled,
  onHighlightChange,
  totalItems,
}: PostMonitoringViewProps) {
  const [showAISummary, setShowAISummary] = React.useState(false)
  
  const headerHeight = showAISummary ? BASE_HEADER_HEIGHT + AI_SUMMARY_HEIGHT : BASE_HEADER_HEIGHT
  const contentHeight = `calc(100vh - ${headerHeight}px - ${FOOTER_HEIGHT}px)`

  const renderContent = () => (
    <div className="flex flex-col h-full">
      {/* Fixed Header - with dynamic height */}
      <div 
        className="sticky top-0 bg-background z-10 px-4 py-2 transition-all duration-200" 
        style={{ height: headerHeight }}
      >
        <HeaderControls 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          sortKey={sortKey}
          onSortChange={onSortChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          onAISummary={() => setShowAISummary(!showAISummary)}
          isHighlightEnabled={isHighlightEnabled}
          onHighlightChange={onHighlightChange}
          showAISummary={showAISummary}
          setShowAISummary={setShowAISummary}
        />
      </div>

      {/* Scrollable Content - with dynamic height */}
      <div 
        className="flex-1 overflow-y-auto px-4" 
        style={{ height: contentHeight }}
      >
        <div className="grid gap-4">
          {currentPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              className="w-full"
            />
          ))}
        </div>
      </div>

      {/* Fixed Footer - increased padding */}
      <div className="sticky bottom-0 bg-background z-10 px-6 py-3" style={{ height: FOOTER_HEIGHT }}>
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={onPageChange}
          pageSize={pageSize}
          totalItems={totalItems}
        />
      </div>
    </div>
  )

  if (variant === 'default') {
    return (
      <div className="w-full h-[600px]">
        {showOverlay && !isOverlay && (
          <TableOverlayNoLimit>
            {renderInOverlay?.()}
          </TableOverlayNoLimit>
        )}
        <div className="h-full px-6">
          {renderContent()}
        </div>
      </div>
    )
  }

  // Sliding variant
  return (
    <div 
      style={{
        ...slideInStyles,
        right: isExpanded ? '0' : '-60%',
      }}
      className="border-l shadow-xl bg-background"
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close panel"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="h-full pt-12">
        {renderContent()}
      </div>
    </div>
  )
} 