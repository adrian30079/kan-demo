"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, DownloadIcon } from 'lucide-react'
import { TableOverlayNoLimit } from './table-overlay'
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Legend } from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { OverallVolumeOfMentions } from "@/components/chart/Overall-Volume-of-Mentions"

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

      <OverallVolumeOfMentions />

      {showTable && (
        <TableOverlayNoLimit
          platform={selectedPlatform}
          onClose={() => setShowTable(false)}
        />
      )}
    </div>
  )
}