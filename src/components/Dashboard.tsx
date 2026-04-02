import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayhub } from '../hooks/use-payhub';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Bell, 
  History, 
  Gift, 
  Wallet,
  LogOut,
  Send,
  MoreVertical,
  AlertCircle,
  ShieldCheck,
  Receipt,
  RefreshCw,
  Settings as SettingsIcon,
  Clock,
  Shield
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../lib/utils';
import { BillHistory } from './BillHistory';
import { Rewards } from './Rewards';
import { Settings } from './Settings';
import { Branding } from './Branding';
import { toast } from 'sonner';

type TabType = 'home' | 'history' | 'rewards' | 'settings';

interface DashboardProps {
  onShowPolicies?: () => void;
}

export const Dashboard = ({ onShowPolicies }: DashboardProps) => {
  const { 
    user, 
    settings,
    transactions, 
    notifications, 
    logout, 
    initiatePayment, 
    initiatePayout, 
    confirmPayment,
    sendMpesaMoney,
    receivePaymentSTK,
    fetchUserData
  } = usePayhub();
  
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [modalType, setModalType] = useState<'pay' | 'send' | 'receive' | 'none'>('none');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleFetchData = async () => {
    setIsSyncing(true);
    try {
      const data = await fetchUserData();
      setLastSync(data.time);
      toast.success('Balance updated from M-Pesa');
    } catch (error) {
      toast.error('Failed to sync with M-Pesa');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (user && !lastSync) {
      handleFetchData();
    }
  }, [user]);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (modalType === 'pay') {
      initiatePayment(numAmount, recipient);
      setShowOtp(true);
    } else if (modalType === 'send') {
      sendMpesaMoney(recipient, numAmount);
    } else if (modalType === 'receive') {
      receivePaymentSTK(recipient, numAmount);
    }
    
    setModalType('none');
    setAmount('');
    setRecipient('');
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    confirmPayment(otp);
    setShowOtp(false);
    setOtp('');
  };

  if (!user) return null;

  const Navigation = ({ currentTab }: { currentTab: TabType }) => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <Wallet className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'history' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <History className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Bills</span>
        </button>
        <div className="relative -top-8">
          <button 
            onClick={() => { setModalType('pay'); if(currentTab === 'settings') setActiveTab('home'); }}
            className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-200 border-4 border-white active:scale-90 transition-transform"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
        <button onClick={() => setActiveTab('rewards')} className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'rewards' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <Gift className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Rewards</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'settings' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <SettingsIcon className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
        </button>
      </div>
    </nav>
  );

  if (activeTab === 'settings') {
    return (
      <div className="min-h-screen bg-white">
        <Settings onBack={() => setActiveTab('home')} />
        <Navigation currentTab="settings" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button 
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="h-11 w-11 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={settings.profile.photo} 
                alt="avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </button>
          <Branding />
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onShowPolicies}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            title="Policies"
          >
            <Shield className="h-5 w-5" />
          </button>
          <button 
            onClick={logout}
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <button className="p-2.5 relative text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Bell className="h-5 w-5" />
            {(notifications?.length ?? 0) > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Notifications Bar */}
        <AnimatePresence>
          {(notifications?.length ?? 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl shadow-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{notifications[0]}</p>
                  <p className="text-[10px] text-blue-100 mt-0.5">Verification required</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="h-9 px-4 text-xs font-bold rounded-xl" onClick={() => setShowOtp(true)}>
                Verify
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white border-none shadow-2xl shadow-blue-200 overflow-hidden relative rounded-[2rem]">
          <div className="absolute top-[-20%] right-[-10%] p-4 opacity-10 rotate-12">
            <Wallet className="h-40 w-40" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Available Balance</p>
              <button 
                onClick={handleFetchData}
                disabled={isSyncing}
                className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">{formatCurrency(user.balance)}</h1>
            
            {lastSync && (
              <div className="flex items-center gap-1.5 mb-8">
                <Clock className="h-3 w-3 text-blue-300" />
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Synced: {formatDateTime(lastSync)}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md h-12 rounded-2xl font-bold"
                onClick={() => setModalType('pay')}
              >
                <Plus className="h-5 w-5 mr-2" /> Pay
              </Button>
              <Button 
                className="bg-white text-blue-700 hover:bg-blue-50 border-none h-12 rounded-2xl font-bold shadow-lg"
                onClick={() => initiatePayout(1000)}
              >
                <Send className="h-4 w-4 mr-2" /> Payout
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Services</h3>
            <span className="text-[11px] text-blue-600 font-black uppercase tracking-wider cursor-pointer bg-blue-50 px-2 py-1 rounded-md">View all</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: ArrowUpRight, label: 'Send', color: 'bg-emerald-50 text-emerald-600', action: () => setModalType('send') },
              { icon: ArrowDownLeft, label: 'Receive', color: 'bg-blue-50 text-blue-600', action: () => setModalType('receive') },
              { icon: Receipt, label: 'Bills', color: 'bg-orange-50 text-orange-600', action: () => setActiveTab('history') },
              { icon: Gift, label: 'Points', color: 'bg-purple-50 text-purple-600', action: () => setActiveTab('rewards') }
            ].map((item, i) => (
              <button key={i} onClick={item.action} className="flex flex-col items-center gap-2 group">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-active:scale-90 transition-transform`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-600">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-6 border-b border-slate-100">
          {(['home', 'history', 'rewards'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              {tab === 'home' ? 'Home' : tab === 'history' ? 'Bills' : 'Rewards'}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content based on tab */}
        <div className="space-y-4">
          {activeTab === 'home' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                {transactions?.length > 0 ? (
                  transactions.map(tx => (
                    <Card key={tx.id} className="p-4 border-slate-100 shadow-sm flex items-center justify-between rounded-2xl hover:border-blue-100 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                          tx.type === 'receive' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {tx.type === 'receive' ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">{tx.type}: {tx.description}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{tx.date ? new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${tx.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.type === 'receive' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                        {(tx.fee ?? 0) > 0 && <p className="text-[9px] text-slate-400 font-medium">Fee: {formatCurrency(tx.fee)}</p>}
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <History className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No transactions yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'history' && <BillHistory />}
          {activeTab === 'rewards' && <Rewards />}
        </div>

        {/* Policy Shortcut */}
        <div className="pt-8">
          <button 
            onClick={onShowPolicies}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">Privacy & Security</p>
                <p className="text-[10px] text-slate-400 font-medium">Read our policies and report fraud</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </main>

      {/* Action Modal */}
      <AnimatePresence>
        {modalType !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  {modalType === 'pay' ? <Plus className="h-8 w-8" /> : modalType === 'send' ? <Send className="h-7 w-7" /> : <ArrowDownLeft className="h-8 w-8" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {modalType === 'pay' ? 'Initiate Payment' : modalType === 'send' ? 'Send Money' : 'Receive Money'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Enter details to proceed securely</p>
                </div>
              </div>

              <form onSubmit={handleAction} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount (KES)</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="h-16 text-3xl font-black border-slate-100 focus:border-blue-600 rounded-2xl"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  {(modalType === 'pay' || modalType === 'send') && (
                    <div className="flex items-center gap-1.5 px-1">
                      <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                      <p className="text-[10px] text-slate-500 font-bold">Service fee of 1.5% will be deducted</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {modalType === 'pay' ? 'Reference / Bill No' : 'Recipient Phone Number'}
                  </label>
                  <Input 
                    placeholder={modalType === 'pay' ? 'e.g. 54321' : '07XXXXXXXX'}
                    className="h-14 text-lg font-bold border-slate-100 focus:border-blue-600 rounded-2xl"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <Button variant="outline" type="button" className="flex-1 h-14 rounded-2xl border-slate-100 font-bold text-slate-600" onClick={() => setModalType('none')}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-blue-600 h-14 rounded-2xl font-black shadow-lg shadow-blue-100">Confirm</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Secure Confirm</h2>
              <p className="text-sm text-slate-500 font-medium mb-8">Enter the 6-digit OTP sent to your device to authorize this action</p>
              
              <form onSubmit={handleConfirmOtp} className="space-y-8">
                <Input 
                  type="text" 
                  maxLength={6} 
                  placeholder="000000" 
                  className="h-16 text-center text-3xl font-black tracking-[0.6em] border-slate-100 focus:border-blue-600 rounded-2xl"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full bg-blue-600 h-14 text-lg font-black rounded-2xl shadow-xl shadow-blue-100">
                    Authorize Now
                  </Button>
                  <Button variant="ghost" type="button" className="font-bold text-slate-400 hover:text-slate-600" onClick={() => setShowOtp(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation currentTab={activeTab} />
    </div>
  );
};