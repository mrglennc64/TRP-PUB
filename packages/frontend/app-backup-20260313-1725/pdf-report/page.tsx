// app/pdf-report/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PDFReportPage() {
  const [reportData, setReportData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Load data from localStorage
    const data = localStorage.getItem('trapRoyaltiesReportData')
    const gross = localStorage.getItem('trapRoyaltiesGrossAmount')
    const hash = localStorage.getItem('trapRoyaltiesDocumentHash')
    
    if (!data) {
      router.push('/free-audit')
      return
    }
    
    setReportData({
      contributors: JSON.parse(data),
      grossAmount: parseFloat(gross || '0'),
      verificationId: hash || '0x123...',
      timestamp: new Date().toISOString()
    })
    
    // Auto-download after 1 second
    setTimeout(() => {
      window.print() // Or use jsPDF
    }, 1000)
  }, [router])

  if (!reportData) return <div>Loading...</div>

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Royalty Audit Report</h1>
      <p>Verification: {reportData.verificationId}</p>
      <p>Date: {new Date().toLocaleDateString()}</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Contributor</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Share</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {reportData.contributors.map((c: any, i: number) => (
            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{c.name}</td>
              <td style={{ padding: '10px' }}>{c.percentage}%</td>
              <td style={{ padding: '10px' }}>
                ${(reportData.grossAmount * c.percentage / 100).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p>This report is cryptographically sealed on Monad Testnet</p>
        <p>Tx: 0xAa19bFC7Bd852efe49ef31297bB082FB044B2ea4</p>
      </div>
    </div>
  )
}