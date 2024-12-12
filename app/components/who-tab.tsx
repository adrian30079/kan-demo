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
import { AdvocateTreeMap } from "@/components/chart/advocate-treemap"
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

const data = [
  { id: "m5gr84i1", advocate: "Roger Ver's Crypto Chronicles", channel: "Facebook", mentions: 5, influence: 7800 },
  { id: "m5gr84i2", advocate: "黃仲偉的區塊鏈探險", channel: "X", mentions: 8, influence: 1500 },
  { id: "m5gr84i3", advocate: "Ada Leung's Digital Currency Diaries", channel: "Instagram", mentions: 12, influence: 6200 },
  { id: "m5gr84i4", advocate: "蕭逸的加密貨幣日誌", channel: "LIHKG", mentions: 3, influence: 1500 },
  { id: "m5gr84i5", advocate: "Chris Liu's Blockchain Breakthroughs", channel: "Facebook", mentions: 10, influence: 2900 },
  { id: "m5gr84i6", advocate: "陳啟明的投資視野", channel: "X", mentions: 4, influence: 2200 },
  { id: "m5gr84i7", advocate: "Kelvin Lee's Coin Chronicles", channel: "Instagram", mentions: 7, influence: 1300 },
  { id: "m5gr84i8", advocate: "劉詩詩的加密旅程", channel: "LIHKG", mentions: 6, influence: 5000 },
  { id: "m5gr84i9", advocate: "Joseph Lubin's Ethereum Explorations", channel: "Facebook", mentions: 9, influence: 7800 },
  { id: "m5gr84i10", advocate: "何啟明的數字資產指南", channel: "X", mentions: 5, influence: 3200 },
  { id: "m5gr84i11", advocate: "Haseeb Qureshi's Crypto Corner", channel: "Instagram", mentions: 11, influence: 4600 },
  { id: "m5gr84i12", advocate: "傑瑞米的金融未來", channel: "LIHKG", mentions: 2, influence: 900 },
  { id: "m5gr84i13", advocate: "Eric Zhang's Bitcoin Bulletin", channel: "Facebook", mentions: 8, influence: 3700 },
  { id: "m5gr84i14", advocate: "林嘉欣的代幣故事", channel: "X", mentions: 4, influence: 1800 },
  { id: "m5gr84i15", advocate: "Juan Villaverde's Crypto Vision", channel: "Instagram", mentions: 10, influence: 6200 },
  { id: "m5gr84i16", advocate: "劉雅雯的區塊鏈快報", channel: "LIHKG", mentions: 3, influence: 2800 },
  { id: "m5gr84i17", advocate: "Tony Tong's Financial Freedom Forum", channel: "Facebook", mentions: 7, influence: 3500 },
  { id: "m5gr84i18", advocate: "鄭文浩的加密洞察", channel: "X", mentions: 5, influence: 1450 },
  { id: "m5gr84i19", advocate: "Kevin Wong's Wallet Wisdom", channel: "Instagram", mentions: 9, influence: 4900 },
  { id: "m5gr84i20", advocate: "張雅婷的虛擬貨幣日記", channel: "LIHKG", mentions: 6, influence: 3900 },
  { id: "m5gr84i21", advocate: "David Lee's Investment Insights", channel: "Facebook", mentions: 10, influence: 3100 },
  { id: "m5gr84i22", advocate: "劉志豪的市場隨想", channel: "X", mentions: 4, influence: 1200 },
  { id: "m5gr84i23", advocate: "Winnie Wong's Crypto Compass", channel: "Instagram", mentions: 11, influence: 6700 },
  { id: "m5gr84i24", advocate: "Nathaniel Yu's Digital Asset Digest", channel: "LIHKG", mentions: 3, influence: 800 },
  { id: "m5gr84i25", advocate: "Kaiwen Chen's Token Talk", channel: "Facebook", mentions: 5, influence: 4500 },
  { id: "m5gr84i26", advocate: "李德尼的區塊鏈文摘", channel: "X", mentions: 8, influence: 2300 },
  { id: "m5gr84i27", advocate: "Angela Tam's Crypto Cafe", channel: "Instagram", mentions: 12, influence: 7400 },
  { id: "m5gr84i28", advocate: "余家慶的投資旅程", channel: "LIHKG", mentions: 3, influence: 1600 },
  { id: "m5gr84i29", advocate: "Sarah Chan's Crypto Canvas", channel: "Facebook", mentions: 9, influence: 5200 },
  { id: "m5gr84i30", advocate: "黃家明的金融前沿", channel: "X", mentions: 5, influence: 2200 },
  { id: "m5gr84i31", advocate: "Iris Lam's Coin Collector's Diary", channel: "Instagram", mentions: 11, influence: 6800 },
  { id: "m5gr84i32", advocate: "李明的市場回顧", channel: "LIHKG", mentions: 2, influence: 1100 },
  { id: "m5gr84i33", advocate: "Tony Wong's Blockchain Breakthroughs", channel: "Facebook", mentions: 8, influence: 3700 },
  { id: "m5gr84i34", advocate: "張志剛的加密貨幣專欄", channel: "X", mentions: 4, influence: 1950 },
  { id: "m5gr84i35", advocate: "Brenda Lee's Altcoin Adventures", channel: "Instagram", mentions: 10, influence: 8100 },
  { id: "m5gr84i36", advocate: "陳家明的金融未來", channel: "LIHKG", mentions: 3, influence: 1800 },
  { id: "m5gr84i37", advocate: "Shelly Ho's Digital Currency Diary", channel: "Facebook", mentions: 7, influence: 4900 },
  { id: "m5gr84i38", advocate: "Jason Yip's Crypto Insights", channel: "X", mentions: 5, influence: 950 },
  { id: "m5gr84i39", advocate: "Emily Wong's Blockchain Bulletin", channel: "Instagram", mentions: 9, influence: 4500 },
  { id: "m5gr84i40", advocate: "李澤鉅的投資見解", channel: "LIHKG", mentions: 6, influence: 3600 },
  { id: "m5gr84i41", advocate: "Nicole Cheng's Token Tales", channel: "Facebook", mentions: 10, influence: 5200 },
  { id: "m5gr84i42", advocate: "Victor Lau's Crypto Corner", channel: "X", mentions: 4, influence: 2900 },
  { id: "m5gr84i43", advocate: "Linda Chan's Market Memoirs", channel: "Instagram", mentions: 11, influence: 7800 },
  { id: "m5gr84i44", advocate: "Simon Ho's Digital Finance Diary", channel: "LIHKG", mentions: 3, influence: 600 },
  { id: "m5gr84i45", advocate: "Amanda Wong's Investment Insights", channel: "Facebook", mentions: 5, influence: 4300 },
  { id: "m5gr84i46", advocate: "李雪琪的財務自由論壇", channel: "X", mentions: 8, influence: 2500 },
  { id: "m5gr84i47", advocate: "Tim Chan's Crypto Chronicles", channel: "Instagram", mentions: 12, influence: 7200 },
  { id: "m5gr84i48", advocate: "吳海倫的區塊鏈探險", channel: "LIHKG", mentions: 3, influence: 1300 },
  { id: "m5gr84i49", advocate: "Leo Zhang's Coin Collector's Diary", channel: "Facebook", mentions: 9, influence: 4700 },
  { id: "m5gr84i50", advocate: "黃維薇的數字資產文摘", channel: "X", mentions: 5, influence: 3300 }
]

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

// Transform the data for the AdvocateTreeMap
const advocateTreeMapData = data.map(item => ({
  id: item.id,
  advocate: item.advocate,
  channel: item.channel,
  mentions: item.mentions,
  influence: item.influence,
  // Calculate or set a trend value (example: random trend between -20 and +20)
  trend: Math.round((Math.random() * 40 - 20) * 10) / 10
}))

interface ManageAdvocatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAdvocates: string[]
  onSelectionChange: (advocates: string[]) => void
}

function ManageAdvocatesDialog({ 
  open, 
  onOpenChange, 
  selectedAdvocates, 
  onSelectionChange 
}: ManageAdvocatesDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [advocates, setAdvocates] = useState(
    // Sort by influence before creating the advocate list
    data
      .sort((a, b) => b.influence - a.influence)
      .map(item => ({
        name: item.advocate,
        included: selectedAdvocates.includes(item.advocate),
        influence: item.influence // Keep influence for reference
      }))
  )

  // Update advocates when selectedAdvocates changes
  useEffect(() => {
    setAdvocates(
      data
        .sort((a, b) => b.influence - a.influence)
        .map(item => ({
          name: item.advocate,
          included: selectedAdvocates.includes(item.advocate),
          influence: item.influence
        }))
    )
  }, [selectedAdvocates])

  // Filter advocates based on search query
  const filteredAdvocates = advocates.filter(advocate =>
    advocate.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleAll = (checked: boolean) => {
    const newAdvocates = advocates.map(advocate => ({
      ...advocate,
      included: checked
    }))
    setAdvocates(newAdvocates)
    onSelectionChange(checked ? data.map(item => item.advocate) : [])
  }

  const toggleAdvocate = (advocateName: string) => {
    const newAdvocates = advocates.map(advocate => 
      advocate.name === advocateName 
        ? { ...advocate, included: !advocate.included }
        : advocate
    )
    setAdvocates(newAdvocates)
    onSelectionChange(newAdvocates.filter(a => a.included).map(a => a.name))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Advocates</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-advocates"
                checked={advocates.every(a => a.included)}
                onCheckedChange={toggleAll}
              />
              <Label htmlFor="select-all-advocates">Select All</Label>
            </div>
            <Input
              placeholder="Search advocates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredAdvocates.map((advocate) => (
                <div key={advocate.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`advocate-${advocate.name}`}
                    checked={advocate.included}
                    onCheckedChange={() => toggleAdvocate(advocate.name)}
                  />
                  <Label htmlFor={`advocate-${advocate.name}`}>
                    {advocate.name} ({advocate.influence.toLocaleString()})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Create a reusable manage advocates hook
function useManageAdvocates(initialLimit: number) {
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [advocateLimit, setAdvocateLimit] = useState<number>(initialLimit)
  const [selectedAdvocates, setSelectedAdvocates] = useState<string[]>(
    // Initialize with top N advocates by influence
    data
      .sort((a, b) => b.influence - a.influence)
      .slice(0, initialLimit)
      .map(item => item.advocate)
  )

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value)
    setAdvocateLimit(newLimit)
    // When limit changes, update selection to top N advocates sorted by influence
    setSelectedAdvocates(
      data
        .sort((a, b) => b.influence - a.influence)
        .slice(0, newLimit)
        .map(item => item.advocate)
    )
  }

  const handleSelectionChange = (advocates: string[]) => {
    setSelectedAdvocates(advocates)
  }

  return {
    manageDialogOpen,
    setManageDialogOpen,
    advocateLimit,
    selectedAdvocates,
    setSelectedAdvocates: handleSelectionChange,
    handleLimitChange
  }
}

export function WhoTab() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const {
    manageDialogOpen,
    setManageDialogOpen,
    advocateLimit,
    selectedAdvocates,
    setSelectedAdvocates,
    handleLimitChange
  } = useManageAdvocates(20)

  // Filter the advocateTreeMapData based on selected advocates
  const filteredTreeMapData = useMemo(() => 
    advocateTreeMapData.filter(item => 
      selectedAdvocates.includes(item.advocate)
    ),
    [selectedAdvocates]
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
        ['Advocate', 'Channel', 'Mentions', 'Influence', 'Trend'].join(','),
        ...advocateTreeMapData.map(item => 
          [item.advocate, item.channel, item.mentions, item.influence, item.trend].join(',')
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
                  selectedAdvocates.length === 10 ? "10" :
                  selectedAdvocates.length === 20 ? "20" :
                  selectedAdvocates.length === 30 ? "30" :
                  selectedAdvocates.length === 50 ? "50" :
                  "custom"
                }
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Show top advocates">
                    {selectedAdvocates.length === advocateLimit 
                      ? `Show Top ${advocateLimit}`
                      : `Selected ${selectedAdvocates.length}`}
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
          <AdvocateTreeMap 
            id="advocate-treemap"
            data={filteredTreeMapData}
            height={350}
            fontSize="12px"
            limit={selectedAdvocates.length}
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

      <ManageAdvocatesDialog
        open={manageDialogOpen}
        onOpenChange={setManageDialogOpen}
        selectedAdvocates={selectedAdvocates}
        onSelectionChange={setSelectedAdvocates}
      />
    </div>
  )
}