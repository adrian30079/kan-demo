'use client'

import { useState } from 'react'
import { Bell, ChevronLeft, ChevronRight, Home, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"

type MenuItem = {
  icon: React.ElementType;
  name: string;
  id: string;
};

interface DashboardSidebarProps {
  activeTab: string;
  showCreateNewTopic: boolean;
  onMenuItemClick: (menuId: string) => void;
}

export function DashboardSidebar({ activeTab, showCreateNewTopic, onMenuItemClick }: DashboardSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const menuItems: MenuItem[] = [
    { icon: Home, name: 'Home', id: 'featured-topics' },
    { icon: Search, name: 'Query', id: 'query' },
    { icon: Bell, name: 'Alerts', id: 'alerts' },
  ]

  return (
    <aside className={`${isExpanded ? 'w-56' : 'w-16'} hidden bg-white transition-all duration-300 ease-in-out lg:block min-w-[4rem] h-screen overflow-visible`}>
      <div className="flex h-full flex-col overflow-visible">
        <div className="flex h-14 items-center px-4 pl-4 border-b overflow-visible">
          <div className="flex items-center font-semibold justify-start overflow-visible">
            <div className="relative h-10 w-10 py-2">
              <img src="/img/logo-new.png" alt="SFC logo" className="object-contain w-full h-full" />
            </div>
            <span className="text-lg text-[#00857C] tracking-tight whitespace-nowrap flex-shrink-0">SENSOR</span>
            <div className="mx-1 border-r ml-3 h-[28px] w-1"/>
            {isExpanded && (
              <span className="pl-2 text-sm text-[#9BB5B1] truncate font-light">
                Suspicious Fraudulent Activities Detection in Social Media Monitoring
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 bg-[#f7fafa] border-r pt-2 flex flex-col justify-between">
          <ul className="space-y-1 p-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full ${isExpanded ? 'justify-start' : 'justify-center'} ${
                    (activeTab === item.id || (showCreateNewTopic && item.id === 'create-new-topic')) 
                      ? 'bg-[#008d84]/10 text-[#008d84] hover:bg-[#008d84]/20' 
                      : ''
                  }`}
                  onClick={() => onMenuItemClick(item.id)}
                >
                  <item.icon className={`h-5 w-5 ${isExpanded ? 'mr-2' : ''} ${
                    (activeTab === item.id || (showCreateNewTopic && item.id === 'create-new-topic')) 
                      ? 'text-[#008d84]' 
                      : ''
                  }`} />
                  {isExpanded && <span>{item.name}</span>}
                </Button>
              </li>
            ))}
          </ul>
          <div className="relative px-3 py-2 text-[10px] text-gray-400 w-full overflow-hidden text-ellipsis">
            {isExpanded && "SENSOR prototype v1.0 data and content are for referencing usage."}
          </div>
        </nav>

        <div className="flex h-14 items-center justify-end border-t px-4 border-r">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </aside>
  )
} 