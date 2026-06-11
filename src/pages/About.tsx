import { useState } from 'react';
import { useSEO } from '../lib/useSEO';
import { Sparkles, Heart, Landmark, ShieldCheck } from 'lucide-react';
import { useSiteContent } from '../lib/SiteContentContext';

const VALUES_ICONS = [Landmark, Heart, ShieldCheck];

export default function About() {
  const { content } = useSiteContent();
  const about = content.about;
  const [tilt1, setTilt1] = useState({ x: 0, y: 0 });
  const [isHovered1, setIsHovered1] = useState(false);
  const [tilt2, setTilt2] = useState({ x: 0, y: 0 });
  const [isHovered2, setIsHovered2] = useState(false);

  const handleMouseMove1 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt1({ x: x * 10, y: -y * 10 });
    setIsHovered1(true);
  };

  const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt2({ x: x * 10, y: -y * 10 });
    setIsHovered2(true);
  };

  useSEO({
    title: 'Our Story & Heritage',
    description: 'Discover the heritage of A1 Sanskriti Silks. Handweaving pure Kalyani cotton and soft silk sarees since 1974. Meet our artisans and explore our traditional weaving process.',
    keywords: 'about a1 sanskriti silks, handloom history, how sarees are woven, pure silk certification, authentic kalyani cotton history',
  });

  return (
    <div className="bg-cream min-h-screen">
      {/* Immersive Hero Header */}
      <div className="relative py-28 px-5 sm:px-7 text-center bg-wine-deep text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/hero/hero-3.jpg.jpeg')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(40,9,17,0.7),rgba(78,19,32,0.9))] z-0" />
        <div className="absolute inset-0 grain opacity-[0.05] pointer-events-none" />

        <Reveal className="relative z-10 max-w-2xl mx-auto">
          <span className="eyebrow mb-3 inline-block">Since 1974</span>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-serif leading-[1.1] mb-6">
            {about.heroTitle}
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto">
            {about.heroSubtitle}
          </p>
        </Reveal>
      </div>

      {/* Narrative Section */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative" style={{ perspective: '1000px' }}>
            <div
              onMouseMove={handleMouseMove1}
              onMouseLeave={() => { setTilt1({ x: 0, y: 0 }); setIsHovered1(false); }}
              className="aspect-[4/5] rounded overflow-hidden shadow-2xl relative transition-all duration-300"
              style={{
                transform: isHovered1 ? `rotateX(${tilt1.y}deg) rotateY(${tilt1.x}deg) scale(1.02)` : 'rotateX(0deg) rotateY(0deg) scale(1)',
              }}
            >
              <img
                src="/sarees/silk-03.jpg"
                alt="Artisan working on a traditional handloom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/40 to-transparent" />
            </div>
            {/* Float badge */}
            <div className="absolute -bottom-6 -right-6 bg-gold text-wine-deep p-6 rounded-sm shadow-xl hidden sm:block">
              <div className="font-serif text-[42px] leading-none font-bold">50+</div>
              <div className="font-sans text-[10px] tracking-[0.2em] uppercase mt-1 font-semibold">Years of Devotion</div>
            </div>
          </div>

          <div className="space-y-6">
            <span className="eyebrow">{about.legacyEyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-medium">{about.legacyTitle}</h2>
            <p className="text-ink-soft text-base font-light leading-relaxed">
              {about.legacyText1}
            </p>
            <p className="text-ink-soft text-base font-light leading-relaxed">
              {about.legacyText2}
            </p>
          </div>
        </div>

        {/* Process Showcase */}
        <div className="my-24 bg-white border border-wine/5 rounded-sm p-8 sm:p-12 shadow-[0_4px_30px_rgba(106,27,45,0.01)]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="eyebrow">Craftsmanship</span>
            <h2 className="text-3xl font-medium mt-1">From Thread to Masterpiece</h2>
            <div className="h-0.5 w-12 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="font-serif text-5xl text-gold-soft mb-3">01</div>
              <h3 className="text-xl font-medium text-wine mb-2">Spun &amp; Dyed</h3>
              <p className="text-ink-soft text-sm font-light leading-relaxed max-w-xs mx-auto">
                Raw silk and premium cotton threads are ethically sourced and naturally dyed in local vats, achieving deep, lustrous hues that retain their vibrancy for decades.
              </p>
            </div>
            <div className="text-center">
              <div className="font-serif text-5xl text-gold-soft mb-3">02</div>
              <h3 className="text-xl font-medium text-wine mb-2">Draughting the Loom</h3>
              <p className="text-ink-soft text-sm font-light leading-relaxed max-w-xs mx-auto">
                The warp threads are meticulously wound onto the loom beam. This stage takes up to two days, setting the warp pattern and border dimensions for the saree.
              </p>
            </div>
            <div className="text-center">
              <div className="font-serif text-5xl text-gold-soft mb-3">03</div>
              <h3 className="text-xl font-medium text-wine mb-2">The Hand-Weave</h3>
              <p className="text-ink-soft text-sm font-light leading-relaxed max-w-xs mx-auto">
                Using a double-shuttle technique, the artisan weaves the body, border, and rich pallu. Zari threads containing real silver are woven in for a luxurious, soft finish.
              </p>
            </div>
          </div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {about.values && about.values.map((val, idx) => {
            const Icon = VALUES_ICONS[idx % VALUES_ICONS.length];
            return (
              <div key={idx} className="border border-wine/10 p-8 rounded-sm bg-cream/50 hover:bg-white transition-all duration-300">
                <div className="w-12 h-12 bg-wine/5 rounded-full flex items-center justify-center text-wine mb-6">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-wine mb-3">{val.title}</h3>
                <p className="text-ink-soft text-sm font-light leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Meet the Weaver block */}
        <div className="mt-24 bg-wine-deep rounded-sm overflow-hidden flex flex-col md:flex-row shadow-xl">
          <div className="w-full md:w-1/2 relative min-h-[350px]" style={{ perspective: '1000px' }}>
            <div
              onMouseMove={handleMouseMove2}
              onMouseLeave={() => { setTilt2({ x: 0, y: 0 }); setIsHovered2(false); }}
              className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-300"
              style={{
                transform: isHovered2 ? `rotateX(${tilt2.y}deg) rotateY(${tilt2.x}deg) scale(1.02)` : 'rotateX(0deg) rotateY(0deg) scale(1)',
              }}
            >
              <img
                src="/sarees/cotton-05.jpg"
                alt="Artisan weaver showing saree work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-wine-deep/30 to-transparent" />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left z-10 p-8 sm:p-12">
            <span className="eyebrow mb-2">Weaver Spotlight</span>
            <h2 className="text-3xl sm:text-4xl font-serif mb-6 text-white leading-tight">Master Weaver Kuppusamy</h2>
            <p className="text-white/80 text-sm font-light leading-relaxed mb-6">
              "I have been sitting at the handloom since I was fourteen. My father taught me, and his father taught him. To me, a loom is not a machine—it is a conversation. When we pull the shuttle, we are weaving our thoughts and history into the cloth. I am proud to see my sarees reaching homes across India through A1 Sanskriti."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-soft/30 overflow-hidden bg-white/10 flex items-center justify-center">
                <Sparkles size={16} className="text-gold" />
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wider text-gold-soft uppercase">Kuppusamy M.</div>
                <div className="text-[10px] text-white/50 uppercase">Weaving Master, Salem Cluster</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
