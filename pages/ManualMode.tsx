import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes, generateShoppingList, saveCurrentPlan, getSettings } from '../services/storage';
import { Recipe, DayPlan } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';

export const ManualMode: React.FC = () => {
  const { activeRecipes } = useRecipes();
  const navigate = useNavigate();
  const settings = getSettings();
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const generateMenu = () => {
    const selectedRecipes = activeRecipes.filter(r => selectedIds.has(r.id));
    const aList = selectedRecipes.filter(r => r.category === 'A');
    const bList = selectedRecipes.filter(r => r.category === 'B');
    const cList = selectedRecipes.filter(r => r.category === 'C');
    
    // Logic: Must have at least 1 C
    let finalC = cList;
    if (cList.length === 0) {
        // Pick random C from pool
        const allC = activeRecipes.filter(r => r.category === 'C');
        if (allC.length > 0) {
            const randomC = allC[Math.floor(Math.random() * allC.length)];
            finalC = [randomC];
        }
    } else {
        // Use user selected Cs
        // If multiple Cs selected, we distribute them or keep them?
        // Prompt says: "If user selected C -> Draw 1 from user selected". 
        // But also implies multi-select. Let's make a plan per Main Dish if possible, or just one big day.
        // Simplifying for "Today's Menu":
        // Combine all A and B into a "Mains" list.
        // Combine all C.
    }
    
    // Creating a plan for "Today" (Just one day representation for the manual mode usually)
    // However, if user selects 5 dishes, maybe they want a list. 
    // Let's create a single DayPlan with arrays? The type definition allows 1 Main 1 Side. 
    // We will generate MULTIPLE DayPlans if multiple mains are selected to accommodate them.

    const mains = [...aList, ...bList];
    const plans: DayPlan[] = [];

    if (mains.length === 0 && finalC.length > 0) {
        // Vegetarian / Soup mode
        plans.push({
            date: new Date().toLocaleDateString(),
            mainDish: null,
            sideDish: finalC[0]
        });
    } else {
        // Distribute mains
        mains.forEach((main, index) => {
            // Cycle through selected Cs or just pick random one from selected if multiple
            const side = finalC.length > 0 ? finalC[index % finalC.length] : null;
            plans.push({
                date: index === 0 ? new Date().toLocaleDateString() : `Day ${index + 1}`,
                mainDish: main,
                sideDish: side
            });
        });
    }

    if (plans.length === 0) {
        alert("请至少选择一个菜！");
        return;
    }

    saveCurrentPlan(plans);
    navigate('/list');
  };

  const renderSection = (title: string, cat: string) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-[#FF8C00] mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-[#FF8C00] rounded-full"></span> {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {activeRecipes.filter(r => r.category === cat).map(r => (
          <Card 
            key={r.id} 
            selected={selectedIds.has(r.id)}
            onClick={() => toggleSelect(r.id)}
            className="cursor-pointer relative min-h-[100px] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800 text-sm">{r.name}</span>
                <Badge category={r.category} />
              </div>
              <div className="text-xs text-gray-400 truncate">
                {r.ingredients.map(i => i.name).join(', ')}
              </div>
            </div>
            {selectedIds.has(r.id) && (
              <div className="absolute top-[-8px] right-[-8px] bg-[#FF8C00] text-white rounded-full p-1 shadow-sm">
                <Check size={12} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFACD] pb-24">
      <header className="sticky top-0 bg-[#FFFACD]/95 backdrop-blur-md z-10 p-4 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-orange-100 rounded-full">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg">自选模式</h1>
        <div className="w-8"></div>
      </header>

      <main className="p-4">
        {renderSection("A 类：小炒 (默认+辣)", 'A')}
        {renderSection("B 类：大肉菜", 'B')}
        {renderSection("C 类：汤 / 素菜", 'C')}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-orange-100 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-medium text-gray-500">
          已选 {selectedIds.size} 个菜
        </div>
        <Button onClick={generateMenu} disabled={selectedIds.size === 0}>
           生成菜单 <ShoppingCart size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
