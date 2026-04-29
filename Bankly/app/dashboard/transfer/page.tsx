'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { addTransaction, updateUserBalance, getUserData, UserData, fetchUserData } from '@/lib/dashboard-utils';

export default function TransferPage() {
  const [formData, setFormData] = useState({
    recipientAccount: '',
    amount: '',
    description: '',
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

    if (!formData.recipientAccount.trim()) {
      newErrors.recipientAccount = 'Account number is required';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Enter a valid amount';
    } else if (userData && amount > userData.balance) {
      newErrors.amount = 'Insufficient funds';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/accounts/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to_account_number: formData.recipientAccount,
          amount: parseFloat(formData.amount),
          description: formData.description
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Transfer failed');
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
      setFormData({
        recipientAccount: '',
        amount: '',
        description: '',
      });
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
          <h1 className="text-3xl font-bold">Transfer Money</h1>
          <p className="text-muted-foreground">Send money to another account</p>
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
                  Transfer Successful!
                </h2>
                <p className="text-muted-foreground">
                  ${parseFloat(formData.amount).toFixed(2)} has been transferred to{' '}
                  {formData.recipientAccount}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {apiError && (
                  <div className="p-3 text-sm font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                    {apiError}
                  </div>
                )}
                {/* Account Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Recipient Account Number
                  </label>
                  <Input
                    placeholder="1234567890"
                    value={formData.recipientAccount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipientAccount: e.target.value,
                      })
                    }
                    className={errors.recipientAccount ? 'border-red-500' : ''}
                  />
                  {errors.recipientAccount && (
                    <p className="text-sm text-red-500">
                      {errors.recipientAccount}
                    </p>
                  )}
                </div>

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

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Payment for services"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6"
                >
                  {submitting ? 'Processing...' : 'Transfer Now'}
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-muted">
            <h2 className="font-semibold mb-4">Transaction Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Balance</span>
                <span className="font-semibold">
                  ${userData.balance.toFixed(2)}
                </span>
              </div>

              {formData.amount && (
                <>
                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-3">
                      <span className="text-muted-foreground">
                        Transfer Amount
                      </span>
                      <span className="text-red-600 font-semibold">
                        -${parseFloat(formData.amount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between bg-primary/10 p-2 rounded">
                      <span className="font-medium">New Balance</span>
                      <span className="font-bold text-primary">
                        $
                        {(
                          userData.balance - parseFloat(formData.amount)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
