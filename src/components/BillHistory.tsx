import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Zap, 
  Wifi, 
  Droplets, 
  HeartPulse, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { usePayhub, Biller } from '../hooks/use-payhub';
import { formatCurrency } from '../lib/utils';

const iconMap: Record<string, any> = {
  Zap: Zap,
  Wifi: Wifi,
  Droplets: Droplets,
  HeartPulse: HeartPulse
};

export const BillHistory = () => {
  const { getBillers, payBill } = usePayhub();
  const [billers, setBillers] = useState<Biller[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getBillers().then(setBillers);
  }, [getBillers]);

  const filteredBillers = billers.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBiller) {
      payBill(selectedBiller.code, accountNo, Number(amount));
      setSelectedBiller(null);
      setAccountNo('');
      setAmount('');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 text-lg">Pay Bills</h3>
        <Button variant="ghost" size="sm" className="text-blue-600 text-xs gap-1">
          <Filter className="h-3 w-3" /> Filter
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search billers (e.g. KPLC, Zuku)" 
          className="pl-10 h-11 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredBillers.map((biller, index) => (
          <motion.div
            key={biller.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="p-4 border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setSelectedBiller(biller)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
                    {React.createElement(iconMap[biller.icon] || Zap, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{biller.name}</h4>
                    <p className="text-xs text-slate-500">{biller.category} \u2022 Paybill: {biller.code}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bill Payment Modal */}
      <AnimatePresence>
        {selectedBiller && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
                  {React.createElement(iconMap[selectedBiller.icon] || Zap, { className: "h-8 w-8" })}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pay {selectedBiller.name}</h2>
                  <p className="text-sm text-slate-500">Paybill: {selectedBiller.code}</p>
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Account Number</label>
                  <Input 
                    placeholder="Enter account or meter no."
                    className="h-12"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Amount (KES)</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="h-12 text-lg font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-slate-500">A small fee of 1% applies to bill payments</p>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" type="button" className="flex-1" onClick={() => setSelectedBiller(null)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-blue-600">Pay Now</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4">
        <Card className="p-4 bg-blue-50 border-blue-100 flex items-center justify-between overflow-hidden relative">
          <div className="z-10">
            <h4 className="font-bold text-blue-900">Automatic Payments</h4>
            <p className="text-xs text-blue-700 mt-1">Never miss a due date again with PayHub Auto-Pay.</p>
            <Button size="sm" className="mt-3 bg-blue-600 h-8">Setup Now</Button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
             <Zap className="h-24 w-24 text-blue-900" />
          </div>
        </Card>
      </div>
    </div>
  );
};