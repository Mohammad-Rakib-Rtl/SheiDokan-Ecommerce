'use client';

import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/data';
import { useCart } from '@/store/cart';
import { ProductVariantSelector, type ColorOption, type SizeOption } from './ProductVariantSelector';

type ProductPurchaseActionsProps = {
  product: Product;
  colors: ColorOption[];
  sizes: SizeOption[];
};

export function ProductPurchaseActions({ product, colors, sizes }: ProductPurchaseActionsProps) {
  const defaultSize = useMemo(() => {
    const preferredSize = sizes.find((size) => size.label === 'S' && size.available);

    return preferredSize?.label ?? sizes.find((size) => size.available)?.label ?? sizes[0]?.label ?? '';
  }, [sizes]);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.value ?? '');
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const addItem = useCart((state) => state.addItem);

  return (
    <>
      <ProductVariantSelector
        colors={colors}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        sizes={sizes}
        onColorChange={setSelectedColor}
        onSizeChange={setSelectedSize}
      />
      <div className="mt-10 flex gap-3">
        <button
          className="btn btn-dark flex-1"
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              title: product.name,
              image: product.image,
              price: product.price,
              selectedColor,
              selectedSize,
              quantity: 1,
            })
          }
          type="button"
        >
          Add to cart
        </button>
        <button className="btn btn-ghost px-8" aria-label="Wishlist" type="button">
          <Heart />
        </button>
      </div>
      <button className="btn btn-ghost mt-3 w-full" type="button">
        Buy now
      </button>
    </>
  );
}
