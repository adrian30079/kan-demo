'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type EntityTreemapProps = {
  data: Array<{
    entity: string
    count: number
    engagementIndex: number
  }>
}

export function EntityTreemap({ data }: EntityTreemapProps) {
  // Dummy data with engagement comparison
  const dummyData = [
    { x: "CoinUnited", y: 13731, trend: 12.4 },  // 12.4% increase
    { x: "JPEX Limited", y: 9424, trend: -19.2 },    // 19.2% decrease
    { x: "CoinUnited", y: 7314, trend: 29.5 },
    { x: "區塊鏈金融方案有限公司", y: 6223, trend: -9.8 },
    { x: "加密貨幣圈", y: 5112, trend: 24.7 },
    { x: "Cybersecurity Win Co.", y: 4523, trend: -14.3 },
    { x: "AT coin 加密圈", y: 3429, trend: 19.6 },
    { x: "Altcoin Market", y: 3485, trend: -24.1 },
    { x: "HKG Crypto Solutions", y: 2812, trend: 9.9 },
    { x: "Future FinTech Ltd.", y: 2348, trend: -4.7 },
    // Additional 10 entities
    { x: "我要做股神", y: 2035, trend: 11.9 },
    { x: "幣安投資巢", y: 1856, trend: -7.8 },
    { x: "Crypto Asset Investments Ltd.", y: 1417, trend: 21.9 },
    { x: "United Exchange Ltd.", y: 1663, trend: -17.5 },
    { x: "區塊鏈技術", y: 1589, trend: 14.9 },
    { x: "Alternatives替代幣市場", y: 14, trend: -11.8 },
    { x: "比特幣期貨", y: 1379, trend: 7.9 },
    { x: "數字資產", y: 1242, trend: -14.5 },
    { x: "未來金融科技有限公司", y: 1135, trend: 17.8 },
    { x: "分析與區塊鏈技術公司", y: 1083, trend: -21.5 }
  ]

  const getColorIntensity = (trend: number) => {
    // Convert trend percentage to color intensity
    const absChange = Math.abs(trend)
    const maxChange = 30 // Maximum expected change percentage
    const baseIntensity = 0.3 // Minimum color intensity (30%)
    const intensity = baseIntensity + (1 - baseIntensity) * Math.min(absChange / maxChange, 1)
    
    if (trend > 0) {
      // Green with dynamic intensity
      return `rgba(76, 175, 80, ${intensity})`
    } else {
      // Red with dynamic intensity
      return `rgba(255, 82, 82, ${intensity})`
    }
  }

  const treeMapData = useMemo(() => {
    return dummyData.map(item => ({
      x: item.x,
      y: item.y,
      fillColor: getColorIntensity(item.trend)
    }))
  }, [])

  const options = {
    legend: {
      show: false
    },
    chart: {
      height: 350,
      type: 'treemap' as const,
      toolbar: {
        show: false
      }
    },
    title: {
      text: undefined  // Remove title
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '18vw',
      },
      formatter: function(text: string, op: any) {
        const item = dummyData.find(d => d.x === text)
        const trend = item ? `${item.trend > 0 ? '+' : ''}${item.trend}%` : ''
        return [text, op.value, trend]
      },
      offsetY: -4
    },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.2,
        distributed: true,
        colorScale: {
          ranges: []  // Remove predefined ranges to use distributed colors
        }
      }
    }
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={[{ data: treeMapData }]}
        type="treemap"
        height={350}
      />
    </div>
  )
} 