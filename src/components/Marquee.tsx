const TERMS = ['Kalyani Cotton', 'Soft Silk', 'Korvai Border', 'Zari Pallu', 'Temple Motifs', 'Pure Handloom'];

export default function Marquee() {
  const run = [...TERMS, ...TERMS];
  return (
    <div className="bg-wine text-gold-soft overflow-hidden py-3.5 border-y border-gold/20">
      <div className="flex whitespace-nowrap gap-[60px] animate-marquee font-serif text-[22px] italic">
        {run.map((t, i) => (
          <span key={i} className="flex gap-[60px]">
            <span>{t}</span>
            <span aria-hidden>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
