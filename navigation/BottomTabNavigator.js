import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LibraryScreen from '../screens/LibraryScreen'
import HistoryScreen from '../screens/HistoryScreen'
import SettingsScreen from '../screens/SettingsScreen'
import SearchScreen from '../screens/SearchScreen'
// import TestingScreen from '../screens/TestingScreen';

const Tab = createBottomTabNavigator()

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { position: 'fixed' }
      }}
    >
      {/* <Tab.Screen name="Testing" component={TestingScreen} /> */}
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default BottomTabNavigator
