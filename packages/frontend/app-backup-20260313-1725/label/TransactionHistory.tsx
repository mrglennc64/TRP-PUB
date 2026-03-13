'use client'

import { useAccount, usePublicClient } from 'wagmi'
import { useEffect, useState } from 'react'
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  type: 'incoming' | 'outgoing'
}

export default function TransactionHistory() {
  const { address, isConnected } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchTransactions() {
      if (!isConnected || !address || !publicClient) return

      setIsLoading(true)
      try {
        // This is a mock implementation - in production, you'd use an API like Etherscan
        const mockTxs: Transaction[] = [
          {
            hash: '0x1234...5678',
            from: address,
            to: '0xabcd...efgh',
            value: '100',
            timestamp: Date.now() - 3600000,
            type: 'outgoing',
          },
          {
            hash: '0x8765...4321',
            from: '0xefgh...abcd',
            to: address,
            value: '50',
            timestamp: Date.now() - 7200000,
            type: 'incoming',
          },
          {
            hash: '0x2468...1357',
            from: address,
            to: '0x9876...5432',
            value: '75',
            timestamp: Date.now() - 86400000,
            type: 'outgoing',
          },
        ]
        setTransactions(mockTxs)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [address, isConnected, publicClient])

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 text-center border-2 border-dashed border-gray-700">
        <p className="text-gray-400">Connect your wallet to view transactions</p>
      </div>
    )
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
      </div>

      <div className="divide-y divide-gray-700">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No transactions found</p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div key={index} className="p-4 hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    tx.type === 'incoming' 
                      ? 'bg-green-600/20 text-green-400' 
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {tx.type === 'incoming' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {tx.type === 'incoming' ? 'From' : 'To'}: {formatAddress(tx.type === 'incoming' ? tx.from : tx.to)}
                      </span>
                      <a
                        href={`https://testnet.monadexplorer.com/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <p className="text-xs text-gray-400">{formatTime(tx.timestamp)}</p>
                  </div>
                </div>
                <div className={`font-medium ${
                  tx.type === 'incoming' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tx.type === 'incoming' ? '+' : '-'}{tx.value} MON
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
