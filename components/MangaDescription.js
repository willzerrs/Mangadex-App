import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import PropTypes from 'prop-types'
import commonStyles from '../styles/CommonStyles'
// TO-DO:
// https://stackoverflow.com/questions/61809670/how-to-animate-expanding-collapsing-a-text-preview-in-react-native-with-animat
const MangaDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false)
  const [animation] = useState(new Animated.Value(0))

  const toggleDescription = () => {
    const initialValue = expanded ? 1 : 0
    const finalValue = expanded ? 0 : 1

    setExpanded(!expanded)

    animation.setValue(initialValue)
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 200]
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.descriptionContainer, { height: animatedHeight }]}>
        <Text style={[commonStyles.text, styles.descriptionText]}>{description}</Text>
      </Animated.View>
      <TouchableOpacity onPress={toggleDescription}>
        <Text style={[styles.toggleButton, commonStyles.mdOrange]}>{expanded ? 'Show less' : 'Show more'}</Text>
      </TouchableOpacity>
    </View>
  )
}

MangaDescription.propTypes = {
  description: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20
  },
  toggleButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16
  },
  descriptionContainer: {
    overflow: 'hidden'
  },
  descriptionText: {
    fontSize: 14
  }
})

export default MangaDescription
