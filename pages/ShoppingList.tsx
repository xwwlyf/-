import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentPlan, getSettings, generateShoppingList, saveCurrentPlan, useRecipes } from '../services/storage';
import { DayPlan, ShoppingItem, Recipe } from '../types';
import { Button, Card, Badge, Modal } from '../components/UI';
import { ArrowLeft, Share, ExternalLink, RefreshCw, ShoppingBag, CheckSquare, Square } from 'lucide-react';

export const ShoppingList: React.FC = () => {
  const navigate = useNavigate();
  const settings = getSettings();
  const { activeRecipes } = useRecipes();
  
  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingSlot, setEditingSlot] = useState<'main' | 'side' | null>(null);

  useEffect(() => {
    const current = getCurrentPlan();
    if (!current.length) {
      navigate('/manual');
      return;
    }
    setPlans(current);
    regenerateItems(current);
  }, []);

  const regenerateItems = (currentPlans: DayPlan[]) => {
    setItems(generateShoppingList(currentPlans, settings));
  };

  const toggleItemCheck = (name: string) => {
    setItems(prev => prev.map(item => 
      item.name === name ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSwapDish = (newDish: Recipe) => {
    if (editingDayIndex === null || !editingSlot) return;
    
    const newPlans = [...plans];
    const targetDay = { ...newPlans[editingDayIndex] };
    
    if (editingSlot === 'main') targetDay.mainDish = newDish;
    else targetDay.sideDish = newDish;
    
    newPlans[editingDayIndex] = targetDay;
    setPlans(newPlans);
    saveCurrentPlan(newPlans);
    regenerateItems(newPlans);
    setEditModalOpen(false);
  };

  const openSwapModal = (dayIdx: number, slot: 'main' | 'side') => {
    setEditingDayIndex(dayIdx);
    setEditingSlot(slot);
    setEditModalOpen(true);
  };

  // Filter recipes for swap modal
  const swapPool = activeRecipes.filter(r => {
    if (!editingSlot) return true;
    if (editingSlot === 'side') return r.category === 'C';
    return r.category !== 'C'; // Mains can swap A or B
  });

  return (
    <div className="min-h-screen bg-[#FFFACD] pb-10">
      <header className="sticky top-0 bg-[#FFFACD]/95 backdrop-blur-md z-10 p-4 shadow-sm flex items-center justify-between">
         <button onClick={() => navigate('/')} className="p-2 hover:bg-orange-100 rounded-full">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg">今日菜单 & 清单</h1>
        <button className="p-2 text-gray-500 hover:text-orange-500">
           <Share size={20} />
        </button>
      </header>

      <main className="p-4 space-y-6">
        
        {/* Menu Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#FF8C00] flex items-center gap-2">
            <span className="text-2xl">🍱</span> 菜单预览
          </h2>
          <div className="space-y-4">
            {plans.map((plan, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border-2 border-orange-50">
                <div className="font-bold text-gray-400 text-xs mb-3 uppercase tracking-wider">{plan.date}</div>
                
                {/* Main Dish */}
                {plan.mainDish ? (
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-gray-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-800">{plan.mainDish.name}</h3>
                            <Badge category={plan.mainDish.category} />
                        </div>
                        {plan.mainDish.link && (
                            <a href={plan.mainDish.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                                查看教程 <ExternalLink size={10} />
                            </a>
                        )}
                    </div>
                    <button onClick={() => openSwapModal(idx, 'main')} className="p-2 text-gray-300 hover:text-[#FF8C00]">
                        <RefreshCw size={18} />
                    </button>
                  </div>
                ) : <div className="text-gray-400 italic mb-4">无主菜</div>}

                {/* Side Dish */}
                {plan.sideDish ? (
                  <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-md text-gray-700">{plan.sideDish.name}</h3>
                            <Badge category={plan.sideDish.category} />
                        </div>
                    </div>
                     <button onClick={() => openSwapModal(idx, 'side')} className="p-2 text-gray-300 hover:text-[#FF8C00]">
                        <RefreshCw size={18} />
                    </button>
                  </div>
                ) : <div className="text-gray-400 italic">无配菜</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Shopping List Section */}
        <section className="space-y-4">
           <h2 className="text-xl font-bold text-[#FF8C00] flex items-center gap-2">
            <span className="text-2xl">🛒</span> 购物清单
          </h2>
          <div className="bg-white rounded-3xl p-2 shadow-sm border-2 border-orange-50">
            {items.length === 0 ? (
                <div className="p-8 text-center text-gray-400">不需要买东西哦</div>
            ) : (
                items.map((item, i) => (
                    <div 
                        key={item.name} 
                        onClick={() => toggleItemCheck(item.name)}
                        className={`flex items-center p-3 rounded-xl transition-colors cursor-pointer ${item.checked ? 'bg-gray-50' : 'hover:bg-orange-50'}`}
                    >
                        <div className={`mr-3 ${item.checked ? 'text-gray-300' : 'text-[#FF8C00]'}`}>
                            {item.checked ? <CheckSquare /> : <Square />}
                        </div>
                        <div className="flex-1">
                            <div className={`font-bold ${item.checked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                {item.name} {item.isSpicy && <span className="text-xs text-red-500 ml-1">(辣)</span>}
                            </div>
                        </div>
                        <div className={`font-mono font-medium ${item.checked ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                            {item.amount}{item.unit}
                        </div>
                    </div>
                ))
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <span className="text-xs text-gray-400">
                Tip: 默认已过滤葱姜蒜，可在设置开启
            </span>
          </div>
        </section>

      </main>

      {/* Swap Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="更换菜品">
         <div className="grid grid-cols-1 gap-2">
            {swapPool.map(r => (
                <div 
                    key={r.id} 
                    onClick={() => handleSwapDish(r)}
                    className="p-3 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-orange-50 cursor-pointer"
                >
                    <span className="font-bold text-gray-700">{r.name}</span>
                    <Badge category={r.category} />
                </div>
            ))}
         </div>
      </Modal>
    </div>
  );
};
