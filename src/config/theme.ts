export interface ThemeColors {
  // Background colors
  background: string;
  cardBackground: string;
  surface: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Brand colors (these stay consistent)
  primary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  
  // UI colors
  border: string;
  divider: string;
  shadow: string;
  overlay: string;
  overlayCard: string;
  
  // Interactive elements
  buttonBackground: string;
  buttonText: string;
  inputBackground: string;
  inputBorder: string;
  
  // Status colors
  active: string;
  inactive: string;
  disabled: string;
}

export const lightTheme: ThemeColors = {
  // Background colors
  background: '#FDFCF9',
  cardBackground: '#fff',
  surface: '#f8f9fa',
  
  // Text colors
  text: '#222',
  textSecondary: '#666',
  textTertiary: '#888',
  
  // Brand colors
  primary: '#1CB0F6',
  accent: '#FFA800',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  
  // UI colors
  border: '#e0e0e0',
  divider: '#f0f0f0',
  shadow: '#000',
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayCard: 'rgba(255, 255, 255, 0.9)',
  
  // Interactive elements
  buttonBackground: '#1CB0F6',
  buttonText: '#fff',
  inputBackground: '#fff',
  inputBorder: '#e0e0e0',
  
  // Status colors
  active: '#1CB0F6',
  inactive: '#B0B0B0',
  disabled: '#E5E5E5',
};

export const darkTheme: ThemeColors = {
  // Background colors
  background: '#1a1a1a',
  cardBackground: '#2a2a2a',
  surface: '#2a2a2a',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#cccccc',
  textTertiary: '#888888',
  
  // Brand colors (same as light)
  primary: '#1CB0F6',
  accent: '#FFA800',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  
  // UI colors
  border: '#404040',
  divider: '#333333',
  shadow: '#000',
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayCard: 'rgba(42, 42, 42, 0.9)',
  
  // Interactive elements
  buttonBackground: '#1CB0F6',
  buttonText: '#fff',
  inputBackground: '#2a2a2a',
  inputBorder: '#404040',
  
  // Status colors
  active: '#1CB0F6',
  inactive: '#555555',
  disabled: '#333333',
};

export const getTheme = (isDarkMode: boolean): ThemeColors => {
  return isDarkMode ? darkTheme : lightTheme;
}; 