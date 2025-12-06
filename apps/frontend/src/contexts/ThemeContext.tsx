import React, { useEffect, useRef } from 'react';
import { MantineProvider, MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { theme } from '../theme/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Inner component that has access to Mantine's color scheme
const ThemeSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { setColorScheme } = useMantineColorScheme();
  const isInitialized = useRef(false);

  // Initialize color scheme on mount only
  useEffect(() => {
    if (!isInitialized.current) {
      const storedScheme = localStorage.getItem('nam-survey-color-scheme');
      const initialScheme = (storedScheme === 'light' || storedScheme === 'dark')
        ? storedScheme
        : systemColorScheme;

      setColorScheme(initialScheme);
      isInitialized.current = true;
    }
  }, [setColorScheme, systemColorScheme]);

  return <>{children}</>;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MantineProvider theme={theme}>
      <ThemeSync>{children}</ThemeSync>
    </MantineProvider>
  );
};

// Helper function to announce changes to screen readers
function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
