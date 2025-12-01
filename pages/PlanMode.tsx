import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes, saveCurrentPlan } from '../services/storage';
import { DayPlan } from '../types';
import { Button, Card } from '../components/UI';
import { ArrowLeft, Sparkles, RefreshCcw } from 'lucide-react';

export const PlanMode: React.FC = () => {
  const { activeRecipes } = useRecipes();
  const navigate = useNavigate();
  
  const [days, setDays] = useState(1);
  const [preference, setPreference] = useState<'MIX' | 'A' | 'B'>('MIX');

  const generatePlan = () => {
    const plans: DayPlan[] = [];
    const poolA = activeRecipes.filter(r => r.category === 'A');
    const poolB = activeRecipes.filter(r => r.category === 'B');
    const poolC = activeRecipes.filter(r => r.category === 'C');

    for (let i = 0; i < days; i++) {
      let mainDish = null;
      let sideDish = null;

      // Pick Main
      let mainPool = [];
      if (preference === 'A') mainPool = poolA;
      else if (preference === 'B') mainPool = poolB;
      else mainPool = [...poolA, ...poolB];

      if (mainPool.length > 0) {
        mainDish = mainPool[Math.floor(Math.random() * mainPool.length)];
      }

      // Pick Side
      if (poolC.length > 0) {
        sideDish = poolC[Math.floor(Math.random() * poolC.length)];
      }

      plans.push({
        date: days === 1 ? new Date().toLocaleDateString() : `第 ${i + 1} 天`,
        mainDish,
        sideDish
      });
    }

    saveCurrentPlan(plans);
    navigate('/list');
  };

  return (
    <div className="min-h-screen bg-[#FFFACD] flex flex-col">
      <header className="p-4 flex items-center">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-orange-100 rounded-full">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="ml-4 font-bold text-xl">计划模式</h1>
      </header>

      <main className="flex-1 p-6 flex flex-col justify-center space-y-8">
        
        {/* Days Selector */}
        <div className="space-y-3">
          <label className="text-gray-600 font-bold block">计划天数</label>
          <div className="flex gap-4">
            {[1, 2, 3].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg border-2 transition-all ${
                  days === d 
                  ? 'bg-[#FF8C00] text-white border-[#FF8C00] shadow-md transform scale-105' 
                  : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {d} 天
              </button>
            ))}
          </div>
        </div>

        {/* Preference Selector */}
        <div className="space-y-3">
          <label className="text-gray-600 font-bold block">口味偏好</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'MIX', label: '随机' },
              { id: 'A', label: '只吃小炒' },
              { id: 'B', label: '只吃硬菜' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPreference(p.id as any)}
                className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  preference === p.id
                  ? 'bg-orange-100 text-[#FF8C00] border-[#FF8C00]' 
                  : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <Button variant="primary" size="lg" className="w-full shadow-lg" onClick={generatePlan}>
            <Sparkles className="mr-2" /> 开始生成
          </Button>
        </div>

      </main>
    </div>
  );
};
