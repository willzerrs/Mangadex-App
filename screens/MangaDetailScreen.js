import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as api from '../services/api';

const MangaDetailScreen = ({ route }) => {
  const { mangaId } = route.params || {};
  const [mangaDetails, setMangaDetails] = useState(null);
  const [chapterList, setChapterList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsResponse, feedResponse] = await Promise.all([
          api.getMangaById(mangaId),
          api.getMangaFeed(mangaId),
        ]);

        if (detailsResponse.status === 200 && feedResponse.status === 200) {
          setMangaDetails(detailsResponse.data.data);
          setChapterList(feedResponse.data.data);
        } else {
          console.error('One or more responses are missing data:', detailsResponse, feedResponse);
        }
      } catch (error) {
        console.error('Error fetching manga details or feed:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mangaId]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff6444" />
      </View>
    );
  }

  return (
    <View>
      <Text>Manga Detail Screen</Text>
      <Text>Manga ID: {mangaId}</Text>
      {mangaDetails && <Text>Response id: {mangaDetails.attributes.title.en}</Text>}
      {chapterList && <Text>Feed Response: {chapterList.response}</Text>}
    </View>
  );
};

export default MangaDetailScreen;
