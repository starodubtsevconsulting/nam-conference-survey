# Dark Mode Implementation for Survey Application

Implement a comprehensive dark mode feature for the NAM Conference Survey application that reduces eye strain for attendees completing surveys in low-light conditions. The implementation must detect system preferences, provide manual toggle functionality, and persist user choices across sessions without any flash of incorrect theme on page load.

## Requirements

- User can view survey in dark mode automatically when their device has dark mode enabled
- User can manually toggle between light and dark modes using an accessible toggle control
- Theme preference persists across page loads and browser sessions using localStorage
- Page renders in the correct theme immediately without flashing the wrong theme first (no FOUC - Flash of Unstyled Content)
- All text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text) in dark mode
- Focus indicators are clearly visible in dark mode for keyboard navigation
- Theme switching is instant without layout shift or performance degradation
- Theme toggle is keyboard accessible (Space/Enter to activate) and announces state to screen readers
- All UI components (questions, buttons, forms, navigation) work correctly in both light and dark modes
- Dark mode works consistently across Chrome, Safari, Firefox, and Edge browsers

## Rules

- rules/react-rules.md
- rules/typescript-rules.md
- rules/clean-code.md

## Component Architecture

```typescript
// Theme context and provider
interface ThemeContextValue {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}

// Theme provider manages preference detection and persistence
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize from localStorage, fallback to system preference
  // 2. Sync with localStorage on changes
  // 3. Provide context value to children
};

// Theme toggle component
interface ThemeToggleProps {
  // Accessible toggle button with visual indicator
}

const ThemeToggle: React.FC<ThemeToggleProps> = () => {
  // 1. Use theme context
  // 2. Render button with sun/moon icon
  // 3. Include ARIA labels and keyboard support
  // 4. Announce state changes to screen readers
};

// Integration with Mantine
// Use MantineProvider with colorScheme and theme customization
// Define light and dark color palettes with WCAG AA compliant contrast
```

## Extra Considerations

- **Accessibility**: All interactive elements must have sufficient color contrast in both modes (WCAG AA). Focus indicators must be clearly visible against dark backgrounds. Screen readers must announce theme changes (e.g., "Dark mode enabled").
- **Performance**: Theme detection and application must happen before first render to prevent flash of wrong theme. Use inline script in HTML head or SSR-compatible initialization. Theme switching should be instant (<16ms) without causing layout reflow.
- **Responsive Design**: Theme toggle must be accessible on all screen sizes (375px - 1920px). Consider placement that doesn't interfere with survey completion on mobile devices.
- **Browser Compatibility**: Test system preference detection across Safari (prefers-color-scheme), Chrome, Firefox, Edge. Ensure localStorage persistence works correctly in all browsers including private/incognito mode fallback.
- **User Experience**: Provide clear visual feedback during theme toggle. Ensure smooth transitions without jarring color changes. Consider whether toggle should be visible on all pages or just specific locations.
- **Color Palette**: Define comprehensive dark mode color scheme for Equal Experts branding. Dark mode should use dark backgrounds (#1a1a1a or similar) with light text, not just inverted colors. Maintain brand colors (#1795d4, #22567c) with appropriate adjustments for dark backgrounds.
- **Mantine Integration**: Leverage Mantine's built-in ColorSchemeProvider and useMantineColorScheme hook. Define custom theme colors for both light and dark modes. Ensure all Mantine components (Paper, Card, Button, TextInput, etc.) adapt correctly.

## Testing Considerations

### Unit Tests
- Test ThemeProvider initializes with system preference when no localStorage value exists
- Test ThemeProvider initializes with localStorage value when present
- Test toggleColorScheme updates both state and localStorage
- Test ThemeToggle renders correct icon for current theme
- Test ThemeToggle calls toggleColorScheme on click and keyboard interaction

### Integration Tests
- Test complete user flow: load page → verify system preference detected → toggle theme → refresh page → verify preference persisted
- Test theme changes propagate to all components across the application
- Test localStorage failure scenarios (private browsing mode) - should fallback to session state


### Visual Regression Tests
- Screenshot comparison of all pages in light vs dark mode
- Verify no flash of wrong theme on page load
- Test theme toggle animation/transition smoothness

### Cross-Browser Tests
- Verify system preference detection in Chrome, Safari, Firefox, Edge
- Test localStorage persistence across all browsers
- Verify no theme flash on load in all browsers


## Implementation Notes

### Component Patterns
- Use React Context API for theme state management (avoid prop drilling)
- Use custom hooks pattern: create `useTheme()` hook that wraps Mantine's `useMantineColorScheme()`
- Use functional components with hooks exclusively
- Implement theme toggle as a controlled component

### CSS Methodology
- Leverage Mantine's theme object for all colors - avoid hardcoded color values
- Use Mantine's sx prop or styled components for component-specific styling
- Define theme colors in MantineProvider theme configuration
- Use CSS custom properties for any non-Mantine styles to enable dynamic theme switching

### State Management
- Use React Context for theme state (no Redux needed for this feature)
- Persist to localStorage with key `nam-survey-color-scheme`
- Sync with system preference using `window.matchMedia('(prefers-color-scheme: dark)')`
- Handle edge cases: localStorage unavailable (private mode), system preference changes while app is open

### Accessibility Standards
- Follow WCAG 2.1 AA standards for color contrast
- Use semantic HTML for theme toggle (button element)
- Include aria-label on toggle button (e.g., "Toggle dark mode")
- Include aria-pressed attribute to indicate current state
- Announce theme changes using aria-live region or similar technique

### Dark Mode Color Palette
```typescript
// Example theme configuration
const theme = {
  colorScheme: colorScheme, // 'light' | 'dark'
  colors: {
    // Define custom colors for Equal Experts branding
    brand: ['#e3f2fd', '#90caf9', '#42a5f5', '#1795d4', '#1976d2', '#1565c0', '#22567c', '#0d47a1', '#0a3d91', '#082f70'],
  },
  primaryColor: 'brand',
  // Dark mode specific overrides
  ...(colorScheme === 'dark' && {
    colors: {
      dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5C5F66', '#373A40', '#2C2E33', '#25262B', '#1A1B1E', '#141517', '#101113'],
    },
  }),
};
```

## Specification by Example

### User Journey 1: First-Time Visitor with Dark Mode System Preference
1. User has macOS/iOS/Windows set to dark mode
2. User opens survey URL in browser
3. System detects `prefers-color-scheme: dark` media query
4. Page renders immediately in dark mode (no flash of light theme)
5. Survey displays with dark background, light text, and brand colors adjusted for dark mode
6. User completes survey in dark mode
7. Theme preference is saved to localStorage

### User Journey 2: Manual Theme Toggle
1. User is viewing survey in light mode
2. User sees theme toggle button (sun/moon icon) in header/navigation
3. User clicks theme toggle button
4. Page instantly switches to dark mode with smooth transition
5. All components update: background becomes dark, text becomes light
6. User navigates to different survey pages - dark mode persists
7. User closes browser and returns later - dark mode preference is still active

### User Journey 3: Keyboard Navigation
1. User navigates survey using keyboard only
2. User presses Tab until theme toggle button receives focus
3. Focus indicator clearly visible on toggle button (in both light and dark modes)
4. User presses Space or Enter key
5. Theme switches with audible feedback from screen reader: "Dark mode enabled"
6. User continues survey in dark mode with all focus indicators clearly visible

### Visual Design Specifications

**Light Mode:**
- Background: #FFFFFF
- Text: #2c3234 (Charcoal)
- Primary: #1795d4 (EE Blue)
- Borders: #E0E0E0

**Dark Mode:**
- Background: #1A1B1E
- Text: #C1C2C5
- Primary: #42a5f5 (Lighter blue for better contrast on dark)
- Borders: #373A40

**Theme Toggle Button:**
- Position: Top right corner of header
- Size: 40px × 40px touch target (mobile), 32px × 32px (desktop)
- Icon: Sun icon for light mode, Moon icon for dark mode
- Hover state: Subtle background color change
- Active state: Scale slightly (transform: scale(0.95))


### Responsive Breakpoint Behavior
- **Mobile (375px - 767px)**: Theme toggle in header, 40px touch target
- **Tablet (768px - 1023px)**: Theme toggle in header, 36px target
- **Desktop (1024px+)**: Theme toggle in header or navigation, 32px target

## Verification

- [ ] Dark mode automatically activates when user has dark system preference
- [ ] Light mode activates when user has light system preference
- [ ] Manual theme toggle button is visible and accessible on all pages
- [ ] Clicking toggle switches between light and dark mode instantly
- [ ] Theme preference persists after page reload
- [ ] Theme preference persists after browser close/reopen
- [ ] No flash of wrong theme occurs on initial page load
- [ ] All text meets WCAG AA contrast requirements in dark mode (verified with contrast checker)
- [ ] Focus indicators clearly visible on all interactive elements in dark mode
- [ ] Theme toggle is keyboard accessible (Tab to focus, Space/Enter to activate)
- [ ] Screen reader announces theme changes (tested with VoiceOver/NVDA/JAWS)
- [ ] All survey question components render correctly in dark mode
- [ ] All form inputs and buttons work correctly in dark mode
- [ ] Equal Experts branding colors adjusted appropriately for dark mode
- [ ] Theme switching causes no layout shift or performance degradation
- [ ] Dark mode works in Chrome (latest)
- [ ] Dark mode works in Safari (latest)
- [ ] Dark mode works in Firefox (latest)
- [ ] Dark mode works in Edge (latest)
- [ ] Mobile responsive behavior works correctly (375px viewport)
- [ ] Tablet responsive behavior works correctly (768px viewport)
- [ ] Desktop responsive behavior works correctly (1024px+ viewport)
- [ ] localStorage fallback works in private browsing mode
- [ ] System preference change detection works (when user changes OS theme while app is open)
