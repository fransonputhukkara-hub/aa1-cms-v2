import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import type { Product } from '../types';

interface Props {
  products: Product[];
}

export default function Bestsellers({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.offsetWidth * 0.7;
    el.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="py-16 sm:py-[90px] bg-ivory">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow">Customer favourites</div>
            <h2 className="text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] mt-2.5 text-wine-deep">
              Bestsellers
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-wine/20 grid place-items-center text-wine hover:bg-wine hover:text-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-wine/20 grid place-items-center text-wine hover:bg-wine hover:text-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </Reveal>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-[22px] overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-5 px-5 sm:-mx-7 sm:px-7 scrollbar-hide"
        >
          {products.map((p, i) => (
            <div key={p.id} className="shrink-0 w-[68%] sm:w-[calc(25%-17px)] snap-start">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
