import type { Product } from '../types';

export function description(p: Product): string {
  if (p.type === 'Soft Silk') {
    return `${p.name} is a lustrous soft silk saree with a smooth, lightweight drape and intricate zari butta woven across the body. The contrast border and richly patterned pallu make it a graceful pick for weddings, receptions and festive occasions.`;
  }
  return `${p.name} is a pure handwoven Kalyani cotton saree — breathable, soft and easy to drape for all-day comfort. It carries a traditional contrast korvai border and a zari-woven pallu, equally at home for daily wear, the office, or festive mornings.`;
}

export function specs(p: Product): { label: string; value: string }[] {
  const cotton = p.type === 'Kalyani Cotton';
  return [
    { label: 'Fabric', value: cotton ? 'Pure handloom Kalyani cotton' : 'Soft silk' },
    { label: 'Border', value: 'Contrast korvai border with zari' },
    { label: 'Pallu', value: 'Traditional zari-woven pallu' },
    { label: 'Blouse', value: 'Includes matching blouse piece (0.8 m)' },
    { label: 'Length', value: '6.3 m (including blouse)' },
    { label: 'Care', value: cotton ? 'Gentle hand wash or dry clean' : 'Dry clean recommended' },
  ];
}
