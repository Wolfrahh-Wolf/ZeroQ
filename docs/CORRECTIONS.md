# ZeroQ — Correction Spec (CORRECTIONS.md)

> **Standard Trigger Contract:**
> *"Read AGENTS.md, docs/MODULES.md, and execute Correction Phase [X] from docs/CORRECTIONS.md completely."*

---

## Overview

This document defines corrections to be applied to the existing Phase 1–5 implementation. Each phase has its own trigger, target files, implementation steps, and verification criteria.

**Current State:**
- All 5 phases implemented and working
- TypeScript compiles with zero errors
- Build passes
- Database seeded and functional

---

## Correction Phase 1 — Cart Restructure, User Names, Realtime & Favicon

**Trigger:** *"Read AGENTS.md, docs/MODULES.md, and execute Correction Phase 1 from docs/CORRECTIONS.md completely."*

**Objective:** Restructure the cart to support multi-outlet ordering, update user display to show names instead of emails, replace polling with real-time updates, and add the app logo as favicon.

**Target Files:**
```
src/components/cart-context.tsx
src/components/cart-drawer.tsx
src/components/navbar.tsx
src/components/checkout-button.tsx
src/app/login/page.tsx
src/components/admin-sidebar.tsx
src/app/dashboard/orders/page.tsx
src/components/admin-order-row.tsx
src/lib/types.ts
src/app/globals.css
public/favicon.ico
prisma/schema.prisma
prisma/seed.ts
```

---

### Task 1.1 — Restructure Cart for Multi-Outlet Ordering

**What to do:**

The current cart locks to a single outlet per session. This must change so students can add items from multiple outlets in the same cart session. Items should be grouped by outlet within the cart UI, and each group should have its own checkout button.

**Implementation Requirements:**

- The cart state must change from tracking a single outlet to tracking multiple outlet groups. Each group contains items belonging to one outlet.
- The `addItem` action must no longer block items from different outlets. Instead, it should place the item into the correct outlet group, creating a new group if one does not exist for that outlet.
- The `removeItem` and `updateQuantity` actions must look up the item within the correct group and modify only that group's items.
- When a group becomes empty (all items removed), that group should be removed from the cart entirely.
- A new action must be added to clear only a specific outlet's group after checkout succeeds, leaving other groups intact.
- The `sessionStorage` persistence format must be updated to serialize the grouped structure. The storage key and version string should be incremented to invalidate old cart data.

**UI Requirements (`cart-drawer.tsx`):**

- The cart drawer must display items grouped by outlet. Each group should have a header showing the outlet name and the number of items in that group.
- Within each group, items are listed with their existing controls (quantity +/-, remove button).
- Below each group's items, show the subtotal for that group.
- Below the subtotal, render a checkout button specific to that group (it should only checkout items in that group).
- At the bottom of the drawer, show the grand total across all groups.
- The cross-outlet warning notice should be removed entirely, as the cart now supports multiple outlets natively.

**UI Requirements (`navbar.tsx`):**

- Remove the cross-outlet notice banner that appeared when items from different outlets were mixed. This is no longer needed.
- The cart count badge in the navbar should continue to show the total number of items across all groups.

**Implementation Notes:**

- The checkout button component must accept outlet-specific items and total, and pass only those items to the order creation API.
- On successful checkout, the checkout button should signal the cart context to remove only its outlet's group, not the entire cart.
- The existing `POST /api/orders` API route requires no changes — it already accepts `outletId` and a list of `items` with `menuItemId` and `quantity`.

---

### Task 1.2 — Display User Names Instead of Email Addresses

**What to do:**

All pages currently display the logged-in user's email address in the navbar and other places. This must be changed to show the user's first and last name combined.

**Database Schema Changes:**

- Add `firstName` and `lastName` fields to the User model in the Prisma schema.
- Run a database migration to add these columns to the existing table.
- Populate the new fields for all existing users:
  - For the default student account, set firstName to "Alex" and lastName to "Student".
  - For the admin accounts, extract the name parts from the existing name field (e.g., "Admin — Main Canteen" → firstName "Admin", lastName "Main Canteen").
  - For the custom student accounts (those starting with "yashwanth"), set firstName to "Yashwanth" and lastName to "A".
- Update the seeding logic so that any newly created users are seeded with both `firstName` and `lastName` fields populated.

**Type and Session Updates:**

- Update the `SessionUser` type in the shared types file to include `firstName` and `lastName` alongside the existing fields.
- Ensure the NextAuth configuration includes these new fields in the JWT and session token so they are available in client components.

**UI Updates — All Pages:**

- Replace all instances where the email address is displayed as the user identifier with the combined first and last name.
- In the navbar, the avatar fallback should continue to show the first initial of the first name.
- The name display text in the navbar (next to the avatar) should show "FirstName LastName".
- In the admin dashboard, when order rows display the student name, ensure the query includes the new `firstName` and `lastName` fields so the display is correct.
- If any other page or component currently references `user.name` or `user.email` as a display label, update it to use the combined name instead.

**API Query Updates:**

- Any Prisma query that returns user data (student name in admin order rows, etc.) must include `firstName` and `lastName` in its `select` clause.

---

### Task 1.3 — Replace Polling with Supabase Realtime

**What to do:**

The student orders page and admin dashboard currently use interval-based polling to refresh order data. Replace this with Supabase Realtime subscriptions so updates appear instantly when another user changes an order status.

**Prerequisites to Set Up:**

- Enable Realtime in the Supabase dashboard under Settings → Replication. Ensure the `orders` table is included.
- Add two new environment variables to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL` — the Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the Supabase anonymous public key

**New File to Create:**

- Create a dedicated realtime module in `src/lib/` that initializes a Supabase client and provides a function to subscribe to order changes. This function should accept an optional filter (student ID or outlet ID) so that subscribers only receive relevant updates.

**Student Orders Page (`src/app/dashboard/orders/page.tsx`):**

- Replace the `setInterval` polling mechanism with a Supabase Realtime subscription.
- Subscribe to changes on the `orders` table filtered to this student's ID.
- On receiving a realtime event (insert, update, delete), trigger a fresh data fetch from the API to sync the UI.
- Clean up the subscription on component unmount.

**Admin Dashboard (`src/components/admin-dashboard.tsx`):**

- Replace the `setInterval` polling mechanism with a Supabase Realtime subscription.
- Subscribe to changes on the `orders` table filtered to the admin's outlet ID.
- Only subscribe while the admin is on the "Active Queue" tab. Unsubscribe or ignore when switched to "History".
- On receiving a realtime event, trigger a fresh data fetch from the API.
- Clean up the subscription on component unmount or tab switch.

**Implementation Notes:**

- The initial data load should still use the existing API endpoints. Realtime only handles push updates.
- It is acceptable to keep a lightweight fallback poll (e.g., every 30 seconds) in case the realtime connection drops, but the primary refresh mechanism should be realtime.
- Ensure the subscription is properly disposed of to avoid memory leaks or multiple subscriptions on re-renders.

---

### Task 1.4 — Add Favicon

**What to do:**

The app currently has no favicon. Add the ZeroQ logo as the favicon so it appears in the browser tab and bookmarks.

**File Locations:**

- Place a `.ico` file at `public/favicon.ico`.
- The ICO should be generated from the existing blue ZeroQ logo icon used in the navbar and admin sidebar (the `Utensils` icon inside a blue square).
- Include multiple resolutions within the ICO (16×16, 32×32, 48×48) for compatibility.

**Implementation:**

- Link the favicon in the root layout's `<head>` or metadata configuration.
- Ensure the favicon loads on all routes, including API pages (which typically strip favicons anyway, but it should not cause errors).
- No code changes are needed in components — this is a static asset and metadata update.

---

### Verification for Phase 1

- [ ] Cart allows adding items from multiple outlets in the same session
- [ ] Cart drawer groups items by outlet with outlet headers and subtotals
- [ ] Each outlet group in the cart has its own "Order Now" / checkout button
- [ ] Successful checkout removes only the checked-out outlet's group, leaving others
- [ ] Cart badge in navbar shows total count across all groups
- [ ] Cross-outlet warning notice is removed from navbar and cart drawer
- [ ] Cart persists across page refreshes with the new grouped format (old cart data is invalidated)
- [ ] User name (first + last) is displayed in the navbar instead of email
- [ ] Admin dashboard order rows display student's first and last name instead of email
- [ ] All existing users have firstName and lastName populated in the database
- [ ] Custom yashwanth users have firstName "Yashwanth" and lastName "A"
- [ ] Seeder creates new users with firstName and lastName populated
- [ ] Session token includes firstName and lastName fields
- [ ] Orders page updates in real-time when admin changes a status (no polling delay)
- [ ] Admin queue updates in real-time when student places a new order
- [ ] Realtime subscription is scoped (student sees only their orders, admin sees only their outlet's)
- [ ] Subscription is cleaned up on component unmount
- [ ] Favicon.ico exists in public/ and appears in browser tab
- [ ] TypeScript compiles with zero errors
- [ ] `npm run build` succeeds

---

## Correction Phase 2 — Dark Theme Implementation

**Trigger:** *"Read AGENTS.md, docs/MODULES.md, and execute Correction Phase 2 from docs/CORRECTIONS.md completely."*

**Objective:** Implement a togglable dark theme using Microsoft Fluent 2 Dark design tokens. Dark mode should be the default state. Users can switch to light mode, and their preference is persisted.

**Target Files:**
```
src/app/layout.tsx
src/app/globals.css
tailwind.config.ts
src/components/theme-provider.tsx  ← New file
src/lib/theme.ts  ← New file
src/components/navbar.tsx
src/components/ui/  ← All Shadcn components
src/components/cart-drawer.tsx
src/components/order-card.tsx
src/components/admin-order-row.tsx
src/components/admin-dashboard.tsx
src/components/admin-sidebar.tsx
```

---

### Task 2.1 — Theme System Infrastructure

**What to do:**

Create a theme management system that tracks the current theme ("dark" or "light"), persists the user's choice, and applies the theme class to the HTML root element.

**Implementation Requirements:**

- Create a new theme provider component that wraps the application. This component manages the theme state, handles the initial theme detection, and provides a toggle function.
- The theme state must persist in `localStorage` using a dedicated key so the preference survives page refreshes.
- The initial theme must be detected as follows:
  1. If a user preference exists in `localStorage`, use that.
  2. Otherwise, check the browser's system preference (`prefers-color-scheme`).
  3. If no system preference is detected, default to **dark**.
- The theme must be applied as a class (`dark`) on the `<html>` element so Tailwind can use its dark mode variants.
- Export a custom hook (`useTheme`) that returns the current theme value and the toggle function.

**Verification:**
- Page loads in dark mode by default (on a first visit).
- Toggling switches between dark and light themes.
- The selected theme persists after page refresh and browser restart.
- The system preference is respected only when no explicit user choice has been saved.

---

### Task 2.2 — Dark Theme Color Tokens

**What to do:**

Define a complete Microsoft Fluent 2 Dark color palette in CSS and map it to Tailwind utility classes. This palette should mirror the light theme structure with appropriate dark-mode substitutions.

**Implementation Requirements:**

- Add a `.dark` CSS class block in the global stylesheet that overrides the Fluent 2 color tokens defined in the `:root` block.
- The dark palette should use the official Microsoft Fluent 2 Dark design tokens. Key mappings:
  - Brand colors should use the Fluent 2 Dark accent palette (lighter blues for visibility on dark backgrounds).
  - Neutral surfaces should use dark gray tones (e.g., `#1A1A1A` for base, `#252525` for layered surfaces, `#333333` for elevated surfaces).
  - Text colors should use white and light gray tones for proper contrast.
  - Border and stroke colors should use medium-dark grays.
  - Status badge colors (ordered, ready, delivered) should also have dark-mode variants that remain legible.
- Ensure all existing light theme tokens in `:root` remain unchanged — the dark tokens are purely additive via the `.dark` class.
- Update the Tailwind config to enable dark mode using the `class` strategy.

**Verification:**
- All Fluent 2 color tokens have dark-mode equivalents.
- No hardcoded color values in components override the CSS variable system (use Tailwind utilities or CSS variable references).
- Status badges remain clearly visible and distinguishable in dark mode.

---

### Task 2.3 — Update Shadcn UI Components

**What to do:**

All Shadcn UI components currently use hardcoded or light-theme-only colors. Update each component to support dark mode through Tailwind's `dark:` variants or by referencing CSS variables.

**Components to Update:**
- `button.tsx` — Background, text, border, and hover colors for all variants (default, outline, secondary, ghost, destructive, link)
- `card.tsx` — Background and border colors
- `input.tsx` — Background, border, focus ring, and disabled colors
- `badge.tsx` — Background, text, and border colors
- `label.tsx` — Text color
- `avatar.tsx` — Fallback background color
- `dialog.tsx` — Overlay and content background colors
- `separator.tsx` — Border color
- `scroll-area.tsx` — Scrollbar track and thumb colors
- `tabs.tsx` — Background colors for tabs list, trigger active state, and content

**Implementation Approach:**

For each component, add `dark:` prefixed Tailwind classes alongside the existing light-mode classes. For components with complex variant systems (like Button), ensure all variant definitions include dark-mode overrides.

**Verification:**
- Every Shadcn component renders correctly in both light and dark modes.
- No text is unreadable (e.g., white on white or black on black).
- Focus rings and hover states are visible in both modes.
- Scrollbar thumb and track colors are appropriate for dark mode.

---

### Task 2.4 — Update Application Components

**What to do:**

Update all application-level components to support the dark theme. This includes the navbar, cart drawer, order cards, admin dashboard, admin sidebar, and any other component with hardcoded colors.

**Components to Update:**
- `navbar.tsx` — Background, border, hover states, and button colors
- `cart-drawer.tsx` — Background, border, and divider colors
- `order-card.tsx` — Card background and border
- `admin-order-row.tsx` — Table row background, hover states, and text colors
- `admin-dashboard.tsx` — Card backgrounds and text colors
- `admin-sidebar.tsx` — Sidebar background, border, and hover colors

**Implementation Approach:**

Where components use hardcoded Tailwind colors (e.g., `bg-white`, `bg-slate-200`), replace them with `dark:` variants or CSS variable references. For example, `bg-white` becomes `bg-white dark:bg-[var(--fluent-neutral-bg)]`.

**Verification:**
- All pages and components render correctly in both light and dark modes.
- The navbar, sidebar, dialogs, and cards all adapt to the theme.
- No component has invisible or illegible content in dark mode.

---

### Task 2.5 — Add Theme Toggle to Navbar

**What to do:**

Add a theme toggle button to the student navbar so users can switch between dark and light themes at any time.

**Implementation Requirements:**

- Import the `useTheme` hook in the navbar component.
- Render a button that calls the toggle function when clicked.
- Use an appropriate icon for the toggle:
  - Show a sun icon when currently in dark mode (clicking switches to light).
  - Show a moon icon when currently in light mode (clicking switches to dark).
- Position the toggle button near the existing user avatar and sign-out button in the navbar's right section.
- The button should use the `ghost` variant and be accessible with a descriptive `aria-label`.

**Verification:**
- Toggle button appears in the navbar on all student-facing pages.
- Clicking the button immediately switches the theme.
- The icon updates to reflect the current and next state (sun for dark→light, moon for light→dark).
- The button is styled consistently with other navbar buttons.

---

### Verification for Phase 2

- [ ] Theme system infrastructure created and working (provider, hook, toggle, persistence)
- [ ] Dark mode is the default on first visit
- [ ] System `prefers-color-scheme` is respected when no user choice is saved
- [ ] User preference persists in localStorage across sessions
- [ ] `.dark` class is applied to `<html>` element when dark mode is active
- [ ] All Fluent 2 Dark color tokens defined and accessible via CSS variables
- [ ] Tailwind dark mode strategy set to `class`
- [ ] All Shadcn UI components updated with dark-mode variants
- [ ] All application components updated with dark-mode support
- [ ] Theme toggle button present in navbar with correct sun/moon icons
- [ ] No text is unreadable in either mode
- [ ] All status badges remain visible and distinct in dark mode
- [ ] `npm run build` succeeds with no errors

---

## Execution Notes

### Recommended Order

Execute Phase 1 before Phase 2. Phase 2 modifies global CSS and many UI components, which could conflict with Phase 1's UI changes if done first.

### Shared Considerations

- Both phases must pass `tsc --noEmit` and `npm run build` before completion.
- Phase 1 requires database changes (Task 1.2) — run `npx prisma db push` after schema updates and populate existing user names.
- Phase 1 requires Supabase Realtime configuration — ensure the Supabase project has Realtime enabled before testing.
- Phase 2 modifies nearly every UI component — coordinate carefully to avoid duplicate work or style regressions.
