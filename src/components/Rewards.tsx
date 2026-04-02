import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Gift, 
  Star, 
  TrendingUp, 
  Award,
  ChevronRight,
  Zap
} from 'lucide-react';
import { MOCK_REWARDS } from '../lib/mock-data';
import { usePayhub } from '../hooks/use-payhub';

export const Rewards = () => {
  const { user, redeemPoints } = usePayhub();

  if (!user) return null;

  const points = user.points ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Rewards Hero */}
      <Card className="p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Star className="h-24 w-24" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/20 p-1 rounded-lg backdrop-blur-sm">
              <Award className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase">Loyalty Status</span>
          </div>
          <h2 className="text-3xl font-black mb-1">{points.toLocaleString()}</h2>
          <p className="text-indigo-100 text-sm">PayHub Points available</p>
          
          <div className="mt-6 flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1 border border-white/10">
              <p className="text-[10px] text-indigo-100 uppercase font-bold">10 pts =</p>
              <p className="text-xl font-bold">1 KES</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1 border border-white/10">
              <p className="text-[10px] text-indigo-100 uppercase font-bold">Value</p>
              <p className="text-xl font-bold">{(points / 10).toLocaleString()} KES</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Rewards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Available Rewards</h3>
          <span className="text-xs text-blue-600 font-medium">View Categories</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_REWARDS.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-sm flex">
                <div className="w-24 h-full min-h-[100px] overflow-hidden">
                  <img 
                    src={reward.image} 
                    alt={reward.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{reward.category}</span>
                      <span className="text-[10px] text-slate-400">Exp. {reward.expiryDate ? new Date(reward.expiryDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{reward.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{reward.description}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-purple-600 font-bold text-xs">
                      <Zap className="h-3 w-3 fill-purple-600" />
                      {reward.pointsRequired} pts
                    </div>
                    <Button 
                      size="sm" 
                      className="h-7 text-[10px] px-3 bg-slate-900"
                      disabled={points < reward.pointsRequired}
                      onClick={() => redeemPoints(user.email, reward.pointsRequired)}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Earn Points Section */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold">Earn more points</h4>
            <p className="text-xs text-slate-400">Get 5 points for every 100 KES spent on utility bills or transfers.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-600 ml-auto" />
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};