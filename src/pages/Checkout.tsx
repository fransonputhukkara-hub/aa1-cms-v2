import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { WHATSAPP_NUMBER } from '../lib/whatsapp';
import { supabase } from '../lib/supabase';

interface Address {
  pincode: string;
  state: string;
  city: string;
  addressLine: string;
  fullName: string;
  email: string;
  phone: string;
  type: 'Home' | 'Work';
}

const EMPTY: Address = {
  pincode: '', state: '', city: '', addressLine: '',
  fullName: '', email: '', phone: '', type: 'Home',
};

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [addr, setAddr] = useState<Address>(EMPTY);
  const [orderOpen, setOrderOpen] = useState(true);
  const [errors, setErrors] = useState<Partial<Address>>({});
  const [placing, setPlacing] = useState(false);

  const mrpTotal = items.reduce((s, i) => s + (i.mrp ?? i.price) * i.qty, 0);

  const set = (k: keyof Address, v: string) => {
    setAddr((a) => ({ ...a, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Address> = {};
    if (!addr.fullName.trim()) e.fullName = 'Required';
    if (!addr.phone.trim()) e.phone = 'Required';
    if (!addr.addressLine.trim()) e.addressLine = 'Required';
    if (!addr.city.trim()) e.city = 'Required';
    if (!addr.state) e.state = 'Required';
    if (!addr.pincode.trim()) e.pincode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    if (!items.length || placing) return;
    setPlacing(true);

    // Record the order in the shared POS database — this atomically
    // lowers inventory stock, keeping website & store in sync.
    const address = `${addr.addressLine}, ${addr.city}, ${addr.state} — ${addr.pincode} (${addr.type})`;
    const { error } = await supabase.rpc('place_online_order', {
      p_name: addr.fullName,
      p_phone: addr.phone,
      p_address: address,
      p_items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, rate: i.price })),
    });
    setPlacing(false);
    if (error) {
      alert('Could not place the order. Please try again or order via WhatsApp.');
      return;
    }

    const lines = items.map(
      (i) => `• ${i.name} (${i.type}) × ${i.qty} — ${formatINR(i.price * i.qty)}`,
    );

    const msg = [
      '🛍️ *New Order — A1 Sanskriti Silks*',
      '',
      '*Items:*',
      ...lines,
      '',
      `*Total: ${formatINR(subtotal)}*`,
      '*Payment: Cash on Delivery (COD)*',
      '',
      '*Shipping Address:*',
      `Name: ${addr.fullName}`,
      `Phone: ${addr.phone}`,
      `Address: ${addr.addressLine}`,
      `${addr.city}, ${addr.state} — ${addr.pincode}`,
      `Country: India`,
      addr.email ? `Email: ${addr.email}` : '',
      `Address Type: ${addr.type}`,
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 py-32 text-center">
        <h2 className="font-serif text-4xl text-wine-deep mb-3">Your cart is empty</h2>
        <Link to="/shop" className="btn btn-gold">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-6">
        <Link to="/" className="hover:text-wine">Home</Link>
        <ChevronRight size={12} />
        <Link to="/cart" className="hover:text-wine">Cart</Link>
        <ChevronRight size={12} />
        <span className="text-ink">Checkout</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Address form */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={18} className="text-wine" />
            <h2 className="font-medium text-[18px] text-ink">Shipping Address</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">
                Full Name <span className="text-wine">*</span>
              </label>
              <input
                value={addr.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder="Full Name"
                className={`w-full border rounded-sm px-4 py-2.5 text-[14px] outline-none focus:border-wine transition-colors ${errors.fullName ? 'border-red-400' : 'border-wine/20'}`}
              />
              {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">
                Phone <span className="text-wine">*</span>
              </label>
              <input
                value={addr.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="Phone Number"
                type="tel"
                className={`w-full border rounded-sm px-4 py-2.5 text-[14px] outline-none focus:border-wine transition-colors ${errors.phone ? 'border-red-400' : 'border-wine/20'}`}
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">
                Email Address
              </label>
              <input
                value={addr.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="Email Address"
                type="email"
                className="w-full border border-wine/20 rounded-sm px-4 py-2.5 text-[14px] outline-none focus:border-wine transition-colors"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">
                Pincode <span className="text-wine">*</span>
              </label>
              <input
                value={addr.pincode}
                onChange={(e) => set('pincode', e.target.value)}
                placeholder="Pincode"
                className={`w-full border rounded-sm px-4 py-2.5 text-[14px] outline-none focus:border-wine transition-colors ${errors.pincode ? 'border-red-400' : 'border-wine/20'}`}
              />
              {errors.pincode && <p className="text-red-500 text-[11px] mt-1">{errors.pincode}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">Country</label>
              <input
                value="India"
                readOnly
                className="w-full border border-wine/10 rounded-sm px-4 py-2.5 text-[14px] bg-ivory text-ink-soft cursor-not-allowed"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">
                State <span className="text-wine">*</span>
              </label>
              <select
                value={addr.state}
                onChange={(e) => set('state', e.target.value)}
                className={`w-full border rounded-sm px-4 py-2.5 text-[14px] outline-none focus:border-wine bg-white transition-colors ${errors.state ? 'border-red-400' : 'border-wine/20'}`}
              >
                <option value="">Select Region</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">
                City <span className="text-wine">*</span>
              </label>
              <input
                value={addr.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="City"
                className={`w-full border rounded-sm px-4 py-2.5 text-[14px] outline-none focus:border-wine transition-colors ${errors.city ? 'border-red-400' : 'border-wine/20'}`}
              />
              {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
            </div>

            {/* Address Line */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-1.5">
                Address Line <span className="text-wine">*</span>
              </label>
              <textarea
                value={addr.addressLine}
                onChange={(e) => set('addressLine', e.target.value)}
                placeholder="House no., Street, Area"
                rows={2}
                className={`w-full border rounded-sm px-4 py-2.5 text-[14px] outline-none focus:border-wine transition-colors resize-none ${errors.addressLine ? 'border-red-400' : 'border-wine/20'}`}
              />
              {errors.addressLine && <p className="text-red-500 text-[11px] mt-1">{errors.addressLine}</p>}
            </div>

            {/* Address type */}
            <div className="sm:col-span-2 flex items-center gap-6">
              <span className="text-[11px] tracking-[0.12em] uppercase text-ink-soft">Address Type</span>
              {(['Home', 'Work'] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-[14px]">
                  <input
                    type="radio"
                    checked={addr.type === t}
                    onChange={() => set('type', t)}
                    className="accent-wine w-4 h-4"
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="mt-8">
            <h3 className="font-medium text-[15px] mb-4">Payment Options</h3>
            <label className="flex items-center gap-3 border border-wine/20 rounded-sm px-4 py-3 cursor-pointer bg-ivory w-fit">
              <input type="radio" defaultChecked className="accent-wine w-4 h-4" />
              <span className="text-[14px] font-medium">COD — Cash on Delivery</span>
            </label>
            <p className="text-[12px] text-ink-soft mt-2">Pay when you receive your order. No advance payment needed.</p>
          </div>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="border border-wine/10 rounded-sm bg-ivory">
            {/* Header toggle */}
            <button
              onClick={() => setOrderOpen((o) => !o)}
              className="w-full flex items-center justify-between px-5 py-4 font-medium text-[13px] tracking-[0.15em] uppercase"
            >
              <span>Order Summary</span>
              <span className="flex items-center gap-2 text-wine-deep font-semibold">
                {formatINR(subtotal)}
                {orderOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {orderOpen && (
              <div className="px-5 pb-5 border-t border-wine/10">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-wine/10 last:border-0">
                    <div className="relative shrink-0">
                      <img src={item.image} alt={item.name} className="w-14 h-[70px] object-cover rounded-sm" />
                      <span className="absolute -top-1.5 -right-1.5 bg-wine-deep text-white text-[9px] w-4 h-4 rounded-full grid place-items-center font-bold">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium leading-tight">{item.name}</p>
                      <p className="text-[11px] text-ink-soft mt-0.5">{item.type}</p>
                    </div>
                    <p className="text-[13px] font-semibold">{formatINR(item.price * item.qty)}</p>
                  </div>
                ))}

                <div className="space-y-2 mt-3 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Sub Total</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  {mrpTotal > subtotal && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>− {formatINR(mrpTotal - subtotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-[16px] pt-2 border-t border-wine/10">
                    <span>Total</span>
                    <span className="text-wine-deep">{formatINR(subtotal)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="px-5 pb-5">
              <button
                onClick={placeOrder}
                className="w-full bg-wine-deep text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3.5 rounded-sm hover:bg-wine transition-colors"
              >
                {placing ? 'PLACING…' : 'PLACE ORDER'}
              </button>
              <p className="text-[10px] text-ink-soft text-center mt-2 leading-relaxed">
                Tracking will be shared via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
