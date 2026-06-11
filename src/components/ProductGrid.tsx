import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import ProductCard from './ProductCard';
import { groupProducts } from '../lib/variants';
import type { Product } from '../types';

interface ProductGridProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  tinted?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
}

export default function ProductGrid({ id, eyebrow, title, description, products, tinted, ctaHref, ctaLabel }: ProductGridProps) {
  const groups = groupProducts(products);
  return (
    <section id={id} className={`py-16 sm:py-[90px] ${tinted ? 'bg-ivory' : ''}`}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7">
        <Reveal className="text-center max-w-[620px] mx-auto mb-12 sm:mb-[52px]">
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.05] my-3.5 text-wine-deep">{title}</h2>
          <p className="text-ink-soft text-[15px] leading-relaxed font-light">{description}</p>
        </Reveal>

        <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-[26px]">
          {groups.map((g, i) => (
            <ProductCard key={g.rep.id} product={g.rep} index={i} colors={g.colors} />
          ))}
        </Reveal>

        {ctaHref && (
          <div className="text-center mt-12">
            <Link to={ctaHref} className="inline-block font-sans text-xs tracking-[0.2em] uppercase font-medium px-9 py-4 rounded-sm border border-wine/30 text-wine transition-all duration-300 hover:bg-wine hover:text-white hover:border-wine">
              {ctaLabel ?? 'View all'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
