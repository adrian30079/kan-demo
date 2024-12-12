'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type AdvocateTreeMapItem = {
  id: string
  advocate: string
  channel: string
  mentions: number
  influence: number
  trend: number
}

type AdvocateTreeMapProps = {
  id?: string
  data: AdvocateTreeMapItem[]
  height?: number
  fontSize?: string
  limit?: number
  onLimitChange?: (value: number) => void
}

export function AdvocateTreeMap({
  id,
  data,
  height = 350,
  fontSize = '12px',
  limit = 20,
  onLimitChange
}: AdvocateTreeMapProps) {
  const treeMapData = useMemo(() => {
    // Transform data to match entity-treemap's simpler structure
    const maxBlocks = 50 // Maximum number of blocks allowed
    const displayLimit = Math.min(limit, maxBlocks) // Use the smaller of limit or maxBlocks
    
    const transformedData = data
      .sort((a, b) => b.influence - a.influence)
      .slice(0, displayLimit)
      .map(item => ({
        x: item.advocate,
        y: item.influence,
        trend: item.trend,
        fillColor: getColorIntensity(item.trend),
        raw: item
      }))

    return transformedData
  }, [data, limit])

  const options: ApexOptions = {
    legend: {
      show: false
    },
    chart: {
      height: height,
      type: 'treemap' as const,
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      },
      fontFamily: 'system-ui'
    },
    title: {
      text: undefined
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: fontSize,
        colors: ['#fff'],
        fontFamily: 'system-ui'
      },
      offsetY: -4,
      formatter: function(text: string, op: any) {
        const item = treeMapData.find(d => d.x === text)
        const trend = item ? `${item.trend > 0 ? '+' : ''}${item.trend}%` : ''
        return [text, op.value, trend]
      }
    },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.2,
        distributed: true,
        colorScale: {
          ranges: []
        }
      }
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex].raw as AdvocateTreeMapItem;
        const trendColor = data.trend >= 0 ? '#4CAF50' : '#FF5252';
        const trendIcon = data.trend >= 0 ? '↗' : '↘';
        
        return `
          <div style="
            padding: 12px;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="
              font-size: 16px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 8px;
              border-bottom: 1px solid #eee;
              padding-bottom: 8px;
            ">${data.advocate}</div>
            
            <div style="
              display: grid;
              gap: 6px;
              font-size: 13px;
              color: #4a4a4a;
            ">
              <div style="display: flex; align-items: center;">
                <span style="width: 20px;">📢</span>
                <span style="color: #666;">Channel:</span>
                <span style="margin-left: 8px; font-weight: 500;">${data.channel}</span>
              </div>
              
              <div style="display: flex; align-items: center;">
                <span style="width: 20px;">⭐</span>
                <span style="color: #666;">Influence:</span>
                <span style="margin-left: 8px; font-weight: 500;">${data.influence.toLocaleString()}</span>
              </div>
              
              <div style="display: flex; align-items: center;">
                <span style="width: 20px;">👥</span>
                <span style="color: #666;">Mentions:</span>
                <span style="margin-left: 8px; font-weight: 500;">${data.mentions.toLocaleString()}</span>
              </div>
              
              <div style="display: flex; align-items: center;">
                <span style="width: 20px;">${trendIcon}</span>
                <span style="color: #666;">Trend:</span>
                <span style="
                  margin-left: 8px;
                  font-weight: 600;
                  color: ${trendColor};
                ">${data.trend > 0 ? '+' : ''}${data.trend}%</span>
              </div>
            </div>
          </div>
        `;
      },
      style: {
        fontSize: '12px'
      },
    },
  }

  return (
    <div id={id || "chart"} style={{ width: '100%' }}>
      <ReactApexChart
        options={options}
        series={[{ data: treeMapData }]}
        type="treemap"
        height={height}
      />
    </div>
  )
}

function getColorIntensity(trend: number): string {
  // Convert trend percentage to color intensity
  const absChange = Math.abs(trend)
  const maxChange = 30 // Maximum expected change percentage
  const baseIntensity = 0.3 // Minimum color intensity (30%)
  const intensity = baseIntensity + 
    (1 - baseIntensity) * Math.min(absChange / maxChange, 1)
  
  if (trend > 0) {
    // Green with dynamic intensity for positive trends
    return `rgba(76, 175, 80, ${intensity})`
  } else {
    // Red with dynamic intensity for negative trends
    return `rgba(255, 82, 82, ${intensity})`
  }
}
