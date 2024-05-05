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
  const volumeIndex = route.params.volumeIndex
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
    navigation.setOptions({ title: chapterIndex })
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

  function findPreviousChapter (currentVolume, currentChapter) {
    const volumeKeys = Object.keys(chapterList)
    const chapterKeys = Object.keys(chapterList[currentVolume].chapters)

    const currentChapterIndex = chapterKeys.indexOf(currentChapter)
    if (currentChapterIndex > 0) {
      const previousChapterNumber = chapterKeys[currentChapterIndex - 1]
      return {
        volume: currentVolume,
        number: previousChapterNumber,
        id: chapterList[currentVolume].chapters[previousChapterNumber].id
      }
    } else {
      const currentVolumeIndex = volumeKeys.indexOf(currentVolume)
      if (currentVolumeIndex > 0) {
        const previousVolume = volumeKeys[currentVolumeIndex - 1]
        const previousVolumeChapters = Object.keys(
          chapterList[previousVolume].chapters
        )
        const previousChapterNumber =
          previousVolumeChapters[previousVolumeChapters.length - 1]
        return {
          volume: previousVolume,
          number: previousChapterNumber,
          id: chapterList[previousVolume].chapters[previousChapterNumber].id
        }
      }
    }
    return null
  }

  function findNextChapter (currentVolume, currentChapter) {
    const volumeKeys = Object.keys(chapterList)
    const chapterKeys = Object.keys(chapterList[currentVolume].chapters)

    const currentChapterIndex = chapterKeys.indexOf(currentChapter)
    if (currentChapterIndex < chapterKeys.length - 1) {
      const nextChapterNumber = chapterKeys[currentChapterIndex + 1]
      return {
        volume: currentVolume,
        number: nextChapterNumber,
        id: chapterList[currentVolume].chapters[nextChapterNumber].id
      }
    } else {
      const currentVolumeIndex = volumeKeys.indexOf(currentVolume)
      if (currentVolumeIndex < volumeKeys.length - 1) {
        const nextVolume = volumeKeys[currentVolumeIndex + 1]
        const nextVolumeChapters = Object.keys(chapterList[nextVolume].chapters)
        const nextChapterNumber = nextVolumeChapters[0]
        return {
          volume: nextVolume,
          number: nextChapterNumber,
          id: chapterList[nextVolume].chapters[nextChapterNumber].id
        }
      }
    }
    return null
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
            if (nativeEvent.contentOffset.x + nativeEvent.layoutMeasurement.width > nativeEvent.contentSize.width) {
              const nextChap = findNextChapter(volumeIndex, chapterIndex)
              if (nextChap) {
                navigation.replace('ChapterPages', { volumeIndex: nextChap.volume, chapterIndex: nextChap.number, chapterId: nextChap.id, chapterList, source: 'ChapterPages' })
              } else {
                endTextAnim()
              }
            } else if (nativeEvent.contentOffset.x < 0) {
              const prevChap = findPreviousChapter(volumeIndex, chapterIndex)
              if (prevChap) {
                navigation.replace('ChapterPages', { volumeIndex: prevChap.volume, chapterIndex: prevChap.number, chapterId: prevChap.id, chapterList, source: 'ChapterPages' })
              } else {
                console.log('no prev chapter')
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
      volumeIndex: PropTypes.string.isRequired,
      chapterIndex: PropTypes.string.isRequired,
      chapterId: PropTypes.string.isRequired,
      chapterList: PropTypes.object.isRequired
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
