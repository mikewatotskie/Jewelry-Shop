export type Category = 'Necklace' | 'Earrings' | 'Rings' | 'Bracelets' | 'Pendants';
export type Material = 'Gold' | 'Silver' | 'Diamond' | 'Pearl' | 'Platinum';

export const CATEGORIES: { name: Category; icon: string }[] = [
  { name: 'Necklace', icon: 'necklace' },
  { name: 'Earrings', icon: 'diamond' },
  { name: 'Rings', icon: 'ring' },
  { name: 'Bracelets', icon: 'circle-outline' },
  { name: 'Pendants', icon: 'heart-outline' },
];

export const MATERIALS: Material[] = ['Gold', 'Silver', 'Diamond', 'Pearl', 'Platinum'];

export interface Product {
  id: string;
  name: string;
  category: Category;
  material: Material;
  price: number;
  image: string;
  description: string;
  rating: number;
  sizes: string[];
  stock: number;
  available: boolean;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  size: string;
  qty: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export interface OrderLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
}

export type PaymentMethod = 'Cash on Delivery' | 'GCash' | 'Card';

export interface Order {
  id: string;
  date: number;
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  payment: PaymentMethod;
  status: OrderStatus;
  customer: { name: string; contact: string; address: string };
}

export interface Settings {
  displayName: string;
  deliveryFee: number;
  currency: string;
  defaultDiscount: number;
  notifications: boolean;
  online: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  displayName: 'Guest',
  deliveryFee: 150,
  currency: '\u20B1',
  defaultDiscount: 0,
  notifications: true,
  online: true,
};

export const DEMO_COUPON = 'DISCOUNT20';
export const DEMO_COUPON_PCT = 0.2;
export const LOW_STOCK_THRESHOLD = 5;

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p-gold-necklace',
    name: 'Gold Necklace',
    category: 'Necklace',
    material: 'Gold',
    price: 75000,
    image: img('photo-1599643478518-a784e5dc4c8f'),
    description:
      'Crafted in 18K gold with a brilliant diamond.\nA delicate, timeless piece for your every day.\nMade to shine, beautifully yours.',
    rating: 4.8,
    sizes: ['16', '18', '20 in'],
    stock: 8,
    available: true,
    createdAt: 6,
  },
  {
    id: 'p-pearl-earrings',
    name: 'Pearl Earrings',
    category: 'Earrings',
    material: 'Pearl',
    price: 12500,
    image: img('photo-1573408301185-9146fe634ad0'),
    description:
      'Lustrous freshwater pearls on gold hooks.\nClassic elegance for day and evening.\nHand-finished by master jewelers.',
    rating: 4.6,
    sizes: ['One Size'],
    stock: 15,
    available: true,
    createdAt: 5,
  },
  {
    id: 'p-diamond-ring',
    name: 'Diamond Ring',
    category: 'Rings',
    material: 'Diamond',
    price: 42000,
    image: img('photo-1605100804763-247f67b9395e'),
    description:
      'Solitaire diamond on a polished gold band.\nExceptional fire and brilliance.\nA forever piece, made to last.',
    rating: 4.9,
    sizes: ['6', '7', '8'],
    stock: 5,
    available: true,
    createdAt: 4,
  },
  {
    id: 'p-gold-bracelet',
    name: 'Gold Bracelet',
    category: 'Bracelets',
    material: 'Gold',
    price: 28000,
    image: img('photo-1611591437281-460bfbe1220a'),
    description:
      'Woven 18K gold chain bracelet.\nComfortable everyday luxury.\nSecure clasp, tarnish resistant.',
    rating: 4.7,
    sizes: ['7', '8'],
    stock: 10,
    available: true,
    createdAt: 3,
  },
  {
    id: 'p-gold-hoops',
    name: 'Gold Hoops',
    category: 'Earrings',
    material: 'Gold',
    price: 18500,
    image: img('photo-1617038220319-276d3cfab638'),
    description:
      'Polished gold hoop earrings.\nLightweight with a bold shine.\nPerfect from morning to midnight.',
    rating: 4.5,
    sizes: ['One Size'],
    stock: 12,
    available: true,
    createdAt: 2,
  },
  {
    id: 'p-heart-pendant',
    name: 'Heart Pendant',
    category: 'Pendants',
    material: 'Gold',
    price: 15000,
    image: img('photo-1602173574767-37ac01994b2a'),
    description:
      'Sweet heart pendant in warm gold.\nA gift-ready keepsake piece.\nIncludes a fine link chain.',
    rating: 4.7,
    sizes: ['16', '18'],
    stock: 4,
    available: true,
    createdAt: 1,
  },
  {
    id: 'p-diamond-pendant',
    name: 'Diamond Pendant',
    category: 'Pendants',
    material: 'Diamond',
    price: 32000,
    image: img('photo-1535632066927-ab7c9ab60908'),
    description:
      'Dainty diamond pendant necklace.\nUnderstated sparkle, endless wear.\nSet in solid 18K gold.',
    rating: 4.8,
    sizes: ['16', '18'],
    stock: 6,
    available: true,
    createdAt: 7,
  },
  {
    id: 'p-platinum-ring',
    name: 'Platinum Ring',
    category: 'Rings',
    material: 'Platinum',
    price: 55000,
    image: img('photo-1515562141207-7a88fb7ce338'),
    description:
      'Sculpted platinum band with pavé diamonds.\nRare metal, remarkable shine.\nCrafted to be worn for generations.',
    rating: 4.9,
    sizes: ['6', '7', '8'],
    stock: 3,
    available: true,
    createdAt: 8,
  },
];

export const BANNER_IMAGE = img('photo-1599643478518-a784e5dc4c8f');
