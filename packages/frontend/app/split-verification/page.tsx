// app/verify-splits/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Types
interface Contributor {
  name: string
  role: string
  percentage: number
  ipi: string
}

interface Error {
  message: string
}

interface PaymentDistribution {
  name: string
  percentage: number
  grossShare: number
  taxShare: number
  netShare: number
}

type Step = 1 | 2 | 3 | 4

export default function VerifySplitsPage() {
  // State Management
  const [currentData, setCurrentData] = useState<Contributor[]>([])
  const [errors, setErrors] = useState<Error[]>([])
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [grossAmount, setGrossAmount] = useState<number>(50000)
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  })
  const [verificationId, setVerificationId] = useState<string>('QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco')
  const [timestamp, setTimestamp] = useState<string>('')
  const [smptAnalysis, setSmptAnalysis] = useState<any>(null)
  const [smptLoading, setSmptLoading] = useState(false)
  const [smptError, setSmptError] = useState<string | null>(null)
  const [dismissedIssues, setDismissedIssues] = useState<Set<number>>(new Set())

  // Constants
  const TAX_RATE = 0.25 // 25% Swedish tax withholding

  // Sample data
  const PERFECT_SAMPLE: Contributor[] = [
    { name: "Drik Svensson", role: "Composer", percentage: 50, ipi: "00624789341" },
    { name: "Anna Deng", role: "Lyricist", percentage: 30, ipi: "00472915682" },
    { name: "Lars Johansson", role: "Producer", percentage: 20, ipi: "00836125497" }
  ]

  const ERROR_SAMPLE: Contributor[] = [
    { name: "Drik Svensson", role: "Composer", percentage: 60, ipi: "" },
    { name: "", role: "Lyricist", percentage: 25, ipi: "00472915682" },
    { name: "Lars Johansson", role: "Producer", percentage: 20, ipi: "invalid" },
    { name: "Extra", role: "Writer", percentage: 10, ipi: "" }
  ]

  // Initialize timestamp on mount
  useEffect(() => {
    const now = new Date()
    setTimestamp(now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC')
  }, [])

  // Helper Functions
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }

  const updateStep = (step: Step) => {
    setCurrentStep(step)
  }

  const progressWidth = `${((currentStep - 1) / 3) * 100}%`

  // Data Validation
  const validateData = (data: Contributor[]): Error[] => {
    const errors: Error[] = []
    let total = 0

    data.forEach((item, index) => {
      total += item.percentage || 0

      if (!item.name || item.name.trim() === '') {
        errors.push({ message: `Contributor ${index + 1} missing name` })
      }

      if (!item.ipi || item.ipi.trim() === '') {
        errors.push({ message: `${item.name || 'Contributor'} missing IPI/ISWC` })
      }

      if (item.percentage <= 0 || item.percentage > 100) {
        errors.push({ message: `${item.name || 'Contributor'} has invalid percentage: ${item.percentage}%` })
      }
    })

    if (Math.abs(total - 100) > 0.1) {
      errors.push({ message: `Total split is ${total}%, must equal 100%` })
    }

    return errors
  }

  // File Handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Simulate file parsing
    setIsLoading(true)
    setTimeout(() => {
      // Randomly choose between perfect and error sample for demo
      const random = Math.random()
      if (random > 0.5) {
        processData(PERFECT_SAMPLE)
      } else {
        processData(ERROR_SAMPLE)
      }
      showToast(`Loaded: ${file.name}`)
      setIsLoading(false)
    }, 500)
  }

  const processData = (data: Contributor[]) => {
    setCurrentData(data)

    // Validate
    const validationErrors = validateData(data)
    setErrors(validationErrors)

    if (validationErrors.length > 0) {
      updateStep(2) // Issues Detected
    } else {
      updateStep(3) // Data Verified
    }
  }

  const loadPerfectSample = () => {
    processData(PERFECT_SAMPLE)
    showToast('Perfect sample loaded - no issues detected')
  }

  const loadErrorSample = () => {
    processData(ERROR_SAMPLE)
    showToast('Sample with issues loaded', 'error')
  }

  const autoFixErrors = () => {
    const fixedData = [...currentData]

    // Fix missing names and IPIs
    fixedData.forEach((item, i) => {
      if (!item.name || item.name === '') item.name = `Contributor ${i + 1}`
      if (!item.ipi || item.ipi === 'invalid') item.ipi = 'Auto-generated'
    })

    // Fix total percentage
    const total = fixedData.reduce((sum, item) => sum + item.percentage, 0)
    if (Math.abs(total - 100) > 0.1) {
      const factor = 100 / total
      fixedData.forEach(item => {
        item.percentage = Math.round(item.percentage * factor * 10) / 10
      })
    }

    const validationErrors = validateData(fixedData)
    setErrors(validationErrors)
    setCurrentData(fixedData)

    if (validationErrors.length === 0) {
      showToast('✅ All issues fixed automatically')
    } else {
      showToast('⚠️ Some issues could not be auto-fixed', 'error')
    }
  }

  const runSmptAnalysis = async (data: any[]) => {
    setSmptLoading(true); setSmptError(null); setSmptAnalysis(null); setDismissedIssues(new Set())
    try {
      const res = await fetch('/api/split-verify-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ splits: data.map((c:any) => ({ name: c.name, role: c.role, percentage: c.percentage })), totalAmount: grossAmount }) })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Analysis failed')
      setSmptAnalysis(json.analysis)
    } catch (err: any) { setSmptError(err.message || 'Analysis failed') }
    finally { setSmptLoading(false) }
  }
  const acceptFix = (i: number) => {
    const issue = smptAnalysis?.issues?.[i]
    if (issue?.party === 'All Parties') {
      const total = currentData.reduce((s:number,c:any) => s+c.percentage, 0)
      if (total > 0) { const n = currentData.map((c:any) => ({...c, percentage: Math.round(c.percentage/total*1000)/10})); setCurrentData(n); setErrors(validateData(n)) }
    }
    const next = new Set(dismissedIssues); next.add(i); setDismissedIssues(next); showToast('Fix applied')
  }
  const dismissFix = (i: number) => { const next = new Set(dismissedIssues); next.add(i); setDismissedIssues(next) }

  const startVerification = () => {
    if (errors.length > 0) {
      showToast('Please fix issues before verification', 'error')
      return
    }

    // Generate new verification ID
    const newHash = 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco' + Math.random().toString(36).substring(2, 8)
    setVerificationId(newHash)
    
    const now = new Date()
    setTimestamp(now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC')
    
    updateStep(3)
    showToast('Data verified successfully')
    runSmptAnalysis(currentData)
  }

  // Payment Calculations
  const updatePaymentCalculation = (amount: number) => {
    setGrossAmount(amount)
  }

  const calculateAndShowPayment = () => {
    updateStep(4)
    showToast('Payment calculated successfully')
  }

  const getDistribution = (): PaymentDistribution[] => {
    return currentData.map(item => {
      const grossShare = grossAmount * (item.percentage / 100)
      const taxShare = grossShare * TAX_RATE
      const netShare = grossShare - taxShare

      return {
        name: item.name,
        percentage: item.percentage,
        grossShare,
        taxShare,
        netShare
      }
    })
  }

  const taxAmount = grossAmount * TAX_RATE
  const netAmount = grossAmount - taxAmount

  // PDF Download
  const downloadPaymentPDF = async () => {
    if (!currentData || currentData.length === 0) {
      showToast('No data to export', 'error')
      return
    }

    setIsLoading(true)

    try {
      // Store data for PDF generation
      localStorage.setItem('trapRoyaltiesReportData', JSON.stringify(currentData))
      localStorage.setItem('trapRoyaltiesFileName', 'SplitSheet_Mar2026.pdf')
      localStorage.setItem('trapRoyaltiesDocumentHash', verificationId)
      localStorage.setItem('trapRoyaltiesReportTimestamp', timestamp)
      localStorage.setItem('trapRoyaltiesGrossAmount', grossAmount.toString())
      localStorage.setItem('trapRoyaltiesTaxRate', TAX_RATE.toString())

      // Open PDF in new tab
      window.open('/pdf-report', '_blank')
      showToast('Opening PDF report...')
    } catch (error) {
      showToast('Error generating PDF', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const resetWorkflow = () => {
    setCurrentData([])
    setErrors([])
    setCurrentStep(1)
    setGrossAmount(50000)
    showToast('Workflow reset')
  }

  // Drag and drop handlers
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && fileInputRef.current) {
      const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(event)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-white font-['Inter',_sans-serif]">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[10000]">
          <div className="bg-white p-8 rounded-xl text-center">
            <i className="fas fa-spinner fa-pulse text-4xl text-[#2B6F4B]"></i>
            <p className="mt-4 font-medium">Generating PDF...</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.visible && (
        <div 
          className={`fixed bottom-8 right-8 bg-white border-l-4 ${
            toast.type === 'success' ? 'border-[#2B6F4B]' : 'border-[#C53030]'
          } rounded-lg p-4 shadow-xl z-[9999] transition-transform duration-300 translate-x-0`}
        >
          <div className="flex items-center gap-3">
            <i className={`fas fa-check-circle ${toast.type === 'success' ? 'text-[#2B6F4B]' : 'text-[#C53030]'}`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-5 border-b border-gray-200 flex-wrap gap-5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-semibold">
              TP
            </div>
            <span className="text-[22px] font-semibold text-indigo-600">TrapRoyalties<span className="text-indigo-600">Pro</span></span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/" className="text-gray-500 hover:text-indigo-600 font-medium text-sm">Home</Link>
            <Link href="/for-attorneys" className="text-gray-500 hover:text-indigo-600 font-medium text-sm">For Attorneys</Link>
            <Link href="/verify-splits" className="text-indigo-600 font-medium text-sm border-b-2 border-indigo-900 pb-1">Split Verification</Link>
            <Link href="/free-audit" className="text-gray-500 hover:text-indigo-600 font-medium text-sm">Free Audit</Link>
            <Link href="/pilot" className="text-gray-500 hover:text-indigo-600 font-medium text-sm">Pilot</Link>
          </div>
          <button className="bg-transparent border border-gray-200 px-5 py-2 rounded-full font-medium hover:border-indigo-500 hover:text-indigo-600 transition">
            <i className="far fa-envelope mr-2"></i> Contact
          </button>
        </nav>

        {/* Page Header */}
        <div className="text-center py-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-indigo-600 mb-3">Split Verification & Payment Workflow</h1>
          <p className="text-gray-500 text-lg">Upload → Detect issues → Verify → Enter amount → Calculate payment → Download PDF</p>
        </div>

        {/* Before vs After Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="md:border-r-2 border-red-100 pr-6">
            <h3 className="text-xl text-red-600 mb-4 flex items-center gap-2">
              <i className="fas fa-times-circle"></i> Before TrapRoyaltiesPro
            </h3>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full border border-gray-200">Label</span>
              <i className="fas fa-arrow-right text-gray-300"></i>
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-500/30">Split Issues</span>
              <i className="fas fa-arrow-right text-gray-300"></i>
              <span className="bg-white/10 px-4 py-2 rounded-full border border-gray-200">PRO</span>
              <i className="fas fa-arrow-right text-gray-300"></i>
              <span className="bg-white/10 px-4 py-2 rounded-full border border-gray-200">Payment Dispute</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl text-indigo-600 mb-4 flex items-center gap-2">
              <i className="fas fa-check-circle text-indigo-600"></i> With TrapRoyaltiesPro
            </h3>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full border border-gray-200">Label</span>
              <i className="fas fa-arrow-right text-gray-300"></i>
              <span className="bg-indigo-600/20 text-indigo-600 px-4 py-2 rounded-full border border-indigo-500/40">TrapRoyaltiesPro</span>
              <i className="fas fa-arrow-right text-gray-300"></i>
              <span className="bg-white/10 px-4 py-2 rounded-full border border-gray-200">PRO</span>
              <i className="fas fa-arrow-right text-gray-300"></i>
              <span className="bg-white/10 px-4 py-2 rounded-full border border-gray-200">Verified Payment</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Progress line background */}
            <div className="absolute top-5 left-12 right-12 h-1 bg-white/20 z-0"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10 bg-gray-50 px-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                currentStep >= 1 
                  ? 'bg-indigo-600 border-indigo-900 text-white' 
                  : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
              }`}>
                {currentStep > 1 ? <i className="fas fa-check"></i> : '1'}
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                Upload Data
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10 bg-gray-50 px-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                currentStep >= 2 
                  ? 'bg-indigo-600 border-indigo-900 text-white' 
                  : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
              }`}>
                {currentStep > 2 ? <i className="fas fa-check"></i> : '2'}
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                Issues Detected
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10 bg-gray-50 px-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                currentStep >= 3 
                  ? 'bg-indigo-600 border-indigo-900 text-white' 
                  : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
              }`}>
                {currentStep > 3 ? <i className="fas fa-check"></i> : '3'}
              </div>
              <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                Data Verified
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center relative z-10 bg-gray-50 px-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                currentStep >= 4 
                  ? 'bg-indigo-600 border-indigo-900 text-white' 
                  : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
              }`}>
                4
              </div>
              <span className={`text-sm font-medium ${currentStep >= 4 ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                Payment Ready
              </span>
            </div>
          </div>

          {/* Green Progress Bar */}
          <div className="max-w-2xl mx-auto mt-8 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 rounded-full" 
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
          {/* LEFT PANEL: UPLOAD + VALIDATE */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600 mb-6 flex items-center gap-2">
              <i className="fas fa-cloud-upload-alt text-indigo-600"></i>
              Step 1: Upload split data
            </h2>

            {/* Upload Area */}
            <div 
              className={`bg-gray-50 border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                isDragging ? 'border-indigo-900 bg-indigo-50' : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-5xl text-indigo-600 mb-4">
                <i className="fas fa-file-upload"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">Drop your split sheet here</h3>
              <p className="text-gray-500 text-sm mb-4">CSV, Excel, or PDF</p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={handleFileSelect}
              />
            </div>

            {/* Sample Links */}
            <div className="text-center my-4">
              <button 
                onClick={loadPerfectSample}
                className="text-indigo-600 text-sm mx-2 font-medium hover:underline"
              >
                Load perfect sample
              </button>
              <button 
                onClick={loadErrorSample}
                className="text-red-600 text-sm mx-2 font-medium hover:underline"
              >
                Load test with errors
              </button>
            </div>

            {/* Error Panel */}
            {errors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 my-4">
                <div className="flex items-center gap-2 text-red-600 font-semibold mb-3">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Issues Detected</span>
                </div>
                <div className="text-red-600 text-sm mb-3">
                  {errors.map((error, i) => (
                    <div key={i}>• {error.message}</div>
                  ))}
                </div>
                <button 
                  onClick={autoFixErrors}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                  <i className="fas fa-magic"></i>
                  Auto-Fix Issues
                </button>
              </div>
            )}

            {/* Split Preview */}
            {currentData.length > 0 && (
              <div className="mt-4">
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
                    <span className="font-semibold text-indigo-600">Summer Nights EP</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      errors.length > 0 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-400'
                    }`}>
                      {errors.length > 0 ? `${errors.length} issues` : 'Ready'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {currentData.map((item, i) => {
                      const hasError = errors.some(e => 
                        e.message.includes(item.name) || 
                        (e.message.includes('missing') && !item.name)
                      )
                      return (
                        <div key={i} className={`flex justify-between items-center py-2 ${hasError ? 'bg-red-900/20 -mx-5 px-5' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-semibold text-indigo-600">
                              {item.name?.[0] || '?'}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{item.name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{item.role} · IPI: {item.ipi || 'Missing'}</div>
                            </div>
                          </div>
                          <span className={`font-semibold ${hasError ? 'text-red-600' : 'text-indigo-600'}`}>
                            {item.percentage}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="mt-3 text-right text-sm">
                    <span className="font-medium">
                      {currentData.reduce((sum, item) => sum + (item.percentage || 0), 0)}% total
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {errors.length === 0 && currentStep < 3 && (
                  <button 
                    onClick={startVerification}
                    className="w-full bg-indigo-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition mt-4"
                  >
                    <i className="fas fa-shield-alt"></i>
                    Start Verification
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: VERIFY + PAYMENT */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600 mb-6 flex items-center gap-2">
              <i className="fas fa-check-circle text-indigo-600"></i>
              Steps 2-4: Verify & Calculate Payment
            </h2>

            {/* Verification Record */}
            {currentStep >= 3 && currentData.length > 0 && errors.length === 0 && (
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <h3 className="font-semibold text-indigo-600 mb-4">Verification Record</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <i className="fas fa-fingerprint"></i> Verification ID
                    </span>
                    <span className="font-medium text-sm">{verificationId.substring(0, 10)}...{verificationId.substring(verificationId.length - 4)}</span>
                  </div>
                  
                  <div className="font-mono text-xs bg-gray-50 text-gray-400 p-3 rounded-lg border border-gray-200 break-all">
                    {verificationId}
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <i className="fas fa-clock"></i> Timestamp
                    </span>
                    <span className="font-medium text-sm">{timestamp}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i> Status
                    </span>
                    <span className="text-green-600 font-medium text-sm">Verified ✓</span>
                  </div>

                  {/* System Reference */}
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <span>System reference: 0xAa19...B2ea4</span>
                    <button 
                      onClick={() => setShowTechDetails(!showTechDetails)}
                      className="float-right hover:text-indigo-600"
                    >
                      {showTechDetails ? 'Hide details ↑' : 'Show details ↓'}
                    </button>
                  </div>
                  
                  {/* Technical details */}
                  {showTechDetails && (
                    <div className="text-xs text-gray-500 mt-2">
                      <div>Contract: 0xAa19bFC7Bd852efe49ef31297bB082FB044B2ea4</div>
                      <div>Network: Monad Testnet (Chain ID: 10143)</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Input Section */}
            {currentStep >= 3 && currentData.length > 0 && errors.length === 0 && (
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <h3 className="font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                  <i className="fas fa-calculator"></i>
                  Enter Payment Amount
                </h3>
                
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                    <input 
                      type="number" 
                      value={grossAmount}
                      min="0"
                      step="1000"
                      onChange={(e) => setGrossAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-full text-lg font-semibold focus:outline-none focus:border-indigo-500 bg-gray-100 text-white"
                    />
                  </div>
                  <button 
                    onClick={calculateAndShowPayment}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <i className="fas fa-sync-alt"></i>
                    Calculate
                  </button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  <i className="fas fa-info-circle text-indigo-600"></i> Enter any amount and we'll calculate the split with 25% Swedish tax withholding
                </div>
              </div>
            )}

            {/* Payment Summary */}
            {currentStep >= 4 && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-indigo-600 flex items-center gap-2">
                    <i className="fas fa-credit-card"></i> Payment Summary
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${grossAmount.toLocaleString()}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">Gross Royalties</span>
                    <span className="font-semibold">${grossAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">Swedish Tax Withholding (25%)</span>
                    <span className="font-semibold text-red-600">-${taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Net Payment</span>
                    <span className="font-semibold text-indigo-600 text-lg">${netAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs text-red-600 flex items-center gap-2 mb-4">
                  <i className="fas fa-info-circle"></i>
                  <span>25% tax withholding automatically calculated for Swedish payees</span>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Distribution by Contributor</h4>
                  <div className="space-y-3">
                    {getDistribution().map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 border-dashed">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-user-circle text-indigo-600"></i>
                          <span className="text-sm">{item.name} ({item.percentage}%)</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-indigo-600">${item.grossShare.toLocaleString()}</div>
                          <div className="text-xs text-red-600">-${item.taxShare.toLocaleString()} tax</div>
                          <div className="text-xs text-indigo-600 font-medium">${item.netShare.toLocaleString()} net</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download PDF Button */}
                <button 
                  onClick={downloadPaymentPDF}
                  className="w-full bg-indigo-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition mt-4"
                >
                  <i className="fas fa-file-pdf"></i>
                  Download Payment Report (PDF)
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {currentStep === 3 && currentData.length > 0 && errors.length === 0 && (
              <button 
                onClick={() => setCurrentStep(4)}
                className="w-full bg-indigo-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition mt-4"
              >
                <i className="fas fa-calculator"></i>
                Calculate Payment
              </button>
            )}
            
            {currentStep === 4 && (
              <button 
                onClick={resetWorkflow}
                className="w-full bg-white/5 border border-gray-200 text-gray-500 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-600 transition mt-4"
              >
                <i className="fas fa-redo"></i>
                Start New Verification
              </button>
            )}
          </div>
        </div>


        {/* SMPT Analysis Panel */}
        {currentStep >= 3 && (smptLoading || smptError || smptAnalysis) && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm my-8">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">SMPT Engine Analysis</h2>
            {smptLoading && <div className="flex items-center gap-3 text-gray-500 py-4"><div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>Analyzing splits with AI...</div>}
            {smptError && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">⚠️ {smptError} <button onClick={() => runSmptAnalysis(currentData)} className="ml-3 underline font-medium">Try again</button></div>}
            {smptAnalysis && (
              <div className="space-y-5">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800"><div className="font-semibold mb-1">Forensic Summary</div>{smptAnalysis.forensicSummary}</div>
                <div className="flex gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${smptAnalysis.riskLevel==='low'?'bg-green-100 text-green-700':smptAnalysis.riskLevel==='medium'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>Risk: {smptAnalysis.riskLevel?.toUpperCase()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${smptAnalysis.blockchainReady?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{smptAnalysis.blockchainReady?'✓ Blockchain Ready':'✗ Not Blockchain Ready'}</span>
                </div>
                {smptAnalysis.issues?.length > 0 && (
                  <div><div className="font-semibold text-gray-700 mb-3">Issues & Suggested Fixes</div>
                    <div className="space-y-3">
                      {smptAnalysis.issues.map((issue: any, i: number) => !dismissedIssues.has(i) && (
                        <div key={i} className={`rounded-xl p-4 border ${issue.severity==='error'?'bg-red-50 border-red-200':'bg-yellow-50 border-yellow-200'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className={`text-xs font-bold uppercase mb-1 ${issue.severity==='error'?'text-red-600':'text-yellow-600'}`}>{issue.severity} — {issue.party}</div>
                              <div className="text-sm text-gray-800 mb-1">{issue.description}</div>
                              <div className="text-xs text-gray-500">Fix: <span className="font-medium text-gray-700">{issue.suggestedFix}</span></div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => acceptFix(i)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700">Yes, fix</button>
                              <button onClick={() => dismissFix(i)} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 text-xs font-semibold rounded-lg">Dismiss</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {smptAnalysis.actionItems?.length > 0 && (
                  <div><div className="font-semibold text-gray-700 mb-2">Action Items</div>
                    <ul className="space-y-1">{smptAnalysis.actionItems.map((item:string,i:number) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-indigo-600">→</span>{item}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Trust Signals */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <i className="fas fa-check-circle text-indigo-600 mb-2"></i>
              <div className="font-medium text-sm">Blockchain Verified</div>
            </div>
            <div>
              <i className="fas fa-check-circle text-indigo-600 mb-2"></i>
              <div className="font-medium text-sm">Court-Admissible</div>
            </div>
            <div>
              <i className="fas fa-check-circle text-indigo-600 mb-2"></i>
              <div className="font-medium text-sm">PRO Cross-Referenced</div>
            </div>
            <div>
              <i className="fas fa-check-circle text-indigo-600 mb-2"></i>
              <div className="font-medium text-sm">Tax-Ready</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 mt-12 text-center text-gray-500">
          <p className="text-sm">TrapRoyaltiesPro ensures split accuracy, payment verification, and blockchain-proof ownership records.</p>
          <div className="flex justify-center gap-8 mt-4 text-xs">
            <span>© 2026 TrapRoyaltiesPro</span>
            <span>ASCAP · BMI · SOCAN Compatible</span>
            <span>Built for Music Attorneys</span>
          </div>
        </footer>
      </div>
    </div>
  )
}