'use client'

import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Plus, Settings, DownloadIcon, Settings2 } from 'lucide-react'
import dataPost from './data-post.json'
import { PostMonitoringCardsComponent } from "./post-monitoring-cards"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BaseTreeMap, TreeMapItem } from './chart/base-treemap'
import { ManageItemsDialog } from "@/components/ui/manage-items-dialog"
import { ChartDownloadButton } from './chart/chart-download-button'
import { BarChartTemplate } from './chart/bar-chart-template'
import { DataTable, SortableHeader } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"

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

const dummyEntitiesData = [
  { entity: "股市達人阿強", color: "#00857C" },
  { entity: "CoinUnited", color: "#00B1A5" },
  { entity: "JPEX家庭", color: "#0070AC" },
  { entity: "比特幣", color: "#593FB6" },
  { entity: "區塊鏈", color: "#DA418E" },
  { entity: "加密貨幣", color: "#E66A22" },
  { entity: "NFT", color: "#FFA600" },
  { entity: "Web3", color: "#3CAEA3" },
  { entity: "元宇宙", color: "#20639B" },
  { entity: "DeFi", color: "#ED553B" }
];

export function TableOverlay({ 
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
        <PostMonitoringCardsComponent 
          onClose={handleClose} 
          selectedEntity={selectedEntity}
        />
      </div>
    </div>
  )
}

export function InspectTabComponent() {
  const [currentURLPage, setCurrentURLPage] = useState(1)
  const [currentEntityPage, setCurrentEntityPage] = useState(1)
  const itemsPerPage = 10
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Post | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("30d")

  // Define the data array within the component
  const data = dataPost.posts

  const totalEntities = data.length
  const totalURLs = 725
  const totalGroups = 321

  const topURLs = useMemo(() => {
    return [...data]
      .sort((a, b) => b.engagementIndex - a.engagementIndex)
  }, [])

  const topEntities = useMemo(() => {
    const entityData = data.flatMap(post => 
      post.ner.map(entity => ({
        entity,
        engagementIndex: post.engagementIndex,
        channel: post.channel
      }))
    ).reduce((acc, { entity, engagementIndex, channel }) => {
      if (!acc[entity]) {
        acc[entity] = { entity, count: 0, engagementIndex: 0, channels: new Set() };
      }
      acc[entity].count++;
      acc[entity].engagementIndex += engagementIndex;
      acc[entity].channels.add(channel);
      return acc;
    }, {} as Record<string, { entity: string, count: number, engagementIndex: number, channels: Set<string> }>);

    return Object.values(entityData)
      .sort((a, b) => b.count - a.count)
      .map(({ entity, count, engagementIndex, channels }) => ({
        entity,
        count,
        engagementIndex: Math.round(engagementIndex),
        channel: Array.from(channels).join(', '),
        randomMentions: Math.floor(Math.random() * (100 - 30 + 1) + 30) // Random number between 30-100
      }));
  }, [])

  const paginatedURLs = topURLs.slice(
    (currentURLPage - 1) * itemsPerPage,
    currentURLPage * itemsPerPage
  )

  const paginatedEntities = topEntities.slice(
    (currentEntityPage - 1) * itemsPerPage,
    currentEntityPage * itemsPerPage
  )

  useEffect(() => {
    const styleTag = document.createElement('style')
    styleTag.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `
    document.head.appendChild(styleTag)
    return () => styleTag.remove()
  }, [])

  const top10Entities = useMemo(() => {
    return topEntities.slice(0, 10).map(entity => entity.entity)
  }, [topEntities])


  // Updated dummy chart data generation with more variations
  const dummyChartData = useMemo(() => {
    const dates = Array.from({ length: 90 }).map((_, i) => {
      const date = new Date('2023-12-31')
      date.setDate(date.getDate() - (89 - i))
      return date.toISOString().split('T')[0]
    })

    const filteredDates = dates.filter(date => {
      const dateObj = new Date(date)
      const referenceDate = new Date('2023-12-31')
      const daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return dateObj >= startDate
    })

    return filteredDates.map(date => {
      const dataPoint: any = { date }
      dummyEntitiesData.forEach(({ entity }) => {
        const dateObj = new Date(date)
        const dayOfMonth = dateObj.getDate()
        
        // Base values with more variation
        const baseValue = {
          "股市達人阿強": 600 + Math.sin(dayOfMonth / 3) * 150,
          "CoinUnited": 1800 + (dayOfMonth === 17 ? 1000 : 0), // Spike on day 15
          "JPEX家庭": 1500 + (dayOfMonth === 28 ? 1200 : 0), // Spike on day 7
          "比特幣": 1000 + Math.cos(dayOfMonth / 4) * 200,
          "區塊鏈": 750 + (dayOfMonth % 7 === 0 ? 700 : 0), // Periodic spikes
          "加密貨幣": 700 + (dayOfMonth < 10 ? -800 : 0), // Low start
          "NFT": 650 + (dayOfMonth > 25 ? -500 : 0), // Low end
          "Web3": 260 + Math.sin(dayOfMonth / 2) * 250,
          "元宇宙": 350 + (dayOfMonth % 5 === 0 ? 200 : -100), // Alternating pattern
          "DeFi": 150 + Math.random() * 200, // High volatility
        }[entity] || 0;

        // Add random fluctuation with more variation
        const fluctuation = Math.sin(dateObj.getTime() / 8.64e7) * 200
        const random = Math.random() * 200 // Increased randomness
        dataPoint[entity] = Math.max(0, Math.round(baseValue + fluctuation + random))
      })
      return dataPoint
    })
  }, [timeRange])

  // Create chart config for dummy entities
  const dummyChartConfig = useMemo(() => {
    return Object.fromEntries(
      dummyEntitiesData.map(({ entity, color }) => [
        entity,
        {
          label: entity,
          color: color,
        }
      ])
    ) satisfies ChartConfig
  }, [])

  const last7DaysBarData = useMemo(() => {
    const entities = topEntities.slice(0, 10)
    return entities.map(entity => {
      const colorMatch = dummyEntitiesData.find(e => e.entity === entity.entity)
      return {
        name: entity.entity,
        value: entity.count,
        // Use the matched color or a default color if no match is found
        color: colorMatch?.color || "#00857C"
      }
    })
  }, [topEntities])

  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => 
    new Set(topEntities.slice(0, 50).map(entity => entity.entity))
  )

  type EntityTableItem = {
    entity: string
    count: number
    randomMentions: number
    engagementIndex: number
    avgEngagement: number
    channel: string
  }

  const columns: ColumnDef<EntityTableItem>[] = [
    {
      accessorKey: "entity",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          onClick={() => handleSort(column, sorting, setSorting)}
        >
          Entity
        </SortableHeader>
      ),
      size: 200,
    },
    {
      accessorKey: "count",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          onClick={() => handleSort(column, sorting, setSorting)}
        >
          Mentions
        </SortableHeader>
      ),
      size: 100,
    },
    {
      accessorKey: "randomMentions",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          onClick={() => handleSort(column, sorting, setSorting)}
        >
          Random Mentions
        </SortableHeader>
      ),
      size: 140,
    },
    {
      accessorKey: "engagementIndex",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          onClick={() => handleSort(column, sorting, setSorting)}
        >
          Engagement Index
        </SortableHeader>
      ),
      size: 140,
    },
    {
      accessorKey: "avgEngagement",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          onClick={() => handleSort(column, sorting, setSorting)}
        >
          Avg. Engagement
        </SortableHeader>
      ),
      size: 140,
    },
    {
      accessorKey: "channel",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          onClick={() => handleSort(column, sorting, setSorting)}
        >
          Channels
        </SortableHeader>
      ),
      size: 200,
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Entity Distribution Treemap</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setManageDialogOpen(true)}
              className="hover:border-[#00857C] hover:text-[#00857C]"
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Button>

            <ChartDownloadButton
              data={topEntities.filter(entity => selectedItems.has(entity.entity))}
              filename="treemap_data"
              variant="dropdown"
            />

            <ManageItemsDialog
              open={manageDialogOpen}
              onOpenChange={setManageDialogOpen}
              title="Manage Entities"
              description="Select entities to display in the treemap"
              items={topEntities.map(entity => ({
                id: entity.entity,
                name: entity.entity,
                metadata: {
                  mentions: entity.randomMentions,
                  channel: entity.channel,
                  engagement: Math.round(entity.engagementIndex / entity.count)
                },
                count: entity.count
              }))}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              maxItems={50}
              metadataLabels={{
                mentions: "Mentions",
                channel: "Channel",
                engagement: "Avg. Engagement"
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <BaseTreeMap 
            data={topEntities
              .filter(entity => selectedItems.has(entity.entity))
              .map(entity => ({
                x: entity.entity,
                y: entity.count,
                raw: {
                  x: entity.entity,
                  y: entity.count,
                  channel: entity.channel,
                  mentions: entity.randomMentions
                }
              }))}
            height={400}
            fontSize="14px"
            limit={50}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top 5 Entity Mentions</CardTitle>
            <CardDescription>
              Daily mention frequency for top performing entities
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <ChartDownloadButton
              data={useMemo(() => {
                const dates = [
                  "11/24",
                  "11/25",
                  "11/26",
                  "11/27",
                  "11/28",
                  "11/29",
                  "11/30"
                ]

                const entityBaseLevels = {
                  'CoinUnited': 850,
                  'JPEX集团': 650,
                  '远翔集团': 500,
                  'Arrexpro': 350,
                  '世博1120': 120
                }

                return dates.map(date => ({
                  date,
                  ...Object.fromEntries(
                    Object.entries(entityBaseLevels).map(([entity, baseLevel]) => [
                      entity,
                      Math.round(baseLevel + (Math.random() - 0.9) * 0.6 * baseLevel)
                    ])
                  )
                }))
              }, [])}
              filename="top_5_entity_mentions"
              variant="dropdown"
            />
          </div>
        </CardHeader>
        <CardContent>
          <BarChartTemplate
            data={useMemo(() => {
              const dates = [
                "11/24",
                "11/25",
                "11/26",
                "11/27",
                "11/28",
                "11/29",
                "11/30"
              ]

              const entityBaseLevels = {
                'CoinUnited': 850,
                'JPEX集团': 650,
                '远翔集团': 500,
                'Arrexpro': 350,
                '世博1120': 120
              }

              return dates.map(date => ({
                date,
                ...Object.fromEntries(
                  Object.entries(entityBaseLevels).map(([entity, baseLevel]) => [
                    entity,
                    Math.round(baseLevel + (Math.random() - 0.9) * 0.6 * baseLevel)
                  ])
                )
              }))
            }, [])}
            type="grouped"
            layout="horizontal"
            categoryKey="date"
            dataKey={['CoinUnited', 'JPEX集团', '远翔集团', 'Arrexpro', '世博1120']}
            height={400}
            colors={['#00B1A5', '#0070AC', '#593FB6', '#DA418E', '#E66A22']}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Entities by mentions</CardTitle>
          <ChartDownloadButton
            data={topEntities.map(entity => ({
              entity: entity.entity,
              count: entity.count,
              randomMentions: entity.randomMentions,
              engagementIndex: entity.engagementIndex,
              avgEngagement: Math.round(entity.engagementIndex / entity.count),
              channel: entity.channel
            }))}
            filename="entities_by_mentions"
            variant="csv"
          />
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={topEntities.map(entity => ({
              entity: entity.entity,
              count: entity.count,
              randomMentions: entity.randomMentions,
              engagementIndex: entity.engagementIndex,
              avgEngagement: Math.round(entity.engagementIndex / entity.count),
              channel: entity.channel
            }))}
            sorting={sorting}
            setSorting={setSorting}
          />
        </CardContent>
      </Card>

      

      {showOverlay && (
        <TableOverlay 
          onClose={() => {
            setShowOverlay(false)
            setSelectedRow(null)
            setSelectedEntity(null)
          }}
          selectedRow={selectedRow}
          selectedEntity={selectedEntity}
        />
      )}
    </div>
  )
}