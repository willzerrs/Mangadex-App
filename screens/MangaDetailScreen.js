import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';


const MangaDetailScreen = ({ route }) => {
  const { mangaId } = route.params || {};

  return (
    <View>
      <Text>Manga Detail Screen</Text>
      <Text>Manga ID: {mangaId}</Text>
    </View>
  );
};

export default MangaDetailScreen;
