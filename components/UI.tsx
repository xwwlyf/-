import React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className, children, ...props }) => {
  const base = "font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#FF8C00] text-white shadow-[0_4px_0_rgb(200,100,0)] hover:bg-[#ff9d2e]",
    secondary: "bg-white text-[#FF8C00] border-2 border-[#FF8C00] shadow-sm hover:bg-orange-50",
    danger: "bg-red-500 text-white shadow-[0_4px_0_rgb(180,0,0)] hover:bg-red-600",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    outline: "border-2 border-gray-300 text-gray-600 hover:border-gray-400"
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-8 py-4 text-xl"
  };

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; selected?: boolean }> = ({ children, className, onClick, selected }) => {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "bg-white rounded-3xl p-4 shadow-sm transition-all border-2",
        selected ? "border-[#FF8C00] ring-2 ring-[#FF8C00]/30" : "border-transparent hover:border-orange-200",
        className
      )}
    >
      {children}
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ category: string }> = ({ category }) => {
  const colors: Record<string, string> = {
    'A': 'bg-green-100 text-green-700',
    'B': 'bg-red-100 text-red-700',
    'C': 'bg-blue-100 text-blue-700'
  };
  return (
    <span className={clsx("px-2 py-0.5 rounded-full text-xs font-bold", colors[category] || 'bg-gray-100')}>
      {category}
    </span>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FFFAF0] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-[bounce_0.2s_ease-out]">
        <div className="p-4 border-b border-orange-100 flex justify-between items-center bg-[#FFFACD]">
          <h3 className="text-lg font-bold text-[#FF8C00]">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-orange-200 rounded-full text-orange-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-orange-100 bg-white flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
