import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteContent } from '../lib/SiteContentContext';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/shop' },
  { label: 'Offers', to: '/offers' },
  { label: 'Our Story', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { content } = useSiteContent();

  const logos = content.logos || {
    header: "/logo.png",
    footer: "/logo.png",
    mobile: "/logo.png",
    desktopWidth: 160,
    desktopHeight: 50,
    mobileWidth: 120,
    mobileHeight: 40,
    headerSpacing: 15,
    footerSpacing: 20,
    fit: "contain"
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-[60] bg-cream/85 backdrop-blur-md border-b border-wine/10 transition-shadow ${
          scrolled ? 'shadow-[0_4px_30px_rgba(106,27,45,0.08)]' : ''
        }`}
      >
        <div 
          className="max-w-[1280px] mx-auto px-5 sm:px-7 min-h-[80px] flex items-center justify-between"
          style={{
            paddingTop: logos.headerSpacing !== undefined ? `${logos.headerSpacing}px` : '15px',
            paddingBottom: logos.headerSpacing !== undefined ? `${logos.headerSpacing}px` : '15px',
          }}
        >
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center border border-gold/20 hover:border-wine/30 hover:bg-wine/5 text-ink hover:text-wine transition-all duration-300 z-50 relative" 
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>

          <Link to="/" className="flex items-center group">
            {/* Desktop Logo */}
            <img
              src={logos.header || '/logo.png'}
              alt="A1 Sanskriti Silks"
              className="hidden md:block group-hover:scale-[1.04] transition-transform duration-300"
              style={{
                width: logos.desktopWidth ? `${logos.desktopWidth}px` : 'auto',
                height: logos.desktopHeight ? `${logos.desktopHeight}px` : '50px',
                objectFit: logos.fit === 'original' ? 'none' : logos.fit
              }}
            />
            {/* Mobile Logo */}
            <img
              src={logos.mobile || logos.header || '/logo.png'}
              alt="A1 Sanskriti Silks"
              className="block md:hidden group-hover:scale-[1.04] transition-transform duration-300"
              style={{
                width: logos.mobileWidth ? `${logos.mobileWidth}px` : 'auto',
                height: logos.mobileHeight ? `${logos.mobileHeight}px` : '40px',
                objectFit: logos.fit === 'original' ? 'none' : logos.fit
              }}
            />
          </Link>

          <nav className="hidden md:flex gap-4 text-[11.5px] tracking-[0.2em] uppercase">
            {NAV.map((n) => {
              const isActive = location.pathname === n.to;
              return (
                <Link
                  key={n.label}
                  to={n.to}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                    isActive 
                      ? 'bg-gold/5 border-gold/25 text-wine shadow-[0_2px_8px_rgba(199,154,62,0.04)] font-semibold' 
                      : 'border-transparent text-ink-soft hover:bg-gold/5 hover:border-gold/20 hover:text-wine'
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gold/20 hover:border-wine/30 hover:bg-wine/5 text-ink hover:text-wine transition-all duration-300" aria-label="Search">
              <Search size={17} strokeWidth={1.5} />
            </button>
            <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center border border-gold/20 hover:border-wine/30 hover:bg-wine/5 text-ink hover:text-wine transition-all duration-300" aria-label="Account">
              <User size={17} strokeWidth={1.5} />
            </button>
            <button 
              onClick={openCart} 
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gold/20 hover:border-wine/30 hover:bg-wine/5 text-ink hover:text-wine transition-all duration-300 relative" 
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-wine text-white font-sans text-[9px] font-semibold min-w-[16px] h-4 rounded-full grid place-items-center px-1 border border-cream animate-pulse">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-40 bg-cream/98 backdrop-blur-lg transition-all duration-500 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full justify-between pt-32 pb-12 px-8">
          <div className="flex flex-col gap-6 text-[22px] font-serif text-wine-deep">
            {NAV.map((n, i) => {
              const isActive = location.pathname === n.to;
              return (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className={`transition-all duration-300 flex items-center gap-3 ${
                    isActive ? 'text-wine font-semibold' : 'text-ink-soft hover:text-wine'
                  }`}
                  style={{
                    transitionDelay: mobileOpen ? `${i * 75}ms` : '0ms',
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: mobileOpen ? 1 : 0
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-gold rotate-45 shrink-0" />
                  {n.label}
                </Link>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="h-px bg-gold/20" />
            <div className="space-y-3 text-xs tracking-wider uppercase text-ink-soft">
              <p className="font-semibold text-gold">Reach Loom representatives</p>
              <a href="tel:+918891182501" className="block text-wine">+91 88911 82501</a>
              <a href="mailto:a1sanskritisilks@gmail.com" className="block text-wine">a1sanskritisilks@gmail.com</a>
            </div>
            <p className="text-[10px] tracking-widest text-ink-soft/60 uppercase">
              © 2026 A1 Sanskriti Silks
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

