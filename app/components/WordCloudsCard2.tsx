import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Settings2 } from "lucide-react"
import { useState } from "react"

export default function WordCloudsCardJensen() {
  const [sentimentFilters, setSentimentFilters] = useState({
    all: true,
    positive: true,
    negative: true,
    mixed: true,
    neutral: true,
  })

  const [posFilters, setPosFilters] = useState({
    all: true,
    nouns: true,
    verbs: true,
    adjectives: true,
  })

  const handleSentimentChange = (value: string) => {
    if (value === 'all') {
      const newState = !sentimentFilters.all
      setSentimentFilters({
        all: newState,
        positive: newState,
        negative: newState,
        mixed: newState,
        neutral: newState,
      })
    } else {
      const newState = {
        ...sentimentFilters,
        [value]: !sentimentFilters[value as keyof typeof sentimentFilters],
      }
      // Update "all" based on other checkboxes
      newState.all = ['positive', 'negative', 'mixed', 'neutral'].every(
        (key) => newState[key as keyof typeof sentimentFilters]
      )
      setSentimentFilters(newState)
    }
  }

  const handlePosChange = (value: string) => {
    if (value === 'all') {
      const newState = !posFilters.all
      setPosFilters({
        all: newState,
        nouns: newState,
        verbs: newState,
        adjectives: newState,
      })
    } else {
      const newState = {
        ...posFilters,
        [value]: !posFilters[value as keyof typeof posFilters],
      }
      // Update "all" based on other checkboxes
      newState.all = ['nouns', 'verbs', 'adjectives'].every(
        (key) => newState[key as keyof typeof posFilters]
      )
      setPosFilters(newState)
    }
  }

  return (
    <Card className="shadow-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Word Cloud</CardTitle>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Word Preference
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                {/* Public Sentiment Section */}
                <div>
                  <h4 className="font-medium mb-2">Public Sentiment</h4>
                  <div className="space-y-2">
                    {["All", "Positive", "Negative", "Mixed", "Neutral"].map((sentiment) => (
                      <div key={sentiment} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sentiment.toLowerCase()}
                          checked={sentimentFilters[sentiment.toLowerCase() as keyof typeof sentimentFilters]}
                          onCheckedChange={() => handleSentimentChange(sentiment.toLowerCase())}
                          className= "data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
                        />
                        <label htmlFor={sentiment.toLowerCase()}>{sentiment}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parts of Speech Section */}
                <div>
                  <h4 className="font-medium mb-2">Parts of Speech</h4>
                  <div className="space-y-2">
                    {["All", "Nouns", "Verbs", "Adjectives"].map((pos) => (
                      <div key={pos} className="flex items-center space-x-2">
                        <Checkbox 
                          id={pos.toLowerCase()}
                          checked={posFilters[pos.toLowerCase() as keyof typeof posFilters]}
                          onCheckedChange={() => handlePosChange(pos.toLowerCase())}
                          className= "data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
                        />
                        <label htmlFor={pos.toLowerCase()}>{pos}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Download as PNG</DropdownMenuItem>
              <DropdownMenuItem>Download as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <img
          src="/img/what-wordcloud-new.jpg"
          alt="Word Cloud Visualization"
          className="w-full h-auto max-h-[400px] object-contain mx-auto"
        />
      </CardContent>
    </Card>
  )
}
