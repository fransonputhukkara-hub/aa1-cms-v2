import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function StickyCartBar({ product }: Props) {
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const navigate = useNavigate();

  const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-wine/10 shadow-[0_-4px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-3 flex items-center justify-between gap-4">
        {/* Price section */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-lg sm:text-xl font-semibold text-wine-deep">{formatINR(product.price)}</span>
          {product.mrp && (
            <span className="text-sm text-ink-soft line-through hidden sm:inline">{formatINR(product.mrp)}</span>
          )}
          {discount > 0 && (
            <span className="text-[10px] tracking-[0.1em] uppercase text-white bg-wine px-2 py-0.5 rounded-sm hidden sm:inline">
              {discount}% off
            </span>
          )}
        </div>

        {/* Qty + buttons */}
        <div className="flex items-center gap-3">
          {/* Qty control */}
          <div className="hidden sm:inline-flex items-center border border-wine/20 rounded-sm">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 grid place-items-center text-wine hover:bg-wine/5 transition-colors"
              aria-label="Decrease"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-[14px]">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 grid place-items-center text-wine hover:bg-wine/5 transition-colors"
              aria-label="Increase"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => add(product, qty)}
            className="border border-wine text-wine text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-semibold px-4 sm:px-6 py-2.5 rounded-sm hover:bg-wine hover:text-white transition-colors"
          >
            Add to cart
          </button>
          <button
            onClick={() => { add(product, qty); navigate('/checkout'); }}
            className="bg-wine-deep text-white text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-semibold px-4 sm:px-6 py-2.5 rounded-sm hover:bg-wine transition-colors"
          >
            Buy it now
          </button>
        </div>
      </div>
    </div>
  );
}
