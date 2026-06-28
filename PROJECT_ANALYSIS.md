# SheiDokan Project Analysis

This document is based on a full inspection of the current repository contents. No existing source files were modified.

## 1. Folder structure

```txt
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx
│   └── shop/
│       └── page.tsx
├── components/
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ProductCard.tsx
├── lib/
│   └── data.ts
├── store/
│   └── cart.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### Observations

- The project is a very small Next.js App Router codebase.
- There is no `public/` directory, no test directory, no API routes, and no persistent data layer.
- Most application files are compressed into one or a few very long lines, which makes review, debugging, and future maintenance difficult.

## 2. Current routing

The project currently uses the Next.js App Router under `app/`.

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Homepage with hero, featured categories, new arrivals, sourcing section, brands, newsletter, header, and footer. |
| `/shop` | `app/shop/page.tsx` | Product listing page with static filter chips, sort button, product grid, show-more button, and pagination text. |
| `/product/[slug]` | `app/product/[slug]/page.tsx` | Dynamic product detail page that finds a product by slug from the local in-memory product array. |

### Missing routes from the requested website structure

The user-requested structure included many routes that do not currently exist:

- `/categories`
- `/brands`
- `/deals`
- `/china-sourcing`
- `/oem-odm`
- `/logistics`
- `/track-order`
- `/about`
- `/contact`
- `/faq`
- `/blog`
- `/cart`
- `/wishlist`
- `/account`

The header and footer mention some of these concepts, but most links are placeholders or static text rather than real routes.

## 3. Components

### `components/Header.tsx`

- Sticky top navigation.
- Displays the SheiDokan logo centered.
- Shows desktop nav items for `Shop`, `Categories`, `Brands`, and `Deals` only.
- Shows icon affordances for search, account, wishlist, and cart.
- Mobile menu button exists visually but has no drawer/menu behavior.

### `components/Footer.tsx`

- Static footer with brand description.
- Static columns for Navigate, Customers, and Company.
- Items are plain list text, not links.
- Social icons are decorative characters rather than accessible links.

### `components/ProductCard.tsx`

- Client component because it uses Zustand and Framer Motion.
- Renders product image, brand, name, price, optional old price, and wishlist button.
- Links the image to `/product/[slug]`.
- Uses Framer Motion `whileInView` animation.
- Wishlist button toggles a product id in the Zustand store.

## 4. UI components

The project does not currently have a formal UI component library or Shadcn UI setup.

### Existing UI primitives

- Global `.btn`, `.btn-dark`, and `.btn-ghost` CSS classes in `app/globals.css`.
- Global `.container`, `.hairline`, `.product-card`, and `.reveal` utility classes in `app/globals.css`.
- Product cards are implemented as a reusable component.
- Header and footer are reusable layout components.

### Missing UI components requested by the original product brief

The following requested UI primitives are not implemented as reusable components:

- Button component abstraction
- Card component abstraction
- Input component abstraction
- Select component
- Tabs
- Accordion component abstraction
- Drawer
- Modal
- Review card
- Badge
- Breadcrumb
- Pagination component
- Search component
- Wishlist button component
- Cart drawer
- Quick view modal
- Loading skeletons

### Shadcn UI status

- `package.json` does not include Shadcn-related dependencies such as `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/*`, or a `components/ui` directory.
- No `components.json` file is present.
- Therefore, Shadcn UI is not actually installed or configured yet.

## 5. State management

State management is handled only by a small Zustand store in `store/cart.ts`.

Current store shape:

```ts
type CartState = {
  items: number[];
  wishlist: number[];
  add: (id: number) => void;
  wish: (id: number) => void;
};
```

### Current capabilities

- Stores cart items as product ids.
- Stores wishlist items as product ids.
- Can append an id to `items` through `add(id)`.
- Can toggle an id in `wishlist` through `wish(id)`.

### Limitations

- No persistence to `localStorage`, cookies, database, or server session.
- No quantity tracking.
- No variant tracking for size/color.
- No cart item removal.
- No cart drawer/open state.
- No totals/subtotals/tax/shipping calculations.
- No checkout state.
- No authentication-aware state.

## 6. Product data source

Product data is generated locally in `lib/data.ts`.

### Current implementation

- Defines a `Product` TypeScript type.
- Defines static arrays for brands, categories, product noun/name fragments, and Unsplash image ids.
- Generates `120` products with `Array.from({ length: 120 })`.
- Exports:
  - `products`
  - `heroProducts`
  - `brandsList`
  - `categoriesList`

### Characteristics

Each generated product has:

- `id`
- `slug`
- `name`
- `brand`
- `category`
- `price`
- optional `oldPrice`
- `rating`
- remote Unsplash image URL
- optional `badge`
- `color`

### Limitations

- Product data is deterministic but synthetic.
- No inventory quantities.
- No SKU model.
- No product variants beyond a single display color string.
- No descriptions per product.
- No product specifications object.
- No reviews collection.
- No shipping/returns metadata per product.
- No category hierarchy.
- No brand metadata.
- No server/API boundary.
- No database, CMS, or commerce backend integration.

## 7. Cart implementation

### Existing behavior

- The Zustand store has an `add(id)` method that appends the product id to the `items` array.
- The current UI does not appear to call `add(id)` anywhere.
- The product detail page renders an `Add to cart` button, but that button is not wired to the cart store.
- The header cart icon links to `#cart`, but no cart drawer or cart page exists.

### Missing cart features

- Add-to-cart interaction from product detail page.
- Add-to-cart interaction from product cards or quick view.
- Cart drawer.
- Cart page.
- Quantity increment/decrement.
- Remove item.
- Variant-aware cart entries.
- Cart persistence.
- Cart badge/count in the header.
- Subtotal/discount/shipping/tax calculations.
- Checkout flow.

## 8. Wishlist implementation

### Existing behavior

- Wishlist state exists in the Zustand store as `wishlist: number[]`.
- `wish(id)` toggles ids in the wishlist.
- `ProductCard` calls `wish(p.id)` when the heart button is clicked.

### Missing wishlist features

- Product detail page wishlist button is not wired to the store.
- Header wishlist icon is not linked to a real wishlist page or drawer.
- No `/wishlist` route.
- No wishlist count indicator.
- No persistent wishlist storage.
- No visual active state for wishlisted products.
- No optimistic/server synchronization.

## 9. Search implementation

### Existing behavior

- The header renders a search icon.
- There is no search input, search drawer, search modal, route, or state.

### Missing search features

- Search overlay or page.
- Keyboard shortcut.
- Search query state.
- Search suggestions/autocomplete.
- Product indexing/filtering.
- Empty/loading/error states.
- URL query parameters for shareable search results.
- Accessibility handling for focus trap and keyboard navigation.

## 10. Missing features

Major missing features relative to the original brief include:

### Commerce

- Real cart flow.
- Checkout flow.
- Product variants and inventory.
- Product reviews.
- Product recommendations beyond simple category filtering.
- Discount/flash sale mechanics.
- Order tracking.
- Account/authentication.
- Payment integration.
- Delivery address management.

### Catalog and merchandising

- Functional filters.
- Functional sorting.
- Functional pagination or infinite loading.
- Category pages.
- Brand pages.
- Deals page.
- Product quick view.
- Loading skeletons.
- SEO metadata per product/category.

### Business model pages

- China Sourcing page.
- OEM & ODM page.
- Logistics page.
- Factory verification page.
- Global trading/service pages.
- Business consultancy content.
- Contact/lead forms for sourcing enquiries.

### UI and platform

- Shadcn UI integration.
- Reusable design-system components.
- Cart drawer.
- Search modal/drawer.
- Mobile menu implementation.
- Mega menu implementation.
- Newsletter submission handling.
- Blog.
- FAQ.
- Policies.
- App download section.

### Engineering

- Tests.
- Lint configuration beyond a script.
- Formatting setup.
- Environment variable schema.
- Error boundaries.
- Loading states.
- Not-found pages beyond default behavior.
- Analytics/observability.
- CI configuration.

## 11. Bugs

The following issues are present in the current implementation:

1. **Header navigation only renders four of eight nav items.**
   - The `nav` array contains eight entries, but the render uses `nav.slice(0, 4)`.

2. **Most header links are placeholders.**
   - Only `Shop` links to `/shop`; the other rendered nav items link to `#`.

3. **Cart icon points to a missing anchor.**
   - Header cart link uses `href="#cart"`, but no element with `id="cart"` exists.

4. **Mobile menu button has no behavior.**
   - It renders an accessible label but does not open a menu.

5. **Product detail add-to-cart is not functional.**
   - The button does not call `useCart().add`.

6. **Product detail wishlist is not functional.**
   - The button renders a heart icon but does not call `useCart().wish`.

7. **Shop filters, sorting, show-more, and pagination are static.**
   - They do not update product results or URL state.

8. **Footer navigation items are not links.**
   - They are rendered as text only.

9. **Newsletter form has no submit handler.**
   - The form is present but does not send data anywhere.

10. **Product color selector uses non-interactive spans.**
    - Color swatches are visual only and are not keyboard-operable controls.

11. **Accordion icons do not reflect open/closed state.**
    - Product page accordions always show a plus icon, even when a section is open.

12. **Potential dependency/version instability.**
    - `package.json` uses `latest` for all dependencies, which can cause non-reproducible installs and unexpected breaking changes.

13. **No lockfile is present.**
    - Without a lockfile, dependency resolution is not deterministic.

14. **No installed dependencies in the repository.**
    - Build/test commands cannot run until dependency installation succeeds.

15. **Remote font import can impact performance and privacy.**
    - Fonts are loaded from Google Fonts via CSS `@import` instead of `next/font`.

16. **One-line source formatting makes maintenance difficult.**
    - Several files compress entire components into one or two lines, increasing review and merge-conflict risk.

## 12. Performance issues

### Current concerns

- `ProductCard` is a client component and imports Framer Motion and Zustand. Every product card in grids therefore participates in the client bundle.
- Large product grids render many animated client components at once.
- Google Fonts are loaded through CSS `@import`, which is typically less optimal than `next/font`.
- Product images come from remote Unsplash URLs and depend on external network availability.
- No blur placeholders or low-quality image placeholders are configured.
- No skeleton loading states exist.
- No route-level loading UI exists.
- Dependency versions are unpinned, which can change bundle size unpredictably.
- The product detail page renders multiple large remote images immediately below the hero area.

### Potential improvements

- Use `next/font` for Inter and Manrope.
- Split product card into a server-rendered display component plus a small client-only wishlist control.
- Use dynamic imports for non-critical interactive components such as cart drawer, search drawer, and quick view.
- Add image placeholders and carefully chosen `sizes` attributes.
- Add route-level `loading.tsx` files.
- Add skeleton components for product grids and product detail pages.
- Introduce virtualization or incremental pagination for very large product grids.
- Pin dependencies and commit a lockfile.

## 13. Recommended architecture

### Application structure

Recommended future folder structure:

```txt
app/
├── (marketing)/
│   ├── about/
│   ├── china-sourcing/
│   ├── logistics/
│   └── oem-odm/
├── (shop)/
│   ├── shop/
│   ├── categories/[slug]/
│   ├── brands/[slug]/
│   ├── deals/
│   └── product/[slug]/
├── account/
├── cart/
├── checkout/
├── track-order/
└── api/

components/
├── layout/
├── product/
├── commerce/
├── search/
├── marketing/
└── ui/

features/
├── cart/
├── wishlist/
├── catalog/
├── checkout/
├── sourcing/
└── account/

lib/
├── commerce/
├── data/
├── utils/
└── validations/

store/
└── client stores only
```

### Data architecture

- Move from generated local data to a clear data access layer.
- Start with typed seed files if a backend is not ready.
- Add API/server functions for product listing, product detail, search, filters, and recommendations.
- Model products with variants, inventory, prices, media, categories, brands, reviews, shipping information, and sourcing metadata.

### State architecture

- Use server components for product/catalog rendering where possible.
- Use Zustand only for client UI state and ephemeral cart/wishlist state.
- Persist cart/wishlist to local storage for guests.
- Sync cart/wishlist with user accounts when authentication is added.
- Use React Query for client-side remote mutations and cache synchronization where needed.

### UI architecture

- Add Shadcn UI properly with `components/ui` primitives.
- Create design-system wrappers for Button, Input, Select, Dialog, Drawer, Accordion, Tabs, Badge, Pagination, Skeleton, and Breadcrumb.
- Keep product, cart, search, and navigation components feature-scoped.
- Add accessibility-first patterns for menus, drawers, modals, accordions, and forms.

### Routing and SEO

- Add real routes for all top-level business areas.
- Add metadata per route and product.
- Add sitemap and robots support.
- Use URL search params for filters, sorting, pagination, and search.
- Add `not-found.tsx` and route-level `loading.tsx` files.

### Quality and delivery

- Pin package versions and commit a lockfile.
- Add ESLint/Prettier configuration.
- Add unit tests for data utilities and store logic.
- Add component tests for product card, filters, cart drawer, and search.
- Add Playwright smoke tests for homepage, shop, product detail, cart, and checkout flows.
- Add CI for typecheck, lint, test, and build.
