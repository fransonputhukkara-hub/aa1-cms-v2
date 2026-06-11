import Reveal from './Reveal';
import { Award, Truck, Scissors, Check } from 'lucide-react';

const VALUES = [
  { Icon: Award, title: 'Pure Handloom', text: 'Authentic Kalyani cotton & soft silk, woven by hand.' },
  { Icon: Truck, title: 'Free Shipping', text: 'Insured delivery across India, with cash on delivery.' },
  { Icon: Scissors, title: 'Blouse & Fall', text: 'Blouse piece included; fall & pico stitching on request.' },
  { Icon: Check, title: 'Easy Returns', text: 'Seven-day hassle-free exchange on all orders.' },
];

export default function Values() {
  return (
    <section className="bg-ivory py-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7">
        <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-9 lg:gap-[30px] text-center">
          {VALUES.map(({ Icon, title, text }) => (
            <div key={title}>
              <div className="w-[54px] h-[54px] mx-auto mb-4 border border-gold rounded-full grid place-items-center text-wine">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-[21px] font-medium mb-1.5 text-wine-deep">{title}</h3>
              <p className="text-[13px] text-ink-soft leading-relaxed font-light">{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
