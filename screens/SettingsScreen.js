import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'

// Check if user is logged in. Allow users to log in if not.
// Allow users to select language. (if all selected languages aren't available, chapter list wiil be empty)
// Allow user to toggle data-saver mode

const SettingsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Settings Screen</Text>
      </View>
    </SafeAreaView>

  )
}

export default SettingsScreen
