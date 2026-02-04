# Hero Background Reusable Component

## Overview
Created a reusable `HeroBackground` component that extracts the animated background from the HeroSection and makes it available throughout the application.

## Changes Made

### New Component: `src/components/HeroBackground.tsx`
- **Purpose**: Reusable background component with floating leaf animations, steam effects, and gradient orbs
- **Features**:
  - Multiple floating leaf animations (regular and alternate styles)
  - Steam line effects rising from the bottom
  - Animated gradient orbs in the background
  - Full tea-forest to tea-dark gradient background
  - Grain texture overlay
  - Pointer-events-none on animations so they don't block interaction
  - Accepts children and optional className for customization
  - Contains relative z-10 positioning for content

### Updated Auth Pages

#### `src/pages/auth/SignUp.tsx`
**Changes**:
- Removed: `import { TeaLeafAnimation }` 
- Added: `import { HeroBackground }`
- Removed: `<TeaLeafAnimation count={12} speed={25} opacity={0.3} />`
- Changed: Root div to `<HeroBackground>` wrapper
- Removed: Individual `relative z-10` class from motion.div (now handled by HeroBackground)
- Result: Auth page now matches landing page visual style

#### `src/pages/auth/SignIn.tsx`
**Changes**:
- Same as SignUp.tsx
- Removed: `import { TeaLeafAnimation }`
- Added: `import { HeroBackground }`
- Removed: `<TeaLeafAnimation count={12} speed={25} opacity={0.3} />`
- Changed: Root div to `<HeroBackground>` wrapper
- Result: Consistent branding across auth pages

## Component Architecture

```tsx
<HeroBackground className="optional">
  <motion.div>
    {/* Your content here - automatically positioned */}
  </motion.div>
</HeroBackground>
```

The HeroBackground handles:
- All background gradient and texture
- All animated elements (leaves, steam, orbs)
- Proper z-index layering (animations at z-0, children at z-10)
- Min-height and flexbox positioning
- Overflow hidden for clean animations

## Benefits
1. **DRY Principle**: No code duplication of animation components
2. **Consistency**: Same animations across landing page and auth pages
3. **Maintainability**: Update animations in one place affects all pages
4. **Scalability**: Can be reused on any page needing the hero background
5. **Accessibility**: Animations don't interfere with user interaction
6. **Performance**: All animations optimized and using Infinity repeat

## Animation Details

### Floating Leaves
- **Duration**: 8 seconds (regular), 10 seconds (alternate)
- **Count**: ~13 total leaves positioned across screen
- **Colors**: text-tea-cream/30 (regular), text-tea-gold/25 (alternate)
- **Motion**: Vertical movement with horizontal drift and rotation

### Steam Lines
- **Duration**: 4 seconds
- **Count**: 5 lines
- **Pattern**: Rising from bottom with fade and scale effects
- **Position**: Scattered horizontally (25%, 35%, 50%, 65%, 75%)

### Gradient Orbs
- **Count**: 2 orbs
- **Colors**: tea-gold/5 and tea-sage/5 for subtle effect
- **Motion**: Scale and opacity pulse
- **Duration**: 8 and 10 seconds (offset for variety)

## Files Modified
- `src/components/HeroBackground.tsx` (NEW)
- `src/pages/auth/SignUp.tsx` (UPDATED)
- `src/pages/auth/SignIn.tsx` (UPDATED)

## Backward Compatibility
- All existing functionality preserved
- Auth pages maintain same form structure and validation
- No breaking changes to imports or exports
- HeroSection.tsx unchanged

## Testing Checklist
- [ ] SignUp page displays with hero background animations
- [ ] SignIn page displays with hero background animations
- [ ] Animations loop infinitely
- [ ] Form elements remain interactive (no pointer-events issues)
- [ ] Responsive on mobile (animations continue to work)
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Visual consistency with landing page

## Rollback Instructions
If needed to revert:
```bash
# Revert auth pages
git checkout src/pages/auth/SignUp.tsx src/pages/auth/SignIn.tsx

# Delete new component
rm src/components/HeroBackground.tsx

# Add back TeaLeafAnimation imports to auth pages
```
