# Huntify Fixes — Task Tracker

## Issue 1: Sticky Navbar
- [x] Verify Navbar has `sticky top-0 z-50 w-full` + solid/backdrop-blur bg (already correct)

## Issue 2: Remove Duplicate Footer
- [x] Verify Footer rendered once globally in `layout.tsx` (already correct)

## Issue 4: Fix Page Routing (City Hubs → /cities, AI Features → /ai-features)
- [x] `components/Navbar.tsx`: remove `sectionId` + home-page smooth-scroll override
- [x] `app/cities/page.tsx`: inline header AI Features → `/ai-features`
- [x] `app/leadfinder/page.tsx`: inline header City Hubs → `/cities`, AI Features → `/ai-features`

## Issue 3: Purge Red/Maroon Colors → Dark Teal & Emerald
- [ ] `components/Navbar.tsx` (none needed)
- [x] `app/cities/page.tsx`
- [x] `app/leadfinder/page.tsx`
- [ ] `app/signin/page.tsx`
- [ ] `app/signup/page.tsx`
- [ ] `app/dashboard/page.tsx`
- [ ] `app/dashboard/user/page.tsx`
- [ ] `app/dashboard/admin/page.tsx`
- [ ] `components/GuardModal.tsx`
- [ ] `app/page.tsx` (maroon-tinted FAQ text)

## Build Verification
- [ ] Run `npm run build` in frontend
