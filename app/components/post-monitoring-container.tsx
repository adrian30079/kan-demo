"use client"

import * as React from "react"
import { PostMonitoringCards } from "./post-monitoring-cards"

export function PostMonitoringContainer() {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortKey, setSortKey] = React.useState("impactDesc");
  const [pageSize, setPageSize] = React.useState(10);
  const [isHighlightEnabled, setIsHighlightEnabled] = React.useState(false);

  React.useEffect(() => {
    const handleWordClick = (event: CustomEvent) => {
      setSearchTerm(event.detail.word);
      if (event.detail.shouldExpand) {
        setIsExpanded(true);
      }
    };

    window.addEventListener('wordClicked', handleWordClick as EventListener);
    return () => {
      window.removeEventListener('wordClicked', handleWordClick as EventListener);
    };
  }, []);

  const handleAISummary = () => {
    // Implement AI Summary functionality
    console.log("AI Summary requested");
  };

  return (
    <PostMonitoringCards
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      sortKey={sortKey}
      onSortChange={setSortKey}
      isExpanded={isExpanded}
      variant="sliding"
      onClose={() => setIsExpanded(false)}
      showOverlay={false}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      isHighlightEnabled={isHighlightEnabled}
      onHighlightChange={setIsHighlightEnabled}
      onAISummary={handleAISummary}
    />
  );
} 