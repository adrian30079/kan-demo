"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, DownloadIcon } from 'lucide-react'
import { TableOverlayNoLimit } from './table-overlay'
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Line, LineChart } from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
      platform: "LIHKG", 
      percentage: Number(((channelCounts.onlineforum || 0) / totalPosts * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-lihkg.png"
    }
  ];
};

const platformData = calculatePlatformData();

// Add chart data
const chartData = [
  { date: "Mon", Facebook: 8500, Instagram: 4020, X: 2103, "Online Forum": 1004 },
  { date: "Tue", Facebook: 7450, Instagram: 4150, X: 2130, "Online Forum": 1520 },
  { date: "Wed", Facebook: 9020, Instagram: 5200, X: 1480, "Online Forum": 920 },
  { date: "Thu", Facebook: 8540, Instagram: 4540, X: 2020, "Online Forum": 1650 },
  { date: "Fri", Facebook: 9530, Instagram: 5450, X: 1290, "Online Forum": 1870 },
  { date: "Sat", Facebook: 12000, Instagram: 6030, X: 3700, "Online Forum": 1880 },
  { date: "Sun", Facebook: 9240, Instagram: 5230, X: 2580, "Online Forum": 1760 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function WhereTabComponent() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const handleChartClick = (data: any) => {
    setSelectedPlatform(data.activePayload?.[0]?.name || '');
    setShowTable(true);
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
            onClick={() => {
              setSelectedPlatform(item.platform);
              setShowTable(true);
            }}
            style={{ background: 'linear-gradient(180deg, #FFF 70%, #F0FAF9 100%)' }}
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

      <Card className="mt-6">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Overall Volume of Mentions</CardTitle>
            <CardDescription>
              Showing mentions across different platforms
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
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
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onClick={handleChartClick}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  fontSize={12}
                  stroke="#94a3b8"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  fontSize={12}
                  stroke="#94a3b8"
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Facebook" stroke="#0A83C4" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Instagram" stroke="#E3559C" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="X" stroke="#725ACC" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Online Forum" stroke="#00B1A5" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {showTable && (
        <TableOverlayNoLimit
          platform={selectedPlatform}
          onClose={() => setShowTable(false)}
        />
      )}
    </div>
  )
}