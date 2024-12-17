"use client"

import * as React from "react"
import postsData from './data-post.json'
import defaultSettings from './data-topic-setting.json'
import { Post } from "@/types/post"
import { PostMonitoringView } from "./post-monitoring-cards/post-monitoring-view"
import { HighlightContext } from "@/contexts/highlight-context"

const typedPostsData: Post[] = postsData.posts as Post[]

interface PostMonitoringCardsProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortKey?: string
  onSortChange: (value: string) => void
  isExpanded: boolean
  variant?: 'default' | 'query' | 'sliding'
  onClose?: () => void
  selectedEntity?: string | null
  isOverlay?: boolean
  showOverlay?: boolean
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  isHighlightEnabled?: boolean
  onHighlightChange?: (enabled: boolean) => void
  className?: string
  customStyles?: {
    cardBorder?: string
    riskLabel?: string
    // Add more customizable styles
  }
}

export function PostMonitoringCards({
  searchTerm,
  onSearchChange,
  sortKey = "impactDesc",
  onSortChange,
  isExpanded,
  variant = 'default',
  onClose,
  isOverlay = false,
  showOverlay = false,
  pageSize: externalPageSize,
  onPageSizeChange: externalPageSizeChange,
  isHighlightEnabled = false,
  onHighlightChange,
  className,
  customStyles,
}: PostMonitoringCardsProps) {
  const [localHighlightEnabled, setLocalHighlightEnabled] = React.useState(isHighlightEnabled)
  const [highlightText, setHighlightText] = React.useState<string[]>([])
  const [showAISummary, setShowAISummary] = React.useState(false)
  const [isAISummaryLoading, setIsAISummaryLoading] = React.useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false)
  const [selectedImages, setSelectedImages] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)

  const handleHighlightTextChange = (enabled: boolean) => {
    setLocalHighlightEnabled(enabled)
    if (enabled) {
      setHighlightText(defaultSettings.highlightText)
    } else {
      setHighlightText([])
    }
    onHighlightChange?.(enabled)
  }

  const handleAISummaryToggle = async (enabled: boolean) => {
    setShowAISummary(enabled)
    if (enabled) {
      setIsAISummaryLoading(true)
      setIsAISummaryLoading(false)
    }
  }

  const handleOpenGallery = (images: string[]) => {
    setSelectedImages(images)
    setIsGalleryOpen(true)
  }

  const handleCloseGallery = () => {
    setIsGalleryOpen(false)
    setSelectedImages([])
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(0)
    externalPageSizeChange?.(newSize)
  }

  const sortedPosts = React.useMemo(() => {
    return [...typedPostsData].sort((a, b) => {
      const effectiveSortKey = sortKey || "impactDesc"
      
      switch (effectiveSortKey) {
        case "impactDesc":
          const bImpact = b.engagementIndex || 0
          const aImpact = a.engagementIndex || 0
          return bImpact - aImpact
          
        case "impactAsc":
          const bImpact2 = b.engagementIndex || 0
          const aImpact2 = a.engagementIndex || 0
          return aImpact2 - bImpact2
          
        case "dateDesc":
          try {
            const dateB = new Date(b.postDate).getTime()
            const dateA = new Date(a.postDate).getTime()
            return dateB - dateA
          } catch {
            return 0
          }
          
        case "dateAsc":
          try {
            const dateB = new Date(b.postDate).getTime()
            const dateA = new Date(a.postDate).getTime()
            return dateA - dateB
          } catch {
            return 0
          }
          
        default:
          return (b.engagementIndex || 0) - (a.engagementIndex || 0)
      }
    })
  }, [typedPostsData, sortKey])

  const effectivePageSize = Number(externalPageSize) || pageSize
  const totalItems = sortedPosts.length
  const pageCount = Math.ceil(totalItems / effectivePageSize)
  
  const safeCurrentPage = Math.min(currentPage, pageCount - 1)
  
  const startIndex = safeCurrentPage * effectivePageSize
  const endIndex = Math.min(startIndex + effectivePageSize, totalItems)
  const currentPosts = sortedPosts.slice(startIndex, endIndex)

  const validPosts = typedPostsData.filter(post => 
    post.id && 
    post.group && 
    post.postDate && 
    typeof post.engagementIndex === 'number'
  )

  React.useEffect(() => {
    const handleWordClick = (event: CustomEvent) => {
      onSearchChange(event.detail.word)
      if (event.detail.shouldExpand && onClose) {
        onClose()
      }
    }

    window.addEventListener('wordClicked', handleWordClick as EventListener)
    return () => {
      window.removeEventListener('wordClicked', handleWordClick as EventListener)
    }
  }, [onSearchChange, onClose])

  React.useEffect(() => {
    if (searchTerm && variant === 'sliding' && !isExpanded) {
      onClose?.()
    }
  }, [searchTerm, variant, isExpanded, onClose])

  React.useEffect(() => {
    if (isHighlightEnabled) {
      setHighlightText(defaultSettings.highlightText)
    } else {
      setHighlightText([])
    }
  }, [isHighlightEnabled])

  const renderInOverlay = () => (
    <PostMonitoringCards
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      sortKey={sortKey}
      onSortChange={onSortChange}
      isExpanded={true}
      variant="sliding"
      onClose={onClose}
      isOverlay={true}
      showOverlay={false}
    />
  )

  return (
    <HighlightContext.Provider value={{ highlightText, setHighlightText }}>
      <PostMonitoringView
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortKey={sortKey || "impactDesc"}
        onSortChange={onSortChange}
        currentPosts={currentPosts.map(post => ({
          ...post,
          comments: post.comment || post.comments || 0,
          shares: post.share || post.shares || 0,
          likes: post.likes || 0
        }))}
        currentPage={safeCurrentPage}
        pageCount={pageCount}
        onPageChange={setCurrentPage}
        variant={variant}
        isExpanded={isExpanded}
        onClose={onClose}
        showOverlay={showOverlay}
        isOverlay={isOverlay}
        renderInOverlay={renderInOverlay}
        pageSize={effectivePageSize}
        onPageSizeChange={handlePageSizeChange}
        isHighlightEnabled={localHighlightEnabled}
        onHighlightChange={onHighlightChange ?? handleHighlightTextChange}
        totalItems={totalItems}
      />
    </HighlightContext.Provider>
  )
}
