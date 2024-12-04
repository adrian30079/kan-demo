'use client'

import * as React from "react"
import { CalendarIcon } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange | undefined;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border-[#00857C] text-black",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#00857C]" />
            {date?.from ? (
              date.to ? (
                <>
                  <span className="text-black">{format(date.from, "LLL dd, y")}</span> -{" "}
                  <span className="text-black">{format(date.to, "LLL dd, y")}</span>
                </>
              ) : (
                <span className="text-black">{format(date.from, "LLL dd, y")}</span>
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            className="[&_.rdp-day_focus]:bg-[#00857C]/50 [&_.rdp-day_selected]:bg-[#00857C] [&_.rdp-day_selected]:text-white [&_.rdp-day_outside]:text-muted-foreground"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}