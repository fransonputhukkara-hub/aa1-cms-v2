import React, { useState } from 'react';
import { useSEO } from '../lib/useSEO';
import { useGeo } from '../lib/useGeo';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Video } from 'lucide-react';
import { useSiteContent } from '../lib/SiteContentContext';

export default function Contact() {
  const { content } = useSiteContent();
  const contact = content.contact;
  const { geo } = useGeo();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // LocalBusiness Schema for Local SEO / GEO optimization
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    'name': 'A1 Sanskriti Silks Kanchipuram',
    'image': 'https://a1sanskritisilks.com/logo.png',
    '@id': 'https://a1sanskritisilks.com/#store-kanchipuram',
    'url': 'https://a1sanskritisilks.com',
    'telephone': '+91 88911 82501',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '12, Temple Road',
      'addressLocality': 'Kanchipuram',
      'postalCode': '631501',
      'addressRegion': 'Tamil Nadu',
      'addressCountry': 'IN',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 12.8387,
      'longitude': 79.7016,
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      'opens': '09:00',
      'closes': '21:00',
    },
  };

  useSEO({
    title: 'Contact Us & Store Locator',
    description: 'Visit our A1 Sanskriti Silks stores in Kanchipuram and Chennai or reach out for inquiries. Offering dedicated video call shopping sessions via WhatsApp.',
    keywords: 'contact a1 sanskriti silks, saree shop kanchipuram, chennai boutique address, video call saree shopping, whatsapp saree orders',
    schema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 600);
  };

  // Determine distance status for Geo-customization
  const isCloseToStores = geo ? (geo.region.toLowerCase().includes('tamil nadu') || geo.region.toLowerCase().includes('pondicherry') || geo.region.toLowerCase().includes('puducherry')) : true;

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Header */}
      <div className="bg-wine-deep text-white py-16 px-5 sm:px-7 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(40,9,17,0.7),rgba(78,19,32,0.85))] z-0" />
        <div className="absolute inset-0 grain opacity-[0.05] pointer-events-none" />
        <Reveal className="w-full md:w-[45%] flex flex-col justify-center p-8 sm:p-12 lg:p-20 bg-wine-deep text-white">
          <span className="eyebrow mb-2 inline-block">Reach Out</span>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mb-4">
            Connect with <em className="italic text-gold-soft font-serif">A1 Sanskriti Silks</em>
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
            {contact.heroSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-16">
        {/* Geo Personalized Prompt */}
        {geo && !isCloseToStores && (
          <div className="mb-12 bg-white border border-gold/30 rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-wine tracking-wider uppercase mb-2">
                <Video size={14} className="text-gold" />
                Video Call Shopping Available
              </span>
              <h3 className="text-xl font-serif font-semibold text-wine mb-2">
                Shopping from {geo.city || geo.region}, {geo.country_name}?
              </h3>
              <p className="text-ink-soft text-sm font-light leading-relaxed max-w-xl">
                Since you are visiting us from outside Tamil Nadu, we invite you to browse our looms live! Schedule a private WhatsApp Video Call with our store consultants to see the drape and color variance under natural light.
              </p>
            </div>
            <a
              href={`https://wa.me/${(contact.whatsapp || "+91 88911 82501").replace(/[^\d]/g, '')}?text=${encodeURIComponent("Hi A1 Sanskriti Silks, I'd like to schedule a video call shopping session.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold flex items-center gap-2"
            >
              <Video size={15} />
              Book Video Call
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-20 items-start">
          {/* Column 1: Locations & Details */}
          <div className="space-y-10">
            <div>
              <span className="eyebrow">Our Boutiques</span>
              <h2 className="text-3xl font-medium mt-1 mb-6">Visit Our Stores</h2>
              
              <div className="space-y-8">
                {contact.locations && contact.locations.map((loc) => (
                  <div key={loc.city} className="border-l-2 border-gold pl-6 space-y-3">
                    <h3 className="text-xl font-serif font-semibold text-wine">{loc.city}</h3>
                    
                    <div className="flex items-start gap-2.5 text-sm text-ink-soft font-light leading-relaxed">
                      <MapPin size={16} className="text-wine shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-ink-soft font-light">
                      <Phone size={15} className="text-wine" />
                      <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="hover:text-wine transition-colors">
                        {loc.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-ink-soft font-light">
                      <Clock size={15} className="text-wine" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-wine/10 space-y-4">
              <h3 className="text-lg font-serif font-medium text-wine">Central Support</h3>
              
              <div className="flex items-center gap-3 text-sm text-ink-soft font-light">
                <Mail size={16} className="text-gold" />
                <a href={`mailto:${contact.email}`} className="hover:text-wine transition-colors">
                  {contact.email}
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm text-ink-soft font-light">
                <Phone size={16} className="text-gold" />
                <span>{contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="bg-white border border-wine/10 p-8 sm:p-10 rounded-sm shadow-[0_4px_24px_rgba(106,27,45,0.02)]">
            <span className="eyebrow">Message Us</span>
            <h2 className="text-3xl font-medium mt-1 mb-8">Send an Inquiry</h2>

            {submitted ? (
              <div className="bg-wine/5 border border-wine/10 rounded-sm p-6 text-center space-y-4 py-12">
                <CheckCircle size={48} className="text-gold mx-auto" />
                <h3 className="text-2xl font-serif font-semibold text-wine">Thank You</h3>
                <p className="text-ink-soft text-sm font-light max-w-sm mx-auto leading-relaxed">
                  Your message has been sent successfully. One of our loom representatives will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-gold !py-2.5 !px-6 text-[10px] mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[11px] tracking-wider text-ink-soft uppercase font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-wine/15 rounded-sm focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors text-sm font-light bg-cream/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[11px] tracking-wider text-ink-soft uppercase font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-wine/15 rounded-sm focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors text-sm font-light bg-cream/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-[11px] tracking-wider text-ink-soft uppercase font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-wine/15 rounded-sm focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors text-sm font-light bg-cream/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-[11px] tracking-wider text-ink-soft uppercase font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-wine/15 rounded-sm focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors text-sm font-light bg-cream/20"
                    >
                      <option>General Inquiry</option>
                      <option>Wedding Order (Bulk)</option>
                      <option>Custom Border &amp; Blouse Services</option>
                      <option>Shipping &amp; Delivery Help</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[11px] tracking-wider text-ink-soft uppercase font-medium mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-wine/15 rounded-sm focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors text-sm font-light bg-cream/20 resize-none"
                    placeholder="Describe how we can assist you..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-gold w-full flex items-center justify-center gap-2 group"
                >
                  <span>Send Message</span>
                  <Send size={13} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
