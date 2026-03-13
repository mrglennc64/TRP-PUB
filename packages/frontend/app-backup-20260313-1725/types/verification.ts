export type SplitStatus = 'complete' | 'incomplete' | 'not_set' | 'disputed';

export interface TrackSplit {
  id: string;
  isrc: string;
  title: string;
  artist: string;
  rightsHolders: RightsHolder[];
  totalPercentage: number;
  status: SplitStatus;
  lastVerified?: Date;
  sourceStatement?: string; // PDF filename
}

export interface RightsHolder {
  name: string;
  role: 'artist' | 'producer' | 'writer' | 'publisher' | 'label';
  percentage: number;
  pro?: 'ASCAP' | 'BMI' | 'SESAC' | 'GMR' | 'None';
  ipi?: string; // International Publisher Identifier
  verified: boolean;
}
