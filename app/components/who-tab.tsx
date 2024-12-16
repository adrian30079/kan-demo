'use client'

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, ArrowDown, ArrowUp, Download, Settings } from 'lucide-react'
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Treemap } from "recharts"
import { useState, useEffect, useMemo } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DataTable, SortableHeader, handleSort } from "@/components/data-table"
import { EntityTreemap } from "@/components/chart/entity-treemap"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ManageItemsDialog } from "@/components/ui/manage-items-dialog"
import { BaseTreeMap } from "@/components/chart/base-treemap"
import advocateData from '@/data/advocate.json'

const data = advocateData.advocates

const generateChartData = () => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2024, 0, i + 1);
    return date.toISOString().split('T')[0];
  });

  return dates.map((date, index) => {
    const dataPoint = { date };
    
    // Use top 5 advocates by influence for the chart
    const topAdvocates = [...data]
      .sort((a, b) => b.influence - a.influence)
      .slice(0, 5);
    
    topAdvocates.forEach(advocate => {
      let value = advocate.influence;
      
      // Add random daily variation
      const variation = Math.random() * 20 - 10;
      
      // Use type assertion to fix the indexing error
      (dataPoint as any)[advocate.advocate] = Math.max(0, Math.floor(value + variation));
    });
    
    return dataPoint;
  });
};

const chartData = generateChartData();
const colors = ['#00A59A', '#006DBA', '#A253BE', '#E98227', '#EA396B'];

export function WhoTab() {
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [selectedAdvocates, setSelectedAdvocates] = useState<Set<string>>(new Set())
  const [advocateLimit, setAdvocateLimit] = useState(20)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState({
    channel: {
      label: "Channels",
      options: [
        { id: "facebook", label: "Facebook", checked: true },
        { id: "instagram", label: "Instagram", checked: true },
        { id: "x", label: "X", checked: true },
        { id: "lihkg", label: "LIHKG", checked: true },
      ]
    }
  })

  // Initialize selected advocates
  useEffect(() => {
    const initialSelected = new Set(
      data
        .sort((a, b) => b.influence - a.influence)
        .slice(0, advocateLimit)
        .map(item => item.id)
    )
    setSelectedAdvocates(initialSelected)
  }, [advocateLimit])

  const handleLimitChange = (value: string) => {
    const limit = parseInt(value)
    setAdvocateLimit(limit)
    // Update selected advocates based on new limit
    const newSelected = new Set(
      data
        .sort((a, b) => b.influence - a.influence)
        .slice(0, limit)
        .map(item => item.id)
    )
    setSelectedAdvocates(newSelected)
  }

  const advocateItems = data.map(item => ({
    id: item.id,
    name: item.advocate,
    count: item.influence,
    metadata: {
      channel: item.channel,
      mentions: item.mentions
    }
  }))

  // Filter the advocateTreeMapData based on selected advocates
  const filteredTreeMapData = useMemo(() => 
    data.filter(item => 
      selectedAdvocates.has(item.id)
    ),
    [selectedAdvocates, data]
  )

  const columns: ColumnDef<typeof data[0]>[] = [
    {
      id: "ranking",
      header: ({ column }) => (
        <div className="w-[80px]">
          <SortableHeader 
            column={column} 
            onClick={() => handleSort(column, sorting, setSorting)}
          >
            Rank
          </SortableHeader>
        </div>
      ),
      cell: ({ row }) => <div className="text-left w-[80px]">{row.index + 1}</div>,
    },
    {
      accessorKey: "advocate",
      header: ({ column }) => (
        <div className="w-[400px]">
          <SortableHeader 
            column={column} 
            onClick={() => handleSort(column, sorting, setSorting)}
          >
            Name of advocate
          </SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left w-[400px] truncate">{row.getValue("advocate")}</div>
      ),
    },
    {
      accessorKey: "channel",
      header: ({ column }) => (
        <div className="w-[150px]">
          <SortableHeader 
            column={column} 
            onClick={() => handleSort(column, sorting, setSorting)}
          >
            Channels
          </SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left w-[150px] truncate">{row.getValue("channel")}</div>
      ),
    },
    {
      accessorKey: "mentions",
      header: ({ column }) => (
        <div className="w-[150px]">
          <SortableHeader 
            column={column} 
            onClick={() => handleSort(column, sorting, setSorting)}
          >
            Mentions
          </SortableHeader>
        </div>
      ),
      cell: ({ row }) => <div className="text-left w-[150px]">{row.getValue("mentions")}</div>,
    },
    {
      accessorKey: "influence",
      header: ({ column }) => (
        <div className="w-[150px]">
          <SortableHeader 
            column={column} 
            onClick={() => handleSort(column, sorting, setSorting)}
          >
            Influence
          </SortableHeader>
        </div>
      ),
      cell: ({ row }) => <div className="text-left w-[150px]">{row.getValue("influence")}</div>,
    },
  ]

  const handleDownload = (type: 'png' | 'csv') => {
    if (type === 'png') {
      // Get the chart element and use ApexCharts export functionality
      const chart = document.querySelector('#advocate-treemap');
      if (chart) {
        // ApexCharts provides a method to export as PNG
        (window as any).ApexCharts?.exec('advocate-treemap', 'exportToSVG');
      }
    } else if (type === 'csv') {
      // Create CSV content
      const csvContent = [
        ['Advocate', 'Channel', 'Mentions', 'Influence'].join(','),
        ...data.map(item => 
          [item.advocate, item.channel, item.mentions, item.influence].join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'advocate_data.csv';
      link.click();
    }
  };

  const handleFilterChange = (filterKey: string, optionId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey as keyof typeof prev],
        options: prev[filterKey as keyof typeof prev].options.map((option: { id: string; label: string; checked: boolean }) => 
          option.id === optionId ? { ...option, checked } : option
        )
      }
    }))
  }

  return (
    <div className="w-full p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Advocate Engagement Trends</CardTitle>
              <CardDescription>
                Size represents influence score, colors indicate trend changes
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="h-9 px-4"
                onClick={() => setManageDialogOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
              <Select
                value={
                  // If selected advocates don't match any preset limit, show custom
                  selectedAdvocates.size === 10 ? "10" :
                  selectedAdvocates.size === 20 ? "20" :
                  selectedAdvocates.size === 30 ? "30" :
                  selectedAdvocates.size === 50 ? "50" :
                  "custom"
                }
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Show top advocates">
                    {selectedAdvocates.size === advocateLimit 
                      ? `Show Top ${advocateLimit}`
                      : `Selected ${selectedAdvocates.size}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Show Top 10</SelectItem>
                  <SelectItem value="20">Show Top 20</SelectItem>
                  <SelectItem value="30">Show Top 30</SelectItem>
                  <SelectItem value="50">Show Top 50</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDownload('png')}>
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('csv')}>
                    Download as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BaseTreeMap 
            id="advocate-treemap"
            data={filteredTreeMapData.map(item => ({
              x: item.advocate,
              y: item.influence,
              raw: item
            }))}
            height={350}
            fontSize="12px"
            limit={selectedAdvocates.size}
            dataLabelFormatter={(text: string, op: any) => {
              const item = filteredTreeMapData.find(d => d.advocate === text)
              return [
                text,
                `Influence: ${op.value.toLocaleString()}`,
                `# Mentions: ${item?.mentions || 0}`
              ]
            }}
            tooltipRenderer={(data) => {
              const rawData = data.raw;
              return `
                <div style="
                  padding: 12px;
                  background: rgba(255, 255, 255, 0.98);
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  font-family: system-ui, -apple-system, sans-serif;
                ">
                  <div style="
                    font-size: 16px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 8px;
                  ">${rawData.advocate}</div>
                  
                  <div style="
                    display: grid;
                    gap: 6px;
                    font-size: 13px;
                    color: #4a4a4a;
                  ">
                    <div style="display: flex; align-items: center;">
                      <span style="width: 20px;">📢</span>
                      <span style="color: #666;">Channel:</span>
                      <span style="margin-left: 8px; font-weight: 500;">${rawData.channel}</span>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                      <span style="width: 20px;">⭐</span>
                      <span style="color: #666;">Influence:</span>
                      <span style="margin-left: 8px; font-weight: 500;">${rawData.influence.toLocaleString()}</span>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                      <span style="width: 20px;">👥</span>
                      <span style="color: #666;">Mentions:</span>
                      <span style="margin-left: 8px; font-weight: 500;">${rawData.mentions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              `
            }}
          />
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Advocate Engagement Table</CardTitle>
              <CardDescription>
                Sortable table showing advocate mentions and influence scores
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="h-9 px-4"
              onClick={() => {
                // Create CSV content
                const headers = ['Rank', 'Advocate', 'Channel', 'Mentions', 'Influence'];
                const csvContent = [
                  headers.join(','),
                  ...data.map((row, index) => 
                    [
                      index + 1,
                      row.advocate,
                      row.channel,
                      row.mentions,
                      row.influence
                    ].join(',')
                  )
                ].join('\n');

                // Create and trigger download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'advocate_engagement_data.csv';
                link.click();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={data} 
            sorting={sorting}
            setSorting={setSorting}
          />
        </CardContent>
      </Card>

      <ManageItemsDialog
        open={manageDialogOpen}
        onOpenChange={setManageDialogOpen}
        title="Manage Advocates"
        description="Select advocates to display in the treemap. Advocates are sorted by influence."
        items={advocateItems}
        selectedItems={selectedAdvocates}
        onSelectionChange={setSelectedAdvocates}
        maxItems={advocateLimit}
        metadataLabels={{
          channel: "Channel",
          mentions: "Mentions"
        }}
        filters={filters}
        onFilterChange={handleFilterChange}
        activeFilters={{
          channel: new Set(filters.channel.options
            .filter(o => o.checked)
            .map(o => o.id))
        }}
      />
    </div>
  )
}