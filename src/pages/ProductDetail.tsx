import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Check, Truck, Scissors, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { description, specs } from '../lib/productInfo';
import { singleItemMessage, whatsappUrl } from '../lib/whatsapp';
import { useProducts } from '../lib/useProducts';
import { variantsOf, colorHex } from '../lib/variants';
import StickyCartBar from '../components/StickyCartBar';

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { products } = useProducts();

  const initial = products.find((p) => p.id === id);
  const variants = initial ? variantsOf(products, initial.group) : [];
  const [activeId, setActiveId] = useState<string | null>(null);
  // Selected colour variant (falls back to the URL one)
  const product = variants.find((v) => v.id === activeId) ?? initial;

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-32 text-center">
        <h1 className="font-serif text-4xl text-wine-deep mb-4">Saree not found</h1>
        <Link to="/shop" className="btn btn-gold">Back to shop</Link>
      </div>
    );
  }

  const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  if (!product && products.length === 0) {
    return <div className="max-w-[1280px] mx-auto px-5 py-32 text-center text-ink-soft">Loading...</div>;
  }

  const related = products.filter((p) => p.type === product?.type && p.id !== product?.id).slice(0, 4);

  return (
    <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-8 sm:py-12">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-8">
        <Link to="/" className="hover:text-wine">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-wine">Shop</Link>
        <ChevronRight size={13} />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* image */}
        <div className="relative aspect-[4/5] rounded overflow-hidden bg-wine sticky top-24 self-start">
          {product.isNew && (
            <span className="absolute top-4 left-4 z-[3] bg-white text-wine-deep text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm font-semibold">
              New
            </span>
          )}
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* info */}
        <div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-gold mb-2 font-medium">{product.type}</div>
          <h1 className="font-serif text-[clamp(2.2rem,4vw,3rem)] font-medium leading-tight text-wine-deep">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-medium text-ink">{formatINR(product.price)}</span>
            {product.mrp && <span className="text-base text-ink-soft line-through">{formatINR(product.mrp)}</span>}
            {discount > 0 && (
              <span className="text-[11px] tracking-[0.1em] uppercase text-white bg-wine px-2 py-1 rounded-sm">
                {discount}% off
              </span>
            )}
          </div>
          <p className="text-[12px] text-ink-soft mt-1.5 font-light">Inclusive of all taxes</p>

          {variants.length > 1 && (
            <div className="mt-6">
              <div className="text-[12px] tracking-[0.12em] uppercase text-ink-soft mb-2.5">
                Colour: <span className="text-ink font-medium">{product.color ?? '—'}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {variants.map((v) => {
                  const out = v.stock <= 0;
                  const sel = v.id === product.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => { setActiveId(v.id); setQty(1); }}
                      disabled={out}
                      title={`${v.color ?? ''}${out ? ' (out of stock)' : ` — ${v.stock} left`}`}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all ${sel ? 'border-wine scale-110' : 'border-black/10 hover:border-wine/50'} ${out ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={{ background: colorHex(v.color) }}
                    >
                      {out && <span className="absolute inset-0 grid place-items-center text-white text-[15px]">×</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[13px] text-ink-soft">Availability:</span>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
            </span>
          </div>

          <p className="text-ink-soft text-[15px] leading-[1.8] mt-5 font-light">{description(product)}</p>

          {/* Qty */}
          <div className="flex items-center gap-3 mt-8">
            <span className="text-[12px] tracking-[0.12em] uppercase text-ink-soft">Qty</span>
            <div className="inline-flex items-center border border-wine/20 rounded-sm">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 grid place-items-center text-wine" aria-label="Decrease">
                <Minus size={15} />
              </button>
              <span className="w-10 text-center text-[15px]">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-11 h-11 grid place-items-center text-wine" aria-label="Increase">
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => add(product, qty)}
              className="flex-1 border border-wine text-wine text-[11px] tracking-[0.18em] uppercase font-semibold py-3.5 rounded-sm hover:bg-wine hover:text-white transition-colors"
            >
              Add to cart
            </button>
            <button
              onClick={() => { add(product, qty); navigate('/checkout'); }}
              className="flex-1 bg-wine-deep text-white text-[11px] tracking-[0.18em] uppercase font-semibold py-3.5 rounded-sm hover:bg-wine transition-colors"
            >
              Buy it now
            </button>
          </div>

          <a
            href={whatsappUrl(singleItemMessage(product, qty))}
            target="_blank"
            rel="noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 font-sans text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-sm bg-[#25D366] text-white transition-opacity hover:opacity-90"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.2.2-3.7-.9a9.3 9.3 0 0 1-3.8-3.4c-.3-.5-1-1.6-1-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7s.7 1.2 1.5 1.9c1 .9 1.8 1.1 2.1 1.3s.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.8-.1 1.4z"/></svg>
            Order on WhatsApp
          </a>

          {/* trust strip */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-wine/10 text-center">
            {[
              { Icon: Truck, label: 'Free shipping' },
              { Icon: Scissors, label: 'Blouse + fall' },
              { Icon: RotateCcw, label: '7-day returns' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <Icon size={20} strokeWidth={1.4} className="text-wine" />
                <span className="text-[10.5px] tracking-[0.1em] uppercase text-ink-soft">{label}</span>
              </div>
            ))}
          </div>

          {/* specs */}
          <div className="mt-8 border-t border-wine/10 pt-6">
            <h3 className="font-serif text-2xl text-wine-deep mb-4">Details</h3>
            <dl className="divide-y divide-wine/10">
              {specs(product).map((s) => (
                <div key={s.label} className="flex justify-between py-2.5 text-[14px]">
                  <dt className="text-ink-soft">{s.label}</dt>
                  <dd className="text-ink font-medium text-right max-w-[60%]">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-2 mt-4 text-[13px] text-ink-soft">
              <Check size={15} className="text-wine" />
              In stock — ready to ship
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-20 sm:mt-28">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium text-wine-deep text-center mb-10">
            You may also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-[26px]">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      <StickyCartBar product={product} />
    </div>
  );
}
