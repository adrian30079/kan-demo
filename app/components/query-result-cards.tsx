'use client'

import { PostMonitoringCards } from './post-monitoring-cards'
import { cn } from "@/lib/utils"

interface QueryResultCardsProps {
  className?: string
  searchTerm: string
}

export function QueryResultCards({ className, searchTerm }: QueryResultCardsProps) {
  return (
    <div className={cn("query-result-view", className)}>
      <PostMonitoringCards 
        searchTerm={searchTerm}
        onSearchChange={() => {}}
        sortKey="impactDesc"
        onSortChange={() => {}}
        isExpanded={false}
        variant="query"
        customStyles={{
          cardBorder: '#008d84',
          riskLabel: '#f0f9ff'
        }}
        className="query-cards"
      />
      <style jsx global>{`
        /* Hide search controls in query view */
        .query-result-view .header-controls {
          display: none !important;
        }
        
        /* Custom styles for query view */
        .query-result-view .post-card {
          border-color: #008d84;
        }
        
        .query-result-view .risk-label {
          background-color: #f0f9ff;
        }
      `}</style>
    </div>
  )
} 