import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import MangaDetailScreen from '../screens/MangaDetailScreen'
import BottomTabNavigator from './BottomTabNavigator'
import MangaChapterScreen from '../screens/MangaChapterScreen'

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
      />
      <Stack.Screen
        name="ChapterPages"
        component={MangaChapterScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#222222',
            shadowOpacity: 0
          }
        }}
      />
    </Stack.Navigator>
  )
}

export default StackNavigator
