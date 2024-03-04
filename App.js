import { StyleSheet, Text, View } from 'react-native';
import NavigationContainer from './navigation/NavigationContainer';
import StackNavigator from './navigation/StackNavigator';
import { LogBox } from 'react-native';

// I have no idea why its warning me if I swipe right to go back
// There are no good fixes and only workarounds afaik
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.'])

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
