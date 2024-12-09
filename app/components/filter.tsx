'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { DateRange } from "react-day-picker"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Channel {
  name: string;
  included: boolean;
  pages: { name: string; included: boolean }[];
}

interface FilterPanelState {
  resultType: string;
  dateRange: DateRange | undefined;
  classifiedContent: {
    virtualAssets: boolean;
    encourageInvestment: boolean;
    encourageAccount: boolean;
  };
  group: 'all' | 'wechat' | 'whatsapp';
  linkExtracted: boolean;
  sentiment: {
    all: boolean;
    positive: boolean;
    negative: boolean;
    mixed: boolean;
    neutral: boolean;
  };
}

interface QueryFiltersProps {
  filterPanel: FilterPanelState;
  channels: Channel[];
  selectAllChannels: boolean;
  channelsError: boolean;
  pendingFilterChanges: boolean;
  onFilterChange: (key: string, value: any) => void;
  onChannelToggle: (channelName: string) => void;
  onAllChannelsToggle: (checked: boolean) => void;
  onPageToggle: (channelName: string, pageName: string) => void;
  onAllPagesToggle: (channelName: string, included: boolean) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

export function QueryFilters({
  filterPanel,
  selectAllChannels,
  pendingFilterChanges,
  onFilterChange,
  onChannelToggle,
  onAllChannelsToggle,
  onPageToggle,
  onResetFilters,
  onApplyFilters,
}: QueryFiltersProps) {
  const dummyChannels = [
    { name: "Facebook", included: true, pages: [{ name: "Page 1", included: true }, { name: "Page 2", included: true }] },
    { name: "Instagram", included: true, pages: [{ name: "Account 1", included: true }, { name: "Account 2", included: true }] },
    { name: "Twitter", included: true, pages: [{ name: "Handle 1", included: true }, { name: "Handle 2", included: true }] },
  ];

  const handleClassifiedContentChange = (field: string) => (checked: boolean) => {
    onFilterChange('classifiedContent', {
      ...filterPanel.classifiedContent,
      [field]: checked
    });
  };

  const handleSentimentChange = (key: string) => (checked: boolean) => {
    onFilterChange('sentiment', {
      ...filterPanel.sentiment,
      [key]: checked,
      all: key === 'all' ? checked : filterPanel.sentiment.all
    });
  };

  return (
    <div className="p-2 space-y-6 rounded-xl">
      {/* Date Range Section */}
      <div className="space-y-2">
        <Label className="text-md font-bold">Date Range</Label>
        <div className="flex gap-2 mb-2">
          <Button 
            variant="outline" 
            size="sm"
            className={filterPanel.dateRange?.from === undefined ? "bg-[#00857C] text-white hover:bg-[#00857C]/90" : ""}
          >
            Last 7 days
          </Button>
          <Button 
            variant="outline"
            size="sm"
          >
            Last 14 days
          </Button>
          <Button 
            variant="outline"
            size="sm"
          >
            Last 30 days
          </Button>
        </div>
        <DatePickerWithRange
          date={filterPanel.dateRange}
          onDateChange={(date) => onFilterChange('dateRange', date)}
        />
      </div>

      {/* Classified Content Dropdown */}
      <div className="space-y-2">
        <Label className="text-md font-bold">Classified Content</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal"
            >
              <span className="truncate">
                {Object.entries(filterPanel.classifiedContent)
                  .filter(([_, value]) => value)
                  .map(([key]) => key)
                  .join(', ') || 'Select options'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="virtualAssets"
                  checked={filterPanel.classifiedContent.virtualAssets}
                  onCheckedChange={handleClassifiedContentChange('virtualAssets')}
                  className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
                />
                <Label htmlFor="virtualAssets">虛擬資產</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="encourageInvestment"
                  checked={filterPanel.classifiedContent.encourageInvestment}
                  onCheckedChange={handleClassifiedContentChange('encourageInvestment')}
                  className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
                />
                <Label htmlFor="encourageInvestment">慫恿投資</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="encourageAccount"
                  checked={filterPanel.classifiedContent.encourageAccount}
                  onCheckedChange={handleClassifiedContentChange('encourageAccount')}
                  className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
                />
                <Label htmlFor="encourageAccount">慫恿開戶</Label>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Channels Section */}
      <div className="space-y-2">
        <Label className="text-md font-bold">Channels</Label>
        <div className="space-y-2 border rounded-lg p-2">
          <div className="flex items-center justify-between pb-2 border-b">
            <Label>Select All</Label>
            <Checkbox 
              checked={selectAllChannels}
              onCheckedChange={(checked) => onAllChannelsToggle(checked as boolean)}
              className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
            />
          </div>
          {dummyChannels.map((channel) => (
            <div key={channel.name} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={channel.included}
                  onCheckedChange={() => onChannelToggle(channel.name)}
                  className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
                />
                <Label>{channel.name}</Label>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-[#FDFFF4] hover:text-[#00857C] hover:bg-[#00857C]/10"
                  >
                    Manage
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage {channel.name} Pages</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {channel.pages.map((page) => (
                      <div key={page.name} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={page.included}
                          onCheckedChange={() => onPageToggle(channel.name, page.name)}
                          className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
                        />
                        <Label>{page.name}</Label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>

      {/* Public Sentiment Dropdown */}
      <div className="space-y-2">
        <Label className="text-md font-bold">Public Sentiment</Label>
        <Select
          value={filterPanel.sentiment.all ? 'all' : 'custom'}
          onValueChange={() => {}}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {filterPanel.sentiment.all
                ? 'All'
                : Object.entries(filterPanel.sentiment)
                    .filter(([key, value]) => key !== 'all' && value)
                    .map(([key]) => key)
                    .join(', ')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="space-y-2 p-2">
              {Object.entries(filterPanel.sentiment).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sentiment-${key}`}
                    checked={checked}
                    onCheckedChange={handleSentimentChange(key)}
                    className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
                  />
                  <Label htmlFor={`sentiment-${key}`} className="capitalize">{key}</Label>
                </div>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Link Included and Group Options */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Label className="text-md font-bold">Link Included</Label>
          <Checkbox
            id="linkExtracted"
            checked={filterPanel.linkExtracted}
            onCheckedChange={(checked) => 
              onFilterChange('linkExtracted', checked)
            }
            className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-md font-bold">Group included?</Label>
          <Checkbox
            id="groupIncluded"
            checked={filterPanel.group !== 'all'}
            onCheckedChange={(checked) => 
              onFilterChange('group', checked ? 'wechat' : 'all')
            }
            className="border-[#00857C] data-[state=checked]:bg-[#00857C]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onResetFilters}
          className="hover:bg-[#00857C]/10 flex-1"
        >
          Reset
        </Button>
        <Button 
          onClick={onApplyFilters}
          disabled={!pendingFilterChanges}
          className="bg-[#00857C] hover:bg-[#00857C]/90 flex-1"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}