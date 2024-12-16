'use client'

import { Menu, User, Globe, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden mr-auto text-[#00857C]"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <div className="pl-2 text-sm text-gray-700 ml-2 truncate font-light">U0051 IS</div>
      <div className="inline-flex items-center rounded-full bg-gray-400 px-3 py-1 text-xs text-white">Manager 2</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#576968] bg-gray-100 border-gray-200 hover:text-[#00857C] hover:bg-[#C8DEDB]">
            <User className="h-8 w-8" />
            <span className="sr-only">User</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="hover:bg-gray-200">
            <Globe className="mr-2 h-4 w-4" />
            <span>Change Language</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-200">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
} 