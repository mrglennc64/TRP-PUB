'use client';

import { useState } from 'react';
import { blockchainSeal } from '@/lib/blockchain/seal';

interface BlockchainSealProps {
  documentContent: string;
  documentName: string;
  caseNumber?: string;
  onSealed?: (data: any) => void;
}

export default function BlockchainSeal({ 
  documentContent, 
  documentName, 
  caseNumber,
  onSealed 
}: BlockchainSealProps) {
  const [sealing, setSealing] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [sealData, setSealData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeal = async () => {
    setSealing(true);
    setError(null);

    try {
      const result = await blockchainSeal.sealDocument(documentContent, {
        documentName,
        caseNumber,
        timestamp: new Date().toISOString(),
        generator: 'TrapRoyalties Pro'
      });

      if (result.success) {
        setSealed(true);
        setSealData(result);
        if (onSealed) onSealed(result);
      } else {
        setError(result.error || 'Failed to seal document');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSealing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Blockchain e-Seal (2025 Compliant)</h3>
          <p className="text-sm text-gray-500">Meets PRC Electronic Signature Law requirements for music contracts</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded-full">🇨🇳 NCAC APPROVED</span>
          <span className="text-xs text-amber-700">Monad Blockchain</span>
        </div>
        <p className="text-sm text-amber-800">
          This e-seal meets the 2025 PRC Electronic Signature Law requirements for music industry contracts.
          Legally binding in all Chinese courts.
        </p>
      </div>

      {sealed && sealData ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-green-700">Document Sealed Successfully</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Document Hash:</span>
                <span className="font-mono text-xs">{sealData.documentHash?.slice(0, 20)}...{sealData.documentHash?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction:</span>
                <span className="font-mono text-xs">{sealData.transactionHash?.slice(0, 20)}...{sealData.transactionHash?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Block:</span>
                <span className="font-medium">{sealData.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span className="font-medium">{sealData.timestamp?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.open(`https://explorer.monad.io/tx/${sealData.transactionHash}`, '_blank')}
            className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            View on Blockchain Explorer
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleSeal}
            disabled={sealing}
            className="w-full py-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {sealing ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Sealing on Blockchain...</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>Apply Blockchain e-Seal</span>
              </>
            )}
          </button>
        </>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ESIGN Act ✓</span>
          <span>eIDAS ✓</span>
          <span>PRC 2025 ✓</span>
        </div>
      </div>
    </div>
  );
}