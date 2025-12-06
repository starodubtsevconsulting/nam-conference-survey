# Equal Experts Favicon Implementation

The NAM Conference Survey application currently references a non-existent `/vite.svg` favicon in `index.html`, resulting in 404 errors in the browser console. This task replaces the default Vite favicon with the official Equal Experts brand favicon to maintain brand consistency and eliminate console errors.

## Requirements

- Replace the default Vite favicon reference in `apps/frontend/index.html`
- Use the official Equal Experts favicon from the brand assets
- Support multiple favicon formats and sizes for cross-browser and device compatibility
- Include standard favicon sizes: 16x16, 32x32, and Apple touch icon (180x180)
- Ensure favicon appears correctly in browser tabs, bookmarks, and mobile home screens
- Eliminate the 404 error currently appearing in browser console
- Maintain proper favicon asset organization in frontend public directory

## Rules

- rules/code-quality-rules.md
- rules/typescript-rules.md

## Component Architecture

This is a static asset implementation, not a React component. The structure involves:

```
apps/frontend/
├── public/
│   ├── favicon.ico          # Standard ICO format (16x16, 32x32 multi-size)
│   ├── favicon.svg          # SVG format (scalable, modern browsers)
│   ├── apple-touch-icon.png # Apple touch icon (180x180)
│   └── favicon-32x32.png    # PNG fallback (32x32)
└── index.html               # Updated with proper favicon links
```

HTML `<head>` structure:
```html
<!-- SVG favicon for modern browsers (scalable, sharp at any size) -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<!-- PNG fallback for browsers without SVG support -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

<!-- Apple touch icon for iOS home screen -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<!-- Traditional ICO for older browsers -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

## Extra Considerations

- **Equal Experts Brand Assets**:
  - Official logo URL: `https://www.equalexperts.com/wp-content/uploads/2024/10/2024-Logo.svg`
  - Primary brand color (EE Blue): `#1795d4`
  - Check Equal Experts website for existing favicon implementation to match brand standards

- **Favicon Formats**:
  - **SVG**: Preferred for modern browsers, scalable, sharp at any DPI
  - **ICO**: Required for IE11 and older browsers, can contain multiple sizes
  - **PNG**: Fallback and Apple touch icon format
  - Serve multiple formats for maximum compatibility

- **Favicon Sizes**:
  - 16x16: Standard browser tab size
  - 32x32: Retina displays and Windows taskbar
  - 180x180: Apple touch icon (iOS home screen)
  - ICO should contain both 16x16 and 32x32 for efficiency

- **Asset Generation**:
  - If only SVG logo is available, may need to generate raster formats
  - Ensure favicon is visually recognizable at small sizes (simplify if needed)
  - Equal Experts "EE" wordmark may be too detailed at 16x16 - consider using just the icon portion
  - Maintain brand colors and visual identity at all sizes

- **Browser Caching**:
  - Favicons are aggressively cached by browsers
  - Users may need hard refresh (Cmd+Shift+R / Ctrl+Shift+R) to see updated favicon
  - Consider versioning strategy for future favicon updates

- **Vite Public Directory**:
  - Files in `apps/frontend/public/` are served at root path in production
  - `/favicon.svg` in HTML resolves to `apps/frontend/public/favicon.svg`
  - Vite copies public directory contents to dist root during build

## Testing Considerations

- **Manual Testing**:
  - Verify favicon appears in browser tab (Chrome, Firefox, Safari, Edge)
  - Verify no 404 errors in browser console
  - Test on Retina/HiDPI displays for sharpness
  - Test "Add to Home Screen" on iOS to verify Apple touch icon
  - Clear browser cache and verify favicon loads correctly
  - Test in both light and dark browser themes (if favicon has transparency)

- **Visual Verification**:
  - Favicon should be recognizable as Equal Experts brand at 16x16 size
  - Icon should maintain brand colors and not appear distorted
  - Transparency (if present) should render correctly
  - Icon should be visible on both light and dark browser tab backgrounds

- **Build Verification**:
  - Run production build and verify favicon files are copied to dist directory
  - Verify all favicon paths resolve correctly in production build
  - Check that `index.html` references are correct after build

## Implementation Notes

- **Public Directory**: Create `apps/frontend/public/` directory if it doesn't exist
- **Asset Source**: Download favicon assets from Equal Experts brand guidelines or official website
- **Favicon Extraction**: If Equal Experts doesn't provide ready-made favicons, extract from logo SVG
- **Fallback Order**: Browsers will use first supported format (SVG → PNG → ICO)
- **No Build Step Required**: Static assets in public directory are served as-is
- **HTML Update**: Update only the `<link rel="icon">` line in `index.html`, preserve other meta tags

**Recommended Approach**:
1. Check Equal Experts website (`https://www.equalexperts.com`) for existing favicon implementation
2. If available, use their exact favicon assets for brand consistency
3. If not available, create favicon from logo SVG using online tool or image editor
4. Ensure favicon is visually distinct at small sizes (may need simplification)

**Tools for Favicon Generation** (if needed):
- Favicon.io: Convert PNG/SVG to multi-format favicon package
- GIMP/Photoshop: Manual creation and export
- ImageMagick: Command-line conversion for automation
- Real Favicon Generator: Comprehensive favicon package with all sizes

## Specification by Example

### User Journey: Developer Inspects Application

**Scenario**: Developer opens the survey application in Chrome DevTools

**Before Fix**:
1. Developer opens `http://localhost:3000` in Chrome
2. Opens DevTools Console (Cmd+Option+J)
3. Sees error: `GET http://localhost:3000/vite.svg 404 (Not Found)`
4. Browser tab shows generic browser default icon (globe or blank document)

**After Fix**:
1. Developer opens `http://localhost:3000` in Chrome
2. Opens DevTools Console
3. No 404 errors related to favicon
4. Browser tab displays Equal Experts favicon (recognizable brand icon)
5. Favicon is sharp and clear on Retina display

### User Journey: End User Bookmarks Survey

**Scenario**: Conference attendee bookmarks the survey page

1. User navigates to survey application
2. Clicks browser bookmark button (Cmd+D / Ctrl+D)
3. Bookmark is created with Equal Experts favicon displayed
4. User can visually identify survey bookmark in bookmark bar by EE icon
5. On iOS Safari, user selects "Add to Home Screen"
6. Home screen icon displays Equal Experts branding (180x180 Apple touch icon)

### Browser Compatibility Verification

Test across browsers to ensure favicon displays correctly:

- **Chrome 120+**: Uses SVG favicon (scalable, sharp)
- **Firefox 115+**: Uses SVG favicon
- **Safari 17+**: Uses PNG fallback or SVG (depending on version)
- **Edge 120+**: Uses SVG favicon
- **iOS Safari**: Uses apple-touch-icon.png for home screen
- **IE11** (if required): Falls back to favicon.ico

## Verification

- [ ] `apps/frontend/public/` directory exists
- [ ] `favicon.svg` is present in public directory and uses Equal Experts branding
- [ ] `favicon.ico` is present in public directory (multi-size ICO with 16x16 and 32x32)
- [ ] `favicon-32x32.png` is present in public directory
- [ ] `apple-touch-icon.png` is present in public directory (180x180)
- [ ] `apps/frontend/index.html` contains updated favicon links (SVG, PNG, ICO, Apple)
- [ ] Old `/vite.svg` reference is completely removed from index.html
- [ ] No 404 errors appear in browser console when loading application
- [ ] Favicon displays correctly in Chrome browser tab
- [ ] Favicon displays correctly in Firefox browser tab
- [ ] Favicon displays correctly in Safari browser tab
- [ ] Favicon displays correctly in Edge browser tab
- [ ] Favicon is sharp and clear on Retina/HiDPI displays
- [ ] Apple touch icon displays correctly when adding to iOS home screen
- [ ] Favicon matches Equal Experts brand identity (colors, logo)
- [ ] Favicon is visually recognizable at 16x16 size
- [ ] Production build includes all favicon files in dist directory
- [ ] All favicon paths resolve correctly in production build
- [ ] Browser cache cleared and favicon loads correctly on fresh load
- [ ] Favicon appears correctly on both light and dark browser themes
- [ ] Documentation or comment added explaining favicon asset source
