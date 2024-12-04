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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Download, Image, Link } from 'lucide-react'

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

import postData from './data-post.json'
import { PostMonitoringCardsComponent } from "./post-monitoring-cards"
import { PhotoGallery } from "./photo-gallery"

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

export const columns: ColumnDef<Post>[] = [
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
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("summary")}</div>,
  },
  {
    accessorKey: "engagementIndex",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Engagement
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("engagementIndex")}</div>,
  },
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("group")}</div>,
  },
  {
    accessorKey: "groupType",
    header: "Group Type",
    cell: ({ row }) => <div>{row.getValue("groupType")}</div>,
  },
  {
    accessorKey: "URL",
    header: "URL",
    cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("URL")}</div>,
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => <div>{row.getValue("channel")}</div>,
  },
  {
    accessorKey: "postDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Post Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("postDate")}</div>,
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => <div>{row.getValue("author")}</div>,
  },
  {
    accessorKey: "mentions",
    header: "Mentions",
    cell: ({ row }) => <div className="text-center">{row.getValue("mentions")}</div>,
  },
  {
    accessorKey: "hashtag",
    header: "Hashtag",
    cell: ({ row }) => <div>{row.getValue("hashtag")}</div>,
  },
  {
    accessorKey: "ner",
    header: "NER",
    cell: ({ row }) => {
      const ner = row.getValue("ner") as string[]
      return <div>{ner.join(", ")}</div>
    },
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
    cell: ({ row }) => <div>{row.getValue("sentiment")}</div>,
  },
  {
    accessorKey: "linkExtracted",
    header: "Link Extracted",
    cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("linkExtracted")}</div>,
  },
  {
    accessorKey: "classifiedContent",
    header: "Classified Content",
    cell: ({ row }) => {
      const classifiedContent = row.getValue("classifiedContent") as string[]
      return <div>{classifiedContent.join(", ")}</div>
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => <div>{row.getValue("country")}</div>,
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => <div>{row.getValue("language")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showGallery, setShowGallery] = React.useState(false)
      const post = row.original
      const hasImages = post.imgGroup && Object.keys(post.imgGroup).length > 0

      return (
        <div className="flex items-center gap-2">
          {hasImages && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowGallery(true)}
            >
              <div className="relative">
                <Image className="h-4 w-4" />
                {Object.keys(post.imgGroup).length > 1 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {Object.keys(post.imgGroup).length}
                  </span>
                )}
              </div>
            </Button>
          )}
          {post.linkExtracted && (
            <Button variant="ghost" size="icon">
              <Link className="h-4 w-4" />
            </Button>
          )}
          {showGallery && (
            <PhotoGallery 
              imageUrls={Object.values(post.imgGroup)}
              onClose={() => setShowGallery(false)}
            />
          )}
        </div>
      )
    }
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

export function RawDataComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [showOverlay, setShowOverlay] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState<Post | null>(null)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableFields = ['group', 'ner', 'id', 'summary', 'author', 'channel', 'hashtag', 'sentiment', 'country', 'language'];
      return searchableFields.some(field => 
        String(row.getValue(field))
          .toLowerCase()
          .includes((filterValue ?? '').toLowerCase())
      );
    },
    onGlobalFilterChange: setGlobalFilter,
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
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#E9EEEE]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-2 text-[#213938]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id} 
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      setSelectedRow(row.original)
                      setShowOverlay(true)
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2">
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
      </div>

      {showOverlay && (
        <TableOverlay onClose={() => {
          setShowOverlay(false)
          setSelectedRow(null)
        }} />
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
    </div>
  )
}