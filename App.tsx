import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ManualMode } from './pages/ManualMode';
import { PlanMode } from './pages/PlanMode';
import { ShoppingList } from './pages/ShoppingList';
import { Admin } from './pages/Admin';
import { SettingsPage } from './pages/Settings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="max-w-md mx-auto min-h-screen bg-[#FFFACD] shadow-2xl overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manual" element={<ManualMode />} />
          <Route path="/plan" element={<PlanMode />} />
          <Route path="/list" element={<ShoppingList />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
