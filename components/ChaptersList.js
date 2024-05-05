import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PropTypes from 'prop-types'
import commonStyles from '../styles/CommonStyles'

/*
  TO-DO:
    - Implement read/unread feature
      - Most likely after user login is implemented to fetch user read progress
    - Separate chapters by volume if applicable

  FIX:
    - Make entire chapter row pressable
    - Not fetching all chapters
*/

const ChaptersList = ({ chapterList }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      {Object.keys(chapterList).map((volumeKey) => {
        const volume = chapterList[volumeKey]
        return (
          <View style={{}} key={volume.volume}>
            <Text style={[commonStyles.text, styles.volumeTitle]}>Volume {volume.volume}</Text>
            <View>
              {Object.keys(volume.chapters).map((chapterKey) => {
                const chapter = volume.chapters[chapterKey]
                return (
                  <View style={styles.chapterItem} key={chapter.id}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('ChapterPages', { volumeIndex: volume.volume, chapterIndex: chapter.chapter, chapterId: chapter.id, chapterList, source: 'ChapterList' })
                      }}>
                      <Text style={[commonStyles.text, styles.chapterTitle]}>Chapter {chapter.chapter}</Text>
                    </Pressable>
                  </View>
                )
              })}
            </View>
          </View>
        )
      })}
    </View >
  )
}

ChaptersList.propTypes = {
  chapterList: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderRadius: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC'
  },
  volumeTitle: {
    fontSize: 18
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  chapterDate: {
    fontSize: 12,
    color: '#666666'
  }
})

export default ChaptersList
