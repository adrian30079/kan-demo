"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Download } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTable, SortableHeader, handleSort } from "@/components/data-table"

import postData from './data-post.json'
import { PostMonitoringCardsComponent } from "./post-monitoring-cards"

interface Post {
  id: string
  group: string
  groupType: string
  URL: string
  channel: string
  summary: string
  fullContent: string
  postDate: string
  engagementIndex: number
  author: string
  mentions: number
  hashtag: string
  ner: string[]
  sentiment: string
  linkExtracted: string
  classifiedContent: string[]
  country: string
  language: string
  imgGroup: Record<string, string>
}

const data: Post[] = postData.posts

export function RawDataComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [showOverlay, setShowOverlay] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState<Post | null>(null)

  const columns: ColumnDef<Post>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          ID
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "summary",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Summary
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="truncate w-[200px]">{row.getValue("summary")}</div>,
    },
    {
      accessorKey: "engagementIndex",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Engagement
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="text-center w-[100px]">{row.getValue("engagementIndex")}</div>,
    },
    {
      accessorKey: "group",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Group
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[120px]">{row.getValue("group")}</div>,
    },
    {
      accessorKey: "groupType",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Group Type
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[120px]">{row.getValue("groupType")}</div>,
    },
    {
      accessorKey: "URL",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          URL
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="truncate w-[200px]">{row.getValue("URL")}</div>,
    },
    {
      accessorKey: "channel",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Channel
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[100px]">{row.getValue("channel")}</div>,
    },
    {
      accessorKey: "postDate",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Post Date
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[120px]">{row.getValue("postDate")}</div>,
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Author
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[120px]">{row.getValue("author")}</div>,
    },
    {
      accessorKey: "mentions",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Mentions
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="text-center w-[80px]">{row.getValue("mentions")}</div>,
    },
    {
      accessorKey: "hashtag",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Hashtag
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[120px]">{row.getValue("hashtag")}</div>,
    },
    {
      accessorKey: "ner",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          NER
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const ner = row.getValue("ner") as string[]
        return <div className="truncate w-[150px]">{ner.join(", ")}</div>
      },
    },
    {
      accessorKey: "sentiment",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Sentiment
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[100px]">{row.getValue("sentiment")}</div>,
    },
    {
      accessorKey: "linkExtracted",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Link Extracted
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="truncate w-[200px]">{row.getValue("linkExtracted")}</div>,
    },
    {
      accessorKey: "classifiedContent",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Classified Content
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const classifiedContent = row.getValue("classifiedContent") as string[]
        return <div className="truncate w-[150px]">{classifiedContent.join(", ")}</div>
      },
    },
    {
      accessorKey: "country",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Country
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[100px]">{row.getValue("country")}</div>,
    },
    {
      accessorKey: "language",
      header: ({ column }) => (
        <SortableHeader column={column} onClick={() => handleSort(column, sorting, setSorting)}>
          Language
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="w-[100px]">{row.getValue("language")}</div>,
    },
  ]

  const columnGroups = {
    "Post Details": ["id", "summary", "postDate", "engagementIndex", "channel", "mentions", "hashtag", "URL"],
    "Inspect Info": ["group", "groupType", "ner", "sentiment", "linkExtracted", "classifiedContent"],
    "Demographic": ["author", "country", "language"]
  }

  function TableOverlay({ 
    onClose, 
    selectedRow,
    selectedEntity 
  }: { 
    onClose: () => void, 
    selectedRow?: Post | null,
    selectedEntity?: string | null
  }) {
    const [isClosing, setIsClosing] = React.useState(false)

    const handleClose = () => {
      setIsClosing(true)
      // Wait for animation to finish before actually closing
      setTimeout(onClose, 300)
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in m-0"
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
            selectedEntity={selectedEntity}
          />
        </div>
      </div>
    )
  }

  // Update the style tag with proper animation timing
  const styleTag = document.createElement('style')
  styleTag.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes slideOut {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `
  document.head.appendChild(styleTag)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search posts..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Visible Items <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[400px] p-4">
              <div className="grid grid-cols-2 gap-4 p-2">
                {Object.entries(columnGroups).map(([group, columns]) => (
                  <div key={group} className={`${group === "Demographic" ? "col-span-2" : ""}`}>
                    {group === "Demographic" && <div className="mb-4"><DropdownMenuSeparator /></div>}
                    <h4 className="mb-2 font-bold text-base">{group}</h4>
                    <div className={group === "Demographic" ? "space-y-0 flex flex-row gap-4" : "space-y-1"}>
                      {table
                        .getAllColumns()
                        .filter(
                          (column) => 
                            column.getCanHide() && 
                            columns.includes(column.id) &&
                            column.id !== "select" &&
                            column.id !== "actions"
                        )
                        .map((column) => {
                          return (
                            <div key={column.id} className="mb-1">
                              <Checkbox
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                id={column.id}
                                className="[&>span:first-child]:border-muted-foreground/50 data-[state=checked]:bg-[#008E66] data-[state=checked]:border-[#008E66]"
                              />
                              <label
                                htmlFor={column.id}
                                className="ml-2 text-sm capitalize"
                              >
                                {column.id}
                              </label>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="bg-[#00857C] text-white hover:bg-[#00857C]/90">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={data}
        sorting={sorting}
        setSorting={setSorting}
      />

      {showOverlay && (
        <TableOverlay 
          onClose={() => {
            setShowOverlay(false)
            setSelectedRow(null)
          }} 
          selectedRow={selectedRow}
        />
      )}
    </div>
  )
}