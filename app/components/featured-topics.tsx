'use client'

import { Input } from "@/components/ui/input"
import { Topic } from '@/types/topic'
import { TopicCard } from './topic-card'
import { Collapsible } from "@/components/ui/collapsible"

interface FeaturedTopicsProps {
  topics: Topic[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  openTopic: string | null
  pinnedTopics: Set<string>
  onOpenChange: (topicId: string | null) => void
  onDuplicate: (topic: Topic) => void
  onViewDetailedAnalysis: (topic: Topic) => void
  onAddForComparison: (topic: Topic) => void
  onPinTopic: (topicId: string) => void
  onImageChange: (topic: Topic, imageUrl: string) => void
}

export function FeaturedTopics({
  topics,
  searchTerm,
  setSearchTerm,
  openTopic,
  pinnedTopics,
  onOpenChange,
  onDuplicate,
  onViewDetailedAnalysis,
  onAddForComparison,
  onPinTopic,
  onImageChange
}: FeaturedTopicsProps) {
  return (
    <div className="space-y-4 px-20 pt-8">
      <h1 className="text-3xl font-bold text-[#00857C]">Featured Topics</h1>
      <p className="text-md text-muted-foreground mb-4">
        Featured Topics are curated collections of pre-defined keywords, strategically grouped to capture comprehensive data on specific subjects of interest.
      </p>
      <div className="mb-4 bg-white">
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-4">
        {topics.map((topic) => (
          <Collapsible
            key={topic.id}
            open={openTopic === topic.id}
            onOpenChange={() => onOpenChange(openTopic === topic.id ? null : topic.id)}
          >
            <TopicCard
              topic={topic}
              isPinned={pinnedTopics.has(topic.id)}
              isFeatured={true}
              onDuplicate={onDuplicate}
              onViewDetailedAnalysis={onViewDetailedAnalysis}
              onAddForComparison={onAddForComparison}
              onPinTopic={onPinTopic}
              onImageChange={onImageChange}
            />
          </Collapsible>
        ))}
      </div>
    </div>
  )
}