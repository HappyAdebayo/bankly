'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';
import { fetchUserData, getUserData, UserData, Transaction } from '@/lib/dashboard-utils';

export default function TransactionsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'transfer'>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        setUserData(getUserData());
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const filteredTransactions =
    filterType === 'all'
      ? userData.transactions
      : userData.transactions.filter((t) => t.type === filterType);

  const getTransactionIcon = (type: string) => {
    if (type === 'deposit') {
      return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    } else if (type === 'withdraw') {
      return <ArrowUpRight className="w-5 h-5 text-red-600" />;
    } else {
      return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    if (type === 'deposit') return 'text-green-600';
    if (type === 'withdraw') return 'text-red-600';
    return 'text-blue-600';
  };

  const totalDeposited = userData.transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = userData.transactions
    .filter((t) => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTransferred = userData.transactions
    .filter((t) => t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">View all your transactions</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm text-green-800 font-medium mb-1">Total Deposited</p>
          <p className="text-2xl font-bold text-green-600">
            ${totalDeposited.toFixed(2)}
          </p>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-800 font-medium mb-1">Total Withdrawn</p>
          <p className="text-2xl font-bold text-red-600">
            ${totalWithdrawn.toFixed(2)}
          </p>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-1">Total Transferred</p>
          <p className="text-2xl font-bold text-blue-600">
            ${totalTransferred.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
        {(['all', 'deposit', 'withdraw', 'transfer'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filterType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-foreground hover:bg-background/80'
            }`}
          >
            {type === 'all' && 'All Transactions'}
            {type === 'deposit' && 'Deposits'}
            {type === 'withdraw' && 'Withdrawals'}
            {type === 'transfer' && 'Transfers'}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <Card className="p-0 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p
                    className={`font-bold text-lg ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type === 'deposit'
                      ? '+'
                      : '-'}
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={`px-2 py-1 rounded-full inline-block ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">
              No transactions found for this filter.
            </p>
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-muted">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Total Transactions</p>
            <p className="text-3xl font-bold">{userData.transactions.length}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Net Change
            </p>
            <p className="text-3xl font-bold text-primary">
              ${(totalDeposited - totalWithdrawn - totalTransferred).toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
            <p className="text-3xl font-bold">
              ${userData.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
