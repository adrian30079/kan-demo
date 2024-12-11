import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

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

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US')
}

export default function HashtagRankingsCard() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(hashtagsData.length / itemsPerPage)

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Rank', 'Hashtag', 'Mentions'],
      ...hashtagsData.map((item, index) => [
        index + 1,
        item.tag,
        item.count
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'hashtag_rankings.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return hashtagsData.slice(startIndex, endIndex)
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hashtags Rankings</CardTitle>
        <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardHeader>
      <CardContent className="h-[400px] flex flex-col">
        <ul className="space-y-2 overflow-auto flex-1 mb-30">
          {getCurrentPageData().map((hashtag, index) => (
            <li 
              key={index} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium w-5">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
                <Badge variant="secondary" className="text-base font-semibold">
                  {hashtag.tag}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(hashtag.count)} mentions
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-2 border-t mt-auto pb-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </>
  )
} 