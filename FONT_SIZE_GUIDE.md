# Font Size Consistency Guide - Lavanya Ceramics

## Current Font Size Analysis

### Issues Found:

1. **Inconsistent responsive breakpoints** - Some pages use `md:` while others use `lg:`
2. **Hero titles vary** - Range from `text-4xl md:text-5xl` to `text-6xl`
3. **Body text lacks mobile consideration** - Most body text doesn't have responsive sizing
4. **Heading levels inconsistent** - `h2` and `h3` don't always follow a hierarchy

---

## Standardized Font Size System (Tailwind)

### Page Hierarchy

#### **1. Page Hero Titles (Main Hero Sections)**

**Desktop:** `text-5xl` → `md:text-6xl` (for Desktop/Tablet)
**Mobile:** `text-4xl` (Auto-scales with smaller screens)
**Tailwind Class:** `text-4xl md:text-5xl lg:text-6xl`

**Current Issues:**

- About.tsx: `text-4xl md:text-5xl` ✓ (Good but could be larger on desktop)
- Products.tsx: `text-4xl md:text-5xl` ✓
- Contact.tsx: `text-4xl md:text-5xl` ✓
- ShippingInfo.tsx: `text-4xl md:text-5xl` ✓
- PrivacyPolicy.tsx: `text-4xl md:text-5xl` ✓
- TermsOfService.tsx: `text-4xl md:text-5xl` ✓

**Recommendation:** Add `lg:text-6xl` for larger screens

---

#### **2. Section Headings (h2)**

**Desktop:** `text-3xl`
**Tablet:** `text-2xl`
**Mobile:** `text-xl`
**Tailwind Class:** `text-xl md:text-2xl lg:text-3xl`

**Current Usage:**

- About.tsx: `text-3xl` (No responsive sizing) ✗
- About.tsx (Manifesto): `text-2xl` (No responsive sizing) ✗
- Craftsmanship.tsx: `text-3xl` (No responsive sizing) ✗
- ShippingInfo.tsx: `text-3xl` (No responsive sizing) ✗

**Issues:** Missing mobile/tablet breakpoints

---

#### **3. Subsection Headings (h3)**

**Desktop:** `text-2xl`
**Tablet:** `text-xl`
**Mobile:** `text-lg`
**Tailwind Class:** `text-lg md:text-xl lg:text-2xl`

**Current Usage:**

- About.tsx: `text-2xl` (No responsive sizing) ✗

---

#### **4. Card/Box Titles**

**Desktop:** `text-xl`
**Tablet:** `text-lg`
**Mobile:** `text-base`
**Tailwind Class:** `text-base md:text-lg lg:text-xl`

**Current Usage:**

- Auth layouts: `text-xl` (Consistent, but no mobile scaling) ✓/-

---

#### **5. Body Text (Paragraphs)**

**Desktop:** `text-base`
**Tablet:** `text-base`
**Mobile:** `text-sm`
**Tailwind Class:** `text-sm md:text-base`

**Current Usage:**

- Most pages: No responsive sizing, just `text-gray-600` or `text-gray-700` ✗

---

#### **6. Small Text (Labels, Hints, Captions)**

**All Sizes:** `text-xs` or `text-sm`
**Tailwind Class:** `text-xs` (consistent across all devices)

**Current Usage:**

- Navbar.tsx: `text-xs` ✓
- Various components: Mix of `text-xs` and `text-sm` ±

---

## Standardization Recommendations

### Tier 1: CRITICAL (Public-facing Pages)

#### Page Hero Banner Title

```jsx
// BEFORE (Inconsistent)
<h1 className="text-4xl md:text-5xl">ABOUT US</h1>

// AFTER (Consistent)
<h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-wide">ABOUT US</h1>
```

**Pages to update:**

- [ ] About.tsx
- [ ] Contact.tsx
- [ ] Products.tsx
- [ ] ShippingInfo.tsx
- [ ] PrivacyPolicy.tsx
- [ ] TermsOfService.tsx
- [ ] Returns.tsx

---

#### Section Headings (h2)

```jsx
// BEFORE
<h2 className="text-3xl font-semibold mb-6">Section Title</h2>

// AFTER
<h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6">Section Title</h2>
```

**Pages to update:**

- [ ] About.tsx - Multiple sections
- [ ] Craftsmanship.tsx
- [ ] ShippingInfo.tsx

---

#### Body Paragraphs

```jsx
// BEFORE
<p className="text-gray-700 leading-relaxed">Content here</p>

// AFTER
<p className="text-sm md:text-base text-gray-700 leading-relaxed">Content here</p>
```

**Pages to update:**

- [ ] All content pages
- [ ] Policy pages
- [ ] Customer pages

---

### Tier 2: IMPORTANT (UI Components)

#### Auth Layouts

- CardTitle: `text-lg md:text-xl` ✓ (Currently: `text-xl`)
- CardDescription: Already uses `text-sm` ✓

#### Navbar/Dropdowns

- Already well-formatted ✓

#### Dashboard

- HeadingSmall: `text-sm md:text-base` (Currently: `text-base`)
- Heading: `text-lg md:text-xl` (Currently: `text-xl`)

---

### Tier 3: NICE-TO-HAVE (Admin Pages)

- Admin headers: Standardize to `text-lg md:text-xl lg:text-2xl`
- Data tables: Keep small text (`text-xs` or `text-sm`)

---

## Implementation Checklist

### Priority: HIGH

- [ ] **About.tsx** - Hero + All sections
    - Hero: Add `lg:text-6xl`
    - Brand Story (h2): Change to responsive
    - Manifesto (h3): Change to responsive
    - All body text: Add responsive sizing

- [ ] **Contact.tsx** - Hero + Body
    - Hero: Add `lg:text-6xl`
    - Section heading: Add responsive sizing
    - Body text: Add responsive sizing

- [ ] **Products.tsx** - Hero + Page titles
    - Hero: Add `lg:text-6xl`
    - Body text: Add responsive sizing

- [ ] **ShippingInfo.tsx** - Multiple sections
    - Hero: Add `lg:text-6xl`
    - All h2 headings: Make responsive
    - Body text: Add responsive sizing

- [ ] **PrivacyPolicy.tsx** - Full page
    - Hero: Add `lg:text-6xl`
    - Sections: Make responsive
    - Body text: Add responsive sizing

- [ ] **TermsOfService.tsx** - Full page
    - Hero: Add `lg:text-6xl`
    - Sections: Make responsive
    - Body text: Add responsive sizing

- [ ] **Returns.tsx** - Full page
    - Check and standardize all headings

### Priority: MEDIUM

- [ ] Craftsmanship.tsx
- [ ] FAQ.tsx (if exists)
- [ ] Articles pages
- [ ] Customer Dashboard pages

### Priority: LOW

- [ ] Auth layout components (mostly good)
- [ ] Admin pages
- [ ] Settings pages

---

## Standard Spacing with Font Sizes

When updating font sizes, also consider spacing:

```jsx
// With larger font, you may need more margin
<h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 lg:mb-8">
  Title
</h1>

// Paragraph below should have less margin
<p className="text-sm md:text-base text-gray-700 mt-3 md:mt-4">
  Content
</p>
```

---

## Device Breakpoints Reference (Tailwind)

| Breakpoint | Width  | Usage                  |
| ---------- | ------ | ---------------------- |
| `sm:`      | 640px  | Small phone            |
| `md:`      | 768px  | Tablet/Landscape phone |
| `lg:`      | 1024px | Desktop                |
| `xl:`      | 1280px | Large desktop          |
| `2xl:`     | 1536px | Ultra-wide             |

**Current Usage:** Most pages use `md:` and `lg:`, which is good. Avoid mixing inconsistently.

---

## Font Size Scale Reference (Tailwind Defaults)

| Class       | Size            |
| ----------- | --------------- |
| `text-xs`   | 12px (0.75rem)  |
| `text-sm`   | 14px (0.875rem) |
| `text-base` | 16px (1rem)     |
| `text-lg`   | 18px (1.125rem) |
| `text-xl`   | 20px (1.25rem)  |
| `text-2xl`  | 24px (1.5rem)   |
| `text-3xl`  | 30px (1.875rem) |
| `text-4xl`  | 36px (2.25rem)  |
| `text-5xl`  | 48px (3rem)     |
| `text-6xl`  | 60px (3.75rem)  |
| `text-7xl`  | 72px (4.5rem)   |

---

## Next Steps

1. Create a reusable component system for headings
2. Audit all pages and apply standardized sizes
3. Test on mobile, tablet, and desktop devices
4. Update style guide after implementation
5. Document in team guidelines
