export interface Bill {
  id: string;
  name: string;
  category: 'Utility' | 'Internet' | 'Insurance' | 'Rent';
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  icon: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: 'Cashback' | 'Voucher' | 'Data';
  expiryDate: string;
  image: string;
}

export const MOCK_BILLS: Bill[] = [
  {
    id: 'b1',
    name: 'KPLC Postpaid',
    category: 'Utility',
    amount: 3450,
    status: 'paid',
    dueDate: '2024-05-15',
    paidDate: '2024-05-12',
    icon: 'Zap'
  },
  {
    id: 'b2',
    name: 'Safaricom Home Fiber',
    category: 'Internet',
    amount: 2999,
    status: 'paid',
    dueDate: '2024-05-20',
    paidDate: '2024-05-18',
    icon: 'Wifi'
  },
  {
    id: 'b3',
    name: 'Nairobi Water',
    category: 'Utility',
    amount: 1200,
    status: 'pending',
    dueDate: '2024-06-05',
    icon: 'Droplets'
  },
  {
    id: 'b4',
    name: 'NHIF Monthly',
    category: 'Insurance',
    amount: 500,
    status: 'overdue',
    dueDate: '2024-05-01',
    icon: 'HeartPulse'
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'r1',
    title: '500 KES Cashback',
    description: 'Get 500 KES back on your next utility bill payment over 5000 KES.',
    pointsRequired: 2500,
    category: 'Cashback',
    expiryDate: '2024-12-31',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'r2',
    title: '10GB Data Bundle',
    description: 'Redeem 10GB of high-speed 5G data valid for 30 days.',
    pointsRequired: 1500,
    category: 'Data',
    expiryDate: '2024-06-30',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'r3',
    title: 'Jumia 1000 KES Voucher',
    description: 'Shopping voucher for any item on Jumia Kenya.',
    pointsRequired: 5000,
    category: 'Voucher',
    expiryDate: '2024-08-15',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&auto=format&fit=crop&q=60'
  }
];