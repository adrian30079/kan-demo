'use client'

import { Topic } from '@/types/topic'
import { Input } from "@/components/ui/input"
import { Collapsible } from "@/components/ui/collapsible"
import { TopicCard } from './topic-card'

interface OwnTopicsProps {
  topics: Topic[]
  searchTerm: string
  openTopic: string | null
  setOpenTopic: (id: string | null) => void
  pinnedTopics: Set<string>
  onDuplicate: (topic: Topic) => void
  onViewAnalysis: (topic: Topic) => void
  onAddComparison: (topic: Topic) => void
  onPinTopic: (topicId: string) => void
  onEditDelete: (topic: Topic) => void
  completedActions: Record<string, boolean>
}

export function OwnTopics({
  topics,
  searchTerm,
  openTopic,
  setOpenTopic,
  pinnedTopics,
  onDuplicate,
  onViewAnalysis,
  onAddComparison,
  onPinTopic,
  onEditDelete,
  completedActions,
}: OwnTopicsProps) {
  return (
    <div className="space-y-6 px-20 pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Own Topics</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-6">
        Manage your own topics here. You can create new topics or view topics you've duplicated from Featured Topics.
      </p>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {topics.length > 0 ? (
        <div className="grid gap-6">
          {topics.map((topic) => (
            <Collapsible
              key={topic.id}
              open={openTopic === topic.id}
              onOpenChange={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
            >
              <TopicCard
                topic={topic}
                isFeatured={false}
                isPinned={pinnedTopics.has(topic.id)}
                onDuplicate={onDuplicate}
                onViewDetailedAnalysis={onViewAnalysis}
                onAddForComparison={onAddComparison}
                onPinTopic={onPinTopic}
                onEmojiChange={onEditDelete}
                onImageChange={() => {}}
              />
            </Collapsible>
          ))}
        </div>
      ) : (
        <p>You haven't created any topics yet. Use the "Create New Topic" button in the top bar to get started, or duplicate topics from the Featured Topics tab.</p>
      )}
    </div>
  )
} 