import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { payerRefersPayeeNumber, generateOTP, sendOTPEmail } from '@/lib/utils';
import { track_event, AnalyticsModel } from '@/services/analytics';
import { log_crash } from '@/services/crashReporting';
import { safaricom_api } from '@/services/safaricom';

export interface User {
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  balance: number;
  points: number;
  mpesa_id?: string;
}

export interface UserSettings {
  profile: {
    name: string;
    photo: string;
  };
  security: {
    password?: string;
    '2fa': boolean;
  };
  notifications: {
    sms: boolean;
    email: boolean;
  };
  payouts: {
    mpesa: string;
    bank: string;
  };
  history: any[];
  language: string;
}

export interface Transaction {
  id: string;
  amount: number;
  fee: number;
  type: 'payment' | 'payout' | 'send' | 'receive' | 'bill' | 'bulk_send';
  status: 'pending' | 'completed' | 'failed' | 'hold';
  date: string;
  description: string;
  recipient_phone?: string;
}

export interface Biller {
  code: string;
  name: string;
  category: string;
  icon: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: { 
    name: 'John Doe', 
    photo: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1f3c3ca9-be17-468f-8cf5-cfc3eee23690/default-avatar-e213c058-1775144867146.webp' 
  },
  security: { '2fa': false },
  notifications: { sms: true, email: true },
  payouts: { mpesa: '', bank: '' },
  history: [],
  language: 'en'
};

const mpesaApi = {
  initiatePayout: async (params: { recipient: string; amount: number }) => {
    console.log('Initiating M-Pesa Payout:', params);
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },
  sendMoney: async (params: { recipient: string; amount: number }) => {
    console.log('Sending M-Pesa Money:', params);
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },
  stkPush: async (params: { phone: string; amount: number }) => {
    console.log('STK Push Request:', params);
    return new Promise((resolve) => setTimeout(resolve, 2000));
  },
  payBill: async (params: { billerCode: string; account: string; amount: number }) => {
    console.log('Paying Bill:', params);
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },
  getBalance: async () => {
    return new Promise<number>((resolve) => {
      setTimeout(() => resolve(15450.00 + (Math.random() * 100)), 1000);
    });
  }
};

export const usePayhub = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('payhub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('payhub_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('payhub_txs');
    return saved ? JSON.parse(saved) : [
      { id: '1', amount: 2500, fee: 37.5, type: 'payment', status: 'completed', date: new Date().toISOString(), description: 'Online Store' },
      { id: '2', amount: 1200, fee: 18, type: 'payout', status: 'completed', date: new Date().toISOString(), description: 'Withdrawal to M-Pesa' }
    ];
  });

  const [notifications, setNotifications] = useState<string[]>([]);
  const [activeOtp, setActiveOtp] = useState<{ email: string; otp: string } | null>(null);

  const analytics = new AnalyticsModel(user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('payhub_user', JSON.stringify(user));
      if (user.name && !settings.profile.name) {
        setSettings(prev => ({ ...prev, profile: { ...prev.profile, name: user.name } }));
      }
    } else {
      localStorage.removeItem('payhub_user');
    }
  }, [user, settings.profile.name]);

  useEffect(() => {
    localStorage.setItem('payhub_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('payhub_txs', JSON.stringify(transactions));
  }, [transactions]);

  const fetchUserData = useCallback(async () => {
    try {
      const balance = await mpesaApi.getBalance();
      const timestamp = new Date().toISOString();
      setUser(prev => prev ? ({ ...prev, balance }) : null);
      analytics.track_event({ name: 'refresh_balance', properties: { balance } });
      return { balance, time: timestamp };
    } catch (error) {
      log_crash(error);
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  }, [analytics]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      if (newSettings.profile) merged.profile = { ...prev.profile, ...newSettings.profile };
      if (newSettings.security) merged.security = { ...prev.security, ...newSettings.security };
      if (newSettings.notifications) merged.notifications = { ...prev.notifications, ...newSettings.notifications };
      if (newSettings.payouts) merged.payouts = { ...prev.payouts, ...newSettings.payouts };
      return merged;
    });
    analytics.track_event({ name: 'update_settings', properties: { section: Object.keys(newSettings).join(',') } });
    toast.success('Settings updated successfully');
  }, [analytics]);

  const sendOtp = useCallback(async (email: string) => {
    const otp = generateOTP();
    const success = await sendOTPEmail(email, otp);
    if (success) {
      setActiveOtp({ email, otp });
      track_event(null, { name: 'send_otp', properties: { email } });
      toast.success(`OTP sent to ${email} (Demo OTP: ${otp})`);
      return true;
    }
    log_crash(new Error(`Failed to send OTP to ${email}`));
    toast.error('Failed to send OTP. Please try again.');
    return false;
  }, []);

  const verifyOtp = useCallback((userOtp: string) => {
    if (activeOtp && userOtp === activeOtp.otp) {
      const demoUser: User = {
        name: 'John Doe',
        email: activeOtp.email,
        phone: '0712345678',
        isVerified: true,
        balance: 15450.00,
        points: 1250,
        mpesa_id: 'MP001'
      };
      setUser(demoUser);
      setActiveOtp(null);
      track_event(demoUser, 'login_success');
      toast.success('Login successful! Welcome back.');
      return true;
    }
    track_event(null, 'login_failed');
    toast.error('Invalid OTP. Please try again.');
    return false;
  }, [activeOtp]);

  const login = useCallback((email: string) => {
    const demoUser: User = {
      name: 'John Doe',
      email: email,
      phone: '0712345678',
      isVerified: true,
      balance: 15450.00,
      points: 1250,
      mpesa_id: 'MP001'
    };
    setUser(demoUser);
    track_event(demoUser, 'login_bypass');
    toast.success('Welcome back to PayHub!');
  }, []);

  const signup = useCallback((data: any) => {
    const newUser = {
      ...data,
      isVerified: false,
      balance: 0,
      points: 0
    };
    setUser(newUser);
    track_event(newUser, 'signup_success');
    toast.success('Account created! Please verify your email.');
  }, []);

  const logout = useCallback(() => {
    track_event(user, 'logout');
    setUser(null);
    setNotifications([]);
    setActiveOtp(null);
    localStorage.removeItem('payhub_user');
    localStorage.removeItem('payhub_txs');
    toast.info('Logged out successfully');
  }, [user]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'date' | 'status'> & { status?: Transaction['status'] }) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: tx.status || 'completed'
    };
    setTransactions(prev => [newTx, ...prev]);
    
    analytics.track_event({ name: 'transaction_completed', properties: { type: tx.type, amount: tx.amount } });

    if (tx.type !== 'receive') {
      const earnedPoints = Math.floor(tx.amount / 100) * 5;
      if (earnedPoints > 0) {
        setUser(prev => prev ? ({ ...prev, points: prev.points + earnedPoints }) : null);
        analytics.track_event({ name: 'points_earned', properties: { points: earnedPoints } });
        toast.success(`You earned ${earnedPoints} reward points!`);
      }
    }
  }, [analytics]);

  const handleTransactionCancellation = useCallback((reason: string) => {
    analytics.track_event({ name: 'transaction_cancelled', properties: { reason } });
    toast.error("Transaction cancelled \ud83d\udeab", {
      description: reason
    });
    setNotifications(prev => [...prev, `Transaction cancelled: ${reason}`]);
    toast.info("Auto-refund in progress... \ud83d\udcb8");
    setTimeout(() => {
      toast.success("Money sent back successfully! \ud83d\udcb8");
    }, 1500);
  }, [analytics]);

  const checkPaymentRules = useCallback((
    payerPhone: string,
    recipientPhone: string,
    paymentDisagree: boolean, 
    amountMismatch: boolean
  ) => {
    const isReferencing = payerRefersPayeeNumber(payerPhone, recipientPhone);
    
    if (isReferencing) {
      if (paymentDisagree || amountMismatch) {
        handleTransactionCancellation("Transaction cancelled due to disagreement or amount mismatch.");
        return { success: false, cancelled: true };
      }
      return { success: true, cancelled: false, shouldNotifySuccess: true };
    }
    
    if (paymentDisagree || amountMismatch) {
        handleTransactionCancellation("Payment mismatch or disagreement.");
        return { success: false, cancelled: true };
    }

    return { success: true, cancelled: false, shouldNotifySuccess: false };
  }, [handleTransactionCancellation]);

  /**
   * Verification for M-Pesa operations
   */
  const verifyMpesaPin = useCallback(async (pin: string) => {
    if (!user) return false;
    return await safaricom_api.verify_pin(user.mpesa_id || user.phone, pin);
  }, [user]);

  /**
   * Bulk Send Feature with Name Confirmation and PIN Integration
   */
  const bulkSend = useCallback(async (
    recipients: { phone: string; name: string }[],
    amountPerRecipient: number,
    pin: string,
    confirmedNames: boolean = false
  ) => {
    if (!user) return;

    // Check verification status
    if (!user.isVerified) {
      toast.error('\ud83d\udeab Verification required to use bulk send.');
      return;
    }

    if (!confirmedNames) {
      toast.info('\ud83d\udcdb Please confirm recipient names first.', {
          description: recipients.map(r => r.name).join(', ')
      });
      return;
    }

    const totalAmount = amountPerRecipient * recipients.length;
    const totalFee = totalAmount * 0.015;
    const totalDeduction = totalAmount + totalFee;

    if (user.balance < totalDeduction) {
      toast.error('\ud83d\udeab Insufficient balance for bulk transfer');
      return;
    }

    // 1. PIN Verification Integration
    const pinValid = await verifyMpesaPin(pin);
    if (!pinValid) {
      toast.error('\ud83d\udeab Invalid M-PESA PIN');
      return;
    }

    // 2. Process transactions after security checks
    analytics.track_event({ name: 'bulk_send_initiated', properties: { recipientCount: recipients.length, totalAmount } });

    toast.promise(
      async () => {
        for (const recipient of recipients) {
          // Simulate name lookup check before sending to each
          const officialName = await safaricom_api.lookup_name(recipient.phone);
          if (officialName !== 'Unknown Recipient' && officialName !== recipient.name) {
              console.warn(`Name mismatch for ${recipient.phone}: Given ${recipient.name}, Official ${officialName}`);
          }

          await mpesaApi.sendMoney({ recipient: recipient.phone, amount: amountPerRecipient });
          
          addTransaction({
            amount: amountPerRecipient,
            fee: amountPerRecipient * 0.015,
            type: 'send',
            description: `Bulk sent to ${recipient.name}`,
            recipient_phone: recipient.phone
          });
        }
        setUser(prev => prev ? ({ ...prev, balance: prev.balance - totalDeduction }) : null);
        return `Successfully sent to ${recipients.length} recipients \ud83d\udcb8`;
      },
      {
        loading: `Sending money to ${recipients.length} recipients...`,
        success: (msg) => msg,
        error: 'Bulk transfer partially failed or failed to start'
      }
    );
  }, [user, verifyMpesaPin, addTransaction, analytics]);

  const initiateSplit = useCallback(async (recipients: { phone: string }[], amount: number) => {
    if (!user || user.balance < amount) {
      toast.error('Insufficient funds for split hold');
      return;
    }

    analytics.track_event({ name: 'initiate_split', properties: { recipients: recipients.length, amount } });

    toast.loading('Initiating split hold... \ud83d\udd12');
    setTimeout(() => {
      setUser(prev => prev ? ({ ...prev, balance: prev.balance - amount }) : null);
      addTransaction({
        amount,
        fee: 0,
        type: 'send',
        description: `Split hold for ${recipients.length} people`,
        status: 'hold'
      });
      toast.dismiss();
      toast.success('Funds held! Recipients notified for confirmation. \ud83d\udce8');
    }, 1500);
  }, [user, addTransaction, analytics]);

  const initiatePayment = useCallback((amount: number, description: string, paymentDisagree: boolean = false, amountMismatch: boolean = false) => {
    const ruleCheck = checkPaymentRules(user?.phone || '', '', paymentDisagree, amountMismatch);
    if (!ruleCheck.success) return;

    analytics.track_event({ name: 'initiate_payment', properties: { amount, description } });

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Initiating payment request...',
        success: () => {
          setNotifications(prev => [...prev, `Approve payment of ${amount} for ${description}`]);
          if (ruleCheck.shouldNotifySuccess) {
            toast.success("All paid \ud83d\udcaf, proceed \ud83d\udcb8");
          }
          return 'Push notification sent to your device!';
        },
        error: 'Payment initiation failed',
      }
    );
  }, [checkPaymentRules, user?.phone, analytics]);

  const confirmPayment = useCallback((otp: string) => {
    analytics.track_event({ name: 'confirm_payment' });
    toast.success('Payment confirmed successfully!');
    setNotifications([]);
  }, [analytics]);

  const initiatePayout = useCallback(async (amount: number) => {
    const transactionFee = amount * 0.015;
    const totalDeduction = amount + transactionFee;

    if (user && user.balance >= totalDeduction) {
      const recipientPhone = settings.payouts.mpesa || (import.meta.env.VITE_PAYOUT_PHONE as string) || '0748561953';
      
      analytics.track_event({ name: 'initiate_payout', properties: { amount, fee: transactionFee } });

      toast.promise(
        async () => {
          await mpesaApi.initiatePayout({
            recipient: recipientPhone,
            amount: transactionFee,
          });

          addTransaction({
            amount,
            fee: transactionFee,
            type: 'payout',
            description: `Payout to ${recipientPhone}`
          });

          setUser(prev => prev ? ({ ...prev, balance: prev.balance - totalDeduction }) : null);
          return `Payout processed to ${recipientPhone}`;
        },
        {
          loading: 'Initiating secure payout...',
          success: (msg) => msg,
          error: 'Payout initiation failed. Please check your connection.',
        }
      );
    } else {
      toast.error(`Insufficient balance. Minimum required: ${totalDeduction.toFixed(2)} (including 1.5% fee)`);
    }
  }, [user, addTransaction, settings.payouts.mpesa, analytics]);

  const sendMpesaMoney = useCallback(async (
    recipient: string, 
    amount: number, 
    paymentDisagree: boolean = false, 
    amountMismatch: boolean = false,
    pin?: string
  ) => {
    const ruleCheck = checkPaymentRules(user?.phone || '', recipient, paymentDisagree, amountMismatch);
    if (!ruleCheck.success) return;

    if (pin) {
        const valid = await verifyMpesaPin(pin);
        if (!valid) {
            toast.error("\ud83d\udeab Invalid M-PESA PIN");
            return;
        }
    }

    const fee = amount * 0.015;
    const total = amount + fee;

    if (user && user.balance >= total) {
      analytics.track_event({ name: 'send_mpesa', properties: { recipient, amount, fee } });
      toast.promise(
        async () => {
          await mpesaApi.sendMoney({ recipient, amount });
          addTransaction({
            amount,
            fee,
            type: 'send',
            description: `Sent to ${recipient}`
          });
          setUser(prev => prev ? ({ ...prev, balance: prev.balance - total }) : null);
          if (ruleCheck.shouldNotifySuccess) {
             toast.success("All paid \ud83d\udcaf, proceed \ud83d\udcb8");
          }
          return `Successfully sent ${amount} to ${recipient}`;
        },
        {
          loading: 'Processing transfer...',
          success: (msg) => msg,
          error: 'Transfer failed'
        }
      );
    } else {
      toast.error('Insufficient balance for this transfer');
    }
  }, [user, addTransaction, checkPaymentRules, verifyMpesaPin, analytics]);

  const receivePaymentSTK = useCallback(async (
    phone: string, 
    amount: number, 
    paymentDisagree: boolean = false, 
    amountMismatch: boolean = false
  ) => {
    const ruleCheck = checkPaymentRules(phone, user?.phone || '', paymentDisagree, amountMismatch);
    if (!ruleCheck.success) return;

    analytics.track_event({ name: 'request_payment_stk', properties: { phone, amount } });

    toast.promise(
      async () => {
        await mpesaApi.stkPush({ phone, amount });
        setTimeout(() => {
          addTransaction({
            amount,
            fee: 0,
            type: 'receive',
            description: `Received from ${phone}`
          });
          setUser(prev => prev ? ({ ...prev, balance: prev.balance + amount }) : null);
          if (ruleCheck.shouldNotifySuccess) {
             toast.success("All paid \ud83d\udcaf, proceed \ud83d\udcb8");
          }
          toast.success(`Received ${amount} KES from ${phone}`);
        }, 5000);
        return 'STK Push sent! Please enter your M-Pesa PIN on your phone.';
      },
      {
        loading: 'Requesting payment...',
        success: (msg) => msg,
        error: 'Failed to send STK Push'
      }
    );
  }, [addTransaction, checkPaymentRules, user?.phone, analytics]);

  const getBillers = useCallback(async (): Promise<Biller[]> => {
    return [
      { code: '222222', name: 'KPLC Postpaid', category: 'Utility', icon: 'Zap' },
      { code: '400222', name: 'Safaricom Home', category: 'Internet', icon: 'Wifi' },
      { code: '913913', name: 'Nairobi Water', category: 'Utility', icon: 'Droplets' },
      { code: '888888', name: 'Zuku', category: 'Internet', icon: 'Wifi' },
    ];
  }, []);

  const payBill = useCallback(async (billerCode: string, account: string, amount: number) => {
    const fee = amount * 0.01;
    const total = amount + fee;

    if (user && user.balance >= total) {
      analytics.track_event({ name: 'pay_bill', properties: { billerCode, amount, fee } });
      toast.promise(
        async () => {
          await mpesaApi.payBill({ billerCode, account, amount });
          addTransaction({
            amount,
            fee,
            type: 'bill',
            description: `Bill: ${billerCode} (${account})`
          });
          setUser(prev => prev ? ({ ...prev, balance: prev.balance - total }) : null);
          return `Bill payment for ${account} successful`;
        },
        {
          loading: 'Processing bill payment...',
          success: (msg) => msg,
          error: 'Bill payment failed'
        }
      );
    } else {
      toast.error('Insufficient balance for this bill payment');
    }
  }, [user, addTransaction, analytics]);

  const trackPoints = useCallback(async (userId: string): Promise<number> => {
    return user?.points || 0;
  }, [user]);

  const redeemPoints = useCallback(async (userId: string, pointsToRedeem: number) => {
    if (user && user.points >= pointsToRedeem) {
      const cashValue = pointsToRedeem / 10;
      analytics.track_event({ name: 'redeem_points', properties: { points: pointsToRedeem, value: cashValue } });
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1000)),
        {
          loading: 'Redeeming points...',
          success: () => {
            setUser(prev => prev ? ({ 
              ...prev, 
              points: prev.points - pointsToRedeem,
              balance: prev.balance + cashValue
            }) : null);
            return `Successfully redeemed ${pointsToRedeem} points for ${cashValue} KES!`;
          },
          error: 'Redemption failed'
        }
      );
    } else {
      toast.error('Insufficient points');
    }
  }, [user, analytics]);

  return {
    user,
    settings,
    transactions,
    notifications,
    updateSettings,
    login,
    signup,
    logout,
    sendOtp,
    verifyOtp,
    initiatePayment,
    confirmPayment,
    initiatePayout,
    sendMpesaMoney,
    receivePaymentSTK,
    getBillers,
    payBill,
    trackPoints,
    redeemPoints,
    fetchUserData,
    bulkSend,
    initiateSplit,
    verifyMpesaPin,
    isLoggedIn: !!user
  };
};