'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PostMonitoringCardsComponent3 } from '@/components/post-monitoring-cards-all'
import { MessageSquare, Users2, BarChart3, Pin, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Dummy data for the past 7 days
const generateDummyData = () => {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  return dates.map(date => ({
    date,
    '黃天祐博士': Math.floor(Math.random() * 50) + 10,
    '梁鳳儀行政總裁': Math.floor(Math.random() * 40) + 15,
    '程蘋執行董事': Math.floor(Math.random() * 30) + 5,
    '蔡鳳儀執行董事': Math.floor(Math.random() * 35) + 8,
    '戴霖執行���事': Math.floor(Math.random() * 45) + 12,
  }))
}

const data = generateDummyData()

const colors = ['#00857C', '#2E9B97', '#5CB2AE', '#8AC9C6', '#B8E0DE']

// Add this after the existing generateDummyData function
const generateSentimentData = () => {
  const managers = [
    '黃天祐博士',
    '梁鳳儀行政總裁',
    '程蘋執行董事',
    '蔡鳳儀執行董事',
    '戴霖執行董事'
  ]

  return managers.map(manager => ({
    name: manager,
    Positive: Math.floor(Math.random() * 42) + 33, // Mostly positive
    Neutral: Math.floor(Math.random() * 30) + 20,  // Some neutral
    Mixed: Math.floor(Math.random() * 11) + 5,     // Less mixed
    Negative: Math.floor(Math.random() * 6) + 2,  // Least negative
  }))
}

export function ManagerMentionsCard() {
  const [selectedManager, setSelectedManager] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowOverlay(false)
      setSelectedManager(null)
      setIsClosing(false)
    }, 300)
  }

  return (
    <div className="space-y-4 px-20 pt-8">
      <Card className="p-4">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col justify-between">
            <h1 className="text-2xl font-bold text-[#00857C] pb-1">Management Sensor</h1>
            <CardDescription>
              Period: <span className="bg-gray-100 rounded-full px-2 py-1 italic">2023-12-01 00:00:00</span> to <span className="bg-gray-100 rounded-full px-2 py-1 italic">2023-12-07 23:59:59</span>
            </CardDescription>
        </div>
        <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-[#00857C] text-white hover:bg-[#00857C]/90"
                >
                  Actions
                  <MoreVertical className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="hover:cursor-pointer">
                  View Analysis
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:cursor-pointer">
                  Add to Comparison
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-[#00857C] bg-gray-100 rounded p-1 px-2"
            >
              <Pin className="h-4 w-4" />
            </Button>
        </div>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pl-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Total Mentions</span>
              </div>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">People Talking</span>
              </div>
              <p className="text-2xl font-bold">567</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Engagement</span>
              </div>
              <p className="text-2xl font-bold">890</p>
            </div>
          </div>

        <CardHeader className="flex flex-row items-center justify-between">
            <div>
            <CardTitle>Management Mentions - Last 7 Days</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(data[0])
                .filter(key => key !== 'date')
                .map((manager, index) => (
                  <Bar
                    key={manager}
                    dataKey={manager}
                    fill={colors[index]}
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedManager(manager)
                      setShowOverlay(true)
                    }}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Management Overall Sentiment</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={generateSentimentData()}
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Positive" stackId="a" fill="#4ade80" />
                <Bar dataKey="Neutral" stackId="a" fill="#94a3b8" />
                <Bar dataKey="Mixed" stackId="a" fill="#fbbf24" />
                <Bar dataKey="Negative" stackId="a" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {showOverlay && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in m-0"
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
            <PostMonitoringCardsComponent3 
              onClose={handleClose} 
              selectedEntity={selectedManager} 
            />
          </div>
        </div>
      )}
    </div>
  )
}