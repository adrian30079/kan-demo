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
    { icon: Folder, name: 'Own Topics', id: 'own-topics' },
    // { icon: LineChart, name: 'Comparison', id: 'comparison' },
    // { icon: Search, name: 'Query', id: 'query' },
    { icon: Bell, name: 'Alerts', id: 'alerts' },
  ]

  const [featuredTopics, setFeaturedTopics] = useState<Topic[]>(() => 
    featuredTopicsData.featuredTopics.map(topic => ({
      ...topic,
      riskLevel: 'low',
      emoji: undefined,
      imageUrl: undefined
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
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs bg-white"
                />
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
      <aside className={`${isExpanded ? 'w-56' : 'w-16'} hidden bg-white transition-all duration-300 ease-in-out lg:block min-w-[4rem] h-screen overflow-visible`}>
        <div className="flex h-full flex-col overflow-visible">
          <div className="flex h-14 items-center px-4 pl-4 border-b overflow-visible">

              <div
                className="flex items-center font-semibold justify-start overflow-visible"
                onClick={() => setActiveTab('featured-topics')}
              >
                <div className="relative h-10 w-10 py-2">
                  <img
                    key={1}
                    src="/img/logo-new.png"
                    alt="SFC logo"
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="text-lg text-[#00857C] tracking-tight whitespace-nowrap flex-shrink-0">SENSOR</span>
                <div className="mx-1 border-r ml-3 h-[28px] w-1"/>
                {isExpanded && (
                <span className="pl-2 text-sm text-[#9BB5B1] truncate font-light">Suspicious Fraudulent Activities Detection in Social Media Monitoring</span>
              )}
              </div>
          </div>
          <nav className="flex-1 bg-[#f7fafa] border-r pt-2 flex flex-col justify-between">
            <ul className="space-y-1 p-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={`w-full ${isExpanded ? 'justify-start' : 'justify-center'} ${
                      (activeTab === item.id || (showCreateNewTopic && item.id === 'create-new-topic')) ? 'bg-[#008d84]/10 text-[#008d84] hover:bg-[#008d84]/20' : ''
                    }`}
                    onClick={() => handleMenuItemClick(item.id)}
                  >
                    <item.icon className={`h-5 w-5 ${isExpanded ? 'mr-2' : ''} ${
                      (activeTab === item.id || (showCreateNewTopic && item.id === 'create-new-topic')) ? 'text-[#008d84]' : ''
                    }`} />
                    {isExpanded && <span>{item.name}</span>}
                  </Button>
                </li>
              ))}
            </ul>
            <div className="relative px-3 py-2 text-[10px] text-gray-400 w-full overflow-hidden text-ellipsis">
              {isExpanded && "SENSOR prototype v1.0 data and content are for referencing usage."}
            </div>
          </nav>
          <div className="flex h-14 items-center justify-end border-t px-4 border-r ">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
            >
              {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 items-center justify-end gap-3 border-b px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-auto text-[#00857C]"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          {/* <Button 
            onClick={() => setShowCreateNewTopic(true)} 
            className="bg-[#00857C] text-white hover:bg-[#007a73]"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Topic
          </Button> */}
          <div className="pl-2 text-sm text-gray-700 ml-2 truncate font-light">U0051 IS</div>
          <div className="inline-flex items-center rounded-full bg-gray-400 px-3 py-1 text-xs text-white">Manager 2</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#576968] bg-gray-100 border-gray-200 hover:text-[#00857C]  hover:bg-[#C8DEDB]">
                <User className="h-8 w-8" />
                <span className="sr-only">User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="hover:bg-gray-200">
                <Globe className="mr-2 h-4 w-4" />
                <span>Change Language</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-200">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#FDFDFD]">
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}