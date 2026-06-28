'use client';

import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/store/cart';

const nav = ['Shop', 'Categories', 'Brands', 'Deals', 'China Sourcing', 'OEM & ODM', 'Logistics', 'Track Order'];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const cartCount = useCart((state) => state.items.reduce((total, item) => total + item.quantity, 0));

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-white/88 backdrop-blur-xl border-b hairline">
      <div className="container h-20 grid grid-cols-3 items-center">
        <nav className="hidden lg:flex gap-7 text-[12px] font-semibold uppercase tracking-[.14em]">
          {nav.slice(0, 4).map((n) => (
            <Link href={n === 'Shop' ? '/shop' : '#'} key={n}>
              {n}
            </Link>
          ))}
        </nav>
        <button className="lg:hidden" aria-label="Open menu">
          <Menu />
        </button>
        <Link href="/" className="text-center font-heading text-2xl font-extrabold tracking-[-.08em]">
          <span>Shei</span>
          <span className="text-[#FF6B00]">Dokan</span>
        </Link>
        <div className="flex justify-end gap-5">
          <Search />
          <User className="hidden sm:block" />
          <Heart />
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag />
            {mounted && cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#FF6B00] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
