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
import { ChartDownloadButton } from "@/components/chart/chart-download-button"
import { BarChartTemplate } from "@/components/chart/bar-chart-template"


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
  { date: "30/Nov/2024", positive: 15, neutral: 14, negative: 3, mixed: 3 },
  { date: "11/24", positive: 14, neutral: 15, negative: 3, mixed: 2 },
  { date: "11/25", positive: 13, neutral: 16, negative: 5, mixed: 3 },
  { date: "11/26", positive: 15, neutral: 14, negative: 4, mixed: 4 },
  { date: "11/27", positive: 16, neutral: 13, negative: 3, mixed: 2 },
  { date: "11/28", positive: 14, neutral: 15, negative: 5, mixed: 3 },
  { date: "11/29", positive: 13, neutral: 16, negative: 4, mixed: 2 },
  { date: "11/30", positive: 15, neutral: 14, negative: 3, mixed: 3 }
]

const SENTIMENT_COLORS = {
  positive: "#4ade80",
  neutral: "#94a3b8",
  negative: "#f87171",
  mixed: "#fbbf24"
}


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

  const getLastSevenDaysData = () => {
    return sentimentOverTime.slice(-7);
  };

  return (
    <div className="p-8 space-y-8">
      <Card className="w-full shadow-none rounded-none border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Public Sentiment Distribution</CardTitle>
            <CardDescription>Overall breakdown of public sentiment across all channels</CardDescription>
          </div>
          <ChartDownloadButton 
            data={pieChartData}
            filename="sentiment_distribution"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-[400px] flex items-center justify-center">
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

      <Card className="w-full shadow-none rounded-none border-0 mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Public Sentiment Distribution over Time</CardTitle>
            <CardDescription>Daily sentiment trends over the past week</CardDescription>
          </div>
          <ChartDownloadButton 
            data={getLastSevenDaysData()}
            filename="sentiment_over_time"
          />
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChartTemplate
              data={getLastSevenDaysData()}
              layout="horizontal"
              type="grouped"
              dataKey={["positive", "neutral", "negative", "mixed"]}
              categoryKey="date"
              colors={[
                SENTIMENT_COLORS.positive,  // #4ade80
                SENTIMENT_COLORS.neutral,   // #94a3b8
                SENTIMENT_COLORS.negative,  // #f87171
                SENTIMENT_COLORS.mixed      // #fbbf24
              ]}
              legendFormatter={(value) => {
                // Capitalize first letter
                return value.charAt(0).toUpperCase() + value.slice(1);
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const getSentimentEmoji = (sentiment: string) => {
                    const lowercaseSentiment = sentiment.toLowerCase();
                    switch (lowercaseSentiment) {
                      case 'positive':
                        return '😊';
                      case 'neutral':
                        return '😐';
                      case 'negative':
                        return '😞';
                      case 'mixed':
                        return '🤔';
                      default:
                        return '📊';
                    }
                  };

                  return (
                    <div className="bg-white p-4 border rounded shadow-lg">
                      <p className="text-base font-semibold text-gray-900 mb-2 pb-2 border-b">
                        {label}
                      </p>
                      <div className="space-y-1.5">
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center">
                            <span className="w-5 mr-2">
                              {getSentimentEmoji(entry.name)}
                            </span>
                            <span className="text-gray-600">{entry.name}:</span>
                            <span className="ml-2 font-medium">
                              {entry.value.toLocaleString()} mentions
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-none rounded-none border-0 mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Public Sentiment Distribution across Channels</CardTitle>
            <CardDescription>Comparison of sentiment patterns across different social media platforms</CardDescription>
          </div>
          <ChartDownloadButton 
            data={transformChannelData()}
            filename="sentiment_by_channel"
          />
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChartTemplate
              data={transformChannelData()}
              layout="vertical"
              type="stacked"
              dataKey={[
                "positive.percentage",
                "neutral.percentage",
                "negative.percentage",
                "mixed.percentage"
              ]}
              categoryKey="channel"
              colors={[
                SENTIMENT_COLORS.positive,
                SENTIMENT_COLORS.neutral,
                SENTIMENT_COLORS.negative,
                SENTIMENT_COLORS.mixed
              ]}
              legendFormatter={(value) => {
                // Remove .percentage from the legend labels
                return value.split('.')[0].charAt(0).toUpperCase() + value.split('.')[0].slice(1);
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const getSentimentEmoji = (sentiment: string) => {
                    const lowercaseSentiment = sentiment.split('.')[0].toLowerCase();
                    switch (lowercaseSentiment) {
                      case 'positive':
                        return '😊';
                      case 'neutral':
                        return '😐';
                      case 'negative':
                        return '😞';
                      case 'mixed':
                        return '🤔';
                      default:
                        return '📊';
                    }
                  };

                  return (
                    <div className="bg-white p-4 border rounded shadow-lg">
                      <p className="text-base font-semibold text-gray-900 mb-2 pb-2 border-b">
                        {label}
                      </p>
                      <div className="space-y-1.5">
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center">
                            <span className="w-5 mr-2">
                              {getSentimentEmoji(entry.name)}
                            </span>
                            <span className="text-gray-600">
                              {entry.name.split('.')[0].charAt(0).toUpperCase() + 
                               entry.name.split('.')[0].slice(1)}:
                            </span>
                            <span className="ml-2 font-medium">
                              {entry.value.toFixed(1)}% of total mentions
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}