'use client'

import { useMemo, useState } from 'react'
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
import { DownloadIcon } from "lucide-react"
import { PostMonitoringCardsComponent } from "../post-monitoring-cards"
import { NerEditDialog } from "../filter/ner-edit-dialog"

// Sample colors for the bars
const colors = ['#00B1A5', '#0070AC', '#593FB6', '#DA418E', '#E66A22']

interface TopNERTimeChartProps {
  data: any[] // Replace with your actual data type
}

export function TopNERTimeChart({ data }: TopNERTimeChartProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  // Add new state for NER labels
  const [nerLabels, setNerLabels] = useState([
    { name: 'Person', included: true },
    { name: 'Organization', included: true },
    { name: 'Location', included: true },
    // Add more NER types as needed
  ])

  // Add handlers for NER label management
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

  const chartData = useMemo(() => {
    const dates = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    // Sample top 5 NER entities with their base engagement levels
    const entityBaseLevels = {
      'CoinUnited': 850,
      'JPEX集团': 650,
      '远翔集团': 500,
      'Arrexpro': 350,
      '世博1120': 120
    }

    return dates.map(date => {
      const dataPoint: any = {
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      }

      // Generate slightly varying values around the base level for each entity
      Object.entries(entityBaseLevels).forEach(([entity, baseLevel]) => {
        // Add small random variation (±10% of base level)
        const variation = (Math.random() - 0.9) * 0.6 * baseLevel
        dataPoint[entity] = Math.round(baseLevel + variation)
      })

      return dataPoint
    })
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top 5 NER Entities - Last 7 Days</CardTitle>
            <CardDescription>
              Daily engagement comparison for top performing entities
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <NerEditDialog
              channelName="NER Labels"
              isDisabled={false}
              pages={nerLabels}
              onTogglePage={handleToggleNerLabel}
              onToggleAllPages={handleToggleAllNerLabels}
            />
            <Button variant="outline" size="sm">NER Type</Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
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
              {['CoinUnited', 'JPEX集团', '远翔集团', 'Arrexpro', '世博1120'].map((entity, index) => (
                <Bar
                  key={entity}
                  dataKey={entity}
                  fill={colors[index]}
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={() => {
                    setSelectedEntity(entity)
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
            <PostMonitoringCardsComponent 
              onClose={handleClose}
              selectedEntity={selectedEntity}
            />
          </div>
        </div>
      )}
    </>
  )
} 