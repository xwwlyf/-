import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Calendar, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../components/UI';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const now = Date.now();
    // Simple double click logic
    if (logoClicks === 0) {
      setLogoClicks(now);
    } else {
      if (now - logoClicks < 500) {
        navigate('/admin');
      }
      setLogoClicks(0); // Reset
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-12">
      <div 
        onClick={handleLogoClick}
        className="cursor-pointer select-none active:scale-95 transition-transform"
      >
        <div className="bg-[#FF8C00] text-white p-6 rounded-[2rem] shadow-[0_8px_0_rgb(200,100,0)] mb-4 inline-block">
          <Utensils size={64} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-extrabold text-[#FF8C00] tracking-tight">小肖厨房</h1>
        <p className="text-sm font-medium text-orange-300 mt-1">DOUBLE TAP LOGO FOR ADMIN</p>
      </div>

      <div className="space-y-4 max-w-xs w-full">
        <h2 className="text-xl font-bold text-gray-700 mb-6">欢迎来到小肖厨房<br/>梁总请点餐 🍳</h2>
        
        <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/manual')}>
          <Utensils className="mr-2" /> 自选模式
        </Button>
        
        <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/plan')}>
          <Calendar className="mr-2" /> 计划模式
        </Button>
      </div>

      <button 
        onClick={() => navigate('/settings')}
        className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#FF8C00] transition-colors"
      >
        <SettingsIcon size={24} />
      </button>
    </div>
  );
};
