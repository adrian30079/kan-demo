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
import { Download, Settings2 } from "lucide-react" // Import icons

export default function WordCloudsCard() {
  return (
    <>
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
                    {["Positive", "Negative", "Mixed", "Neutral"].map((sentiment) => (
                      <div key={sentiment} className="flex items-center space-x-2">
                        <Checkbox id={sentiment.toLowerCase()} />
                        <label htmlFor={sentiment.toLowerCase()}>{sentiment}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parts of Speech Section */}
                <div>
                  <h4 className="font-medium mb-2">Parts of Speech</h4>
                  <div className="space-y-2">
                    {["Nouns", "Verbs", "Adjectives"].map((pos) => (
                      <div key={pos} className="flex items-center space-x-2">
                        <Checkbox id={pos.toLowerCase()} />
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
          src="/img/what-wordcloud.jpg"
          alt="Word Cloud Visualization"
          className="w-full h-auto"
        />
      </CardContent>
    </>
  )
}
