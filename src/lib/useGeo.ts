import { useEffect, useState } from 'react';

export interface GeoData {
  country: string;
  country_name: string;
  region: string; // State/Region
  city: string;
  currency: string;
  ip: string;
}

export function useGeo() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem('sanskriti_geo');
    if (cached) {
      try {
        setGeo(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (e) {
        sessionStorage.removeItem('sanskriti_geo');
      }
    }

    fetch('https://ipapi.co/json/')
      .then((res) => {
        if (!res.ok) throw new Error('Geo fetch failed');
        return res.json();
      })
      .then((data) => {
        const geoData: GeoData = {
          country: data.country_code || 'IN',
          country_name: data.country_name || 'India',
          region: data.region || 'Tamil Nadu',
          city: data.city || 'Chennai',
          currency: data.currency || 'INR',
          ip: data.ip || '',
        };
        setGeo(geoData);
        sessionStorage.setItem('sanskriti_geo', JSON.stringify(geoData));
      })
      .catch(() => {
        setGeo({
          country: 'IN',
          country_name: 'India',
          region: 'Tamil Nadu',
          city: 'Chennai',
          currency: 'INR',
          ip: '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return { geo, loading };
}
