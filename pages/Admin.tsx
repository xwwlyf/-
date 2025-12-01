import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../services/storage';
import { Recipe, Category } from '../types';
import { Button, Modal, Badge } from '../components/UI';
import { ArrowLeft, Plus, Trash2, RotateCcw, X, Edit, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Standard practice, but since I can't import uuid without package, I'll write a simple helper.

// Simple ID generator
const genId = (cat: string) => `${cat}${Date.now().toString().slice(-4)}`;

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { activeRecipes, deletedRecipes, addRecipe, updateRecipe, deleteRecipe, restoreRecipe, permDeleteRecipe, emptyBin } = useRecipes();
  
  const [view, setView] = useState<'ACTIVE' | 'BIN'>('ACTIVE');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formCat, setFormCat] = useState<Category>('A');
  const [formIngs, setFormIngs] = useState('');
  const [formLink, setFormLink] = useState('');

  const openEdit = (r?: Recipe) => {
    if (r) {
      setEditingRecipe(r);
      setFormName(r.name);
      setFormCat(r.category);
      setFormIngs(r.ingredients.map(i => i.name).join(' ')); // Simple space separated for now
      setFormLink(r.link || '');
    } else {
      setEditingRecipe(null);
      setFormName('');
      setFormCat('A');
      setFormIngs('');
      setFormLink('');
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    const ingredients = formIngs.split(/[,，\s]+/).filter(Boolean).map(name => ({ name }));
    
    if (editingRecipe) {
      updateRecipe({
        ...editingRecipe,
        name: formName,
        category: formCat,
        ingredients,
        link: formLink
      });
    } else {
      addRecipe({
        id: genId(formCat),
        name: formName,
        category: formCat,
        ingredients,
        link: formLink,
        deleted: false
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("确认要把这个菜谱移入回收站吗？")) {
        deleteRecipe(id);
    }
  };

  const handleEmptyBin = () => {
    if (window.confirm("⚠ 警告：确认清空回收站吗？此操作不可恢复！")) {
        emptyBin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="text-gray-600" />
            </button>
            <h1 className="font-bold text-lg">菜谱管理</h1>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setView('ACTIVE')} 
                className={`px-3 py-1 rounded-lg text-sm font-bold ${view === 'ACTIVE' ? 'bg-[#FF8C00] text-white' : 'text-gray-500'}`}
            >
                列表
            </button>
            <button 
                onClick={() => setView('BIN')} 
                className={`px-3 py-1 rounded-lg text-sm font-bold ${view === 'BIN' ? 'bg-red-500 text-white' : 'text-gray-500'}`}
            >
                回收站
            </button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {view === 'ACTIVE' ? (
            <div className="space-y-3">
                {activeRecipes.map(r => (
                    <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-gray-300">{r.id}</span>
                                <h3 className="font-bold text-gray-800">{r.name}</h3>
                                <Badge category={r.category} />
                            </div>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {r.ingredients.map(i => i.name).join(', ')}
                            </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(r)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-4">
                 {deletedRecipes.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                        <span className="text-red-600 font-bold text-sm flex items-center gap-2">
                            <AlertTriangle size={16} /> 回收站中有 {deletedRecipes.length} 个菜谱
                        </span>
                        <button onClick={handleEmptyBin} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-700">
                            清空回收站
                        </button>
                    </div>
                 )}
                 
                 {deletedRecipes.map(r => (
                    <div key={r.id} className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex justify-between items-center opacity-75">
                         <div>
                            <h3 className="font-bold text-gray-600 line-through">{r.name}</h3>
                            <Badge category={r.category} />
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => restoreRecipe(r.id)} className="p-2 text-green-600 bg-white shadow-sm rounded-lg hover:bg-green-50">
                                <RotateCcw size={18} />
                            </button>
                             <button onClick={() => { if(confirm('彻底删除？')) permDeleteRecipe(r.id) }} className="p-2 text-red-600 bg-white shadow-sm rounded-lg hover:bg-red-50">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                 ))}
                 
                 {deletedRecipes.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        回收站是空的
                    </div>
                 )}
            </div>
        )}
      </main>

      {view === 'ACTIVE' && (
        <button 
            onClick={() => openEdit()}
            className="fixed bottom-6 right-6 bg-[#FF8C00] text-white p-4 rounded-full shadow-lg shadow-orange-300 hover:scale-105 transition-transform"
        >
            <Plus size={24} strokeWidth={3} />
        </button>
      )}

      {/* Edit/Add Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingRecipe ? '编辑菜谱' : '新增菜谱'}
        footer={
            <div className="flex w-full gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>取消</Button>
                <Button className="flex-1" onClick={handleSave}>保存</Button>
            </div>
        }
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">菜名</label>
                <input 
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#FF8C00] outline-none" 
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="例如：番茄炒蛋"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">分类</label>
                <div className="flex gap-2">
                    {(['A','B','C'] as Category[]).map(c => (
                        <button 
                            key={c}
                            onClick={() => setFormCat(c)}
                            className={`flex-1 py-2 rounded-xl border-2 font-bold ${formCat === c ? 'bg-orange-100 border-[#FF8C00] text-[#FF8C00]' : 'border-gray-200 text-gray-400'}`}
                        >
                            {c} 类
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">食材 (空格或逗号分隔)</label>
                <input 
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#FF8C00] outline-none" 
                    value={formIngs}
                    onChange={e => setFormIngs(e.target.value)}
                    placeholder="鸡蛋 番茄 葱"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">教程链接 (选填)</label>
                <input 
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#FF8C00] outline-none" 
                    value={formLink}
                    onChange={e => setFormLink(e.target.value)}
                    placeholder="URL 或 平台名"
                />
            </div>
        </div>
      </Modal>

    </div>
  );
};
