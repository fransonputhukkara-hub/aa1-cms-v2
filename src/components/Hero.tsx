import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ShoppingBag, Sparkles, ArrowRight, BookOpen, Gift } from 'lucide-react';
import Reveal from './Reveal';
import { useSiteContent } from '../lib/SiteContentContext';

// 3D Tilt Image Component for Tactile Feel
function TiltImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 }); // Max 10 degrees rotation
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: x * 10, y: -y * 10 });
      setIsHovered(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      const clampedX = Math.max(-0.5, Math.min(0.5, x));
      const clampedY = Math.max(-0.5, Math.min(0.5, y));
      setTilt({ x: clampedX * 10, y: -clampedY * 10 });
      setIsHovered(true);
    }
  };

  const handleTouchEnd = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-sm group cursor-pointer shadow-2xl transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ perspective: '1000px' }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-[400ms] ease-out ${className}`}
        style={{
          transform: isHovered
            ? `scale(1.05) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
            : 'scale(1) rotateX(0deg) rotateY(0deg)',
          filter: isHovered ? 'brightness(1.04) contrast(1.02)' : 'brightness(1) contrast(1)',
        }}
      />
      {/* Light sweep glare effect on hover */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/12 to-white/0 pointer-events-none transition-transform duration-1000 ease-out" 
        style={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
        }}
      />
    </div>
  );
}

// Background Mandala SVG Ornament
function MandalaOrnament() {
  return (
    <svg 
      className="absolute -right-20 -bottom-20 w-80 h-80 text-gold/8 pointer-events-none animate-[spin_100s_linear_infinite]" 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="0.25"
    >
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="38" />
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="20" />
      <path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 50 + 20 * Math.cos(angle);
        const y1 = 50 + 20 * Math.sin(angle);
        const x2 = 50 + 46 * Math.cos(angle);
        const y2 = 50 + 46 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {[...Array(8)].map((_, i) => {
        const rot = i * 45;
        return (
          <path 
            key={i} 
            d="M50 12 Q42 30 50 48 Q58 30 50 12 Z" 
            transform={`rotate(${rot} 50 50)`} 
          />
        );
      })}
    </svg>
  );
}

export default function Hero() {
  const { content } = useSiteContent();
  const hero = content.hero;

  return (
    <div className="bg-wine-deep w-full relative">
      
      {/* SECTION 1: TRADITION (Blue Saree & Carved Door) */}
      <section className="min-h-[calc(100vh-80px)] w-full flex flex-col md:flex-row items-stretch relative overflow-hidden bg-[#faf6f0] py-12 md:py-0">
        {/* Left Side: Editorial Typography */}
        <Reveal className="w-full md:w-[45%] flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative z-10">
          <MandalaOrnament />
          
          <div className="mb-4 inline-flex items-center gap-1.5 text-wine uppercase text-[10px] tracking-[0.25em] font-semibold">
            <Sparkles size={11} className="text-gold" />
            <span>{hero.section1.eyebrow}</span>
          </div>
          
          <div className="my-8 md:my-10">
            <h2 className="font-script text-[clamp(4.8rem,11vw,7.8rem)] leading-[0.85] text-wine-deep normal-case font-light tracking-normal hover:scale-[1.02] transition-transform duration-500 origin-left">
              {hero.section1.title}
            </h2>
            <div className="h-px w-24 bg-wine/30 mt-6" />
          </div>

          <p className="text-ink-soft text-sm sm:text-base font-light leading-relaxed max-w-sm mb-6">
            {hero.section1.description}
          </p>

          <div className="flex items-center gap-2.5 text-[10px] tracking-[0.2em] uppercase text-ink-soft select-none mt-4">
            <ArrowDown size={14} className="animate-bounce text-wine" />
            <span>Scroll lookbook</span>
          </div>
        </Reveal>

        {/* Right Side: Blue Saree image (with mouse tilt) */}
        <Reveal className="w-full md:w-[55%] relative min-h-[45vh] md:min-h-auto flex items-stretch p-6 md:p-12">
          <TiltImage
            src={hero.section1.image}
            alt={hero.section1.title}
          />
        </Reveal>
      </section>

      {/* SECTION 2: TEMPLE ARTISTRY (Rust Saree) */}
      <section className="min-h-[calc(100vh-80px)] w-full flex flex-col md:flex-row-reverse items-stretch relative overflow-hidden bg-wine-deep text-white py-12 md:py-0">
        {/* Right Side: Context & Quotes */}
        <Reveal className="w-full md:w-[45%] flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative z-10 bg-wine-deep">
          <span className="eyebrow mb-2">{hero.section2.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium mb-6 leading-tight">
            {hero.section2.title}
          </h2>
          
          <blockquote className="border-l-2 border-gold pl-6 text-white/80 italic text-sm sm:text-base font-light leading-relaxed mb-8">
            "{hero.section2.quote}"
          </blockquote>

          <div className="flex gap-4">
            <Link to="/shop?type=silk" className="btn btn-gold flex items-center gap-2 shadow-lg shadow-black/25 hover:shadow-gold/15">
              <ShoppingBag size={14} />
              <span>Explore Silks</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] tracking-[0.2em] uppercase text-gold-soft select-none mt-8">
            <ArrowDown size={14} className="animate-bounce" />
            <span>Keep exploring</span>
          </div>
        </Reveal>

        {/* Left Side: Temple Saree Image */}
        <Reveal className="w-full md:w-[55%] relative min-h-[45vh] md:min-h-auto p-6 md:p-12">
          <TiltImage
            src={hero.section2.image}
            alt={hero.section2.title}
          />
        </Reveal>
      </section>

      {/* SECTION 3: HERITAGE (Vintage Car Courtyard) */}
      <section className="min-h-[calc(100vh-80px)] w-full flex flex-col md:flex-row items-stretch relative overflow-hidden bg-ivory py-12 md:py-0">
        {/* Left Side: Text Details */}
        <Reveal className="w-full md:w-[45%] flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative z-10">
          <MandalaOrnament />
          <span className="eyebrow">{hero.section3.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium my-4 leading-tight text-wine-deep">
            {hero.section3.title}
          </h2>
          <p className="text-ink-soft text-sm sm:text-base font-light leading-relaxed mb-8">
            {hero.section3.description}
          </p>

          <div>
            <Link to="/about" className="btn btn-gold !bg-wine !text-gold-soft hover:!bg-wine-deep flex items-center gap-2 w-fit shadow-lg shadow-wine/20">
              <BookOpen size={14} />
              <span>Our Legacy</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] tracking-[0.2em] uppercase text-ink-soft select-none mt-8">
            <ArrowDown size={14} className="animate-bounce text-wine" />
            <span>View special offers</span>
          </div>
        </Reveal>

        {/* Right Side: Vintage Car Courtyard Image */}
        <Reveal className="w-full md:w-[55%] relative min-h-[45vh] md:min-h-auto p-6 md:p-12">
          <TiltImage
            src={hero.section3.image}
            alt={hero.section3.title}
          />
        </Reveal>
      </section>

      {/* SECTION 4: ENTER SHOP (Maroon Studio Shoot) */}
      <section className="min-h-[calc(100vh-80px)] w-full flex flex-col md:flex-row-reverse items-stretch relative overflow-hidden bg-wine-deep text-white py-12 md:py-0">
        {/* Right Side: Final CTAs */}
        <Reveal className="w-full md:w-[45%] flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative z-10 bg-wine-deep">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-6 bg-gold-soft" />
            <span className="eyebrow">{hero.section4.eyebrow}</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-6 leading-tight">
            {hero.section4.title} <br />
            <em className="italic text-gold-soft font-light">{hero.section4.italicTitle}</em>
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed mb-8 max-w-sm">
            {hero.section4.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="btn btn-gold flex items-center justify-center gap-2 shadow-xl shadow-black/30 hover:shadow-gold/15 hover:-translate-y-0.5">
              <span>Enter Store</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/offers" className="btn btn-ghost flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <Gift size={14} className="text-gold-soft" />
              <span>Curated Offers</span>
            </Link>
          </div>
        </Reveal>

        {/* Left Side: Maroon Saree studio image */}
        <Reveal className="w-full md:w-[55%] relative min-h-[45vh] md:min-h-auto p-6 md:p-12">
          <TiltImage
            src={hero.section4.image}
            alt={hero.section4.title}
          />
        </Reveal>
      </section>

    </div>
  );
}
