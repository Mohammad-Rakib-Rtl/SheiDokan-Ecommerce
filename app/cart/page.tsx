'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { useCart } from '@/store/cart';

const SHIPPING = 120;

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const storedItems = useCart((state) => state.items);
  const items = mounted ? storedItems : [];
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const clearCart = useCart((state) => state.clearCart);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const estimatedShipping = items.length ? SHIPPING : 0;
  const total = subtotal + estimatedShipping;

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Header />
      <main className="container py-14">
        <nav className="text-xs uppercase tracking-[.18em] text-neutral-400">Home → Cart</nav>
        <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-heading text-[clamp(4rem,10vw,10rem)] font-extrabold leading-none">Cart</h1>
          {items.length ? (
            <button className="btn btn-ghost" onClick={clearCart} type="button">
              Clear cart
            </button>
          ) : null}
        </div>

        {!items.length ? (
          <section className="mt-16 grid place-items-center bg-[#f6f6f4] px-6 py-24 text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-[#111827]">
              <ShoppingBag size={42} />
            </div>
            <h2 className="mt-8 font-heading text-4xl font-bold">Your cart is quietly waiting.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
              Add a product with your preferred color and size to begin a premium SheiDokan order.
            </p>
            <Link href="/shop" className="btn btn-dark mt-8">
              Continue shopping
            </Link>
          </section>
        ) : (
          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_420px]">
            <section className="divide-y hairline border-y hairline">
              {items.map((item) => (
                <article className="grid gap-6 py-8 sm:grid-cols-[160px_1fr]" key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}>
                  <Link href={`/product/${item.slug}`} className="block overflow-hidden bg-[#f6f6f4]">
                    <Image src={item.image} alt={item.title} width={320} height={420} className="aspect-[3/4] h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-col justify-between gap-8">
                    <div className="flex justify-between gap-6">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-[.14em]">{item.title}</h2>
                        <p className="mt-3 text-sm text-neutral-500">Color: {item.selectedColor}</p>
                        <p className="mt-1 text-sm text-neutral-500">Size: {item.selectedSize}</p>
                      </div>
                      <button aria-label={`Remove ${item.title}`} className="self-start text-neutral-500" onClick={() => removeItem(item)} type="button">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-full border hairline">
                        <button aria-label={`Decrease ${item.title} quantity`} className="p-3" onClick={() => decreaseQuantity(item)} type="button">
                          <Minus size={16} />
                        </button>
                        <span className="min-w-10 text-center text-sm">{item.quantity}</span>
                        <button aria-label={`Increase ${item.title} quantity`} className="p-3" onClick={() => increaseQuantity(item)} type="button">
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-neutral-500">৳{item.price.toLocaleString()} each</p>
                        <p className="text-lg font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                        <button aria-label={`Remove ${item.title}`} className="text-neutral-500" onClick={() => removeItem(item)} type="button">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit bg-[#f6f6f4] p-8 lg:sticky lg:top-28">
              <h2 className="font-heading text-3xl font-bold">Order summary</h2>
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated shipping</span>
                  <span>৳{estimatedShipping.toLocaleString()}</span>
                </div>
                <div className="border-t hairline pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>
              <button className="btn btn-dark mt-8 w-full" type="button">
                Checkout unavailable
              </button>
              <p className="mt-4 text-xs leading-6 text-neutral-500">Checkout, payments and backend order creation are intentionally not implemented yet.</p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
