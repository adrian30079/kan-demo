import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"

interface DownloadableData {
  [key: string]: any
}

interface ChartDownloadButtonProps<T extends DownloadableData> {
  data: T[]
  filename?: string
  variant?: 'dropdown' | 'csv'
}

export function ChartDownloadButton<T extends DownloadableData>({ 
  data,
  filename = 'chart_data',
  variant = 'dropdown'
}: ChartDownloadButtonProps<T>) {
  const handleDownloadCSV = () => {
    const headers = Object.keys(data[0])
    const csvContent = [
      headers,
      ...data.map(item => headers.map(header => item[header]))
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadFile(blob, `${filename}.csv`)
  }

  const handleDownloadPNG = () => {
    console.log('PNG download not implemented yet')
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (variant === 'csv') {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownloadCSV}
        className="rounded-none"
      >
        <Download className="h-4 w-4" />
        Download CSV
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-none"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-full rounded-none border-t-0 mt-0"
      >
        <DropdownMenuItem 
          onClick={handleDownloadCSV}
          className="rounded-none"
        >
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDownloadPNG}
          className="rounded-none"
        >
          Download PNG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 