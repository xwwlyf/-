export type Category = 'A' | 'B' | 'C';

export interface Ingredient {
  name: string;
  amount?: string;
  unit?: string;
  checked?: boolean; // For shopping list UI
}

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  ingredients: Ingredient[];
  link?: string;
  deleted?: boolean;
  createdAt?: number;
}

export interface Settings {
  peopleCount: '1-2' | '3-4';
  autoSpicyA: boolean; // A类默认加小米辣
  showGarlicGinger: boolean; // 清单展示葱姜蒜
  cloudSync: boolean;
}

export interface DayPlan {
  date: string; // ISO date or "Day 1"
  mainDish: Recipe | null;
  sideDish: Recipe | null; // C category
}

export interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
  originalText: string[]; // Debug/Traceability
  checked: boolean;
  isSpicy?: boolean; // Was added due to spicy rule
}
