import { useSiteContent } from '../lib/SiteContentContext';

export default function WhatsAppFloat() {
  const { content } = useSiteContent();
  const layout = content.layout || { whatsapp: true };
  const contact = content.contact || { whatsapp: "+91 88911 82501" };

  if (layout.whatsapp === false) return null;

  const rawNumber = contact.whatsapp || "+91 88911 82501";
  // Strip all non-digit characters except maybe plus
  const cleanNumber = rawNumber.replace(/[^\d+]/g, '');

  return (
    <a
      href={`https://wa.me/${cleanNumber.replace('+', '')}?text=${encodeURIComponent('Hi A1 Sanskriti Silks! I have a query about your sarees.')}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 w-[56px] h-[56px] rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] grid place-items-center hover:scale-110 transition-transform duration-200"
      aria-label="Chat on WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.2.2-3.7-.9a9.3 9.3 0 0 1-3.8-3.4c-.3-.5-1-1.6-1-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7s.7 1.2 1.5 1.9c1 .9 1.8 1.1 2.1 1.3s.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.8-.1 1.4z"/>
      </svg>
    </a>
  );
}
