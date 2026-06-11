import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../lib/useProducts';
import { groupProducts } from '../lib/variants';
import type { SareeType } from '../types';

type FilterKey = 'all' | 'cotton' | 'silk';

const FILTERS: { key: FilterKey; label: string; type?: SareeType }[] = [
  { key: 'all', label: 'All Sarees' },
  { key: 'cotton', label: 'Kalyani Cotton', type: 'Kalyani Cotton' },
  { key: 'silk', label: 'Soft Silk', type: 'Soft Silk' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { products, loading } = useProducts();
  const active = (params.get('type') as FilterKey) || 'all';
  const current = FILTERS.find((f) => f.key === active) ?? FILTERS[0];

  const list = current.type ? products.filter((p) => p.type === current.type) : products;
  const groups = groupProducts(list);

  return (
    <section className="py-12 sm:py-16 min-h-[70vh]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7">
        <div className="text-center max-w-[620px] mx-auto mb-9">
          <div className="eyebrow">Shop</div>
          <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.05] my-3 text-wine-deep">
            {current.key === 'all' ? 'The full collection' : current.label}
          </h1>
          <p className="text-ink-soft text-[15px] font-light">
            Handwoven sarees with a blouse piece, free fall &amp; pico on request.
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mb-10 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setParams(f.key === 'all' ? {} : { type: f.key })}
              className={`font-sans text-[11.5px] sm:text-xs tracking-[0.16em] uppercase px-5 py-2.5 rounded-sm border transition-all ${
                active === f.key ? 'bg-wine text-white border-wine' : 'bg-transparent text-ink-soft border-wine/20 hover:border-wine hover:text-wine'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-center text-[12px] tracking-[0.12em] uppercase text-ink-soft mb-8">
          {loading ? 'Loading...' : `${groups.length} ${groups.length === 1 ? 'design' : 'designs'}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-[26px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-wine/5 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-[26px]">
            {groups.map((g, i) => (
              <ProductCard key={g.rep.id} product={g.rep} index={i} colors={g.colors} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
