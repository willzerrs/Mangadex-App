import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import MangaDetailScreen from '../screens/MangaDetailScreen'
import BottomTabNavigator from './BottomTabNavigator'

const Stack = createStackNavigator()

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Back"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={MangaDetailScreen}
        // options={({ route }) => ({ title: route.params.mangaId })}
      />
    </Stack.Navigator>
  )
}

export default StackNavigator
