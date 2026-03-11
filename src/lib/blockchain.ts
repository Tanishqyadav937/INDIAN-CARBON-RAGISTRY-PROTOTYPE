// Blockchain utilities - Type definitions

export interface Transaction {
  _id: string;
  transactionId: string;
  project: string;
  type: 'issuance' | 'transfer' | 'retirement' | 'cancellation';
  from?: string;
  to?: string;
  credits: number;
  pricePerCredit?: number;
  totalAmount?: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}
