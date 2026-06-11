import { useState } from 'react';
import { useProducts } from '../lib/useProducts';
import { useSEO } from '../lib/useSEO';
import { useGeo } from '../lib/useGeo';
import ProductCard from '../components/ProductCard';
import { Tag, Sparkles, Truck, Check, Copy } from 'lucide-react';

const COUPONS = [
  {
    code: 'WELCOMESILK',
    discount: 'Flat ₹500 Off',
    title: 'Your First Soft Silk Saree',
    desc: 'Unlock timeless elegance. Valid on all pure soft silk sarees for first-time buyers.',
    minPurchase: 'No minimum order value',
  },
  {
    code: 'KALYANI10',
    discount: '10% Off',
    title: 'Kalyani Cotton Heritage',
    desc: 'Celebrate daily handwoven grace. Save 10% on any Kalyani Cotton sarees.',
    minPurchase: 'Min. order of ₹2,500',
  },
  {
    code: 'ARTISAN15',
    discount: '15% Off',
    title: 'Artisan Support Fest',
    desc: 'Support our weaving clusters in Kanchipuram and Salem. Get 15% off when you purchase 2 or more sarees.',
    minPurchase: 'Buy 2 or more sarees',
  },
];

export default function Offers() {
  const { products, loading } = useProducts();
  const { geo } = useGeo();
  const [copied, setCopied] = useState<string | null>(null);

  useSEO({
    title: 'Special Purchase Offers',
    description: 'Explore handwoven soft silk and Kalyani cotton sarees at exclusive prices. Limited time discounts, active promotions, and seasonal artisan deals.',
    keywords: 'saree offers, silk saree discount, kalyani cotton deals, handloom sales, a1 sanskriti silks discount code',
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  // Filter sale items (where MRP is higher than current price)
  const saleProducts = products.filter((p) => p.mrp && p.mrp > p.price);

  // Fallback: If no products have direct discount, simulate sale items by showing best sellers
  const displayProducts = saleProducts.length > 0 ? saleProducts : products.slice(0, 4);

  return (
    <div className="bg-cream min-h-screen">
      {/* Geotargeted Announcement Bar */}
      {geo && (
        <div className="bg-wine text-gold-soft text-xs tracking-wider py-3 px-4 text-center font-medium animate-fadeUp">
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} />
            Exclusive Delivery Benefit: Free shipping to{' '}
            <strong className="underline decoration-gold">{geo.region}, {geo.country_name}</strong>{' '}
            applied at checkout!
          </span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative py-20 px-5 sm:px-7 text-center overflow-hidden bg-wine-deep text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(106,27,45,0.4)_0%,rgba(40,9,17,0.8)_100%)] z-0" />
        <div className="absolute inset-0 grain opacity-[0.05] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="eyebrow !text-gold-soft mb-3 inline-block">Exclusive Collections</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
            Curated <em className="italic text-gold-soft font-serif">Purchase Offers</em>
          </h1>
          <p className="text-white/85 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto">
            Woven with legacy, shared with gratitude. Explore our active discount codes and handloom collections curated at special rates.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-16">
        {/* Section 1: Coupons */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="eyebrow">Promo Codes</span>
            <h2 className="text-3xl font-medium mt-1">Unlock Additional Blessings</h2>
            <div className="h-0.5 w-12 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COUPONS.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white border border-wine/10 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_24px_rgba(106,27,45,0.02)] relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(106,27,45,0.06)] transition-all duration-300"
              >
                {/* Visual Accent */}
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-gold/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
                
                <div>
                  <div className="flex items-center gap-2 text-wine font-medium text-[11px] tracking-[0.2em] uppercase mb-4">
                    <Tag size={12} className="text-gold" />
                    {coupon.discount}
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-wine mb-2">{coupon.title}</h3>
                  <p className="text-ink-soft text-sm font-light leading-relaxed mb-6">{coupon.desc}</p>
                </div>

                <div>
                  <div className="border-t border-dashed border-wine/10 pt-4 mb-4 flex items-center justify-between">
                    <span className="text-[10px] tracking-wider text-ink-soft/80 uppercase">{coupon.minPurchase}</span>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className={`w-full py-3 px-4 rounded-sm border font-sans text-xs tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      copied === coupon.code
                        ? 'bg-wine text-white border-wine'
                        : 'border-wine/20 text-wine hover:bg-wine hover:text-white hover:border-wine'
                    }`}
                  >
                    {copied === coupon.code ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy Code: {coupon.code}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Sale Products */}
        <div>
          <div className="text-center mb-12">
            <span className="eyebrow">Curated Specials</span>
            <h2 className="text-3xl font-medium mt-1">Special Edition Sarees</h2>
            <div className="h-0.5 w-12 bg-gold mx-auto mt-4" />
            <p className="text-ink-soft text-sm font-light max-w-md mx-auto mt-4">
              Handpicked weaves at limited-edition rates. Each saree includes free falls and picos on request.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-wine/5 aspect-[3/4] rounded mb-4" />
                  <div className="h-3 bg-wine/5 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-wine/5 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-wine/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
              {displayProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          )}
        </div>

        {/* Local/Geo Offer Details */}
        <div className="bg-wine-deep text-white rounded-sm p-8 mt-20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-[0.04] pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2 text-gold-soft font-semibold text-xs tracking-widest uppercase">
              <Sparkles size={14} />
              Handloom Authenticity Guarantee
            </div>
            <h3 className="text-2xl font-serif font-medium mb-3">Direct Support to Weavers</h3>
            <p className="text-white/80 text-sm font-light leading-relaxed">
              Every purchase you make directly supports over 140 weaver families across Kanchipuram, Salem, and Rasipuram. We ensure fair wages, ethical conditions, and support for the continuation of traditional jacquard and korvai artistry.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <a href="/shop" className="btn btn-gold whitespace-nowrap">
              Explore Entire Catalog
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
