// Example: DisputeBanner component
import { Dispute } from '../types/types';

interface DisputeBannerProps {
  dispute: Dispute;
}

export function DisputeBanner({ dispute }: DisputeBannerProps) {
  return (
    <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-2 rounded relative">
      <strong className="font-bold">Dispute:</strong> {dispute.id} - {dispute.status}
    </div>
  );
}
