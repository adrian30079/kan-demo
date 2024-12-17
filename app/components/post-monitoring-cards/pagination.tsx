import * as React from "react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(pageCount - 1, currentPage + 1))}
        disabled={currentPage === pageCount - 1}
      >
        Next
      </Button>
    </div>
  )
} 