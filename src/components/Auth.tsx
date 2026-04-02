import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { usePayhub } from '../hooks/use-payhub';
import { Lock, Mail, Phone, User, ArrowRight, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, sendOtp, verifyOtp } = usePayhub();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        if (!showOtp) {
          // Step 1: Request OTP
          const success = await sendOtp(formData.email);
          if (success) {
            setShowOtp(true);
          }
        } else {
          // Step 2: Verify OTP
          verifyOtp(formData.otp);
        }
      } else {
        // Sign up logic
        signup(formData);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1f3c3ca9-be17-468f-8cf5-cfc3eee23690/auth-background-f0857222-1775138111486.webp" 
          alt="background" 
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1f3c3ca9-be17-468f-8cf5-cfc3eee23690/payhub-logo-6a4080ab-1775138111202.webp" 
            alt="PayHub Logo" 
            className="h-16 w-auto mx-auto mb-4 rounded-xl shadow-lg"
          />
          <h1 className="text-2xl font-bold text-slate-900">PayHub Mobile</h1>
          <p className="text-slate-500">
            {showOtp ? 'Check your email for the verification code' : 'Fast, secure, and offline-capable payments'}
          </p>
        </div>

        <Card className="p-6 border-none shadow-xl bg-white/80 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && !showOtp && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      name="name"
                      placeholder="Full Name"
                      className="pl-10"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      name="phone"
                      placeholder="M-Pesa / Airtel Number"
                      className="pl-10"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>
              )}

              {showOtp ? (
                <motion.div
                  key="otp-field"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      className="pl-10 text-center tracking-[0.5em] font-mono text-lg"
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="standard-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {showOtp ? 'Verify & Sign In' : (isLogin ? 'Sign In' : 'Create Account')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {showOtp && (
              <button
                type="button"
                onClick={() => setShowOtp(false)}
                className="w-full text-sm text-slate-500 hover:text-blue-600"
              >
                Back to Email
              </button>
            )}
          </form>

          {!showOtp && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          )}
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure AES-256 Encrypted Payments</span>
        </div>
      </motion.div>
    </div>
  );
};