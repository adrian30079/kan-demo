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
import { ArrowUpDown, ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  sorting?: SortingState
  setSorting?: (sorting: SortingState) => void
}

export const handleSort = (column: any, sorting: SortingState, setSorting: (sorting: SortingState) => void) => {
  if (!column.getIsSorted()) {
    setSorting([{ id: column.id, desc: true }])
  } else if (column.getIsSorted() === "desc") {
    setSorting([{ id: column.id, desc: false }])
  } else {
    setSorting([])
  }
}

export const SortableHeader = ({ column, children, onClick }: { column: any, children: React.ReactNode, onClick: () => void }) => {
  return (
    <div 
      className={cn(
        "text-left flex items-center gap-2 text-white cursor-pointer w-full",
        "hover:opacity-80"
      )}
      onClick={onClick}
    >
      <span className="select-none">{children}</span>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "p-0 h-auto hover:bg-transparent",
          column.getIsSorted() && "bg-transparent hover:bg-transparent"
        )}
      >
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4 text-white" />
          ) : (
            <ArrowDown className="h-4 w-4 text-white" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 text-white hover:text-white/80" />
        )}
      </Button>
    </div>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting: externalSorting,
  setSorting: setExternalSorting,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)

  const sorting = externalSorting ?? internalSorting
  const setSorting = setExternalSorting ?? setInternalSorting

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => setSorting(
      typeof updater === 'function' ? updater(sorting) : updater
    ),
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' 
        ? updater({pageIndex, pageSize})
        : updater
      setPageIndex(newState.pageIndex)
      setPageSize(newState.pageSize)
    },
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#00A59A]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className={cn(
                      "text-white hover:bg-[#00A59A]",
                      header.column.getIsSorted() && "bg-[#00A59A]"
                    )}
                  >
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
                    <TableCell 
                      key={cell.id}
                      className={cn(
                        cell.column.getIsSorted() && "bg-[#00A59A]/5"
                      )}
                    >
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
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        </div>
        <div className="flex-1 text-sm text-muted-foreground text-center">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{' '}
          of {data.length} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}