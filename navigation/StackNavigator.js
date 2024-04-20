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
        // options={{
        //   headerShown: false,
        //   headerTransparent: true,
        //   headerTintColor: 'white',
        //   headerStyle: {
        //     backgroundColor: '#222222',
        //     shadowOpacity: 0
        //   }
        // }}
        options={(props) => {
          // eslint-disable-next-line react/prop-types
          if (props.route.params.source === 'ChapterPages') {
            return {
              animationEnabled: false,
              headerShown: false,
              headerTransparent: true,
              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: '#222222',
                shadowOpacity: 0
              }
            }
          } else {
            return {
              headerShown: false,
              headerTransparent: true,
              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: '#222222',
                shadowOpacity: 0
              }
            }
          }
        }}
      />
    </Stack.Navigator>
  )
}

export default StackNavigator
