"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Download } from 'lucide-react'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, Legend, LabelList } from "recharts"
import { Tooltip as RechartsTooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pie, PieChart, Cell, Label, Sector } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CustomPieChart } from "@/components/ui/pie-chart"

const platformData = [
  { platform: "Facebook", percentage: 57.3, icon: "/img/media/ic-mediatype-facebook.png" },
  { platform: "Instagram", percentage: 15.6, icon: "/img/media/ic-mediatype-instagram.png" },
  { platform: "X", percentage: 17.4, icon: "/img/media/ic-mediatype-X.png" },
  { platform: "Online Forum", percentage: 9.7, icon: "/img/media/ic-mediatype-forum.png" },
]

const sentimentOverTime = [
  { date: "01/Nov/2024", positive: 12, neutral: 18, negative: 5, mixed: 3 },
  { date: "02/Nov/2024", positive: 14, neutral: 16, negative: 4, mixed: 2 },
  { date: "03/Nov/2024", positive: 13, neutral: 15, negative: 6, mixed: 4 },
  { date: "04/Nov/2024", positive: 11, neutral: 19, negative: 3, mixed: 2 },
  { date: "05/Nov/2024", positive: 15, neutral: 14, negative: 5, mixed: 3 },
  { date: "06/Nov/2024", positive: 16, neutral: 13, negative: 4, mixed: 2 },
  { date: "07/Nov/2024", positive: 14, neutral: 15, negative: 5, mixed: 3 },
  { date: "08/Nov/2024", positive: 13, neutral: 16, negative: 4, mixed: 4 },
  { date: "09/Nov/2024", positive: 15, neutral: 14, negative: 3, mixed: 2 },
  { date: "10/Nov/2024", positive: 17, neutral: 12, negative: 4, mixed: 3 },
  { date: "11/Nov/2024", positive: 16, neutral: 13, negative: 5, mixed: 2 },
  { date: "12/Nov/2024", positive: 14, neutral: 15, negative: 4, mixed: 3 },
  { date: "13/Nov/2024", positive: 13, neutral: 16, negative: 5, mixed: 4 },
  { date: "14/Nov/2024", positive: 15, neutral: 14, negative: 3, mixed: 2 },
  { date: "15/Nov/2024", positive: 16, neutral: 13, negative: 4, mixed: 3 },
  { date: "16/Nov/2024", positive: 14, neutral: 15, negative: 5, mixed: 2 },
  { date: "17/Nov/2024", positive: 13, neutral: 16, negative: 4, mixed: 3 },
  { date: "18/Nov/2024", positive: 15, neutral: 14, negative: 3, mixed: 4 },
  { date: "19/Nov/2024", positive: 16, neutral: 13, negative: 5, mixed: 2 },
  { date: "20/Nov/2024", positive: 14, neutral: 15, negative: 4, mixed: 3 },
  { date: "21/Nov/2024", positive: 13, neutral: 16, negative: 3, mixed: 2 },
  { date: "22/Nov/2024", positive: 15, neutral: 14, negative: 5, mixed: 4 },
  { date: "23/Nov/2024", positive: 16, neutral: 13, negative: 4, mixed: 3 },
  { date: "24/Nov/2024", positive: 14, neutral: 15, negative: 3, mixed: 2 },
  { date: "25/Nov/2024", positive: 13, neutral: 16, negative: 5, mixed: 3 },
  { date: "26/Nov/2024", positive: 15, neutral: 14, negative: 4, mixed: 4 },
  { date: "27/Nov/2024", positive: 16, neutral: 13, negative: 3, mixed: 2 },
  { date: "28/Nov/2024", positive: 14, neutral: 15, negative: 5, mixed: 3 },
  { date: "29/Nov/2024", positive: 13, neutral: 16, negative: 4, mixed: 2 },
  { date: "30/Nov/2024", positive: 15, neutral: 14, negative: 3, mixed: 3 }
]

const SENTIMENT_COLORS = {
  positive: "#4ade80",
  neutral: "#94a3b8",
  negative: "#f87171",
  mixed: "#fbbf24"
}

const CustomPieTooltip = ({ 
  active, 
  payload 
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      count: number;
    };
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-medium">{data.payload.count}</span>
        </p>
        <p className="text-sm text-gray-600">
          Percentage: <span className="font-medium">
            {data.value.toFixed(1)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const channelSentimentData = [
  {
    channel: "Facebook",
    positive: 573,
    neutral: 658,
    negative: 247,
    mixed: 165,
  },
  {
    channel: "Instagram",
    positive: 156,
    neutral: 187,
    negative: 93,
    mixed: 42,
  },
  {
    channel: "X",
    positive: 174,
    neutral: 218,
    negative: 186,
    mixed: 62,
  },
  {
    channel: "Online Forum",
    positive: 30,
    neutral: 40,
    negative: 20,
    mixed: 10,
  },
]

const transformChannelData = () => {
  // Calculate total mentions across all channels
  const totalMentions = channelSentimentData.reduce((sum, channel) => 
    sum + channel.positive + channel.neutral + channel.negative + channel.mixed, 0
  );

  return channelSentimentData.map(channel => {
    // Calculate channel's total mentions
    const channelTotal = channel.positive + channel.neutral + channel.negative + channel.mixed;
    // Calculate channel's percentage of total mentions
    const channelPercentage = (channelTotal / totalMentions) * 100;
    
    // Calculate sentiment percentages within the channel's portion
    return {
      channel: channel.channel,
      channelPercentage: Number(channelPercentage.toFixed(1)),
      positive: {
        count: channel.positive,
        percentage: Number(((channel.positive / channelTotal) * channelPercentage).toFixed(1)),
      },
      neutral: {
        count: channel.neutral,
        percentage: Number(((channel.neutral / channelTotal) * channelPercentage).toFixed(1)),
      },
      negative: {
        count: channel.negative,
        percentage: Number(((channel.negative / channelTotal) * channelPercentage).toFixed(1)),
      },
      mixed: {
        count: channel.mixed,
        percentage: Number(((channel.mixed / channelTotal) * channelPercentage).toFixed(1)),
      },
    };
  });
};

export function HowTab() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>()

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  const handleClick = (data: any, index: number) => {
    console.log('Clicked:', data, index)
    // Add your click handler logic here
  }

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload
    } = props

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    )
  }

  const calculateTotalSentiments = () => {
    const totals = sentimentOverTime.reduce((acc, curr) => {
      return {
        Positive: acc.Positive + curr.positive,
        Neutral: acc.Neutral + curr.neutral,
        Negative: acc.Negative + curr.negative,
        Mixed: acc.Mixed + curr.mixed,
      }
    }, { Positive: 0, Neutral: 0, Negative: 0, Mixed: 0 })

    const total = Object.values(totals).reduce((sum, value) => sum + value, 0)

    return Object.entries(totals).map(([key, value]) => ({
      name: key,
      value: Number(((value / total) * 100).toFixed(1)),
      count: value
    }))
  }

  const pieChartData = calculateTotalSentiments()

  const handleDownload = (format: 'png' | 'csv') => {
    if (format === 'csv') {
      const csvContent = [
        ['Sentiment', 'Count', 'Percentage'],
        ...pieChartData.map(item => [item.name, item.count, item.value]),
        ['Total', pieChartData.reduce((sum, item) => sum + item.count, 0), '100']
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'sentiment_distribution.csv'
      link.click()
    } else if (format === 'png') {
      // Get the SVG element
      const svgElement = document.querySelector('.recharts-wrapper svg')
      if (!svgElement) return

      // Create a canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const link = document.createElement('a')
        link.download = 'sentiment_distribution.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="w-full rounded-none border-2 border-[#00A59A] shadow-none">
        <CardHeader className="bg-[#00A59A] p-4">
          <CardTitle className="text-white font-bold">Public Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-end mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDownload('png')}>
                  Download PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('csv')}>
                  Download CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[300px]">
              <CustomPieChart 
                data={pieChartData} 
                showLabels={true}
                interactive={true}
                size="large"
              />
            </div>
            
            <div className="flex items-center">
              <Table className="border border-gray-200 rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-[#00A59A] text-white font-medium">Public Sentiment</TableHead>
                    <TableHead className="bg-[#00A59A] text-white font-medium text-right">Count</TableHead>
                    <TableHead className="bg-[#00A59A] text-white font-medium text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pieChartData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: SENTIMENT_COLORS[item.name.toLowerCase() as keyof typeof SENTIMENT_COLORS] }}
                          />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">{item.value}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="text-right">
                      {pieChartData.reduce((sum, item) => sum + item.count, 0)}
                    </TableCell>
                    <TableCell className="text-right">100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full rounded-none border-2 border-[#00A59A] shadow-none">
        <CardHeader className="bg-[#00A59A] p-4">
          <CardTitle className="text-white font-bold">Public Sentiment Distribution over Time</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDownload('png')}>
                    Download PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('csv')}>
                    Download CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sentimentOverTime}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar 
                    dataKey="positive" 
                    fill="#4ade80" 
                    name="Positive"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="neutral" 
                    fill="#94a3b8" 
                    name="Neutral"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="negative" 
                    fill="#f87171" 
                    name="Negative"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="mixed" 
                    fill="#fbbf24" 
                    name="Mixed"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full rounded-none border-2 border-[#00A59A] shadow-none">
        <CardHeader className="bg-[#00A59A] p-4">
          <CardTitle className="text-white font-bold">Public Sentiment Distribution across Channels</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDownload('png')}>
                    Download PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('csv')}>
                    Download CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transformChannelData()}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis type="category" dataKey="channel" />
                  <RechartsTooltip
                    formatter={(value: number, name: string) => {
                      const sentimentType = name.split('.')[0];
                      const data = transformChannelData();
                      const channel = data.find(d => d.channel === name);
                      return [`${value.toFixed(1)}% of total mentions`, sentimentType];
                    }}
                    labelFormatter={(label) => `Channel: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="positive.percentage"
                    stackId="stack"
                    fill={SENTIMENT_COLORS.positive}
                    name="Positive"
                  >
                    <LabelList
                      dataKey="positive.percentage"
                      position="center"
                      formatter={(value: number) => (value > 5 ? `${value.toFixed(1)}%` : '')}
                      fill="white"
                    />
                  </Bar>
                  <Bar
                    dataKey="neutral.percentage"
                    stackId="stack"
                    fill={SENTIMENT_COLORS.neutral}
                    name="Neutral"
                  >
                    <LabelList
                      dataKey="neutral.percentage"
                      position="center"
                      formatter={(value: number) => (value > 5 ? `${value.toFixed(1)}%` : '')}
                      fill="white"
                    />
                  </Bar>
                  <Bar
                    dataKey="negative.percentage"
                    stackId="stack"
                    fill={SENTIMENT_COLORS.negative}
                    name="Negative"
                  >
                    <LabelList
                      dataKey="negative.percentage"
                      position="center"
                      formatter={(value: number) => (value > 5 ? `${value.toFixed(1)}%` : '')}
                      fill="white"
                    />
                  </Bar>
                  <Bar
                    dataKey="mixed.percentage"
                    stackId="stack"
                    fill={SENTIMENT_COLORS.mixed}
                    name="Mixed"
                  >
                    <LabelList
                      dataKey="mixed.percentage"
                      position="center"
                      formatter={(value: number) => (value > 5 ? `${value.toFixed(1)}%` : '')}
                      fill="white"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}