import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, ActivityIndicator, StyleSheet, Dimensions, Pressable } from 'react-native'
import PropTypes from 'prop-types'
import * as api from '../services/api'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native'
// import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler'

/*
  TO-DO:
  - If image is too long, allow user to scroll up and down
  - Allow zoom in/out for images
  - Pass the chapter lists to here to navigate to prev/next chapter
*/
const renderPagination = (index, total, context) => {
  return (
    <View style={styles.pagination}>
      <Text style={styles.paginationText}>
        {index + 1}/{total}
      </Text>
    </View>
  )
}

const MangaChapterScreen = ({ route }) => {
  const navigation = useNavigation()
  const chapterId = route.params.chapterId
  const [chapterImgs, setChapterImgs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chapterResponse] = await Promise.all([
          api.getMangaChapter(chapterId)
        ])

        if (chapterResponse.result === 'ok') {
          const chapterImgBuilder = []
          for (const img of chapterResponse.chapter.data) {
            // Implement user's setting to change between /data/ or /data-saver/ in the future.
            chapterImgBuilder.push(`${chapterResponse.baseUrl}/data/${chapterResponse.chapter.hash}/${img}`)
          }
          setChapterImgs(chapterImgBuilder)
        }
      } catch (error) {
        console.error('Error fetching chapter pages:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    // navigation.setOptions({ title:  }) // set the header title to chapter number
  }, [chapterId])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6444" />
      </View>
    )
  }

  // const onSwipeRight = () => {
  //   navigation.goBack()
  // }
  
  // Update chapterImgs here in a function?

  const toggleHeaderVisibility = () => {
    setHeaderVisible(!headerVisible)
    navigation.setOptions({ headerShown: headerVisible })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Swiper
        styles={{ position: 'relative' }}
        loop={false}
        renderPagination={renderPagination}
        bounces={true}
        onIndexChanged={() => {
          if (!headerVisible) {
            toggleHeaderVisibility()
          }
        }}
      >
        {chapterImgs.map((imageUrl, index) => (
          <View style={styles.slide} key={index}>
            <Pressable onPress={() => toggleHeaderVisibility()}>
              <Image style={styles.image} source={{ uri: imageUrl }} />
            </Pressable>
          </View>
        ))}
      </Swiper>
    </SafeAreaView >
  )
}

MangaChapterScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      chapterId: PropTypes.string.isRequired
    })
  })
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width,
    height: '100%',
    resizeMode: 'contain'
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-end'
  },
  paginationText: {
    color: 'white',
    fontSize: 16
  }
})

export default MangaChapterScreen
