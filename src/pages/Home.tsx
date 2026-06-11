import Hero from '../components/Hero';
import Bestsellers from '../components/Bestsellers';
import StorySplit from '../components/StorySplit';
import Testimonial from '../components/Testimonial';
import InstagramFeed from '../components/InstagramFeed';
import Newsletter from '../components/Newsletter';
import { useSEO } from '../lib/useSEO';
import { useSiteContent } from '../lib/SiteContentContext';
import { useProducts } from '../lib/useProducts';

export default function Home() {
  const { content } = useSiteContent();
  const { products } = useProducts();
  
  const layout = content.layout || {
    hero: true,
    collections: true,
    story: true,
    testimonials: true,
    instagram: true,
    newsletter: true,
    order: ["hero", "collections", "story", "testimonials", "instagram", "newsletter"]
  };

  const seo = content.seo || {
    metaTitle: "A1 Sanskriti Silks — Handwoven Kalyani Cotton & Soft Silk",
    metaDescription: "We've got you covered, from head to toe. Premium handwoven Kalyani cotton and soft silk sarees. Explore our digital lookbook.",
    keywords: "a1 sanskriti silks, handloom history, kalyani cotton, soft silk sarees",
    ogImage: "/logo.png"
  };

  useSEO({
    title: seo.metaTitle || 'A1 Sanskriti Silks — Handwoven Kalyani Cotton & Soft Silk',
    description: seo.metaDescription || "Premium handwoven Kalyani cotton and soft silk sarees. Explore our digital lookbook.",
    keywords: seo.keywords || 'a1 sanskriti silks, handloom lookbook, kalyani cotton, pure soft silk sarees',
    ogImage: seo.ogImage || '/logo.png',
  });

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return layout.hero !== false ? <Hero key="hero" /> : null;
      case 'collections':
        return layout.collections !== false ? <Bestsellers key="collections" products={products} /> : null;
      case 'story':
        return layout.story !== false ? <StorySplit key="story" /> : null;
      case 'testimonials':
        return layout.testimonials !== false ? <Testimonial key="testimonials" /> : null;
      case 'instagram':
        return layout.instagram !== false ? <InstagramFeed key="instagram" /> : null;
      case 'newsletter':
        return layout.newsletter !== false ? <Newsletter key="newsletter" /> : null;
      default:
        return null;
    }
  };

  const sectionOrder = layout.order || ["hero", "collections", "story", "testimonials", "instagram", "newsletter"];

  return (
    <>
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </>
  );
}
