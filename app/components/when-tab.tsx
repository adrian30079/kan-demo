"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { TableOverlayNoLimit } from './table-overlay'
import { ChartDownloadButton } from "@/components/chart/chart-download-button"

const mentionsData = [
  { date: "24/Nov/2024", mentions: 1422 },
  { date: "25/Nov/2024", mentions: 2512 },
  { date: "26/Nov/2024", mentions: 924 },
  { date: "27/Nov/2024", mentions: 1514 },
  { date: "28/Nov/2024", mentions: 1127 },
  { date: "29/Nov/2024", mentions: 2025 },
  { date: "30/Nov/2024", mentions: 1020 },
]

const relativeVolumeData = [
  { day: "Day 1", week1: 1, week2: 6, week3: 7, week4: 32, week5: 2 },
  { day: "Day 2", week1: 0, week2: 7, week3: 25, week4: 9, week5: 6 },
  { day: "Day 3", week1: 0, week2: 2, week3: 16, week4: 8, week5: 1 },
  { day: "Day 4", week1: 0, week2: 4, week3: 9, week4: 17, week5: 0 },
  { day: "Day 5", week1: 2, week2: 15, week3: 7, week4: 14, week5: 0 },
  { day: "Day 6", week1: 13, week2: 5, week3: 8, week4: 9, week5: 0 },
  { day: "Day 7", week1: 2, week2: 7, week3: 23, week4: 6, week5: 1 },
]

export function WhenTab() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="w-full shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Peak Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17-Nov-2024</div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Peak Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Monday</div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Peak Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">00:00 - 01:00</div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full shadow-none rounded-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Overall Share of Voice</CardTitle>
          <ChartDownloadButton 
            data={mentionsData}
            filename="share_of_voice"
            variant="dropdown"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <ChartContainer
              config={{
                mentions: {
                  label: "Mentions",
                  color: "#00857C",
                },
              }}
              className="w-full h-[300px] sm:h-[400px] min-w-[600px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mentionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mentions"
                    stroke="#00857C"
                    fill="#00857C"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {showOverlay && (
        <TableOverlayNoLimit 
          onClose={() => {
            setShowOverlay(false)
            setSelectedDate(null)
          }}
          selectedEntity={selectedDate}
        />
      )}
    </div>
  )
}