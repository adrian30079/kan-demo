'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define the entities data with colors
const dummyEntitiesData = [
  { entity: "我要做股神", color: "#FF6B6B" },
  { entity: "CoinUnited", color: "#4ECDC4" },
  { entity: "JPEX家庭", color: "#45B7D1" },
  { entity: "比特幣", color: "#96CEB4" },
  { entity: "區塊鏈", color: "#FFEEAD" },
  { entity: "加密貨幣", color: "#D4A5A5" },
  { entity: "NFT", color: "#9B5DE5" },
  { entity: "Web3", color: "#00BBF9" },
  { entity: "元宇宙", color: "#F15BB5" },
  { entity: "DeFi", color: "#FEE440" },
]

interface TopEntitiesPerformanceChartProps {
  timeRange: string
  onTimeRangeChange: (value: string) => void
}

export function TopEntitiesPerformanceChart({ 
  timeRange, 
  onTimeRangeChange 
}: TopEntitiesPerformanceChartProps) {
  // Generate dummy chart data
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
        
        const baseValue = {
          "股市達人阿強": 600 + Math.sin(dayOfMonth / 3) * 150,
          "CoinUnited": 1800 + (dayOfMonth === 17 ? 1000 : 0),
          "JPEX家庭": 1500 + (dayOfMonth === 28 ? 1200 : 0),
          "比特���": 1000 + Math.cos(dayOfMonth / 4) * 200,
          "區塊鏈": 750 + (dayOfMonth % 7 === 0 ? 700 : 0),
          "加密貨幣": 700 + (dayOfMonth < 10 ? -800 : 0),
          "NFT": 650 + (dayOfMonth > 25 ? -500 : 0),
          "Web3": 260 + Math.sin(dayOfMonth / 2) * 250,
          "元宇宙": 350 + (dayOfMonth % 5 === 0 ? 200 : -100),
          "DeFi": 150 + Math.random() * 200,
        }[entity] || 0

        const fluctuation = Math.sin(dateObj.getTime() / 8.64e7) * 200
        const random = Math.random() * 200
        dataPoint[entity] = Math.max(0, Math.round(baseValue + fluctuation + random))
      })
      return dataPoint
    })
  }, [timeRange])

  // Create chart config
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

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Top 10 Entities Performance</CardTitle>
          <CardDescription>
            Showing engagement trends for top entities
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
        </Button>
        <Select>
          <SelectTrigger className="w-[100px] rounded-lg">
            <SelectValue placeholder="Top 10" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="10">Top 10</SelectItem>
            <SelectItem value="25">Top 25</SelectItem>
            <SelectItem value="50">Top 50</SelectItem>
            <SelectItem value="100">Top 100</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={dummyChartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={dummyChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="line"
                />
              }
            />
            {dummyEntitiesData.map(({ entity, color }) => (
              <Area
                key={entity}
                dataKey={entity}
                type="monotone"
                stroke={color}
                fill={`url(#fill-${entity})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
            <defs>
              {dummyEntitiesData.map(({ entity, color }) => (
                <linearGradient
                  key={entity}
                  id={`fill-${entity}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={color}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={color}
                    stopOpacity={0.01}
                  />
                </linearGradient>
              ))}
            </defs>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 