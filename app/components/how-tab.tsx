"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Download } from 'lucide-react'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, Tooltip as RechartsTooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const platformData = [
  { platform: "Facebook", percentage: 57.3, icon: "/img/media/ic-mediatype-facebook.png" },
  { platform: "Instagram", percentage: 15.6, icon: "/img/media/ic-mediatype-instagram.png" },
  { platform: "X", percentage: 17.4, icon: "/img/media/ic-mediatype-X.png" },
  { platform: "Online Forum", percentage: 9.7, icon: "/img/media/ic-mediatype-forum.png" },
]

const sentimentOverTime = [
  { date: "01/Nov/2024", positive: 5, neutral: 15, negative: 3, mixed: 2 },
  { date: "07/Nov/2024", positive: 5, neutral: 15, negative: 3, mixed: 2 },
  { date: "14/Nov/2024", positive: 8, neutral: 12, negative: 4, mixed: 3 },
  { date: "21/Nov/2024", positive: 12, neutral: 10, negative: 2, mixed: 4 },
  { date: "28/Nov/2024", positive: 15, neutral: 8, negative: 3, mixed: 2 },
  { date: "30/Nov/2024", positive: 13, neutral: 9, negative: 2, mixed: 1 },
]

const sentimentScoreData = [
  { date: "01/Nov/2024", score: 20 },
  { date: "04/Nov/2024", score: 0 },
  { date: "07/Nov/2024", score: 15 },
  { date: "10/Nov/2024", score: -60 },
  { date: "13/Nov/2024", score: 0 },
  { date: "16/Nov/2024", score: 15 },
  { date: "19/Nov/2024", score: 0 },
  { date: "22/Nov/2024", score: 15 },
  { date: "25/Nov/2024", score: 20 },
  { date: "28/Nov/2024", score: 0 },
]

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-4 border rounded shadow">
//         <p className="font-bold">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} style={{ color: entry.color }}>
//             {`${entry.name}: ${entry.value}`}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

//I don't know why I removed "default" from "export deault function HowTab() then it works
export function HowTab() {
  const [dateRange, setDateRange] = useState('30')

  return (
    <div className="p-6 space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Overall Sentiment</CardTitle>
          <div className="flex gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Bar dataKey="positive" stackId="a" fill="#4ade80" />
                <Bar dataKey="neutral" stackId="a" fill="#94a3b8" />
                <Bar dataKey="negative" stackId="a" fill="#f87171" />
                <Bar dataKey="mixed" stackId="a" fill="#fbbf24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sentiment Score Over Time</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[-80, 40]} />
                {/* <RechartsTooltip content={<CustomTooltip />} /> */}
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#f97316" }}
                  activeDot={{ r: 6, fill: "#f97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sentiment & Sentiment Score by Media</h2>
        <div className="flex flex-wrap gap-4">
          {platformData.map((item) => (
            <Card 
              key={item.platform} 
              className="flex-1 min-w-[200px] transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
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
      </div>
    </div>
  )
}