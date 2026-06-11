import type { CartItem, Product } from '../types';
import { formatINR } from './format';

// Replace with the client's WhatsApp business number — country code + number, no "+" or spaces.
export const WHATSAPP_NUMBER = '918891182501';

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(items: CartItem[]): string {
  const lines = items.map(
    (i) => `• ${i.name} (${i.type}) × ${i.qty} — ${formatINR(i.price * i.qty)}`,
  );
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return [
    'Hello A1 Sanskriti Silks! I would like to place an order:',
    '',
    ...lines,
    '',
    `Subtotal: ${formatINR(subtotal)}`,
    '',
    'Name:',
    'Delivery address:',
    'Phone:',
  ].join('\n');
}

export function singleItemMessage(p: Product, qty: number): string {
  return [
    'Hello A1 Sanskriti Silks! I am interested in this saree:',
    '',
    `• ${p.name} (${p.type}) × ${qty} — ${formatINR(p.price * qty)}`,
    '',
    'Is this available? My details:',
    'Name:',
    'Delivery address:',
    'Phone:',
  ].join('\n');
}
