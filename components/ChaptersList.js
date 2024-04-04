import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PropTypes from 'prop-types'

const ChaptersList = ({ chapterList }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chapters List</Text>
      {chapterList.map((item) => (
        // Implement these to be touchables -> get manga pages
        <View style={styles.chapterItem} key={item.id}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChapterPage', { chapterId: item.id })
            }}>
            <Text>{item.attributes.chapter}</Text>
            <Text style={styles.chapterDate}>{item.attributes.publishAt}</Text>
          </TouchableOpacity>
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
