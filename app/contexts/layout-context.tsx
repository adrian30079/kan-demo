"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface LayoutContextType {
  sidebarWidth: number
  headerHeight: number
}

const LayoutContext = createContext<LayoutContextType>({ sidebarWidth: 0, headerHeight: 0 })

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [measurements, setMeasurements] = useState({
    sidebarWidth: 0,
    headerHeight: 0
  })

  useEffect(() => {
    const updateMeasurements = () => {
      const sidebar = document.getElementById('sidebar')
      const header = document.getElementById('header')
      
      const sidebarWidth = sidebar?.offsetWidth || 0
      const headerHeight = header?.offsetHeight || 0
      
      setMeasurements({
        sidebarWidth,
        headerHeight
      })

      // Set CSS variables
      document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`)
    }

    updateMeasurements()
    window.addEventListener('resize', updateMeasurements)
    
    return () => window.removeEventListener('resize', updateMeasurements)
  }, [])

  return (
    <LayoutContext.Provider value={measurements}>
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext) 