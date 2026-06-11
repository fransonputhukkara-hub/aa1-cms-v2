import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const STORY_IMAGE = '/sarees/cotton-05.jpg';

const STATS = [
  { value: '200+', label: 'Weaver families' },
  { value: '50yrs', label: 'Of heritage' },
  { value: '100%', label: 'Handloom' },
];

export default function StorySplit() {
  return (
    <section id="story" className="bg-ivory py-16 sm:py-[90px] scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-[70px]">
        <Reveal className="aspect-[4/5] rounded overflow-hidden relative bg-wine">
          <img src={STORY_IMAGE} alt="A Sanskriti weave" className="w-full h-full object-cover object-[center_35%]" />
        </Reveal>

        <Reveal>
          <div className="eyebrow">Five decades of the loom</div>
          <h2 className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-medium leading-[1.06] text-wine-deep my-4 mb-6">
            Every thread carries a lineage.
          </h2>
          <p className="text-ink-soft text-[15.5px] leading-[1.85] mb-5 font-light">
            Sanskriti Silks began in 1974 as a single handloom in a weaver's courtyard. Today we work directly with
            artisan families across Tamil Nadu, bringing you authentic Kalyani cotton and soft silk with no middlemen
            in between.
          </p>
          <p className="text-ink-soft text-[15.5px] leading-[1.85] mb-5 font-light">
            Breathable weaves, hand-knotted tassels, and zari borders made the traditional way — saris meant to be
            worn, loved, and passed on.
          </p>
          <div className="flex gap-10 my-7 mb-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <b className="font-serif text-[40px] text-wine font-semibold block leading-none">{s.value}</b>
                <span className="text-[11px] tracking-[0.16em] uppercase text-ink-soft">{s.label}</span>
              </div>
            ))}
          </div>
          <Link to="/shop?type=silk" className="btn btn-gold">
            See the soft silk edit
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
