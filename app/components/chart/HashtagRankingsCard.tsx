import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ChartDownloadButton } from "./chart-download-button"

const hashtagsData = [
  { tag: '#加密貨幣', count: 1234 },
  { tag: '#Bitcoin', count: 1187 },
  { tag: '#以太坊', count: 1165 },
  { tag: '#CryptoNews', count: 1154 },
  { tag: '#區塊鏈', count: 1143 },
  { tag: '#BlockchainTechnology', count: 1132 },
  { tag: '#比特幣交易', count: 1121 },
  { tag: '#DeFi', count: 1110 },
  { tag: '#去中心化', count: 1099 },
  { tag: '#CryptoCommunity', count: 1088 },
  { tag: '#穩定幣', count: 1077 },
  { tag: '#Altcoins', count: 1066 },
  { tag: '#加密投資', count: 1055 },
  { tag: '#NFT', count: 1044 },
  { tag: '#CryptoTrading', count: 1033 },
  { tag: '#智能合約', count: 1022 },
  { tag: '#Mining', count: 1011 },
  { tag: '#加密市場', count: 1000 },
  { tag: '#Tokenomics', count: 989 },
  { tag: '#CryptoWallet', count: 978 },
  { tag: '#數字貨幣', count: 967 },
  { tag: '#HODL', count: 956 },
  { tag: '#加密資產', count: 945 },
  { tag: '#ICO', count: 934 },
  { tag: '#CryptoAnalysis', count: 923 },
  { tag: '#鏈上數據', count: 912 },
  { tag: '#Liquidity', count: 901 },
  { tag: '#加密策略', count: 890 },
  { tag: '#Staking', count: 879 },
  { tag: '#CryptoExchange', count: 868 },
  { tag: '#去中心化金融', count: 857 },
  { tag: '#MarketCap', count: 846 },
  { tag: '#Cryptography', count: 835 },
  { tag: '#投資者', count: 824 },
  { tag: '#TokenSale', count: 813 },
  { tag: '#CryptoEvents', count: 802 },
  { tag: '#價格預測', count: 791 },
  { tag: '#加密新聞', count: 780 },
  { tag: '#BlockchainGaming', count: 769 },
  { tag: '#技術分析', count: 758 },
  { tag: '#YieldFarming', count: 747 },
  { tag: '#加密錢包', count: 736 },
  { tag: '#CryptoInvestor', count: 725 },
  { tag: '#社區建設', count: 714 },
  { tag: '#Forks', count: 703 },
  { tag: '#CryptocurrencyMining', count: 692 },
  { tag: '#GasFees', count: 681 },
  { tag: '#去中心化交易所', count: 670 },
  { tag: '#CryptoMarketAnalysis', count: 659 },
  { tag: '#加密交易', count: 648 },
]

interface HashtagData {
  tag: string
  count: number
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US')
}

export default function HashtagRankingsCard() {
  const columns: ColumnDef<HashtagData>[] = [
    {
      id: 'rank',
      accessorFn: (_, index) => index + 1,
      header: ({ column }) => (
        <SortableHeader 
          column={column} 
          onClick={() => column.toggleSorting()}
        >
          Rank
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="w-[100px]">
          <span className="text-base text-primary">{row.index + 1}</span>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "tag",
      header: ({ column }) => (
        <SortableHeader 
          column={column} 
          onClick={() => column.toggleSorting()}
        >
          Hashtag
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="w-[400px]">
          <Badge variant="secondary" className="text-base text-primary font-semibold">
            {row.original.tag}
          </Badge>
        </div>
      ),
      size: 400,
    },
    {
      accessorKey: "count",
      header: ({ column }) => (
        <SortableHeader 
          column={column} 
          onClick={() => column.toggleSorting()}
        >
          Mentions
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="w-[150px]">
          <span className="text-base text-primary">
            {formatNumber(row.original.count)}
          </span>
        </div>
      ),
      size: 150,
    },
  ]

  return (
    <Card className="shadow-none rounded-none border-0">
      <CardContent className="p-0">
        <DataTable 
          columns={columns} 
          data={hashtagsData}
        />
      </CardContent>
    </Card>
  )
} 