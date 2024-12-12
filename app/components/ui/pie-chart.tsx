import { PieChart as ReChartsPieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip } from 'recharts'
import { useState } from 'react'

export const SENTIMENT_COLORS = {
  positive: "#4ade80",
  neutral: "#94a3b8",
  negative: "#f87171",
  mixed: "#fbbf24"
}

interface PieChartData {
  name: string
  value: number
  count?: number
}

interface CustomPieChartProps {
  data: PieChartData[]
  width?: string | number
  height?: string | number
  showLabels?: boolean
  interactive?: boolean
  size?: 'small' | 'large'
}

const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value
  } = props

  return (
    <g>
      <text 
        x={cx} 
        y={cy-12} 
        textAnchor="middle" 
        fill={fill} 
        className="text-base font-semibold"
      >
        {payload.name}
      </text>
      <text 
        x={cx} 
        y={cy+12} 
        textAnchor="middle" 
        fill={fill} 
        className="text-base font-medium"
      >
        {`${value.toFixed(1)}%`}
      </text>
      
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  )
}

export function CustomPieChart({ 
  data, 
  width = "100%", 
  height = "100%",
  showLabels = true,
  interactive = true,
  size = 'small'
}: CustomPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>()

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  const dimensions = {
    small: {
      innerRadius: 35,
      outerRadius: 55,
      labelOffset: 15
    },
    large: {
      innerRadius: 50,
      outerRadius: 80,
      labelOffset: 20
    }
  }

  const { innerRadius, outerRadius, labelOffset } = dimensions[size]

  return (
    <ResponsiveContainer width={width} height={height}>
      <ReChartsPieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          label={showLabels ? ({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            name
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius + labelOffset;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="#374151"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-[10px]"
              >
                {`${name} (${value}%)`}
              </text>
            );
          } : undefined}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={SENTIMENT_COLORS[entry.name.toLowerCase() as keyof typeof SENTIMENT_COLORS]} 
              className="transition-all duration-300"
            />
          ))}
        </Pie>
      </ReChartsPieChart>
    </ResponsiveContainer>
  )
} 