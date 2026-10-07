import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { initDatabase, loadProducts, loadValue, saveValue, transaction, writeProducts } from '@/services/db';
import { useDatabaseState } from '@/services/useDatabaseState';
import {
  CartItem,
  DEFAULT_SETTINGS,
  Order,
  OrderLine,
  OrderStatus,
  PaymentMethod,
  Product,
  SEED_PRODUCTS,
  Settings,
} from './data';

const STORAGE_KEY = 'jewelry-shop-v1';

interface Persisted {
  products: Product[];
  favorites: string[];
  cart: CartItem[];
  orders: Order[];
  recentSearches: string[];
  settings: Settings;
}

interface ShopContextValue extends Persisted {
  loaded: boolean;
  cartCount: number;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  purchasable: (p: Product) => boolean;
  addToCart: (productId: string, size: string, qty?: number) => void;
  updateQty: (productId: string, size: string, delta: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  subtotal: () => number;
  placeOrder: (args: {
    customer: { name: string; contact: string; address: string };
    payment: PaymentMethod;
    deliveryFee: number;
    discount: number;
  }) => Order | null;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  setStock: (id: string, stock: number) => void;
  setAvailability: (id: string, available: boolean) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
  resetDemo: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

function withAvailability(p: Product): Product {
  if (p.stock <= 0) return { ...p, available: false };
  return p;
}

function seed(): Persisted {
  return {
    products: [],
    favorites: [],
    cart: [],
    orders: [],
    recentSearches: [],
    settings: DEFAULT_SETTINGS,
  };
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, setState, hydrateState] = useDatabaseState<Persisted>(seed(), persistState);
  const [loaded, setLoaded] = useState(false);
  const [startupError, setStartupError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setStartupError('');
    (async () => {
      try {
        let legacy: Partial<Persisted> = {};
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (raw) legacy = JSON.parse(raw) as Partial<Persisted>;
        } catch { /* New database remains usable if old JSON is corrupt. */ }
        const defaults = { ...seed(), ...legacy, settings: { ...DEFAULT_SETTINGS, ...legacy.settings } };
        const { products: oldProducts, ...other } = defaults;
        await initDatabase(Array.isArray(legacy.products) ? oldProducts : SEED_PRODUCTS.slice(0, 6), { state: other });
        if (!active) return;
        hydrateState({ ...defaults, ...loadValue('state', other), products: loadProducts<Product>() });
        setLoaded(true);
      } catch (error) {
        if (active) setStartupError(error instanceof Error ? error.message : 'Please restart the app and try again.');
      }
    })();
    return () => { active = false; };
  }, [hydrateState, attempt]);

  const getProduct = useCallback(
    (id: string) => state.products.find((p) => p.id === id),
    [state.products],
  );

  const purchasable = useCallback((p: Product) => p.available && p.stock > 0, []);

  const isFavorite = useCallback((id: string) => state.favorites.includes(id), [state.favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  }, [setState]);

  const addToCart = useCallback(
    (productId: string, size: string, qty = 1) => {
      const p = getProduct(productId);
      if (!p || !purchasable(p)) return;
      const safeQty = Math.max(1, Math.min(qty, p.stock));
      setState((s) => {
        const idx = s.cart.findIndex((c) => c.productId === productId && c.size === size);
        if (idx >= 0) {
          const next = [...s.cart];
          next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + safeQty, p.stock) };
          return { ...s, cart: next };
        }
        return { ...s, cart: [...s.cart, { productId, size, qty: safeQty }] };
      });
    },
    [getProduct, purchasable, setState],
  );

  const updateQty = useCallback(
    (productId: string, size: string, delta: number) => {
      setState((s) => {
        const p = s.products.find((x) => x.id === productId);
        const cap = p ? Math.max(p.stock, 1) : 99;
        const next = s.cart
          .map((c) =>
            c.productId === productId && c.size === size
              ? { ...c, qty: Math.max(0, Math.min(c.qty + delta, cap)) }
              : c,
          )
          .filter((c) => c.qty > 0);
        return { ...s, cart: next };
      });
    },
    [setState],
  );

  const removeFromCart = useCallback((productId: string, size: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((c) => !(c.productId === productId && c.size === size)) }));
  }, [setState]);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), [setState]);

  const subtotal = useCallback(() => {
    return state.cart.reduce((sum, c) => {
      const p = state.products.find((x) => x.id === c.productId);
      return sum + (p ? p.price * c.qty : 0);
    }, 0);
  }, [state.cart, state.products]);

  const cartCount = useMemo(() => state.cart.reduce((n, c) => n + c.qty, 0), [state.cart]);

  const placeOrder: ShopContextValue['placeOrder'] = useCallback(
    ({ customer, payment, deliveryFee, discount }) => {
      const lines: OrderLine[] = [];
      for (const c of state.cart) {
        const p = state.products.find((x) => x.id === c.productId);
        if (!p || !p.available || p.stock <= 0) continue;
        const qty = Math.min(c.qty, p.stock);
        lines.push({ productId: p.id, name: p.name, image: p.image, price: p.price, size: c.size, qty });
      }
      if (!lines.length) return null;
      const sub = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
      const total = Math.max(0, sub + deliveryFee - discount);
      const order: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1296)
          .toString(36)
          .toUpperCase()
          .padStart(2, '0')}`,
        date: Date.now(),
        items: lines,
        subtotal: sub,
        deliveryFee,
        discount,
        total,
        payment,
        status: 'Pending',
        customer,
      };
      const soldQty = new Map<string, number>();
      for (const l of lines) soldQty.set(l.productId, (soldQty.get(l.productId) ?? 0) + l.qty);
      setState((s) => ({
        ...s,
        products: s.products.map((p) => {
          const sold = soldQty.get(p.id) ?? 0;
          if (!sold) return p;
          return withAvailability({ ...p, stock: Math.max(0, p.stock - sold) });
        }),
        cart: [],
        orders: [order, ...s.orders],
      }));
      return order;
    },
    [setState, state.cart, state.products],
  );

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
  }, [setState]);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = withAvailability({
      ...p,
      id: `p-${Date.now().toString(36)}-${Math.floor(Math.random() * 1296).toString(36)}`,
      createdAt: Date.now(),
    });
    setState((s) => ({ ...s, products: [product, ...s.products] }));
    return product;
  }, [setState]);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? withAvailability({ ...p, ...patch, id: p.id }) : p)),
    }));
  }, [setState]);

  const deleteProduct = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
      favorites: s.favorites.filter((f) => f !== id),
      cart: s.cart.filter((c) => c.productId !== id),
    }));
  }, [setState]);

  const adjustStock = useCallback((id: string, delta: number) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => {
        if (p.id !== id) return p;
        const stock = Math.max(0, Math.round(p.stock + delta));
        // Restocking from zero re-enables; zeroing auto-disables; otherwise keep manual flag.
        const available = stock <= 0 ? false : p.stock === 0 ? true : p.available;
        return { ...p, stock, available };
      }),
    }));
  }, [setState]);

  const setStock = useCallback((id: string, stock: number) => {
    if (!Number.isFinite(stock)) return;
    setState((s) => ({
      ...s,
      products: s.products.map((p) => {
        if (p.id !== id) return p;
        const next = Math.max(0, Math.floor(stock));
        const available = next <= 0 ? false : p.stock === 0 ? true : p.available;
        return { ...p, stock: next, available };
      }),
    }));
  }, [setState]);

  const setAvailability = useCallback((id: string, available: boolean) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, available: p.stock > 0 && available } : p)),
    }));
  }, [setState]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, [setState]);

  const addRecentSearch = useCallback((q: string) => {
    const query = q.trim();
    if (!query) return;
    setState((s) => ({
      ...s,
      recentSearches: [query, ...s.recentSearches.filter((r) => r.toLowerCase() !== query.toLowerCase())].slice(0, 8),
    }));
  }, [setState]);

  const clearRecentSearches = useCallback(() => setState((s) => ({ ...s, recentSearches: [] })), [setState]);

  const resetDemo = useCallback(() => setState({ ...seed(), products: SEED_PRODUCTS.slice(0, 6) }), [setState]);

  const value: ShopContextValue = {
    ...state,
    loaded,
    cartCount,
    isFavorite,
    toggleFavorite,
    getProduct,
    purchasable,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    subtotal,
    placeOrder,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    setStock,
    setAvailability,
    updateSettings,
    addRecentSearch,
    clearRecentSearches,
    resetDemo,
  };

  if (!loaded) return <DatabaseStatus error={startupError} onRetry={() => setAttempt((a) => a + 1)} />;
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

function persistState(next: Persisted): Persisted {
  return transaction(() => {
    const { products, ...other } = next;
    const savedProducts = writeProducts(products);
    saveValue('state', other);
    return { ...other, products: savedProducts };
  });
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
