import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { colorHex } from '../lib/variants';
import type { Product } from '../types';

const FALLBACKS = ['silk', 's2', 's3', 's4'];

export default function ProductCard({
  product,
  index,
  colors = [],
}: {
  product: Product;
  index: number;
  colors?: (string | null)[];
}) {
  const { add } = useCart();
  const fb = FALLBACKS[index % FALLBACKS.length];
  const multi = colors.length > 1;
  // Card shows the style name (not the "- Red" suffix)
  const title = product.group || product.name;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block cursor-pointer" style={{ perspective: '1000px' }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative aspect-[3/4] rounded overflow-hidden mb-3.5 ${fb} transition-all duration-300`}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          boxShadow: isHovered ? '0 16px 32px rgba(106,27,45,0.08)' : 'none',
        }}
      >
        {product.isNew && (
          <span className="absolute top-3 left-3 z-[3] bg-white text-wine-deep text-[9px] tracking-[0.18em] uppercase px-2.5 py-[5px] rounded-sm font-semibold">
            New
          </span>
        )}
        {multi && (
          <span className="absolute top-3 right-3 z-[3] bg-wine-deep/90 text-white text-[9px] tracking-[0.12em] uppercase px-2.5 py-[5px] rounded-full font-semibold">
            {colors.length} colours
          </span>
        )}
        <img
          src={product.image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); add(product); }}
          className="absolute left-3 right-3 bottom-3 z-[3] bg-cream/95 text-wine-deep font-sans text-[11px] tracking-[0.18em] uppercase py-3 rounded-sm font-semibold opacity-0 translate-y-2.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:!bg-wine hover:!text-white"
        >
          {multi ? 'View colours' : 'Add to bag'}
        </button>
      </div>
      <div className="text-[10px] tracking-[0.22em] uppercase text-gold mb-1 font-medium">{product.type}</div>
      <h3 className="text-[20px] font-medium leading-tight">{title}</h3>
      <div className="flex items-center gap-2.5 mt-1.5">
        <span className="text-[15px] font-medium text-ink">{formatINR(product.price)}</span>
        {product.mrp && <span className="text-[12.5px] text-ink-soft line-through">{formatINR(product.mrp)}</span>}
      </div>
      {multi && (
        <div className="flex items-center gap-1.5 mt-2">
          {colors.slice(0, 6).map((c, i) => (
            <span key={i} title={c ?? ''} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: colorHex(c) }} />
          ))}
          {colors.length > 6 && <span className="text-[10px] text-ink-soft">+{colors.length - 6}</span>}
        </div>
      )}
    </Link>
  );
}
