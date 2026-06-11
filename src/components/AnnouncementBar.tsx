import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useGeo } from '../lib/useGeo';
import { useSiteContent } from '../lib/SiteContentContext';

export default function AnnouncementBar() {
  const { geo } = useGeo();
  const { content } = useSiteContent();
  const [index, setIndex] = useState(0);

  const am = content.announcementManager || {
    enabled: true,
    text: "Complimentary Shipping Across India · Cash on Delivery Available",
    bgColor: "#280911",
    textColor: "#f1e5d1",
    btnText: "Shop New Arrivals",
    btnLink: "/shop",
    startDate: "",
    endDate: ""
  };

  // Date scheduling evaluation
  const isVisible = () => {
    if (!am.enabled) return false;
    const now = new Date();
    if (am.startDate) {
      const start = new Date(am.startDate);
      if (isNaN(start.getTime()) || now < start) return false;
    }
    if (am.endDate) {
      const end = new Date(am.endDate);
      if (isNaN(end.getTime()) || now > end) return false;
    }
    return true;
  };

  const rawMessages = content.announcements || [];
  const announcementsList = rawMessages.length > 0 ? rawMessages : [am.text];
  
  const messages = announcementsList.map((msg) => {
    if (geo && msg.includes('Across India')) {
      return msg.replace('Across India', `to ${geo.region}`);
    }
    return msg;
  });

  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (!isVisible()) return null;

  const activeMessage = messages[index] || am.text;

  return (
    <div 
      className="relative text-[10px] sm:text-[10.5px] tracking-[0.28em] uppercase text-center py-2.5 px-4 overflow-hidden border-b border-gold/15 flex items-center justify-center min-h-[38px] select-none transition-all duration-300"
      style={{
        backgroundColor: am.bgColor || '#280911',
        color: am.textColor || '#f1e5d1',
      }}
    >
      
      {/* Shimmer light-sweep effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"
        style={{
          animation: 'shimmerSweep 4s infinite linear',
          backgroundSize: '200% 100%',
        }}
      />

      <style>{`
        @keyframes shimmerSweep {
          0% { background-position: -150% 0; }
          100% { background-position: 150% 0; }
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div 
        key={index}
        className="flex items-center justify-center flex-wrap gap-2.5 transition-all duration-700 ease-in-out"
        style={{ animation: 'fadeSlideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
      >
        <Sparkles size={9} className="text-gold animate-pulse shrink-0" />
        <span className="font-sans font-medium">{activeMessage}</span>
        <Sparkles size={9} className="text-gold animate-pulse shrink-0" />

        {am.btnText && (
          <Link 
            to={am.btnLink || '/shop'} 
            className="ml-3 px-3 py-1 text-[8.5px] tracking-[0.15em] uppercase font-semibold transition-all hover:scale-105 active:scale-95 inline-block shrink-0 rounded-sm"
            style={{
              color: am.bgColor || '#280911',
              backgroundColor: am.textColor || '#f1e5d1',
            }}
          >
            {am.btnText}
          </Link>
        )}
      </div>
    </div>
  );
}
