import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface AnalyticsCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  className?: string
  subtitle?: React.ReactNode
}

export function AnalyticsCard({ title, value, icon: Icon, className }: AnalyticsCardProps) {
  return (
    <Card className={`border border-[#00857C] rounded-none shadow-none ${className}`}>
      <div className="bg-[#00857C] px-4 py-2 h-[32px]">
        <div className="flex items-center justify-center gap-1.5">
          {Icon && <Icon className="h-3 w-3 text-white" />}
          <span className="text-sm text-white">{title}</span>
        </div>
      </div>
      <div className="p-2 flex items-center justify-center">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </Card>
  )
}

export function TotalMentionsCard() {
  return (
    <AnalyticsCard
      title="Total Mentions"
      value="45,231"
    />
  )
}

export function TotalPeopleTalkingCard() {
  return (
    <AnalyticsCard
      title="Total People Talking"
      value="20,456"
    />
  )
}

export function AverageMentionsCard() {
  return (
    <AnalyticsCard
      title="Average Mentions Per Day"
      value="1,508"
    />
  )
}

export function AveragePeopleTalkingCard() {
  return (
    <AnalyticsCard
      title="Average People Talking Per Day"
      value="682"
    />
  )
} 