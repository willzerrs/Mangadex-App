import { NavigationContainer as ReactNavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const NavigationContainer = ({ children }) => {
  return (
    <SafeAreaProvider>
      <ReactNavigationContainer>
        {children}
      </ReactNavigationContainer>
    </SafeAreaProvider>
    
  );
};

export default NavigationContainer;
