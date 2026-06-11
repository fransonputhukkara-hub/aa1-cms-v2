import type { Product } from '../types';

export interface ProductGroup {
  rep: Product;            // representative variant (for the card)
  variants: Product[];     // all colours in this style
  colors: (string | null)[];
}

/** Group flat variants by their style name. */
export function groupProducts(products: Product[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>();
  for (const p of products) {
    const g = map.get(p.group);
    if (!g) {
      map.set(p.group, { rep: p, variants: [p], colors: p.color ? [p.color] : [] });
    } else {
      g.variants.push(p);
      if (p.color && !g.colors.includes(p.color)) g.colors.push(p.color);
    }
  }
  return [...map.values()];
}

export function variantsOf(products: Product[], group: string): Product[] {
  return products.filter((p) => p.group === group);
}

const NAMED: Record<string, string> = {
  red: '#b3202a', maroon: '#6b1a1a', wine: '#6b1a1a', blue: '#1a4a8a', navy: '#1a2a4a',
  green: '#1a5e3a', olive: '#6b6b1a', teal: '#1a8a8a', black: '#222222', white: '#f2efe6',
  cream: '#f5ead0', offwhite: '#f5efe0', gold: '#c9a84c', mustard: '#d6a821', yellow: '#e8b84b',
  orange: '#e07b2a', pink: '#e05a8a', rose: '#d96a86', magenta: '#b3247a', purple: '#6b3aa0',
  violet: '#7a4fb0', lavender: '#b9a0d8', grey: '#8a8a8a', gray: '#8a8a8a', silver: '#c7c7c7',
  brown: '#7a5230', beige: '#d8c4a0', peach: '#f0a987', mint: '#a8d8c0', sky: '#8ec5e8',
};
/** Best-effort CSS colour for a colour name. */
export function colorHex(name: string | null): string {
  if (!name) return '#c9a84c';
  const k = name.trim().toLowerCase().replace(/\s+/g, '');
  for (const key of Object.keys(NAMED)) if (k.includes(key)) return NAMED[key];
  return '#c9a84c';
}
