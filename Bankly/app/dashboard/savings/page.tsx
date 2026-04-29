'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, TrendingUp, Check } from 'lucide-react';
import Link from 'next/link';
import {
  addToSavings,
  createSavingsGoal,
  getUserData,
  UserData,
} from '@/lib/dashboard-utils';

export default function SavingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'goal'>(
    'overview'
  );
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Add to savings form
  const [addForm, setAddForm] = useState({ amount: '', description: '' });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Create goal form
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });
  const [goalErrors, setGoalErrors] = useState<Record<string, string>>({});
  const [goalSubmitting, setGoalSubmitting] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    setLoading(false);
  }, []);

  const handleAddToSavings = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(addForm.amount);
    if (!addForm.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Enter a valid amount';
    } else if (userData && amount > userData.balance) {
      newErrors.amount = 'Insufficient funds';
    }

    if (!addForm.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setAddErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setAddSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updated = addToSavings(amount, addForm.description);
    setUserData(updated);
    setSuccess(true);
    setSuccessMessage(`$${amount.toFixed(2)} added to savings!`);
    setAddForm({ amount: '', description: '' });
    setAddSubmitting(false);

    setTimeout(() => setSuccess(false), 2000);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!goalForm.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    const targetAmount = parseFloat(goalForm.targetAmount);
    if (!goalForm.targetAmount || isNaN(targetAmount) || targetAmount <= 0) {
      newErrors.targetAmount = 'Enter a valid amount';
    }

    if (!goalForm.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setGoalErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setGoalSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updated = createSavingsGoal(
      goalForm.name,
      targetAmount,
      goalForm.deadline
    );
    setUserData(updated);
    setSuccess(true);
    setSuccessMessage(`Savings goal "${goalForm.name}" created!`);
    setGoalForm({ name: '', targetAmount: '', deadline: '' });
    setGoalSubmitting(false);

    setTimeout(() => setSuccess(false), 2000);
  };

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const totalGoalTarget = userData.savingsGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const totalGoalProgress = userData.savingsGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

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
          <h1 className="text-3xl font-bold">Savings</h1>
          <p className="text-muted-foreground">
            Manage your savings and goals
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Main Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold opacity-90">
              Total Savings Balance
            </h2>
            <TrendingUp className="w-6 h-6 opacity-60" />
          </div>
          <div className="text-4xl font-bold">
            ${userData.savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm opacity-80">
            Main balance: $
            {userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {(['overview', 'add', 'goal'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === tab
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'add' && 'Add to Savings'}
            {tab === 'goal' && 'Create Goal'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {userData.savingsGoals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Goal Target
                  </p>
                  <p className="text-2xl font-bold">
                    ${totalGoalTarget.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-4 bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Progress
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ${totalGoalProgress.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-4 bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">
                    Progress %
                  </p>
                  <p className="text-2xl font-bold">
                    {(
                      (totalGoalProgress / totalGoalTarget) *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                </Card>
              </div>

              {/* Goals List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Your Savings Goals</h2>
                {userData.savingsGoals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <Card key={goal.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{goal.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            Deadline: {goal.deadline}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            ${goal.currentAmount.toFixed(2)} / $
                            {goal.targetAmount.toFixed(2)}
                          </span>
                          <span className="font-semibold">{progress.toFixed(0)}%</span>
                        </div>

                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t created any savings goals yet.
              </p>
              <Button
                onClick={() => setActiveTab('goal')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Goal
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Add to Savings Tab */}
      {activeTab === 'add' && (
        <Card className="p-6">
          {success && !successMessage.includes('goal') ? (
            <div className="py-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-600">
                Added to Savings!
              </h2>
              <p className="text-muted-foreground">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleAddToSavings} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={addForm.amount}
                  onChange={(e) =>
                    setAddForm({ ...addForm, amount: e.target.value })
                  }
                  className={addErrors.amount ? 'border-red-500' : ''}
                />
                {addErrors.amount && (
                  <p className="text-sm text-red-500">{addErrors.amount}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={addSubmitting}
                className="w-full mt-6"
              >
                {addSubmitting ? 'Adding...' : 'Add to Savings'}
              </Button>
            </form>
          )}
        </Card>
      )}

      {/* Create Goal Tab */}
      {activeTab === 'goal' && (
        <Card className="p-6">
          {success && successMessage.includes('goal') ? (
            <div className="py-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-600">
                Goal Created!
              </h2>
              <p className="text-muted-foreground">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleCreateGoal} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Name</label>
                <Input
                  placeholder="e.g., Vacation Fund"
                  value={goalForm.name}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, name: e.target.value })
                  }
                  className={goalErrors.name ? 'border-red-500' : ''}
                />
                {goalErrors.name && (
                  <p className="text-sm text-red-500">{goalErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Amount (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={goalForm.targetAmount}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      targetAmount: e.target.value,
                    })
                  }
                  className={goalErrors.targetAmount ? 'border-red-500' : ''}
                />
                {goalErrors.targetAmount && (
                  <p className="text-sm text-red-500">
                    {goalErrors.targetAmount}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, deadline: e.target.value })
                  }
                  className={goalErrors.deadline ? 'border-red-500' : ''}
                />
                {goalErrors.deadline && (
                  <p className="text-sm text-red-500">{goalErrors.deadline}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={goalSubmitting}
                className="w-full mt-6"
              >
                {goalSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
