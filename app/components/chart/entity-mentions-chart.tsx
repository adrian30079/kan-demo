'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useState } from 'react'
import { PostMonitoringCardsComponent } from "../post-monitoring-cards"

type EntityMentionsProps = {
  data: Array<{
    entity: string
    count: number
    engagementIndex: number
    channel: string
    randomMentions: number
  }>
  timeRange: string
  onTimeRangeChange: (value: string) => void
}

const dummyEntitiesData = [
  { entity: "世博1120", color: "#0A83C4" },
  { entity: "CoinUnited", color: "#00B1A5" },
  { entity: "JPEX家庭", color: "#725ACC" },
  { entity: "比特幣", color: "#E3559C" },
  { entity: "區塊鏈", color: "#EB7937" },
  { entity: "加密貨幣", color: "#E94343" },
  { entity: "NFT", color: "#68AC3A" },
  { entity: "Web3", color: "#00BBF9" },
  { entity: "元宇宙", color: "#F15BB5" },
  { entity: "DeFi", color: "#FEE440" },
]

export function EntityMentionsChart({ data, timeRange, onTimeRangeChange }: EntityMentionsProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  const chartData = data.slice(0, 10).map((entity, index) => {
    const colorMatch = dummyEntitiesData.find(e => e.entity === entity.entity)
    return {
      name: entity.entity,
      value: entity.count,
      color: colorMatch?.color || dummyEntitiesData[index % dummyEntitiesData.length].color,
      hoverColor: `${colorMatch?.color || dummyEntitiesData[index % dummyEntitiesData.length].color}dd`
    }
  })

  const handleBarClick = (entry: any) => {
    setSelectedEntity(entry.name)
    setShowOverlay(true)
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Newly Identified NER - Last 7 Days</CardTitle>
          <CardDescription>
            Showing total mentions for top identified entities over the 7 days
          </CardDescription>
        </div>
        <Select>
          <SelectTrigger className="w-[150px] rounded-lg">
            <SelectValue placeholder="NER Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Entities">Entities</SelectItem>
            <SelectItem value="Non-entities">Non-entities</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Download as PNG</DropdownMenuItem>
              <DropdownMenuItem>Download as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350} style={{ paddingTop: '10px' }}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 4, 4]}
              label={{ position: 'right', fill: '#213938' }}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
              onMouseOver={(e) => {
                document.body.style.cursor = 'pointer'
                setHoveredBar(e.name)
              }}
              onMouseOut={(e) => {
                document.body.style.cursor = 'default'
                setHoveredBar(null)
              }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={hoveredBar === entry.name ? entry.hoverColor : entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mb-4 mt-4 flex flex-wrap gap-4">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>

      {showOverlay && (
        <TableOverlay 
          onClose={() => {
            setShowOverlay(false)
            setSelectedEntity(null)
          }}
          selectedEntity={selectedEntity}
        />
      )}
    </Card>
  )
}

function TableOverlay({ 
  onClose, 
  selectedEntity 
}: { 
  onClose: () => void
  selectedEntity: string | null 
}) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 300)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in m-0"
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