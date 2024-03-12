import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, Modal } from 'react-native'
import PropTypes from 'prop-types'
import * as api from '../services/api'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'
import TextTicker from 'react-native-text-ticker'

const MangaDetailScreen = ({ route }) => {
  const { mangaId } = route.params || {}
  const [mangaDetails, setMangaDetails] = useState(null)
  const [chapterList, setChapterList] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCoverModalVisible, setCoverModal] = useState(false)

  const toggleCoverModal = () => {
    setCoverModal(!isCoverModalVisible)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsResponse, feedResponse] = await Promise.all([
          api.getMangaById(mangaId),
          api.getMangaFeed(mangaId)
        ])

        if (detailsResponse.status === 200 && feedResponse.status === 200) {
          setMangaDetails(detailsResponse.data.data)
          setChapterList(feedResponse.data.data)
        } else {
          console.error('One or more responses are missing data:', detailsResponse, feedResponse)
        }
      } catch (error) {
        console.error('Error fetching manga details or feed:', error.message)
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
    - Make the cover art and title touchables
      - Cover art should be able to enlargeable and zoomed in -> use modal to pop it out
        - https://reactnative.dev/docs/modal
    - Title should be toggelable if it's too long to expand

    variables:
    - mangaId
    - mangaDetails
    - chapterList
  */
  return (
    <ScrollView>
      <View style={{ padding: 5 }}>

        {/* Manga Details View */}
        <View style={[styles.mangaDetailsContainer, { backgroundColor: 'cyan' }] }>
          {/* Manga Cover */}
          <TouchableOpacity onPress={toggleCoverModal}>
            <Image
              source={{
                uri: `https://uploads.mangadex.org/covers/${mangaId}/${mangaDetails.relationships.find(rel => rel.type === 'cover_art').attributes.fileName}`
              }}
              style={{ width: 128, height: 182, borderRadius: 5, marginRight: 8 }} />
          </TouchableOpacity>
          {/* Pop out the cover */}
          <Modal visible={isCoverModalVisible} transparent={true}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={toggleCoverModal}>
                <Image
                  source={{
                    uri: `https://uploads.mangadex.org/covers/${mangaId}/${mangaDetails.relationships.find(rel => rel.type === 'cover_art').attributes.fileName}`
                  }}
                  style={{ width: 353, height: 502 }}
                />
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Manga details and stats */}
          <View style={{ flex: 1 }}>
            {/* Manga title and author view */}
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'blue' }}>
              <TextTicker scrollSpeed={10} repeatSpacer={20} marqueeDelay={5000} numberOfLines={1} style={{ fontSize: 20, fontWeight: 'bold', flexShrink: 1 }}>
                {mangaDetails.attributes.title.en}
              </TextTicker>
              <TextTicker scrollSpeed={10} repeatSpacer={20} marqueeDelay={5000} numberOfLines={1}>
                {mangaDetails.relationships.filter((relationship) => relationship.type === 'author').map((author) => author.attributes.name).join(', ')}
              </TextTicker>
            </View>
            {/* Manga statistics */}
            <View style={{ flex: 1, backgroundColor: 'green' }}>
              <TextTicker scrollSpeed={10} repeatSpacer={20} marqueeDelay={5000} numberOfLines={1}>
                Manga statistics goes here
              </TextTicker>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow' }}>
              <Button mode='contained' style={{ marginRight: 10 }}>Favorite</Button>
              <Button mode='contained' style={{ marginLeft: 10 }}>Read</Button>
            </View>
          </View>

        </View>

        {/* Chapter List View */}
        {/* <View>
          <Text>Chapter Response: {chapterList.response}</Text>
        </View> */}
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
    resizeMode: 'cover', // or 'stretch' or 'contain'
    justifyContent: 'center'
  },
  contentContainer: {
    padding: 16
  },
  mangaDetailsContainer: {
    flexDirection: 'row',
    height: 182
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
  }
})

export default MangaDetailScreen
