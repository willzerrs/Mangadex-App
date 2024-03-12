import { NavigationContainer as ReactNavigationContainer } from '@react-navigation/native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import PropTypes from 'prop-types'

const NavigationContainer = ({ children }) => {
  return (
    <SafeAreaProvider>
      <ReactNavigationContainer>
        {children}
      </ReactNavigationContainer>
    </SafeAreaProvider>

  )
}

NavigationContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default NavigationContainer
