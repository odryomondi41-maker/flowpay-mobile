import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  Globe, 
  Check, 
  ChevronRight,
  Camera,
  Lock,
  Smartphone as PhoneIcon,
  Building2,
  LogOut
} from 'lucide-react';
import { usePayhub, UserSettings } from '../hooks/use-payhub';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { settings, updateSettings, logout } = usePayhub();
  const [activeSection, setActiveSection] = useState<'menu' | 'profile' | 'security' | 'notifications' | 'payouts' | 'language'>('menu');

  // Local state for form fields to avoid excessive re-renders of the entire app
  const [formData, setFormData] = useState<UserSettings>(settings);

  const handleSave = () => {
    updateSettings(formData);
    setActiveSection('menu');
  };

  const SectionHeader = ({ title, onBackToMenu }: { title: string; onBackToMenu: () => void }) => (
    <div className="flex items-center gap-4 mb-8">
      <button onClick={onBackToMenu} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-black text-slate-900">{title}</h2>
    </div>
  );

  const MenuItem = ({ icon: Icon, label, description, onClick, variant = 'default' }: { icon: any, label: string, description: string, onClick: () => void, variant?: 'default' | 'danger' }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl border transition-all group active:scale-[0.98] ${
        variant === 'danger' 
          ? 'border-red-100 hover:border-red-200 hover:bg-red-50/30' 
          : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
          variant === 'danger' 
            ? 'bg-red-50 text-red-500 group-hover:bg-white group-hover:text-red-600' 
            : 'bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-blue-600'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-left">
          <p className={`text-sm font-black ${variant === 'danger' ? 'text-red-600' : 'text-slate-900'}`}>{label}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{description}</p>
        </div>
      </div>
      <ChevronRight className={`h-5 w-5 transition-colors ${variant === 'danger' ? 'text-red-300 group-hover:text-red-400' : 'text-slate-300 group-hover:text-blue-400'}`} />
    </button>
  );

  if (activeSection === 'menu') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your account and preferences</p>
          </div>
          <button onClick={onBack} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <MenuItem 
            icon={User} 
            label="Profile Details"
            description="Name, Photo"
            onClick={() => setActiveSection('profile')}
          />
          <MenuItem 
            icon={Shield} 
            label="Security"
            description="Password, 2FA"
            onClick={() => setActiveSection('security')}
          />
          <MenuItem 
            icon={Bell} 
            label="Notifications"
            description="SMS, Email Preferences"
            onClick={() => setActiveSection('notifications')}
          />
          <MenuItem 
            icon={Smartphone} 
            label="Payout Methods"
            description="M-Pesa, Bank Account"
            onClick={() => setActiveSection('payouts')}
          />
          <MenuItem 
            icon={Globe} 
            label="Language"
            description={settings.language === 'en' ? 'English' : 'Swahili'}
            onClick={() => setActiveSection('language')}
          />
          
          <div className="pt-4">
            <MenuItem 
              icon={LogOut} 
              label="Sign Out"
              description="Clear session and exit"
              onClick={logout}
              variant="danger"
            />
          </div>
        </div>

        <Card className="p-6 bg-slate-900 text-white rounded-[2rem] border-none shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400">Identity Verified</p>
              <p className="text-sm font-black">Tier 2 Verified Account</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
            Your identity was verified on Oct 12, 2024. You have full access to all payout features.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6"
    >
      {activeSection === 'profile' && (
        <div className="space-y-8">
          <SectionHeader title="Profile Settings" onBackToMenu={() => setActiveSection('menu')} />
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-32 w-32 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                <img src={formData.profile.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 h-10 w-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white active:scale-90 transition-transform">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Change Profile Photo</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <Input 
                value={formData.profile.name}
                onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, name: e.target.value } })}
                className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
              />
            </div>
            <Button onClick={handleSave} className="w-full h-14 rounded-2xl bg-blue-600 font-black shadow-lg shadow-blue-100">Save Changes</Button>
          </div>
        </div>
      )}

      {activeSection === 'security' && (
        <div className="space-y-8">
          <SectionHeader title="Security" onBackToMenu={() => setActiveSection('menu')} />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  type="password"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">2FA Authentication</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SMS Verification</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, security: { ...formData.security, '2fa': !formData.security['2fa'] } })}
                className={`h-8 w-14 rounded-full p-1 transition-colors ${formData.security['2fa'] ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className="h-6 w-6 rounded-full bg-white transition-transform" style={{ transform: formData.security['2fa'] ? 'translateX(24px)' : 'translateX(0)' }} />
              </button>
            </div>

            <Button onClick={handleSave} className="w-full h-14 rounded-2xl bg-blue-600 font-black shadow-lg shadow-blue-100">Update Security</Button>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="space-y-8">
          <SectionHeader title="Notifications" onBackToMenu={() => setActiveSection('menu')} />
          
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">SMS Alerts</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Transaction updates</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, notifications: { ...formData.notifications, sms: !formData.notifications.sms } })}
                className={`h-8 w-14 rounded-full p-1 transition-colors ${formData.notifications.sms ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className="h-6 w-6 rounded-full bg-white transition-transform" style={{ transform: formData.notifications.sms ? 'translateX(24px)' : 'translateX(0)' }} />
              </button>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-purple-500 shadow-sm">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Email Notifications</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Marketing & Reports</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, notifications: { ...formData.notifications, email: !formData.notifications.email } })}
                className={`h-8 w-14 rounded-full p-1 transition-colors ${formData.notifications.email ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className="h-6 w-6 rounded-full bg-white transition-transform" style={{ transform: formData.notifications.email ? 'translateX(24px)' : 'translateX(0)' }} />
              </button>
            </div>

            <Button onClick={handleSave} className="w-full h-14 rounded-2xl bg-blue-600 font-black shadow-lg shadow-blue-100">Save Preferences</Button>
          </div>
        </div>
      )}

      {activeSection === 'payouts' && (
        <div className="space-y-8">
          <SectionHeader title="Payout Methods" onBackToMenu={() => setActiveSection('menu')} />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">M-Pesa Number</label>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  value={formData.payouts.mpesa}
                  onChange={(e) => setFormData({ ...formData, payouts: { ...formData.payouts, mpesa: e.target.value } })}
                  placeholder="0712 345 678"
                  className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bank Account (KCB/Equity)</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  value={formData.payouts.bank}
                  onChange={(e) => setFormData({ ...formData, payouts: { ...formData.payouts, bank: e.target.value } })}
                  placeholder="Acc: 1234567890"
                  className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full h-14 rounded-2xl bg-blue-600 font-black shadow-lg shadow-blue-100">Update Methods</Button>
          </div>
        </div>
      )}

      {activeSection === 'language' && (
        <div className="space-y-8">
          <SectionHeader title="Language Preference" onBackToMenu={() => setActiveSection('menu')} />
          
          <div className="space-y-3">
            {[
              { code: 'en', name: 'English', sub: 'Default' },
              { code: 'sw', name: 'Kiswahili', sub: 'Regional' },
              { code: 'fr', name: 'Fran\u00e7ais', sub: 'International' }
            ].map((lang) => (
              <button 
                key={lang.code}
                onClick={() => setFormData({ ...formData, language: lang.code })}
                className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${formData.language === lang.code ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-slate-50 border-transparent text-slate-900'}`}
              >
                <div className="text-left">
                  <p className="font-black text-sm">{lang.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${formData.language === lang.code ? 'text-blue-200' : 'text-slate-400'}`}>{lang.sub}</p>
                </div>
                {formData.language === lang.code && <Check className="h-5 w-5" />}
              </button>
            ))}
          </div>

          <Button onClick={handleSave} className="w-full h-14 rounded-2xl bg-blue-600 font-black shadow-lg shadow-blue-100 mt-6">Confirm Selection</Button>
        </div>
      )}
    </motion.div>
  );
};