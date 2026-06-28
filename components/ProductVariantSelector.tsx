'use client';

import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';

type ColorOption = {
  name: string;
  value: string;
};

type SizeOption = {
  label: string;
  available: boolean;
};

type ProductVariantSelectorProps = {
  colors: ColorOption[];
  sizes: SizeOption[];
};

export function ProductVariantSelector({ colors, sizes }: ProductVariantSelectorProps) {
  const defaultSize = useMemo(() => {
    const preferredSize = sizes.find((size) => size.label === 'S' && size.available);

    return preferredSize?.label ?? sizes.find((size) => size.available)?.label ?? sizes[0]?.label ?? '';
  }, [sizes]);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.value ?? '');
  const [selectedSize, setSelectedSize] = useState(defaultSize);

  const handleOptionKeyDown = <T extends { available?: boolean }>(
    event: KeyboardEvent<HTMLButtonElement>,
    options: T[],
    currentIndex: number,
    selectOption: (option: T) => void,
  ) => {
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;

    if (!direction) return;

    event.preventDefault();

    const availableOptions = options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.available !== false);
    if (!availableOptions.length) return;

    const currentAvailableIndex = availableOptions.findIndex(({ index }) => index === currentIndex);
    const nextAvailableIndex = (currentAvailableIndex + direction + availableOptions.length) % availableOptions.length;
    const next = availableOptions[nextAvailableIndex];

    if (!next) return;

    selectOption(next.option);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[next.index]?.focus();
  };

  return (
    <>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Color</h2>
        <div className="mt-4 flex gap-3" role="radiogroup" aria-label="Select color">
          {colors.map((color) => {
            const isSelected = selectedColor === color.value;

            return (
              <button
                aria-checked={isSelected}
                aria-label={color.name}
                className={`h-9 w-9 rounded-full border hairline p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827] ${
                  isSelected ? 'ring-1 ring-[#111827] ring-offset-2' : ''
                }`}
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, colors, colors.indexOf(color), (nextColor) => setSelectedColor(nextColor.value))}
                role="radio"
                style={{ background: color.value }}
                type="button"
              />
            );
          })}
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Size</h2>
          <span className="text-sm">What’s my size?</span>
        </div>
        <div className="mt-4 flex gap-3" role="radiogroup" aria-label="Select size">
          {sizes.map((size) => {
            const isSelected = selectedSize === size.label;

            return (
              <button
                aria-checked={isSelected}
                className={`rounded-xl border px-5 py-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827] disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSelected ? 'bg-[#111827] text-white' : ''
                }`}
                disabled={!size.available}
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                onKeyDown={(event) => handleOptionKeyDown(event, sizes, sizes.indexOf(size), (nextSize) => setSelectedSize(nextSize.label))}
                role="radio"
                type="button"
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
