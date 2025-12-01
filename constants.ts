import { Recipe, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  peopleCount: '1-2',
  autoSpicyA: true,
  showGarlicGinger: false,
  cloudSync: false,
};

// Helper to split ingredients string
const parseIng = (list: string[]): any[] => list.map(name => ({ name }));

export const INITIAL_RECIPES: Recipe[] = [
  // A Category
  { id: 'A01', name: '冬瓜焖肉', category: 'A', ingredients: parseIng(['冬瓜', '五花肉', '小米辣']) },
  { id: 'A02', name: '青瓜炒肉', category: 'A', ingredients: parseIng(['青瓜', '五花肉']) },
  { id: 'A03', name: '香菇炒肉', category: 'A', ingredients: parseIng(['香菇', '五花肉']) },
  { id: 'A04', name: '土豆丝炒肉', category: 'A', ingredients: parseIng(['土豆', '五花肉']) },
  { id: 'A05', name: '豆角炒肉', category: 'A', ingredients: parseIng(['豆角', '五花肉']) },
  { id: 'A06', name: '茄子炒肉', category: 'A', ingredients: parseIng(['茄子', '五花肉']) },
  { id: 'A07', name: '绿豆芽炒肉', category: 'A', ingredients: parseIng(['绿豆芽', '五花肉']) },
  { id: 'A08', name: '南瓜焖肉', category: 'A', ingredients: parseIng(['南瓜', '五花肉']) },
  { id: 'A09', name: '蒸肉饼', category: 'A', ingredients: parseIng(['香菇', '马蹄', '芹菜', '梅花肉']) },

  // B Category
  { id: 'B01', name: '蒸牛肉饼', category: 'B', link: 'B站', ingredients: parseIng(['牛肉', '马蹄', '香菇', '芹菜']) },
  { id: 'B02', name: '番茄牛肉蛋羹', category: 'B', link: 'B站', ingredients: parseIng(['牛肉', '番茄', '鸡蛋', '香菜']) },
  { id: 'B03', name: '小炒黄牛肉', category: 'B', link: '抖音', ingredients: parseIng(['牛肉', '洋葱', '青椒', '泡椒', '小米辣', '香菜']) },
  { id: 'B04', name: '葱爆羊肉', category: 'B', link: 'B站', ingredients: parseIng(['羊肉', '大葱', '红椒', '小米辣']) },
  { id: 'B05', name: '可乐鸡翅', category: 'B', link: 'B站', ingredients: parseIng(['鸡翅', '可乐', '葱']) },
  { id: 'B06', name: '蒸排骨', category: 'B', link: 'B站', ingredients: parseIng(['前排骨', '芋头仔', '香菜', '豆豉']) },
  { id: 'B07', name: '黄焖鸡', category: 'B', ingredients: parseIng(['三黄鸡', '小土豆', '香菇']) },
  { id: 'B08', name: '菠萝焖鸭', category: 'B', link: '抖音', ingredients: parseIng(['菠萝', '鸭']) },
  { id: 'B09', name: '椒盐虾', category: 'B', link: '抖音', ingredients: parseIng(['虾', '椒盐', '红葱头']) },
  { id: 'B10', name: '蒸鲫/皖鱼', category: 'B', ingredients: parseIng(['鱼', '葱', '香菜', '豆豉']) },
  { id: 'B11', name: '红烧鱼', category: 'B', link: 'B站', ingredients: parseIng(['皖鱼', '十三香', '猪油', '豆瓣酱', '豆腐']) },

  // C Category
  { id: 'C01', name: '炒花甲', category: 'C', ingredients: parseIng(['花甲', '香菜', '小米辣']) },
  { id: 'C02', name: '番茄炒鸡蛋', category: 'C', ingredients: parseIng(['番茄', '鸡蛋']) },
  { id: 'C03', name: '蒸鸡蛋', category: 'C', ingredients: parseIng(['鸡蛋', '油', '盐', '胡椒']) },
  { id: 'C04', name: '油麦菜', category: 'C', ingredients: parseIng(['油麦菜']) },
  { id: 'C05', name: '生菜', category: 'C', ingredients: parseIng(['生菜']) },
  { id: 'C06', name: '紫菜汤', category: 'C', ingredients: parseIng(['虾皮', '紫菜', '鸡蛋']) },
  { id: 'C07', name: '冬瓜汤', category: 'C', ingredients: parseIng(['冬瓜', '鸡蛋']) },
  { id: 'C08', name: '番茄鸡蛋汤', category: 'C', link: 'B站', ingredients: parseIng(['番茄', '鸡蛋']) },
];
