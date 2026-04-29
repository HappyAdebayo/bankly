'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Wallet } from 'lucide-react';
import { fetchUserData, getUserData, UserData } from '@/lib/dashboard-utils';

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
        // Fallback to local data if fetch fails (e.g. offline)
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

  const kycStatusColor =
    userData.kycStatus === 'verified'
      ? 'bg-green-100 text-green-800'
      : userData.kycStatus === 'rejected'
        ? 'bg-red-100 text-red-800'
        : userData.kycStatus === 'not created'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">
          {userData.accountName} • {userData.email}
        </p>
      </div>

      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold opacity-90">
                Account Balance
              </h2>
              <Wallet className="w-6 h-6 opacity-60" />
            </div>
            <div className="text-4xl font-bold">
              ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-sm opacity-80 border-t border-primary-foreground/20 pt-4">
              <span>Account: {userData.accountNumber}</span>
            </div>
          </div>
        </Card>

        {/* Quick Stats Card */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Stats</h2>

          <div className="space-y-3">
            {/* KYC Status */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">KYC Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${kycStatusColor}`}
              >
                {userData.kycStatus === 'not created' ? 'Not Started' : userData.kycStatus}
              </span>
            </div>

            {/* Savings */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Savings Balance
              </span>
              <span className="font-semibold text-accent">
                ${userData.savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Recent Transactions */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Recent Transactions</span>
              <span className="font-semibold">
                {userData.transactions.length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/transfer" className="block">
          <Button className="w-full h-auto py-6 flex items-center justify-between px-6 bg-primary hover:bg-primary/90">
            <div className="text-left">
              <div className="font-semibold">Transfer Money</div>
              <div className="text-sm opacity-75">Send to another account</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        <Link href="/dashboard/withdraw" className="block">
          <Button className="w-full h-auto py-6 flex items-center justify-between px-6 bg-accent hover:bg-accent/90 text-accent-foreground">
            <div className="text-left">
              <div className="font-semibold">Withdraw Money</div>
              <div className="text-sm opacity-75">Withdraw from account</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Recent Transactions Preview */}
      {userData.transactions.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {userData.transactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'deposit' ||
                      transaction.type === 'transfer'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'deposit' ||
                    transaction.type === 'transfer'
                      ? '+'
                      : '-'}
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
