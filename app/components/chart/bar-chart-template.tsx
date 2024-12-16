'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export interface BarChartProps {
  data: any[]
  layout?: 'vertical' | 'horizontal'
  type?: 'single' | 'grouped'
  dataKey: string | string[]
  categoryKey: string
  width?: string | number
  height?: string | number
  yAxisWidth?: number
  legendFormatter?: (value: string) => string
  colors?: string[]
  isChannelChart?: boolean
  content?: (props: any) => React.ReactNode;
}

export function BarChartTemplate({ 
  data,
  layout = 'vertical',
  type = 'single',
  dataKey,
  categoryKey,
  width = "100%",
  height = "100%",
  yAxisWidth = 120,
  legendFormatter = (value) => value,
  colors = [
    // Primary distinct colors
    '#00B1A5', // teal
    '#0070AC', // blue
    '#593FB6', // purple
    '#DA418E', // pink
    '#E66A22', // orange
    '#26A69A', // sea green
    '#FF4E50', // red
    '#FFA726', // amber
    '#66BB6A', // green
    '#5C6BC0', // indigo
    '#8D6E63', // brown
    '#78909C', // blue grey
    '#7E57C2', // deep purple
    '#26C6DA', // cyan
    '#D4E157', // lime
    '#FFB300', // amber
    '#FF7043', // deep orange
    '#EC407A', // pink
    '#5C6BC0', // indigo
    '#9CCC65', // light green

    // Secondary distinct colors
    '#FF5722', // deep orange
    '#009688', // teal
    '#673AB7', // deep purple
    '#2196F3', // blue
    '#FFC107', // amber
    '#795548', // brown
    '#607D8B', // blue grey
    '#4CAF50', // green
    '#9C27B0', // purple
    '#FF9800', // orange
    '#03A9F4', // light blue
    '#8BC34A', // light green
    '#E91E63', // pink
    '#CDDC39', // lime
    '#3F51B5', // indigo

    // Additional distinct colors
    '#F44336', // red
    '#00BCD4', // cyan
    '#9E9E9E', // grey
    '#FFEB3B', // yellow
    '#4DB6AC', // teal light
    '#7986CB', // indigo light
    '#FFB74D', // orange light
    '#BA68C8', // purple light
    '#81C784', // green light
    '#64B5F6', // blue light
    '#A1887F', // brown light
    '#90A4AE', // blue grey light
    '#AED581', // light green light
    '#4DD0E1', // cyan light
    '#DCE775'  // lime light
  ],
  isChannelChart = false,
  content,
}: BarChartProps) {
  const isVertical = layout === 'vertical'
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey]

  // Define consistent font sizes
  const AXIS_FONT_SIZE = 12
  const LEGEND_FONT_SIZE = 10

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart 
        data={data} 
        layout={layout}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type={isVertical ? "number" : "category"} 
          dataKey={!isVertical ? categoryKey : undefined}
          tick={{ fontSize: AXIS_FONT_SIZE }}
          stroke="#6B7280"
        />
        <YAxis 
          type={isVertical ? "category" : "number"}
          dataKey={isVertical ? categoryKey : undefined}
          width={60}
          tick={{ fontSize: AXIS_FONT_SIZE }}
          stroke="#6B7280"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            border: 'none',
            padding: '12px'
          }}
          content={content}
        />
        <Legend
          formatter={legendFormatter}
          iconSize={8}
          wrapperStyle={{
            fontSize: `${LEGEND_FONT_SIZE}px`,
            lineHeight: '1.4',
          }}
          fontWeight={400}
        />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            fill={colors[index % colors.length]}
            stackId={type === 'stacked' ? 'stack' : undefined}
            {...(type === 'grouped' ? { 
              maxBarSize: 50
            } : {})}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
} 