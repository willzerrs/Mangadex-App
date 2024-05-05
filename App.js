import React, { StyleSheet, LogBox, StatusBar } from 'react-native'
import NavigationContainer from './navigation/NavigationContainer'
import StackNavigator from './navigation/StackNavigator'

// I have no idea why its warning me if I navigate around stacks
// and there are no good fixes; only workarounds afaik
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.'])

// TO-DO:
// - Themes: https://reactnavigation.org/docs/themes
export default function App () {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <StackNavigator />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
