import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { orderMessage, whatsappUrl } from '../lib/whatsapp';

const WA = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.2.2-3.7-.9a9.3 9.3 0 0 1-3.8-3.4c-.3-.5-1-1.6-1-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7s.7 1.2 1.5 1.9c1 .9 1.8 1.1 2.1 1.3s.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.8-.1 1.4z" />
  </svg>
);

export default function Cart() {
  const { items, subtotal, changeQty, remove } = useCart();

  const mrpTotal = items.reduce((s, i) => s + (i.mrp ?? i.price) * i.qty, 0);
  const discount = mrpTotal - subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 py-32 text-center">
        <h2 className="font-serif text-4xl text-wine-deep mb-3">Your cart is empty</h2>
        <p className="text-ink-soft text-sm mb-8">Add some handwoven sarees to get started.</p>
        <Link to="/shop" className="btn btn-gold">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-6">
        <Link to="/" className="hover:text-wine">Home</Link>
        <span>›</span>
        <span className="text-ink">My Cart</span>
      </nav>

      <h1 className="font-serif text-[2.2rem] text-wine-deep mb-8 font-medium">MY CART</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Items table */}
        <div className="flex-1 w-full overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-wine/10 text-[11px] tracking-[0.18em] uppercase text-ink-soft">
                <th className="text-left pb-3 font-medium">Product</th>
                <th className="text-center pb-3 font-medium">Price</th>
                <th className="text-center pb-3 font-medium">Quantity</th>
                <th className="text-center pb-3 font-medium">Total</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-wine/10">
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[68px] h-[86px] object-cover rounded-sm shrink-0"
                      />
                      <div>
                        <p className="font-medium text-ink text-[15px]">{item.name}</p>
                        <p className="text-[11px] text-ink-soft mt-0.5">{item.type}</p>
                        <p className="text-[12px] text-emerald-600 font-semibold mt-1.5">FREE Delivery</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[12px] text-emerald-600 font-medium">In Stock</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center text-[15px]">{formatINR(item.price)}</td>
                  <td className="text-center">
                    <div className="inline-flex items-center border border-wine/20 rounded-sm">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="w-8 h-8 grid place-items-center text-wine text-[15px] hover:bg-wine/5 transition-colors"
                      >−</button>
                      <span className="w-8 text-center text-[14px]">{item.qty}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="w-8 h-8 grid place-items-center text-wine text-[15px] hover:bg-wine/5 transition-colors"
                      >+</button>
                    </div>
                  </td>
                  <td className="text-center font-semibold text-[15px]">{formatINR(item.price * item.qty)}</td>
                  <td className="text-center pl-2">
                    <button
                      onClick={() => remove(item.id)}
                      className="text-ink-soft hover:text-wine transition-colors"
                      aria-label="Remove"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart totals */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="border border-wine/10 rounded-sm p-6 bg-ivory">
            <h3 className="font-medium text-[13px] tracking-[0.2em] uppercase text-ink mb-5">CART TOTALS</h3>

            <div className="space-y-2.5 text-[14px]">
              <div className="flex justify-between">
                <span className="text-ink-soft">MRP</span>
                <span className="font-medium">{formatINR(mrpTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-ink-soft">Discount</span>
                  <span className="text-emerald-600 font-medium">− {formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 mt-1 border-t border-wine/10 text-[18px] font-semibold">
                <span>Total</span>
                <span className="text-wine-deep">{formatINR(subtotal)}</span>
              </div>
            </div>

            <p className="text-[11px] text-ink-soft text-center mt-3 leading-relaxed">
              Taxes and Shipping charge will be calculated at checkout
            </p>

            <Link
              to="/checkout"
              className="mt-5 w-full block text-center bg-wine-deep text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3.5 rounded-sm hover:bg-wine transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>

            <a
              href={whatsappUrl(orderMessage(items))}
              target="_blank"
              rel="noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3.5 rounded-sm hover:opacity-90 transition-opacity"
            >
              <WA /> ORDER VIA WHATSAPP
            </a>

            <Link
              to="/shop"
              className="block text-center text-[12px] text-ink-soft hover:text-wine mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
