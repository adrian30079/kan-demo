"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Download, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const mentionsData = [
  { date: "01/Nov/2024", mentions: 12 },
  { date: "03/Nov/2024", mentions: 2 },
  { date: "05/Nov/2024", mentions: 6 },
  { date: "07/Nov/2024", mentions: 14 },
  { date: "09/Nov/2024", mentions: 7 },
  { date: "11/Nov/2024", mentions: 25 },
  { date: "13/Nov/2024", mentions: 10 },
  { date: "15/Nov/2024", mentions: 7 },
  { date: "17/Nov/2024", mentions: 33 },
  { date: "19/Nov/2024", mentions: 8 },
  { date: "21/Nov/2024", mentions: 15 },
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
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg text-muted-foreground mb-6">When are the topics discussed?</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="bg-gradient-to-b from-white via-white to-[#F4FCFC]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Peak Date
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-2 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black border shadow-md transition-all duration-150 ease-in-out">
                      <p>Day within the selected period with most mentions.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">17-Nov-2024</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-white via-white to-[#F4FCFC]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Peak Day of Week
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-2 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black border shadow-md transition-all duration-150 ease-in-out">
                      <p>The day within the week with most mentions.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Monday</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-white via-white to-[#F4FCFC]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Peak Hour
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-2 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black border shadow-md transition-all duration-150 ease-in-out">
                      <p>The hour within the day with most mentions.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">00:00 - 01:00</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Overall Volume of Mentions
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border shadow-md transition-all duration-150 ease-in-out">
                  <p>Number of mentions in the topic.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <ChartContainer
              config={{
                mentions: {
                  label: "Mentions",
                  color: "hsl(24.6, 95%, 53.1%)", // Orange color matching the screenshot
                },
              }}
              className="w-full h-[300px] sm:h-[400px] min-w-[600px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mentionsData}>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip />
                  <Area
                    type="monotone"
                    dataKey="mentions"
                    stroke="hsl(24.6, 95%, 53.1%)"
                    fill="hsl(24.6, 95%, 53.1%)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Relative Volume of Mentions
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border shadow-md transition-all duration-150 ease-in-out">
                  <p>Comparison of mention volumes across different periods</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Select period</span>
            <Select defaultValue="week">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">By Week</SelectItem>
                <SelectItem value="month">By Month</SelectItem>
                <SelectItem value="year">By Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <ChartContainer
              config={{
                week1: {
                  label: "27/Oct/2024 - 02/Nov/2024",
                  color: "hsl(var(--primary))",
                },
                week2: {
                  label: "03/Nov/2024 - 09/Nov/2024",
                  color: "hsl(142.1, 76.2%, 36.3%)",
                },
                week3: {
                  label: "10/Nov/2024 - 16/Nov/2024",
                  color: "hsl(47.9, 95.8%, 53.1%)",
                },
                week4: {
                  label: "17/Nov/2024 - 23/Nov/2024",
                  color: "hsl(346.8, 77.2%, 49.8%)",
                },
                week5: {
                  label: "24/Nov/2024 - 30/Nov/2024",
                  color: "hsl(199, 89%, 48%)",
                },
              }}
              className="w-full h-[300px] sm:h-[400px] min-w-[600px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={relativeVolumeData}>
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="week1" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="week2" stroke="hsl(142.1, 76.2%, 36.3%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="week3" stroke="hsl(47.9, 95.8%, 53.1%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="week4" stroke="hsl(346.8, 77.2%, 49.8%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="week5" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}