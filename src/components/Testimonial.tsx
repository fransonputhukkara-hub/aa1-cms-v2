import Reveal from './Reveal';

const TESTI_IMAGE = '/sarees/silk-03.jpg';

export default function Testimonial() {
  return (
    <section className="relative overflow-hidden bg-wine-deep text-white text-center py-16 sm:py-[90px]">
      <div className="absolute inset-0">
        <img src={TESTI_IMAGE} alt="" className="w-full h-full object-cover object-[center_30%] opacity-[0.22]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(78,19,32,.92),rgba(40,9,17,.88))]" />
      <Reveal className="relative z-[2] max-w-[1280px] mx-auto px-5 sm:px-7">
        <div className="text-gold-soft text-lg tracking-[4px] mb-6">★ ★ ★ ★ ★</div>
        <blockquote className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-normal italic leading-[1.35] max-w-[880px] mx-auto mb-7">
          “The softest weaves I've worn. The colours are exactly as shown and the zari borders are stunning in person.
          My third order from Sanskriti.”
        </blockquote>
        <cite className="not-italic text-xs tracking-[0.25em] uppercase text-gold-soft">— Lakshmi Priya, Coimbatore</cite>
      </Reveal>
    </section>
  );
}
