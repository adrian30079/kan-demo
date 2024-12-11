'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Download, Settings2, Check } from "lucide-react"
import { PostMonitoringCardsComponent3 } from "../post-monitoring-cards-all"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample colors for the bars
const colors = ['#00B1A5', '#0070AC', '#593FB6', '#DA418E', '#E66A22']


export function OverallVolumeOfMentions() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)


  const handleToggleNerLabel = (labelName: string) => {
    setNerLabels(labels => 
      labels.map(label => 
        label.name === labelName ? { ...label, included: !label.included } : label
      )
    )
  }

  const handleToggleAllNerLabels = (included: boolean) => {
    setNerLabels(labels => labels.map(label => ({ ...label, included })))
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowOverlay(false)
      setSelectedEntity(null)
      setIsClosing(false)
    }, 300)
  }

  const chartData = [
    { date: "Mon", Facebook: 8500, Instagram: 4020, X: 2103, "Online Forum": 1004 },
    { date: "Tue", Facebook: 7450, Instagram: 4150, X: 2130, "Online Forum": 1520 },
    { date: "Wed", Facebook: 9020, Instagram: 5200, X: 1480, "Online Forum": 920 },
    { date: "Thu", Facebook: 8540, Instagram: 4540, X: 2020, "Online Forum": 1650 },
    { date: "Fri", Facebook: 9530, Instagram: 5450, X: 1290, "Online Forum": 1870 },
    { date: "Sat", Facebook: 12000, Instagram: 6030, X: 3700, "Online Forum": 1880 },
    { date: "Sun", Facebook: 9240, Instagram: 5230, X: 2580, "Online Forum": 1760 }
  ]

  const [nerTypes, setNerTypes] = useState({
    entities: true,
    nonEntities: true
  })

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Overall Volume of Mentions - Last 7 Days</CardTitle>
            <CardDescription>
              Daily engagement comparison for top performing channels
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hover:border-[#00857C] hover:text-[#00857C]">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Download as PNG</DropdownMenuItem>
              <DropdownMenuItem>Download as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0])
                .filter(key => key !== 'date')
                .map((platform, index) => (
                  <Bar
                    key={platform}
                    dataKey={platform}
                    fill={colors[index]}
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedEntity(platform)
                      setShowOverlay(true)
                    }}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showOverlay && (
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
            <PostMonitoringCardsComponent3 
              onClose={handleClose}
              selectedEntity={selectedEntity}
            />
          </div>
        </div>
      )}
    </>
  )
} 