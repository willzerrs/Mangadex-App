// SearchScreen.js
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import * as api from '../services/api'
import commonStyles from '../styles/CommonStyles'
// import MangaDetailScreen from './MangaDetailScreen';

/*
  TO-DO:
  - Integrate this screen with the Home screen with MangaDex Home features.
    - Carousel for featured mangas
      - https://www.npmjs.com/package/react-native-snap-carousel
  - Animate stack transitions
    - https://reactnavigation.org/docs/shared-element-transitions
*/
const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    try {
      const response = await api.searchMangas(searchQuery)

      if (response && response.status === 200) {
        const mangaData = response.data.data || []
        setSearchResults(mangaData)
      } else {
        console.error('Search response is missing results property:', response)
      }
    } catch (error) {
      console.error('Error searching manga:', error.message)
    }
  }

  const navigation = useNavigation()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ flex: 4 }}>
            <TextInput
              placeholder="Enter manga title"
              placeholderTextColor={'#636363'}
              selectionColor={'#ff6444'}
              keyboardAppearance={'dark'}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              returnKeyType='search'
              onSubmitEditing={handleSearch}
              style={[commonStyles.text, { backgroundColor: '#222222', marginLeft: 5, marginBottom: 5, padding: 10, borderWidth: 1, borderRadius: 5 }]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Search" color={'#ff6444'} onPress={handleSearch} />
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 20, borderColor: '#ccc' }}>
          {searchResults.length > 0
            ? (<FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Details', {
                      mangaId: item.id
                    })
                  }}
                  style={styles.buttonItem}
                >
                  <View style={styles.listItem}>
                    <Image
                      source={{
                        uri: `https://uploads.mangadex.org/covers/${item.id}/${item.relationships.find(rel => rel.type === 'cover_art').attributes.fileName}`
                      }}
                      style={styles.thumbnail}
                    />
                    <View style={styles.itemDetails}>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={[commonStyles.text, styles.title]}>
                        {item.attributes.title.en}
                      </Text>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={[commonStyles.text]}>
                        {item.relationships.filter((relationship) => relationship.type === 'author').map((author) => author.attributes.name).join(', ')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

              )}
            />)
            : (<Text style={{ marginTop: 10, textAlign: 'center' }}>Find manga by searching</Text>
              )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  thumbnail: {
    width: 43,
    height: 61,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#3b3b3b',
    padding: 10
  },
  itemDetails: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonItem: {
  }
})

export default SearchScreen
