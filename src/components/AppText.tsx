import React from 'react';
import { Text, TextProps } from 'react-native';

const AppText: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text {...props} style={[{ fontFamily: 'Nunito-Regular' }, style]} />;
};

export default AppText; 