import { Recipe, Settings, DayPlan, ShoppingItem, Ingredient } from '../types';
import { INITIAL_RECIPES, DEFAULT_SETTINGS } from '../constants';

const KEYS = {
  RECIPES: 'xiao_recipes',
  SETTINGS: 'xiao_settings',
  PLAN: 'xiao_current_plan',
  SHOPPING: 'xiao_shopping_list'
};

// --- Recipes ---

export const getRecipes = (): Recipe[] => {
  const stored = localStorage.getItem(KEYS.RECIPES);
  if (!stored) {
    localStorage.setItem(KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
    return INITIAL_RECIPES;
  }
  return JSON.parse(stored);
};

export const saveRecipes = (recipes: Recipe[]) => {
  localStorage.setItem(KEYS.RECIPES, JSON.stringify(recipes));
  // Force a window event for cross-component updates if needed
  window.dispatchEvent(new Event('recipesUpdated'));
};

// --- Settings ---

export const getSettings = (): Settings => {
  const stored = localStorage.getItem(KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// --- Plans ---

export const getCurrentPlan = (): DayPlan[] => {
  const stored = localStorage.getItem(KEYS.PLAN);
  return stored ? JSON.parse(stored) : [];
};

export const saveCurrentPlan = (plan: DayPlan[]) => {
  localStorage.setItem(KEYS.PLAN, JSON.stringify(plan));
};

// --- Logic Helpers ---

export const generateShoppingList = (plans: DayPlan[], settings: Settings): ShoppingItem[] => {
  const itemsMap = new Map<string, ShoppingItem>();

  const addToMap = (name: string, amount: number, unit: string, isSpicy: boolean = false) => {
    // Normalization: Remove standard spices if settings say so
    if (!settings.showGarlicGinger && ['葱', '姜', '蒜', '大葱', '红葱头'].includes(name)) return;
    
    // Auto Spicy Rule for A dishes (handled below, but checking here for safety)
    
    const key = name.trim();
    const existing = itemsMap.get(key);
    if (existing) {
      existing.amount += amount;
      existing.originalText.push(`${amount}${unit}`);
    } else {
      itemsMap.set(key, {
        name: key,
        amount,
        unit,
        originalText: [`${amount}${unit}`],
        checked: false,
        isSpicy
      });
    }
  };

  plans.forEach(day => {
    [day.mainDish, day.sideDish].forEach(dish => {
      if (!dish) return;

      // Rule: A category auto spicy
      if (dish.category === 'A' && settings.autoSpicyA) {
        addToMap('小米辣', 5, 'g', true);
      }

      dish.ingredients.forEach(ing => {
        let amount = 0;
        let unit = '个';

        // Default Quantity Logic based on settings
        const isMeat = ['肉', '鸡', '鸭', '鱼', '牛', '排骨', '虾'].some(k => ing.name.includes(k));
        const isEgg = ing.name.includes('鸡蛋');
        const isVeg = ['冬瓜', '青瓜', '土豆', '茄子', '南瓜'].some(k => ing.name.includes(k));

        if (isMeat) {
          amount = settings.peopleCount === '3-4' ? 500 : 350;
          unit = 'g';
        } else if (isEgg) {
          amount = settings.peopleCount === '3-4' ? 4 : 2;
          unit = '个';
        } else if (isVeg) {
          amount = settings.peopleCount === '3-4' ? 600 : 400;
          unit = 'g';
        } else {
           amount = 1;
           unit = '份';
        }

        // Check if user manually set amount (mocking this capability as simple string parsing is hard without struct)
        // In this app, we rely on defaults mostly, but respect existing structure
        
        addToMap(ing.name, amount, unit);
      });
    });
  });

  return Array.from(itemsMap.values());
};

// --- Global Event Listener Hook helper ---
import { useState, useEffect } from 'react';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes());

  useEffect(() => {
    const handler = () => setRecipes(getRecipes());
    window.addEventListener('recipesUpdated', handler);
    return () => window.removeEventListener('recipesUpdated', handler);
  }, []);

  return {
    recipes,
    activeRecipes: recipes.filter(r => !r.deleted),
    deletedRecipes: recipes.filter(r => r.deleted),
    addRecipe: (r: Recipe) => {
      const updated = [...recipes, r];
      saveRecipes(updated);
    },
    updateRecipe: (r: Recipe) => {
      const updated = recipes.map(old => old.id === r.id ? r : old);
      saveRecipes(updated);
    },
    deleteRecipe: (id: string) => {
      const updated = recipes.map(r => r.id === id ? { ...r, deleted: true } : r);
      saveRecipes(updated);
    },
    restoreRecipe: (id: string) => {
      const updated = recipes.map(r => r.id === id ? { ...r, deleted: false } : r);
      saveRecipes(updated);
    },
    permDeleteRecipe: (id: string) => {
      const updated = recipes.filter(r => r.id !== id);
      saveRecipes(updated);
    },
    emptyBin: () => {
      const updated = recipes.filter(r => !r.deleted);
      saveRecipes(updated);
    }
  };
};
