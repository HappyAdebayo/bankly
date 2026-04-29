'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { addTransaction, updateUserBalance, getUserData, UserData, fetchUserData } from '@/lib/dashboard-utils';

export default function WithdrawPage() {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'atm' as 'atm' | 'bank-transfer' | 'check',
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [apiError, setApiError] = useState<string | null>(null);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Enter a valid amount';
    } else if (userData && amount > userData.balance) {
      newErrors.amount = 'Insufficient funds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      const token = sessionStorage.getItem('bankly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/accounts/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Withdrawal failed');
      }

      setSuccess(true);
      // Refresh user data to update balance
      await fetchUserData();
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({ amount: '', method: 'atm' });
      setSuccess(false);
    }, 2000);
  };

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const methodLabels: Record<string, string> = {
    atm: 'ATM Withdrawal',
    'bank-transfer': 'Bank Transfer',
    check: 'Check',
  };

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
        <div>
          <h1 className="text-3xl font-bold">Withdraw Money</h1>
          <p className="text-muted-foreground">Withdraw from your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-600">
                  Withdrawal Successful!
                </h2>
                <p className="text-muted-foreground">
                  ${parseFloat(formData.amount).toFixed(2)} has been withdrawn
                  via {methodLabels[formData.method]}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {apiError && (
                  <div className="p-3 text-sm font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                    {apiError}
                  </div>
                )}
                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6"
                >
                  {submitting ? 'Processing...' : 'Withdraw Now'}
                </Button>
              </form>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
