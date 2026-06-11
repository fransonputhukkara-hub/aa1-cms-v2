export interface SiteContent {
  announcements: string[]; // Kept for simple backwards compatibility
  announcementManager?: {
    enabled: boolean;
    text: string;
    bgColor: string;
    textColor: string;
    btnText: string;
    btnLink: string;
    startDate: string;
    endDate: string;
  };
  hero: {
    section1: { eyebrow: string; title: string; description: string; image: string };
    section2: { eyebrow: string; title: string; quote: string; image: string };
    section3: { eyebrow: string; title: string; description: string; image: string };
    section4: { eyebrow: string; title: string; italicTitle: string; description: string; image: string };
  };
  about: {
    heroTitle: string;
    heroSubtitle: string;
    legacyEyebrow: string;
    legacyTitle: string;
    legacyText1: string;
    legacyText2: string;
    values: { title: string; desc: string }[];
  };
  contact: {
    heroSubtitle: string;
    locations: { city: string; address: string; phone: string; hours: string }[];
    email: string;
    phone: string;
    whatsapp?: string;
    googleMapsLink?: string;
  };
  footer: {
    showcase: { src: string; title: string; desc: string }[];
  };
  logos?: {
    header: string;
    footer: string;
    mobile: string;
    desktopWidth: number;
    desktopHeight: number;
    mobileWidth: number;
    mobileHeight: number;
    headerSpacing: number;
    footerSpacing: number;
    fit: 'contain' | 'cover' | 'original';
  };
  layout?: {
    hero: boolean;
    collections: boolean;
    story: boolean;
    testimonials: boolean;
    instagram: boolean;
    newsletter: boolean;
    whatsapp: boolean;
    spotlight: boolean;
    order: string[];
  };
  socials?: {
    instagram: { enabled: boolean; url: string };
    facebook: { enabled: boolean; url: string };
    youtube: { enabled: boolean; url: string };
    pinterest: { enabled: boolean; url: string };
    threads: { enabled: boolean; url: string };
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
  lastUpdated?: string;
}

export const defaultSiteContent: SiteContent = {
  announcements: [
    "Complimentary Shipping Across India · Cash on Delivery Available",
    "Sanskriti Heritage Certified · Salem Shuttle Weaving",
    "100% Pure Certified Silk & Premium Kalyani Cotton",
    "Private Loom Releases · Experience Legacy Handwoven Artistry"
  ],
  announcementManager: {
    enabled: true,
    text: "Complimentary Shipping Across India · Cash on Delivery Available",
    bgColor: "#280911",
    textColor: "#f1e5d1",
    btnText: "Shop New Arrivals",
    btnLink: "/shop",
    startDate: "",
    endDate: ""
  },
  hero: {
    section1: {
      eyebrow: "A1 Sanskriti Silks",
      title: "Tradition",
      description: "Our handwoven collections blend heritage craftsmanship with modern design. Each saree reflects rich Indian legacy and superior fabric quality.",
      image: "/hero/editorial-blue.png"
    },
    section2: {
      eyebrow: "Temple Elegance",
      title: "The Soul of Kanchipuram",
      quote: "Our soft silk sarees feature signature heavy gold zari borders and intricate motifs inspired by temple architecture, handwoven with silk thread certified for absolute purity.",
      image: "/hero/editorial-temple.png"
    },
    section3: {
      eyebrow: "Heritage Since 1974",
      title: "Patience of Generations",
      description: "Worn for the moments you will never forget. Sanskriti sarees are handwoven by master artisans over 3 to 18 days of shuttle labor.",
      image: "/hero/editorial-vintage.png"
    },
    section4: {
      eyebrow: "The Shop Entry",
      title: "We've got you covered,",
      italicTitle: "from head to toe.",
      description: "Step inside our store to explore Kalyani Cotton, soft silk drapes, and seasonal wedding specials.",
      image: "/hero/editorial-maroon.png"
    }
  },
  about: {
    heroTitle: "Woven with the Patience of Generations",
    heroSubtitle: "The story of A1 Sanskriti Silks is a journey of threads, looms, and the hands that bring heritage to life.",
    legacyEyebrow: "Our Legacy",
    legacyTitle: "The Soul of Sanskriti",
    legacyText1: "For nearly five decades, A1 Sanskriti Silks has been a custodian of South Indian handloom traditions. What started as a small cluster of five family looms in Kanchipuram has grown into a cherished heritage label, supporting over 120 master weaver families across Salem, Arni, and Rasipuram.",
    legacyText2: "Every warp and weft is guided by a commitment to pure materials. We select only the finest grade mulberry silk and long-staple Kalyani cotton. Our zari is spun with pure silver thread and electroplated with 24-carat gold, ensuring that each creation remains an heirloom for generations to come.",
    values: [
      {
        title: "Heritage Weaving",
        desc: "Preserving 50+ year-old weaving techniques, contrast border korvai work, and pure silk threads."
      },
      {
        title: "Ethical Wages",
        desc: "Supporting artisan clusters directly, guaranteeing fair wages and sustaining traditional livelihoods."
      },
      {
        title: "Silk Mark Certified",
        desc: "Each silk saree is certified for absolute purity, using authentic gold & silver zari work."
      }
    ]
  },
  contact: {
    heroSubtitle: "Whether you want to inquire about custom border designs, request fall & pico services, or place a bulk family wedding order.",
    locations: [
      {
        city: "Kanchipuram Flagship",
        address: "12, Temple Road, Kanchipuram, Tamil Nadu - 631501",
        phone: "+91 88911 82501",
        hours: "9:00 AM - 9:00 PM (All Days)"
      },
      {
        city: "Chennai Boutique",
        address: "45, Khader Nawaz Khan Road, Nungambakkam, Chennai - 600006",
        phone: "+91 88911 82501",
        hours: "10:00 AM - 8:30 PM (Closed Tuesdays)"
      }
    ],
    email: "a1sanskritisilks@gmail.com",
    phone: "+91 88911 82501 (Mon-Sat, 10 AM - 7 PM IST)",
    whatsapp: "+91 88911 82501",
    googleMapsLink: "https://maps.google.com"
  },
  footer: {
    showcase: [
      { src: '/hero/editorial-temple.png', title: 'Temple Artistry', desc: 'Certified Kanchipuram silk' },
      { src: '/sarees/silk-03.jpg', title: 'Artisan Shuttle', desc: 'Handwoven zari details' },
      { src: '/hero/editorial-maroon.png', title: 'Studio Classic', desc: 'Rich wedding maroon drape' },
      { src: '/hero/editorial-blue.png', title: 'Royal Heritage', desc: 'Traditional royal blue border' }
    ]
  },
  logos: {
    header: "/logo.png",
    footer: "/logo.png",
    mobile: "/logo.png",
    desktopWidth: 160,
    desktopHeight: 50,
    mobileWidth: 120,
    mobileHeight: 40,
    headerSpacing: 15,
    footerSpacing: 20,
    fit: "contain"
  },
  layout: {
    hero: true,
    collections: true,
    story: true,
    testimonials: true,
    instagram: true,
    newsletter: true,
    whatsapp: true,
    spotlight: true,
    order: ["hero", "collections", "story", "testimonials", "instagram", "newsletter"]
  },
  socials: {
    instagram: { enabled: true, url: "https://www.instagram.com/a1sanskritisilks" },
    facebook: { enabled: false, url: "https://facebook.com" },
    youtube: { enabled: false, url: "https://youtube.com" },
    pinterest: { enabled: false, url: "https://pinterest.com" },
    threads: { enabled: false, url: "https://threads.net" }
  },
  seo: {
    metaTitle: "A1 Sanskriti Silks — Handwoven Kalyani Cotton & Soft Silk",
    metaDescription: "We've got you covered, from head to toe. Premium handwoven Kalyani cotton and soft silk sarees. Explore our digital lookbook.",
    keywords: "a1 sanskriti silks, handloom history, kalyani cotton, soft silk sarees",
    ogImage: "/logo.png"
  },
  lastUpdated: ""
};
