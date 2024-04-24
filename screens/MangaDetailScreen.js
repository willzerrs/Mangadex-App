import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, Modal, Animated } from 'react-native'
import PropTypes from 'prop-types'
import * as api from '../services/api'
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import { Button } from 'react-native-paper'
// import TextTicker from 'react-native-text-ticker'
// import MangaCover from '../components/MangaCover'
import MangaDetails from '../components/MangaDetails'
import MangaDescription from '../components/MangaDescription'
import ChaptersList from '../components/ChaptersList'

const MangaDetailScreen = ({ route }) => {
  const { mangaId } = route.params || {}
  const [mangaDetails, setMangaDetails] = useState(null)
  const [mangaStats, setMangaStats] = useState(null)
  const [chapterList, setChapterList] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   if (mangaId) {
  //     api.getMangaStats(mangaId)
  //       .then(response => {
  //         console.log('manga id:', mangaId)
  //         console.log('Manga Stats:', response.statistics[mangaId].rating)
  //       })
  //       .catch(error => {
  //         console.error('Test Error:', error)
  //       })
  //   }
  // })

  // const toggleCoverModal = () => {
  //   setCoverModal(!isCoverModalVisible)
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsResponse, feedResponse, statsResponse] = await Promise.all([
          api.getMangaById(mangaId),
          api.getMangaFeed(mangaId),
          api.getMangaStats([mangaId])
        ])

        if (detailsResponse.status === 200 && feedResponse.status === 200) {
          setMangaDetails(detailsResponse.data.data)
          setChapterList(feedResponse.data.data)
          setMangaStats(statsResponse.statistics)
        } else {
          console.error('One or more responses are missing data:', detailsResponse, feedResponse)
        }
      } catch (error) {
        console.error('Error fetching manga details/feed/stats:', error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [mangaId])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6444" />
      </View>
    )
  }

  /*
    TO-DO:
    - Implement ImageBackground for cover art
    - Title should be toggelable if it's too long to expand

    variables:
    - mangaId
    - mangaDetails
    - chapterList
    - mangaStats
  */
  return (
    <ScrollView>
      <View style={styles.container}>
        <MangaDetails mangaDetails={mangaDetails} mangaStats={mangaStats} mangaId={mangaId} chapterList={chapterList} />
        <MangaDescription description={mangaDetails.attributes.description.en} />
        <ChaptersList chapterList={chapterList} />
      </View>
    </ScrollView>
  )
}

MangaDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object
  })
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'/'contain'
    justifyContent: 'center'
  },
  contentContainer: {
    padding: 16
  },
  mangaDetailsContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 182,
    marginBottom: 15
    // position: 'absolute'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    padding: 5
  }
})

export default MangaDetailScreen
