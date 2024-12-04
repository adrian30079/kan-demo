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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Download, TrendingUp } from 'lucide-react'
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const data = [
  { id: "m5gr84i9", influencer: "明周娛樂 MP Weekly", channel: "facebook", mentions: 5, influence: 75 },
  { id: "n6hs95j0", influencer: "傑哥幣談", channel: "twitter", mentions: 7, influence: 82 },
  { id: "k7it06l1", influencer: "區塊客 blockcast.it", channel: "facebook", mentions: 15, influence: 95 },
  { id: "j8lu17m2", influencer: "Khushi Akter", channel: "linkedin", mentions: 6, influence: 68 },
  { id: "p9ox28n3", influencer: "高欢欢", channel: "instagram", mentions: 9, influence: 88 },
]

const generateChartData = () => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2024, 0, i + 1);
    return date.toISOString().split('T')[0];
  });

  return dates.map((date, index) => {
    const dataPoint = { date };
    
    // Base values for each influencer
    const baseValues = {
      "明周娛樂 MP Weekly": 40,
      "傑哥幣談": 65,
      "區塊客 blockcast.it": 85,
      "Khushi Akter": 60,
      "高欢欢": 70
    };

    // Add variations for each influencer
    Object.keys(baseValues).forEach(influencer => {
      let value = baseValues[influencer];
      
      // Add random daily variation
      const variation = Math.random() * 20 - 10;
      
      // Special handling for 區塊客 blockcast.it peak period
      if (influencer === "區塊客 blockcast.it" && index >= 16 && index <= 20) { // Jan 17-21
        value += 40 + Math.random() * 20; // Significant peak
      }
      
      // Keep 明周娛樂 MP Weekly generally lower
      if (influencer === "明周娛樂 MP Weekly") {
        value = value * 0.7; // Reduce by 30%
      }
      
      // Keep 區塊客 blockcast.it generally higher
      if (influencer === "區塊客 blockcast.it") {
        value = value * 1.2; // Increase by 20%
      }
      
      dataPoint[influencer] = Math.max(0, Math.floor(value + variation));
    });
    
    return dataPoint;
  });
};

const chartData = generateChartData();
const colors = ['#00A59A', '#006DBA', '#A253BE', '#E98227', '#EA396B'];

const columns: ColumnDef<typeof data[0]>[] = [
  {
    accessorKey: "influencer",
    header: "Name of Influencer",
    cell: ({ row }) => <div>{row.getValue("influencer")}</div>,
  },
  {
    accessorKey: "channel",
    header: "Channels",
    cell: ({ row }) => <div>{row.getValue("channel")}</div>,
  },
  {
    accessorKey: "mentions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mentions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("mentions")}</div>,
  },
  {
    accessorKey: "influence",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Influence
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("influence")}</div>,
  },
]

export function WhoTab() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(5)

  const handleExport = (format: string) => {
    if (format === 'csv') {
      console.log('Exporting table data as CSV...')
      // Implement CSV export logic here
    } else if (format === 'ppt' || format === 'jpeg') {
      console.log(`Exporting chart as ${format.toUpperCase()}...`)
      // Implement PPT or JPEG export logic here
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState = updater({
        pageIndex,
        pageSize,
      })
      setPageIndex(newState.pageIndex)
      setPageSize(newState.pageSize)
    },
  })

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Who discusses the most?</h2>
        <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="rounded-md border mb-6">
        <Table>
          <TableHeader className="bg-[#E9EEEE]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[#213938]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} influencers
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Top 5 Influencers by Influence</CardTitle>
              <CardDescription>
                Showing influence trends for the top 5 influencers over the last 30 days
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('ppt')}>
                  Export as PPT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('jpeg')}>
                  Export as JPEG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.map((influencer, index) => (
                <Line
                  key={influencer.id}
                  type="monotone"
                  dataKey={influencer.influencer}
                  stroke={colors[index]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Top influencer: {data[0].influencer} <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Notable peak during January 17-21
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}