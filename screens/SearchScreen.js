// SearchScreen.js
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import * as api from '../services/api'
// import { commonStyles } from './styles';
// import MangaDetailScreen from './MangaDetailScreen';

/*
  TO-DO:
  - Implement filter for genres/maturity rating
  - Implement feature to search by author/artist
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

  // // Call this function when a button in the flatlist is pressed
  // const fetchMangaDetails = async (mangaId) => {
  //   try {
  //     const mangaDetails = await api.getMangaById(mangaId);
  //     // console.log('Manga Details:', mangaDetails);
  //     // setMangaDetailsArray((prevArray) => [...prevArray, mangaDetails]);
  //   } catch (error) {
  //     console.error('Error fetching manga details:', error.message);
  //   }
  // };

  const navigation = useNavigation()

  return (
    // Make the flatlist items as a button and lead it to details screen
    // Align the title text to top and make it bigger
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 4 }}>
          <TextInput
            placeholder="Enter manga title"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            returnKeyType='search'
            onSubmitEditing={handleSearch}
            style={{ marginLeft: 5, marginBottom: 5, padding: 10, borderWidth: 1, borderRadius: 5 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Search" onPress={handleSearch} />
        </View>
      </View>

      <View style={{ flex: 1, marginTop: 20, borderTopWidth: 1, borderColor: '#ccc' }}>
        {searchResults.length > 0
          ? (<FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  // console.log('Item pressed:', item.id);
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
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                      {item.attributes.title.en}
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail">
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
    borderColor: '#ccc',
    padding: 10
  },
  itemDetails: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default SearchScreen
