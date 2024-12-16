'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

// Default colors from bar-chart-template
const DEFAULT_COLORS = [
  '#00B1A5', '#0070AC', '#593FB6', '#DA418E', '#E66A22', 
  '#26A69A', '#FF4E50', '#FFA726', '#66BB6A', '#5C6BC0',
  '#8D6E63', '#78909C', '#7E57C2', '#26C6DA', '#D4E157',
  '#FFB300', '#FF7043', '#EC407A', '#5C6BC0', '#9CCC65'
]

export type TreeMapItem = {
  x: string               // Label/name to display
  y: number              // Size/value of the block
  fillColor?: string     // Optional custom color
  raw?: any              // Optional raw data for tooltip
}

export type BaseTreeMapProps = {
  id?: string
  data: TreeMapItem[]
  height?: number
  fontSize?: string
  limit?: number
  tooltipRenderer?: (data: any) => string
  dataLabelFormatter?: (text: string, op: any) => string[]
}

export function BaseTreeMap({
  id,
  data,
  height = 350,
  fontSize = '12px',
  limit = 20,
  tooltipRenderer,
  dataLabelFormatter
}: BaseTreeMapProps) {
  const treeMapData = useMemo(() => {
    const maxBlocks = 50
    const displayLimit = Math.min(limit, maxBlocks)
    
    return data
      .sort((a, b) => b.y - a.y)
      .slice(0, displayLimit)
      .map((item, index) => ({
        ...item,
        fillColor: item.fillColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
      }))
  }, [data, limit])

  const defaultDataLabelFormatter = (text: string, op: any) => {
    return [text, op.value.toLocaleString()]
  }

  const defaultTooltipRenderer = (data: TreeMapItem) => {
    const rawData = data.raw || data;
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
        ">${rawData.x || rawData.advocate}</div>
        
        <div style="
          display: grid;
          gap: 6px;
          font-size: 13px;
          color: #4a4a4a;
        ">
          ${rawData.channel ? `
            <div style="display: flex; align-items: center;">
              <span style="width: 20px;">📢</span>
              <span style="color: #666;">Channel:</span>
              <span style="margin-left: 8px; font-weight: 500;">${rawData.channel}</span>
            </div>
          ` : ''}
          
          <div style="display: flex; align-items: center;">
            <span style="width: 20px;">⭐</span>
            <span style="color: #666;">Value:</span>
            <span style="margin-left: 8px; font-weight: 500;">${rawData.y.toLocaleString()}</span>
          </div>
          
          ${rawData.mentions ? `
            <div style="display: flex; align-items: center;">
              <span style="width: 20px;">👥</span>
              <span style="color: #666;">Mentions:</span>
              <span style="margin-left: 8px; font-weight: 500;">${rawData.mentions.toLocaleString()}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `
  }

  const options: ApexOptions = {
    legend: { show: false },
    chart: {
      height: height,
      type: 'treemap',
      toolbar: { show: false },
      animations: { enabled: false },
      fontFamily: 'system-ui'
    },
    title: { text: undefined },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: fontSize,
        colors: ['#fff'],
        fontFamily: 'system-ui'
      },
      offsetY: -4,
      formatter: dataLabelFormatter || defaultDataLabelFormatter
    },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.2,
        distributed: true,
        colorScale: { ranges: [] }
      }
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        return tooltipRenderer ? tooltipRenderer(data) : defaultTooltipRenderer(data);
      }
    }
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
