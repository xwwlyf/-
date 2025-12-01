import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveSettings } from '../services/storage';
import { Settings } from '../types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/UI';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Settings>(getSettings());

  const handleSave = () => {
    saveSettings(config);
    navigate(-1); // Go back
  };

  const toggle = (key: keyof Settings) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#FFFACD]">
      <header className="p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-orange-100 rounded-full">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="ml-4 font-bold text-xl">设置</h1>
      </header>

      <main className="p-6 space-y-6">
        
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* People Count */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">用餐人数</label>
                <div className="flex bg-gray-100 rounded-xl p-1">
                    {['1-2', '3-4'].map(val => (
                        <button
                            key={val}
                            onClick={() => setConfig({ ...config, peopleCount: val as any })}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                                config.peopleCount === val 
                                ? 'bg-white shadow-sm text-[#FF8C00]' 
                                : 'text-gray-500'
                            }`}
                        >
                            {val} 人
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Toggles */}
            <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div>
                        <div className="font-bold text-gray-800">A 类自动加辣</div>
                        <div className="text-xs text-gray-400">小炒类默认添加小米辣</div>
                    </div>
                    <button 
                        onClick={() => toggle('autoSpicyA')}
                        className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${config.autoSpicyA ? 'bg-[#FF8C00]' : 'bg-gray-200'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${config.autoSpicyA ? 'translate-x-5' : ''}`} />
                    </button>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <div className="font-bold text-gray-800">清单显示葱姜蒜</div>
                        <div className="text-xs text-gray-400">默认隐藏常用配料</div>
                    </div>
                     <button 
                        onClick={() => toggle('showGarlicGinger')}
                        className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${config.showGarlicGinger ? 'bg-[#FF8C00]' : 'bg-gray-200'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${config.showGarlicGinger ? 'translate-x-5' : ''}`} />
                    </button>
                </div>
            </div>
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">保存设置</Button>
        
        <div className="text-center text-xs text-gray-400 mt-8">
            Build v1.0.0 • 小肖厨房
        </div>

      </main>
    </div>
  );
};
