'use client'

import { useState, useCallback } from 'react'
import { Bell, ChevronLeft, ChevronRight, House, User, Folder, LineChart, Menu, MessageSquare, Search, Settings, Plus, Globe, LogOut } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TopicAnalysisComponent } from './topic-analysis'
import { FeaturedTopics } from './featured-topics'
import featuredTopicsData from '@/data/featured-topics.json'
import { TopicCard } from './topic-card'
import QueryContent from './query-content'
import { Topic } from '@/types/topic'
import { ManagerMentionsCard } from './manager-mentions'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'

type MenuItem = {
  icon: React.ElementType;
  name: string;
  id: string;
};

type QueryResult = {
  id: number;
  title: string;
  snippet: string;
  platform: string;
  date: string;
  sentiment: string;
};

export function DashboardComponent() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("featured-topics")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateNewTopic, setShowCreateNewTopic] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [querySearchTerm, setQuerySearchTerm] = useState("")
  const [queryResults, setQueryResults] = useState<QueryResult[]>([])
  const [filterPanel, setFilterPanel] = useState({
    date: 'all',
    platform: 'all',
    sentiment: 'all',
  })

  const [selectedTopicForAnalysis, setSelectedTopicForAnalysis] = useState<Topic | null>(null)

  const [pinnedTopics, setPinnedTopics] = useState<Set<string>>(new Set())

  const [topicToEdit, setTopicToEdit] = useState<Topic | null>(null)

  const menuItems: MenuItem[] = [
    { icon: MessageSquare, name: 'Featured Topics', id: 'featured-topics' },
    { icon: Search, name: 'Query', id: 'query' },
    { icon: Bell, name: 'Alerts', id: 'alerts' },
  ]

  const [featuredTopics, setFeaturedTopics] = useState<Topic[]>(() => 
    featuredTopicsData.featuredTopics
      .filter(topic => 
        !['jpex monitoring'].includes(topic.name.toLowerCase())
      )
      .map(topic => ({
        ...topic,
        name: topic.name === 'Cryptocurrency1' ? '虛擬資產 VATP' :
              topic.name === 'Artificial Intelligence' ? '唱高散貨 Suspicious Ramp and Dump' :
              topic.name,
        riskLevel: 'low',
        emoji: undefined,
        imageUrl: undefined,
        period: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      }))
  );

  const [ownTopics, setOwnTopics] = useState<Topic[]>([])

  const filterTopics = useCallback((topics: Topic[]) => {
    return topics
      .filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (pinnedTopics.has(a.id) && !pinnedTopics.has(b.id)) return -1
        if (!pinnedTopics.has(a.id) && pinnedTopics.has(b.id)) return 1
        return 0
      })
  }, [searchTerm, pinnedTopics])

  const isTopicNameUnique = (name: string) => {
    const allTopics = [...featuredTopics, ...ownTopics];
    return !allTopics.some(topic => topic.name.toLowerCase() === name.toLowerCase());
  };

  const handleDuplicate = (topic: Topic) => {
    let newName = `${topic.name} (Copy)`;
    let counter = 1;

    while (!isTopicNameUnique(newName)) {
      counter++;
      newName = `${topic.name} (Copy ${counter})`;
    }

    const newTopic: Topic = {
      ...topic,
      id: String(Date.now()),
      name: newName,
    };
    
    setOwnTopics(prev => [...prev, newTopic]);
    toast({
      title: "Topic Duplicated",
      description: `"${topic.name}" has been duplicated to Own Topics as "${newName}".`,
      className: "bg-[#00857C] text-white",
    });
  }

  const handleViewDetailedAnalysis = (topic: Topic) => {
    setSelectedTopicForAnalysis(topic)
    setActiveTab('analysis')
  }

  const handleAddForComparison = (topic: Topic) => {
    toast({
      title: "Added to Comparison",
      description: `"${topic.name}" has been added to comparison view.`,
      className: "bg-[#00857C] text-white",
    })
  }

  const handleEditDelete = (topic: Topic) => {
    toast({
      title: "Edit/Delete",
      description: `Editing/Deleting ${topic.name}.`
    })
  }

  const handleSaveNewTopic = (newTopic: Topic) => {
    setOwnTopics(prevTopics => [...prevTopics, newTopic])
    setShowCreateNewTopic(false)
    setActiveTab('own-topics')
    toast({
      title: "New Topic Created",
      description: `${newTopic.name} has been added to your Own Topics.`,
    })
  }

  const handleQuerySearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual search logic here
    console.log("Searching for:", querySearchTerm)
    // For demonstration, let's set some dummy results
    setQueryResults([
      { id: 1, title: "Result 1", snippet: "This is a snippet for result 1", platform: "Twitter", date: "2023-06-15", sentiment: "positive" },
      { id: 2, title: "Result 2", snippet: "This is a snippet for result 2", platform: "Facebook", date: "2023-06-14", sentiment: "negative" },
      { id: 3, title: "Result 3", snippet: "This is a snippet for result 3", platform: "Instagram", date: "2023-06-13", sentiment: "neutral" },
    ])
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilterPanel(prev => ({ ...prev, [key]: value }))
  }

  const handlePinTopic = (topicId: string) => {
    setPinnedTopics(prev => {
      const newPinned = new Set(prev)
      if (newPinned.has(topicId)) {
        newPinned.delete(topicId)
      } else {
        newPinned.add(topicId)
      }
      return newPinned
    })
  }

  const handleEditTopic = (topic: Topic) => {
    setTopicToEdit(topic)
    setShowCreateNewTopic(true)
  }

  const handleDeleteTopic = (topicId: string) => {
    setOwnTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId))
    toast({
      title: "Topic Deleted",
      description: "The topic has been deleted successfully.",
      className: "bg-[#00857C] text-white",
    })
  }

  const renderQueryTab = () => {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
        <h2 className="text-3xl font-bold text-[#008d84]">Query</h2>
        <p className="text-md text-muted-foreground mb-6">
          Search and analyze social media posts across multiple platforms. Use advanced search operators (AND, OR, NOT) to refine your results.
        </p>
        <QueryContent />
        </div>
      </div>
    )
  }

  const renderMainContent = () => {
    if (selectedTopicForAnalysis) {
      return (
        <TopicAnalysisComponent 
          topic={selectedTopicForAnalysis}
          onBack={() => {
            setSelectedTopicForAnalysis(null)
            setActiveTab('featured-topics')
          }}
        />
      )
    }

    if (showCreateNewTopic) {
      return (
        <CreateNewTopicContent
          onBack={() => {
            setShowCreateNewTopic(false)
            setTopicToEdit(null)
          }}
          existingTopics={[...featuredTopics, ...ownTopics]
            .filter(t => t.id !== topicToEdit?.id)
            .map(t => t.name)}
          onSave={(updatedTopic) => {
            if (topicToEdit) {
              // Update existing topic
              setOwnTopics(prevTopics =>
                prevTopics.map(t => t.id === topicToEdit.id ? updatedTopic : t)
              )
            } else {
              // Create new topic
              setOwnTopics(prevTopics => [...prevTopics, updatedTopic])
            }
            setShowCreateNewTopic(false)
            setTopicToEdit(null)
            setActiveTab('own-topics')
          }}
          editingTopic={topicToEdit as Topic | undefined}
          onDelete={(topicId) => {
            handleDeleteTopic(topicId)
            setShowCreateNewTopic(false)
            setTopicToEdit(null)
            setActiveTab('own-topics')
          }}
        />
      )
    }

    const contentClass = "space-y-6 p-6 overflow-y-auto";

    switch (activeTab) {
      case 'featured-topics':
        return (
          <div className={contentClass}>
            <FeaturedTopics
              topics={filterTopics(featuredTopics)}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              openTopic={openTopic}
              pinnedTopics={pinnedTopics}
              onOpenChange={setOpenTopic}
              onDuplicate={handleDuplicate}
              onViewDetailedAnalysis={handleViewDetailedAnalysis}
              onAddForComparison={handleAddForComparison}
              onPinTopic={handlePinTopic}
              onEmojiChange={(topic, emoji) => {
                const updatedTopic: Topic = {
                  ...topic,
                  emoji,
                  imageUrl: undefined
                };
                setFeaturedTopics(prev => 
                  prev.map(t => t.id === topic.id ? updatedTopic : t)
                );
              }}
              onImageChange={(topic, imageUrl) => {
                const updatedTopic: Topic = {
                  ...topic,
                  imageUrl,
                  emoji: undefined
                };
                setFeaturedTopics(prev => 
                  prev.map(t => t.id === topic.id ? updatedTopic : t)
                );
              }}
            />
            <ManagerMentionsCard />
          </div>
        )
      case 'own-topics':
        return (
          <div className={contentClass}>
            <div className="space-y-6 px-20 pt-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-[#00857C]">Own Topics</h2>
                <p className="text-muted-foreground text-md">
                Manage your own topics here. You can create new topics or view topics you've duplicated from Featured Topics.
                </p>
              </div>
              <div className="flex gap-4 bg-white">
                <div className="relative flex items-center w-full">
                  <Search className="absolute left-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs bg-white shadow-none rounded-none pl-10"
                  />
                </div>
              </div>
              {ownTopics.length > 0 ? (
                <div className="grid gap-6">
                  {filterTopics(ownTopics).map((topic) => (
                    <Collapsible
                      key={topic.id}
                      open={openTopic === topic.id}
                      onOpenChange={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
                    >
                      <TopicCard
                        topic={topic}
                        isPinned={pinnedTopics.has(topic.id)}
                        isFeatured={false}
                        onDuplicate={handleDuplicate}
                        onViewDetailedAnalysis={handleViewDetailedAnalysis}
                        onAddForComparison={handleAddForComparison}
                        onPinTopic={handlePinTopic}
                        onEdit={handleEditTopic}
                        onDelete={handleDeleteTopic}
                        onEmojiChange={(topic, emoji) => {
                          const updatedTopic: Topic = {
                            ...topic,
                            emoji,
                            imageUrl: undefined
                          };
                          setOwnTopics(prev => 
                            prev.map(t => t.id === topic.id ? updatedTopic : t)
                          );
                        }}
                        onImageChange={(topic, imageUrl) => {
                          const updatedTopic: Topic = {
                            ...topic,
                            imageUrl,
                            emoji: undefined
                          };
                          setOwnTopics(prev => 
                            prev.map(t => t.id === topic.id ? updatedTopic : t)
                          );
                        }}
                      />
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                      <div className="mb-4">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/11213/11213575.png" 
                          alt="No Topics Icon" 
                          className="h-12 w-12 mx-auto" // Adjust size as needed
                        />
                      </div>
                  <p>No topics created yet. Create your first topic to get started.</p>
                  <Button 
                    className="mt-4 bg-[#00857C] text-white hover:bg-[#00857C]/90"
                    onClick={() => {
                      setShowCreateNewTopic(true)
                      setActiveTab('create-new-topic')
                    }}
                  >
                    Create New Topic
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )
      case 'query':
        return renderQueryTab()
      case 'comparison':
        return (
          <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Comparison</h1>
            <p>Compare different topics and their social media metrics here.</p>
          </div>
        )
      case 'alerts':
        return (
          <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Alerts</h1>
            <p>Set up and manage your social media monitoring alerts.</p>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 ont-bold text-[#00857C]">Featured Topics</h2>
            <div className="grid gap-6">
              {featuredTopics.map((topic) => (
                <Collapsible
                  key={topic.id}
                  open={openTopic === topic.id}
                  onOpenChange={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
                >
                  <TopicCard
                    topic={topic}
                    isPinned={pinnedTopics.has(topic.id)}
                    isFeatured={true}
                    onDuplicate={handleDuplicate}
                    onViewDetailedAnalysis={handleViewDetailedAnalysis}
                    onAddForComparison={handleAddForComparison}
                    onPinTopic={handlePinTopic}
                    onEmojiChange={(topic, emoji) => {
                      const updatedTopic: Topic = {
                        ...topic,
                        emoji,
                        imageUrl: undefined
                      };
                      setFeaturedTopics(prev => 
                        prev.map(t => t.id === topic.id ? updatedTopic : t)
                      );
                    }}
                    onImageChange={(topic, imageUrl) => {
                      const updatedTopic: Topic = {
                        ...topic,
                        imageUrl,
                        emoji: undefined
                      };
                      setFeaturedTopics(prev => 
                        prev.map(t => t.id === topic.id ? updatedTopic : t)
                      );
                    }}
                  />
                </Collapsible>
              ))}
            </div>
          </div>
        )
    }
  }

  const handleMenuItemClick = (menuId: string) => {
    // Clear the analysis state when navigating away
    setSelectedTopicForAnalysis(null)
    
    if (showCreateNewTopic) {
      if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
        setShowCreateNewTopic(false)
        setTopicToEdit(null)
        setActiveTab(menuId)
      }
    } else {
      setActiveTab(menuId)
    }
  }

  if (hasError) {
    return <div>Something went wrong. Please try refreshing the page.</div>
  }

  return (
    <div className="grid h-screen w-full lg:grid-cols-[auto_1fr]">
      <DashboardSidebar 
        activeTab={activeTab}
        showCreateNewTopic={showCreateNewTopic}
        onMenuItemClick={handleMenuItemClick}
      />
      <div className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-[#FDFDFD]">
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}