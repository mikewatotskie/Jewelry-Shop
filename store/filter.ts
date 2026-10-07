import { Category, Material, Product } from './data';

export type SortKey = 'popular' | 'newest' | 'oldest' | 'low' | 'high' | 'rating';

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Popularity' },
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'low', label: 'Low Price' },
  { key: 'high', label: 'High Price' },
  { key: 'rating', label: 'Rating' },
];

export interface FilterState {
  category: Category | 'All';
  sort: SortKey;
  min: string;
  max: string;
  materials: Material[];
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  sort: 'popular',
  min: '',
  max: '',
  materials: [],
};

export function matchesQuery(p: Product, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  // Token-prefix matching: "ring" finds Rings but not Earrings,
  // while "earring", "diam", "gold" still match intuitively.
  const tokens = `${p.name} ${p.category} ${p.material}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return tokens.some((t) => t.startsWith(query));
}

export function applyFilters(products: Product[], query: string, f: FilterState): Product[] {
  const min = f.min.trim() === '' ? 0 : Number(f.min);
  const max = f.max.trim() === '' ? Infinity : Number(f.max);
  const lo = Number.isFinite(min) ? min : 0;
  const hi = Number.isFinite(max) ? max : Infinity;
  const out = products.filter(
    (p) =>
      matchesQuery(p, query) &&
      (f.category === 'All' || p.category === f.category) &&
      (f.materials.length === 0 || f.materials.includes(p.material)) &&
      p.price >= lo &&
      p.price <= hi,
  );
  switch (f.sort) {
    case 'low':
      return out.sort((a, b) => a.price - b.price);
    case 'high':
      return out.sort((a, b) => b.price - a.price);
    case 'rating':
      return out.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return out.sort((a, b) => b.createdAt - a.createdAt);
    case 'oldest':
      return out.sort((a, b) => a.createdAt - b.createdAt);
    default:
      return out.sort((a, b) => b.rating * b.stock - a.rating * a.stock);
  }
}
