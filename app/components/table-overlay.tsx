'use client'

import { useState } from 'react'
import { PostMonitoringCardsComponentNoLimit } from "./post-monitoring-cards-nolimit"

type Post = {
  id: string
  group: string
  groupType: string
  URL: string
  channel: string
  summary: string
  fullContent: string
  postDate: string
  engagementIndex: number
  author: string
  mentions: number
  hashtag: string
  ner: string[]
  sentiment: string
  linkExtracted: string
  classifiedContent: string[]
  country: string
  language: string
}

export function TableOverlayNoLimit({ 
  onClose, 
  selectedRow,
  selectedEntity 
}: { 
  onClose: () => void, 
  selectedRow?: Post | null,
  selectedEntity?: string | null
}) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 300)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in m-0"
      onClick={handleClose}
      style={{ 
        animation: `${isClosing ? 'fadeOut' : 'fadeIn'} 250ms ease-in`,
        top: 0,
        margin: 0
      }}
    >
      <div 
        className="fixed right-0 top-0 h-full bg-white overflow-auto"
        style={{ 
          width: '78%',
          minWidth: '830px',
          animation: `${isClosing ? 'slideOut' : 'slideIn'} 300ms cubic-bezier(0.72, 0, 0.13, 1)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <PostMonitoringCardsComponentNoLimit 
          onClose={handleClose} 
          selectedEntity={selectedEntity}
        />
      </div>
    </div>
  )
} 