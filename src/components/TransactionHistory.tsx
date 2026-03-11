import { Transaction } from '../lib/blockchain';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx._id} className="border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(tx.status)}
              <div>
                <p className="font-medium text-neutral-800 capitalize">{tx.type}</p>
                <p className="text-sm text-neutral-500">{tx.transactionId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-neutral-800">{tx.credits} credits</p>
              <p className="text-sm text-neutral-500 capitalize">{tx.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
