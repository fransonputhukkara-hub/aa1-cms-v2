import { useState } from 'react';
import Reveal from './Reveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const subscribe = () => {
    if (!email.trim()) {
      setMsg('Please enter your email');
      return;
    }
    setMsg('Welcome to the family ✦');
    setEmail('');
    window.setTimeout(() => setMsg(null), 2500);
  };

  return (
    <section className="py-16 sm:py-[90px] text-center">
      <Reveal className="max-w-[1280px] mx-auto px-5 sm:px-7">
        <div className="eyebrow">Join the family</div>
        <h2 className="text-[clamp(2rem,4vw,3rem)] text-wine-deep my-3.5 mb-1.5 font-medium">First look. First weaves.</h2>
        <p className="text-ink-soft font-light max-w-[440px] mx-auto">
          Be the first to see new collections and get ₹100 off your first order.
        </p>
        <div className="max-w-[540px] mx-auto mt-7 flex gap-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && subscribe()}
            placeholder="Your email address"
            className="flex-1 px-5 py-4 border border-wine/10 bg-white font-sans text-[13px] rounded-sm outline-none focus:border-gold"
          />
          <button onClick={subscribe} className="btn btn-gold">
            Subscribe
          </button>
        </div>
        {msg && <p className="text-[12px] tracking-[0.12em] text-wine mt-3">{msg}</p>}
      </Reveal>
    </section>
  );
}
