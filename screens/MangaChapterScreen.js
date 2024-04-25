import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, ActivityIndicator, StyleSheet, Dimensions, Pressable, Animated } from 'react-native'
import PropTypes from 'prop-types'
import * as api from '../services/api'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native'

/*
  TO-DO:
  - If image is too long, allow user to scroll up and down
  - Allow zoom in/out for images
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
  const chapterIndex = route.params.chapterIndex
  const chapterId = route.params.chapterId
  const chapterList = route.params.chapterList
  const [chapterImgs, setChapterImgs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [endReachedAnim] = useState(new Animated.Value(0))
  const [pageLoadingMap, setPageLoadingMap] = useState({})

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

  useEffect(() => {
    fetchData()
    navigation.setOptions({ title: chapterList[chapterIndex].attributes.chapter })
  }, [chapterId])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6444" />
      </View>
    )
  }

  const toggleHeaderVisibility = () => {
    setHeaderVisible(!headerVisible)
    navigation.setOptions({ headerShown: headerVisible })
  }

  const isPastEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.width + contentOffset.x > contentSize.width || contentOffset.x < 0
  }

  const endTextAnim = () => {
    Animated.timing(endReachedAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setTimeout(() => {
        Animated.timing(endReachedAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start()
      }, 2000)
    })
  }

  const togglePageLoading = (index) => {
    setPageLoadingMap(prevLoadingMap => ({
      ...prevLoadingMap,
      [index]: !prevLoadingMap[index]
    }))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Swiper
        styles={{ position: 'relative' }}
        loop={false}
        renderPagination={renderPagination}
        bounces={true}
        onScroll={({ nativeEvent }) => {
          if (isPastEnd(nativeEvent)) {
            // TO-DO:
            // - When navigating to prev, set page index to last
            // Navigate using reverse index b/c chapter list is in reverse order
            if (nativeEvent.contentOffset.x + nativeEvent.layoutMeasurement.width > nativeEvent.contentSize.width) {
              if (chapterIndex - 1 >= 0 && chapterIndex - 1 <= chapterList.length - 1) {
                navigation.replace('ChapterPages', { chapterIndex: chapterIndex - 1, chapterId: chapterList[chapterIndex - 1].id, chapterList, source: 'ChapterPages' })
              } else {
                endTextAnim()
              }
            } else if (nativeEvent.contentOffset.x < 0) {
              if (chapterIndex + 1 <= chapterList.length - 1) {
                navigation.replace('ChapterPages', { chapterIndex: chapterIndex + 1, chapterId: chapterList[chapterIndex + 1].id, chapterList, source: 'ChapterPages' })
              }
            }
          }
        }}
        scrollEventThrottle={2000}
        onIndexChanged={() => {
          if (!headerVisible) {
            toggleHeaderVisibility()
          }
        }}
      >
        {chapterImgs.map((imageUrl, index) => (
          <View style={styles.slide} key={index}>
            <Pressable onPress={() => toggleHeaderVisibility()}>
              <Image
                style={styles.image}
                source={{ uri: imageUrl }}
                onLoadStart={() => togglePageLoading(index)}
                onLoadEnd={() => togglePageLoading(index)}
              />
              {pageLoadingMap[index] && (
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                  <ActivityIndicator size="large" color="#ff6444" />
                </View>
              )}
            </Pressable>
          </View>
        ))}
      </Swiper>
      <Animated.View pointerEvents="none" style={[styles.endAnimBox, { opacity: endReachedAnim }]}>
        <Text style={{ color: 'white', textAlign: 'center' }}>End Reached</Text>
      </Animated.View>
    </SafeAreaView >
  )
}

MangaChapterScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      chapterIndex: PropTypes.number.isRequired,
      chapterId: PropTypes.string.isRequired,
      chapterList: PropTypes.array.isRequired
    })
  })
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  slide: {
    flex: 1,
    position: 'relative',
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
  },
  endAnimBox: {
    position: 'absolute',
    top: '50%',
    left: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    width: 120
  }
})

export default MangaChapterScreen
