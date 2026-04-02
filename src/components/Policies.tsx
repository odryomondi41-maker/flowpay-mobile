import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Mail, Phone, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { BRANDING } from '../constants/branding';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface PoliciesProps {
  onBack: () => void;
}

export const Policies = ({ onBack }: PoliciesProps) => {
  const [issue, setIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setIsSubmitting(true);
    // Simulate sending report
    setTimeout(() => {
      setIsSubmitting(false);
      setIssue('');
      toast.success('Report sent successfully! 💯', {
        description: 'Our security team will review your report immediately.',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-black text-slate-900">Policies & Security</h2>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Privacy Policy */}
        <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Shield className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Privacy Policy</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              At {BRANDING.APP_NAME}, your security is our top priority. We 💯 protect 👥 data 🔒 using military-grade encryption. Your personal information and transaction history are never shared with third parties without your explicit consent.
            </p>
          </div>
        </Card>

        {/* Fraud Reporting */}
        <Card className="p-6 border-none shadow-xl shadow-red-100/50 rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <AlertTriangle className="h-24 w-24 text-red-600" />
          </div>
          <div className="relative z-10">
            <div className="h-12 w-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4">Report 🛑 Fraud</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Email Support</p>
                  <p className="text-sm font-bold text-slate-700">{BRANDING.SUPPORT_EMAIL}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Call Security</p>
                  <p className="text-sm font-bold text-slate-700">{BRANDING.SUPPORT_PHONE}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Issue Reporting Form */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Report an Issue</h3>
          </div>
          <form onSubmit={handleReportIssue} className="space-y-4">
            <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe 🛑 issue: e.g. Payment not reflecting..."
                className="w-full h-32 p-0 border-none focus:ring-0 text-slate-700 text-sm placeholder:text-slate-300 resize-none font-medium"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !issue.trim()}
              className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-black shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Report 📨
                </span>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};