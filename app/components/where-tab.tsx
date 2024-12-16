"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DownloadIcon } from 'lucide-react'
import { TableOverlayNoLimit } from './table-overlay'
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Legend } from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BarChartTemplate } from '@/components/chart/bar-chart-template'

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
  const totalPosts = Object.values(channelCounts).reduce<number>((previousValue: number, currentValue: number) => previousValue + currentValue, 0);

  // Format data with percentages and icons
  return [
    { 
      platform: "Facebook", 
      percentage: Number(((channelCounts.facebook || 0) / (totalPosts as number) * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-facebook.png"
    },
    { 
      platform: "Instagram", 
      percentage: Number(((channelCounts.instagram || 0) / (totalPosts as number) * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-instagram.png"
    },
    { 
      platform: "X",
      percentage: Number(((channelCounts.x || 0) / (totalPosts as number) * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-X.png"
    },
    { 
      platform: "LIHKG",
      percentage: Number(((channelCounts.onlineforum || 0) / (totalPosts as number) * 100).toFixed(1)),
      icon: "/img/media/ic-mediatype-lihkg.png"
    }
  ];
};

const platformData = calculatePlatformData();

// Add chart data
const chartData = [
  { date: "11/24", Facebook: 8500, Instagram: 4020, X: 2103, "Online Forum": 1004 },
  { date: "11/25", Facebook: 7450, Instagram: 4150, X: 2130, "Online Forum": 1520 },
  { date: "11/26", Facebook: 9020, Instagram: 5200, X: 1480, "Online Forum": 920 },
  { date: "11/27", Facebook: 8540, Instagram: 4540, X: 2020, "Online Forum": 1650 },
  { date: "11/28", Facebook: 9530, Instagram: 5450, X: 1290, "Online Forum": 1870 },
  { date: "11/29", Facebook: 12000, Instagram: 6030, X: 3700, "Online Forum": 1880 },
  { date: "11/30", Facebook: 9240, Instagram: 5230, X: 2580, "Online Forum": 1760 }
];

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
  const [showTable, setShowTable] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const handleChartClick = (data: any) => {
    setSelectedPlatform(data.activePayload?.[0]?.name || '');
    setShowTable(true);
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {platformData.map((item) => (
          <Card 
            key={item.platform} 
            className="w-full shadow-none rounded-none"
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

      <div className="mt-8" style={{ height: "400px" }}>
        <Card>
          <CardHeader>
            <CardTitle>Overall Volume of Mentions</CardTitle>
            <CardDescription>Daily mentions across different platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartTemplate 
              data={chartData}
              layout="horizontal"
              type="grouped"
              categoryKey="date"
              dataKey={["Facebook", "Instagram", "X", "Online Forum"]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {showTable && (
        <TableOverlayNoLimit
          selectedEntity={selectedPlatform}
          onClose={() => setShowTable(false)}
        />
      )}
    </div>
  )
}