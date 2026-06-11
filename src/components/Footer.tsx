import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Lock, Instagram, Facebook, Youtube } from 'lucide-react';
import { useSiteContent } from '../lib/SiteContentContext';

const COLUMNS = [
  {
    heading: 'Shop Weaves',
    links: [
      { label: 'Kalyani Cotton Collection', to: '/shop?type=cotton' },
      { label: 'Pure Soft Silk Edit', to: '/shop?type=silk' },
      { label: 'Exclusive Offers', to: '/offers' },
      { label: 'Our Story & Heritage', to: '/about' },
    ],
  },
  {
    heading: 'Customer Help',
    links: [
      { label: 'Track Order', to: '/checkout' },
      { label: 'Shipping & Returns Policy', to: '/about' },
      { label: 'Saree Care Guide', to: '/about' },
      { label: 'Contact Loom Representatives', to: '/contact' },
    ],
  },
  {
    heading: 'Reach Boutiques',
    links: [
      { label: 'WhatsApp Live Orders', to: 'https://wa.me/918891182501', external: true },
      { label: 'Store Address Locator', to: '/contact' },
      { label: '+91 88911 82501', to: 'tel:+918891182501', external: true },
      { label: 'a1sanskritisilks@gmail.com', to: 'mailto:a1sanskritisilks@gmail.com', external: true },
    ],
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Silk Mark Certified' },
  { icon: Truck, label: 'Free Shipping India' },
  { icon: CreditCard, label: 'COD & Online Pay' },
  { icon: Lock, label: 'Secure Checkout' },
];

function HeritageShowcase() {
  const { content } = useSiteContent();
  const items = content.footer.showcase || [];

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <span className="eyebrow">The Loom Edit</span>
        <h3 className="font-serif text-xl sm:text-2xl text-white mt-1 font-medium tracking-wide">
          Heritage & Weaving Spotlight
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="group relative rounded-sm overflow-hidden border border-gold/15 bg-wine-deep shadow-xl transition-all duration-300">
            {/* Image aspect ratio container */}
            <div className="aspect-[4/5] overflow-hidden relative">
              <img 
                src={item.src} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {/* Elegant dark gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="font-script text-[20px] text-gold-soft block leading-none mb-1.5">{item.title}</span>
                  <span className="text-[9px] tracking-widest text-white/70 uppercase block">{item.desc}</span>
                </div>
              </div>
            </div>
            {/* Active sweep line */}
            <div className="h-0.5 w-0 bg-gold group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const { content } = useSiteContent();
  const logos = content.logos || {
    header: "/logo.png",
    footer: "/logo.png",
    desktopWidth: 160,
    desktopHeight: 50,
    footerSpacing: 20,
    fit: "contain"
  };
  const layout = content.layout || { spotlight: true };
  const socials = (content.socials || {
    instagram: { enabled: true, url: "https://www.instagram.com/a1sanskritisilks" }
  }) as any;

  return (
    <footer 
      className="relative bg-[#170407] text-white/75 border-t border-gold/20 overflow-hidden font-sans"
      style={{
        paddingTop: logos.footerSpacing !== undefined ? `${logos.footerSpacing * 2.5}px` : '80px',
        paddingBottom: logos.footerSpacing !== undefined ? `${logos.footerSpacing * 1.5}px` : '48px',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Heritage Showcase Image Grid at the top */}
        {layout.spotlight !== false && <HeritageShowcase />}

        {/* Dynamic elegant divider */}
        {layout.spotlight !== false && (
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent my-16" />
        )}

        {/* Info Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-gold/10">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <div className="mb-4">
              <img
                src={logos.footer || '/logo.png'}
                alt="A1 Sanskriti Silks"
                className="object-contain"
                style={{
                  width: logos.desktopWidth ? `${logos.desktopWidth}px` : 'auto',
                  height: logos.desktopHeight ? `${logos.desktopHeight}px` : '50px',
                  objectFit: logos.fit === 'original' ? 'none' : logos.fit,
                  filter: 'brightness(0) invert(1) contrast(0.8)'
                }}
              />
            </div>
            <div className="font-serif text-[28px] font-semibold text-white leading-none tracking-wide">
              A1 Sanskriti
              <span className="block font-sans text-[9px] tracking-[0.55em] text-gold uppercase mt-2.5 font-semibold">
                Silks · Est. 1974
              </span>
            </div>
            <p className="text-[13px] leading-[1.7] text-white/50 font-light">
              Premium handwoven Kalyani cotton and pure soft silk sarees, crafted with the patience of generations.
            </p>
            <span className="font-script text-[20px] text-gold-soft/80 font-light block pt-1.5">
              Worn for the moments you will never forget.
            </span>

            {/* Social Icons row */}
            <div className="flex gap-3 pt-4">
              {socials.instagram?.enabled && (
                <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white/60 hover:text-gold-soft grid place-items-center transition-all" aria-label="Instagram">
                  <Instagram size={14} />
                </a>
              )}
              {socials.facebook?.enabled && (
                <a href={socials.facebook.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white/60 hover:text-gold-soft grid place-items-center transition-all" aria-label="Facebook">
                  <Facebook size={14} />
                </a>
              )}
              {socials.youtube?.enabled && (
                <a href={socials.youtube.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white/60 hover:text-gold-soft grid place-items-center transition-all" aria-label="YouTube">
                  <Youtube size={14} />
                </a>
              )}
              {socials.pinterest?.enabled && (
                <a href={socials.pinterest.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white/60 hover:text-gold-soft grid place-items-center transition-all text-xs font-semibold" aria-label="Pinterest">
                  P
                </a>
              )}
              {socials.threads?.enabled && (
                <a href={socials.threads.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white/60 hover:text-gold-soft grid place-items-center transition-all text-xs font-semibold" aria-label="Threads">
                  T
                </a>
              )}
            </div>
          </div>

          {/* Navigation link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-5">
              <h4 className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold-soft font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rotate-45 inline-block shrink-0" />
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.to}
                        target={l.to.startsWith('http') ? '_blank' : undefined}
                        rel={l.to.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="relative inline-block text-[13px] text-white/55 transition-all duration-300 hover:text-gold-soft hover:translate-x-1 font-light after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-gold/40 after:transition-all hover:after:w-full"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        className="relative inline-block text-[13px] text-white/55 transition-all duration-300 hover:text-gold-soft hover:translate-x-1 font-light after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-gold/40 after:transition-all hover:after:w-full"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Seal Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-gold/10 text-center bg-white/[0.01]">
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-3 text-white/70 group">
                <div className="w-10 h-10 rounded-full border border-gold/15 flex items-center justify-center text-gold group-hover:border-gold-soft group-hover:text-gold-soft transition-all duration-300 bg-[#3a0c16]/30">
                  <Icon size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/80 group-hover:text-gold-soft transition-colors duration-300">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Brand Watermark Overlay */}
        <div className="mt-12 select-none pointer-events-none text-center">
          <div className="font-serif text-[7.5vw] md:text-[6vw] font-bold tracking-[0.45em] text-white/[0.02] uppercase leading-none">
            Sanskriti Silks
          </div>
        </div>

        {/* Bottom Copyright & Fine Print */}
        <div className="mt-10 pt-4 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.18em] text-white/30 uppercase font-light">
          <span>© 2026 A1 Sanskriti Silks · Pure Heritage Handloom Registry #S-1974</span>
          <div className="flex gap-8">
            <span className="hover:text-gold-soft cursor-pointer transition-colors duration-300">Privacy Policy</span>
            <span className="hover:text-gold-soft cursor-pointer transition-colors duration-300">Terms of Sale</span>
            <span className="hover:text-gold-soft cursor-pointer transition-colors duration-300">Authenticity Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
