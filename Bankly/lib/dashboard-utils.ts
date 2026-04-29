'use client';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface UserData {
  email: string;
  accountName: string;
  balance: number;
  accountNumber: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not created';
  kycDetails?: {
    fullName: string;
    idUploaded: boolean;
    submittedAt: string;
  };
  savingsBalance: number;
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];
}

const DEFAULT_USER_DATA: UserData = {
  email: 'user@bankly.com',
  accountName: 'John Doe',
  balance: 15250.50,
  accountNumber: '1234567890',
  kycStatus: 'pending',
  savingsBalance: 5000.00,
  savingsGoals: [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 5000,
      deadline: '2025-12-31',
    },
  ],
  transactions: [
    {
      id: '1',
      type: 'deposit',
      amount: 2500.0,
      date: '2024-04-15',
      status: 'completed',
      description: 'Monthly Salary',
    },
    {
      id: '2',
      type: 'withdraw',
      amount: 500.0,
      date: '2024-04-12',
      status: 'completed',
      description: 'ATM Withdrawal',
    },
    {
      id: '3',
      type: 'transfer',
      amount: 300.0,
      date: '2024-04-10',
      status: 'completed',
      description: 'Transfer to Savings',
    },
    {
      id: '4',
      type: 'deposit',
      amount: 150.0,
      date: '2024-04-08',
      status: 'completed',
      description: 'Refund',
    },
  ],
};

export async function fetchUserData(): Promise<UserData> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const token = sessionStorage.getItem('bankly_token');
  const userStr = sessionStorage.getItem('bankly_user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log('Dashboard API Response:', result);

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch dashboard data');
  }

  // Map backend data to UserData interface
  const data = result.data || {};
  const acct = data.account || {};

  let transactionsList: Transaction[] = [];
  if (data.transaction?.data) {
    data.transaction.data.forEach((item: any) => {
      // Direct transaction item
      if (item.type && item.amount) {
        transactionsList.push({
          id: item.id?.toString() || Math.random().toString(),
          type: item.type === 'withdrawal' ? 'withdraw' : item.type,
          amount: parseFloat(item.amount),
          date: (item.createdAt || item.created_at || new Date().toISOString()).split('T')[0],
          status: item.status === 'success' ? 'completed' : item.status,
          description: item.description || item.type,
        });
      }
      // Nested under account (User -> Account -> Transactions)
      else if (item.account?.transactions) {
        item.account.transactions.forEach((t: any) => {
          transactionsList.push({
            id: t.id?.toString() || Math.random().toString(),
            type: t.type === 'withdrawal' ? 'withdraw' : t.type,
            amount: parseFloat(t.amount),
            date: (t.createdAt || t.created_at || new Date().toISOString()).split('T')[0],
            status: t.status === 'success' ? 'completed' : t.status,
            description: t.description || t.type,
          });
        });
      }
    });
  }

  const mappedData: UserData = {
    email: data.userdetails?.email || user?.email || 'user@bankly.com',
    accountName: (data.userdetails?.email || user?.email || 'User').split('@')[0],
    balance: parseFloat(acct.acctBalance || data.savingBalance || 0),
    accountNumber: acct.acctNumber || 'N/A',
    kycStatus: data.kycStatus || 'pending',
    savingsBalance: parseFloat(data.savingBalance || 0),
    savingsGoals: [],
    transactions: transactionsList,
  };

  saveUserData(mappedData);
  return mappedData;
}

export function getUserData(): UserData {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_DATA;
  }

  const stored = sessionStorage.getItem('bankly_user_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USER_DATA;
    }
  }

  return DEFAULT_USER_DATA;
}

export function saveUserData(data: UserData): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('bankly_user_data', JSON.stringify(data));
  }
}

export function updateUserBalance(amount: number, type: 'add' | 'subtract'): UserData {
  const data = getUserData();
  if (type === 'add') {
    data.balance += amount;
  } else {
    data.balance -= amount;
  }
  saveUserData(data);
  return data;
}

export function addTransaction(
  type: 'deposit' | 'withdraw' | 'transfer',
  amount: number,
  description: string
): UserData {
  const data = getUserData();
  const transaction: Transaction = {
    id: Date.now().toString(),
    type,
    amount,
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    description,
  };

  data.transactions.unshift(transaction);
  saveUserData(data);
  return data;
}

export function updateKYCStatus(
  fullName: string,
  idUploaded: boolean,
  status: 'verified' | 'pending' = 'verified'
): UserData {
  const data = getUserData();
  data.accountName = fullName;
  data.kycStatus = status;
  data.kycDetails = {
    fullName,
    idUploaded,
    submittedAt: new Date().toISOString().split('T')[0],
  };
  saveUserData(data);
  return data;
}

export function addToSavings(amount: number, description: string): UserData {
  const data = getUserData();

  // Deduct from main balance
  if (data.balance >= amount) {
    data.balance -= amount;
    data.savingsBalance += amount;

    // Add transaction record
    data.transactions.unshift({
      id: Date.now().toString(),
      type: 'transfer',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: `Transfer to Savings - ${description}`,
    });

    // Update goal progress if exists
    if (data.savingsGoals.length > 0) {
      data.savingsGoals[0].currentAmount += amount;
    }
  }

  saveUserData(data);
  return data;
}

export function createSavingsGoal(
  name: string,
  targetAmount: number,
  deadline: string
): UserData {
  const data = getUserData();
  const goal: SavingsGoal = {
    id: Date.now().toString(),
    name,
    targetAmount,
    currentAmount: 0,
    deadline,
  };

  data.savingsGoals.push(goal);
  saveUserData(data);
  return data;
}
