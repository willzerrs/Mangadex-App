import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PropTypes from 'prop-types'

const ChaptersList = ({ chapterList }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chapters List</Text>
      {chapterList.map((item) => (
        // FIX: make entire row pressable.
        <View style={styles.chapterItem} key={item.id}>
          <Pressable
            onPress={() => {
              navigation.navigate('ChapterPages', { chapterId: item.id })
            }}>
            <View>
              <Text>{item.attributes.chapter}</Text>
              <Text style={styles.chapterDate}>{item.attributes.publishAt}</Text>
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  )
}

ChaptersList.propTypes = {
  chapterList: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20
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
  chapterDate: {
    fontSize: 12,
    color: '#666666'
  }
})

export default ChaptersList
