"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Info, Download } from 'lucide-react'
import { PostMonitoringCardsComponent } from "@/components/post-monitoring-cards"
import { Post } from "@/types/post"

// Calculate platform data from posts
const calculatePlatformData = () => {
  const posts = require("./data-post.json").posts;
  
  // Count posts per channel
  const channelCounts = posts.reduce((acc: Record<string, number>, post: any) => {
    const channel = post.channel.toLowerCase();
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});

  // Calculate total posts
  const totalPosts = Object.values(channelCounts).reduce((a: number, b: number) => a + b, 0);

  // Format data with percentages and icons
  return [
    { 
      platform: "Facebook", 
      percentage: Number(((channelCounts.facebook || 0) / totalPosts * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-facebook.png"
    },
    { 
      platform: "Instagram", 
      percentage: Number(((channelCounts.instagram || 0) / totalPosts * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-instagram.png"
    },
    { 
      platform: "X", 
      percentage: Number(((channelCounts.x || 0) / totalPosts * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-X.png"
    },
    { 
      platform: "Online Forum", 
      percentage: Number(((channelCounts.onlineforum || 0) / totalPosts * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-forum.png"
    }
  ];
};

const platformData = calculatePlatformData();

const chartData = [
  { date: "2024-04-01", facebook: 222, instagram: 150, x: 180, forum: 100 },
  { date: "2024-04-02", facebook: 197, instagram: 180, x: 160, forum: 120 },
  { date: "2024-04-03", facebook: 167, instagram: 120, x: 140, forum: 90 },
  { date: "2024-04-04", facebook: 242, instagram: 260, x: 200, forum: 150 },
  { date: "2024-04-05", facebook: 373, instagram: 290, x: 250, forum: 180 },
  { date: "2024-04-06", facebook: 301, instagram: 340, x: 280, forum: 200 },
  { date: "2024-04-07", facebook: 245, instagram: 180, x: 220, forum: 130 },
  { date: "2024-04-08", facebook: 409, instagram: 320, x: 300, forum: 220 },
  { date: "2024-04-09", facebook: 259, instagram: 210, x: 180, forum: 140 },
  { date: "2024-04-10", facebook: 261, instagram: 190, x: 240, forum: 160 },
  { date: "2024-04-11", facebook: 327, instagram: 350, x: 290, forum: 210 },
  { date: "2024-04-12", facebook: 292, instagram: 210, x: 260, forum: 180 },
  { date: "2024-04-13", facebook: 342, instagram: 380, x: 320, forum: 240 },
  { date: "2024-04-14", facebook: 337, instagram: 220, x: 280, forum: 190 },
  { date: "2024-04-15", facebook: 320, instagram: 270, x: 240, forum: 170 },
  { date: "2024-04-16", facebook: 338, instagram: 290, x: 260, forum: 200 },
  { date: "2024-04-17", facebook: 446, instagram: 360, x: 380, forum: 280 },
  { date: "2024-04-18", facebook: 364, instagram: 410, x: 340, forum: 250 },
  { date: "2024-04-19", facebook: 343, instagram: 280, x: 300, forum: 220 },
  { date: "2024-04-20", facebook: 289, instagram: 250, x: 220, forum: 160 },
  { date: "2024-04-21", facebook: 337, instagram: 300, x: 260, forum: 190 },
  { date: "2024-04-22", facebook: 324, instagram: 270, x: 240, forum: 180 },
  { date: "2024-04-23", facebook: 338, instagram: 330, x: 280, forum: 210 },
  { date: "2024-04-24", facebook: 387, instagram: 290, x: 320, forum: 240 },
  { date: "2024-04-25", facebook: 315, instagram: 350, x: 280, forum: 200 },
  { date: "2024-04-26", facebook: 275, instagram: 230, x: 200, forum: 150 },
  { date: "2024-04-27", facebook: 383, instagram: 420, x: 360, forum: 270 },
  { date: "2024-04-28", facebook: 322, instagram: 280, x: 240, forum: 180 },
  { date: "2024-04-29", facebook: 315, instagram: 240, x: 280, forum: 210 },
  { date: "2024-04-30", facebook: 454, instagram: 380, x: 400, forum: 300 },
]

const chartConfig = {
  facebook: {
    label: "Facebook",
    color: "hsl(215, 90%, 50%)",
  },
  instagram: {
    label: "Instagram",
    color: "hsl(340, 80%, 50%)",
  },
  x: {
    label: "X",
    color: "hsl(0, 0%, 0%)",
  },
  forum: {
    label: "Online Forum",
    color: "hsl(30, 90%, 50%)",
  },
}

export function WhereTabComponent() {
  const [timeRange, setTimeRange] = useState("30d")
  const [showTooltip, setShowTooltip] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-04-30")
    let daysToSubtract = 30
    if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  function TableOverlay({ onClose }: { onClose: () => void }) {
    const [isClosing, setIsClosing] = React.useState(false);
    const posts = require("./data-post.json").posts;
    
    // Filter posts based on selected platform
    const filteredPosts = posts.filter((post: Post) => 
      post.channel.toLowerCase() === selectedPlatform?.toLowerCase() ||
      (selectedPlatform === "Online Forum" && post.channel.toLowerCase() === "onlineforum")
    );

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(onClose, 300);
    };

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
            selectedEntity={selectedPlatform}
            posts={filteredPosts} // Pass the filtered posts
          />
        </div>
      </div>
    );
  }

  const handleCardClick = (platform: string) => {
    setSelectedPlatform(platform);
    setShowOverlay(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold mr-2">Where do people discuss?</h2>
        <div className="relative inline-block">
          <Info 
            className="h-4 w-4 text-gray-400" 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-gray-500 bg-white border rounded shadow-lg">
              Percentage accounted mentions per media channel
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {platformData.map((item) => (
          <Card 
            key={item.platform} 
            className="flex-1 min-w-[200px] transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            style={{ background: 'linear-gradient(180deg, #FFF 70%, #F0FAF9 100%)' }}
            onClick={() => handleCardClick(item.platform)}
          >
            <CardHeader className="flex flex-col items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium mb-2">{item.platform}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <img src={item.icon} alt={`${item.platform} icon`} className="h-8 w-8" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{`${item.platform} Count: ${item.percentage}`}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-0">
              <div className="text-4xl font-bold">{`${item.percentage}%`}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Social Media Mentions Over Time</CardTitle>
            <CardDescription>
              Showing mentions across different platforms
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a time range"
              >
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" style={{ backgroundColor: '#F4F4F4' }}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export as PPT</DropdownMenuItem>
                <DropdownMenuItem>Export as JPEG</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  {Object.entries(chartConfig).map(([key, value]) => (
                    <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={value.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={value.color} stopOpacity={0.1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                />
                <YAxis />
                <RechartsTooltip content={<CustomTooltip />} />
                {Object.keys(chartConfig).map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={chartConfig[key].color}
                    fill={`url(#fill${key})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {showOverlay && <TableOverlay onClose={() => setShowOverlay(false)} />}
    </div>
  )
}