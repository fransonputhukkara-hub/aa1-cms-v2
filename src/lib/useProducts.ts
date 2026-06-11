import { useEffect, useState } from 'react';
import { supabase, type DbProduct } from './supabase';
import type { Product, SareeType } from '../types';

export function toProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    group: p.group_name ?? p.name,
    color: p.color,
    type: (p.category as SareeType) ?? 'Kalyani Cotton',
    price: Number(p.selling_rate),
    mrp: p.mrp == null ? null : Number(p.mrp),
    isNew: p.is_new,
    image: p.image_url ?? '',
    stock: Number(p.in_stock),
  };
}

/** Live products (each colour is a variant) from the shared POS inventory. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .rpc('get_online_products')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProducts(((data as DbProduct[]) || []).map(toProduct).filter((p) => p.stock > 0));
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
