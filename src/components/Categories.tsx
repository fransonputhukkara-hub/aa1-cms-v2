import { Link } from 'react-router-dom';
import Reveal from './Reveal';

interface Cat {
  image: string;
  title: string;
  subtitle: string;
  to: string;
  count: string;
}

const CATS: Cat[] = [
  {
    image: '/sarees/cotton-03.jpg',
    title: 'Kalyani Cotton',
    subtitle: 'Handwoven korvai borders, temple pallus & everyday elegance',
    to: '/shop?type=cotton',
    count: '19 sarees',
  },
  {
    image: '/sarees/silk-02.jpg',
    title: 'Soft Silk',
    subtitle: 'Lustrous zari weaves for weddings & the grandest occasions',
    to: '/shop?type=silk',
    count: '10 sarees',
  },
];

export default function Categories() {
  return (
    <section id="cats" className="py-16 sm:py-[90px]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7">
        <Reveal className="text-center max-w-[620px] mx-auto mb-12 sm:mb-[52px]">
          <div className="eyebrow">Shop by collection</div>
          <h2 className="text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.05] my-3.5 text-wine-deep">
            Our Collections
          </h2>
          <p className="text-ink-soft text-[15px] leading-relaxed font-light">
            Handpicked weaves for festive mornings, temple visits, office days and everything in between.
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CATS.map((cat) => (
            <Link
              key={cat.title}
              to={cat.to}
              className="group relative rounded-lg overflow-hidden aspect-[3/4] sm:aspect-[4/5] cursor-pointer"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(40,9,17,.9)_0%,rgba(40,9,17,.4)_40%,transparent_70%)]" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-[2] text-white">
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold-soft font-medium">
                  {cat.count}
                </span>
                <h3 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight mt-1.5 mb-2">
                  {cat.title}
                </h3>
                <p className="text-white/75 text-[13px] leading-relaxed font-light max-w-[320px]">
                  {cat.subtitle}
                </p>
                <span className="inline-flex items-center gap-2 mt-4 text-[11px] tracking-[0.2em] uppercase text-gold-soft font-semibold group-hover:gap-3 transition-all">
                  Explore collection
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
