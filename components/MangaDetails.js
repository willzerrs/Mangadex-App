import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PropTypes from 'prop-types'
import MangaCover from './MangaCover'

const MangaDetails = ({ mangaId, mangaDetails, mangaStats, chapterList }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View>
        <MangaCover mangaId={mangaId} mangaDetails={mangaDetails} />
      </View>

      <View style={styles.detailsContainer}>
        {/* Change title, author, and genres to horizontally scrollables */}
        <Text style={styles.title} numberOfLines={2}>{mangaDetails.attributes.title.en}</Text>
        <Text style={styles.author} numberOfLines={1}>{mangaDetails.relationships.filter(rel => rel.type === 'author').map(author => author.attributes.name).join(', ')}</Text>
        <Text style={styles.genres} numberOfLines={1}>{mangaDetails.attributes.tags.filter(tag => tag.attributes.group === 'genre').map(tag => tag.attributes.name.en).join(', ')}</Text>
        <Text style={styles.rating}>Rating: {mangaStats[mangaId]?.rating?.average ?? 'n/a'}</Text>
        <Text style={styles.status}>Status: {mangaDetails.attributes.status}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Read" onPress={() => {
            if (chapterList.length > 0) {
              navigation.navigate('ChapterPages', { chapterIndex: chapterList.length - 1, chapterId: chapterList[chapterList.length - 1].id, chapterList, source: 'ChapterList' })
            }
          }} />
        </View>
      </View>
    </View>
  )
}

MangaDetails.propTypes = {
  mangaId: PropTypes.string.isRequired,
  mangaDetails: PropTypes.object.isRequired,
  mangaStats: PropTypes.object.isRequired,
  chapterList: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  author: {
    fontSize: 16,
    marginBottom: 4
  },
  genres: {
    fontSize: 14,
    marginBottom: 4,
    fontStyle: 'italic'
  },
  rating: {
    fontSize: 14,
    marginBottom: 4
  },
  status: {
    fontSize: 14,
    marginBottom: 4
  },
  buttonContainer: {
    marginTop: 8
  }
})

export default MangaDetails
