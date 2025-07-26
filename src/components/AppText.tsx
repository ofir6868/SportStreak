import React from 'react';
import { Text, TextProps, Platform } from 'react-native';
import { useFonts } from 'expo-font';

const fontMap = {
  Nunito: require('../../assets/fonts/Nunito-Bold.ttf'),
  'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
  'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
};

const AppText: React.FC<TextProps> = ({ style, ...props }) => {
  const [fontsLoaded] = useFonts(fontMap);
  
  // Get the font family from the style prop
  const getFontFamily = () => {
    if (style && typeof style === 'object' && 'fontFamily' in style) {
      return style.fontFamily;
    }
    // Default font family
    return fontsLoaded ? 'Nunito-Regular' : Platform.OS === 'ios' ? 'System' : undefined;
  };

  return (
    <Text 
      {...props} 
      style={[
        { fontFamily: getFontFamily() }, 
        style
      ]} 
    />
  );
};

export default AppText; 