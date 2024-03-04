import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import * as fromAPI from '../services/api'
// import { TouchableOpacity } from 'react-native-gesture-handler';

// TO-DO: Implement SecureStore for tokens

const TestingScreen = () => {
    const [authStatus, setAuthStatus] = React.useState('Not authenticated')
    const [text1, setText1] = React.useState('Initial Text 1');
    const [text2, setText2] = React.useState('Initial Text 2');

    const handleAuthButtonPress = async () => {
      try {
        const { access_token, refresh_token } = await fromAPI.authUser();
        // setText1(String(access_token))
        // setText2(String(refresh_token))
        setAuthStatus("authenticated")
      } catch (error) {
        console.error('Error fetching tokens:', error.message)
      }
    };

    const handleGetAuthButtonPress = async () => {
      try {
        const accessToken = await fromAPI.getToken('accessToken')
        const refreshToken = await fromAPI.getToken('refreshToken')
        setText1(String(accessToken))
        setText2(String(refreshToken))
      } catch (error) {
        console.error('Error fetching tokens:', error.message)
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Press button to authenticate user.</Text>
        {}
        <Text>{authStatus}</Text>
        <Text>{text1}</Text>
        <Text>{text2}</Text>
        {}
        <TouchableOpacity onPress={handleAuthButtonPress}>
          <View style={{ padding: 10, backgroundColor: 'blue', marginTop: 10 }}>
            <Text style={{ color: 'white' }}>Press me to change authenticate</Text>
          </View>
        </TouchableOpacity>
        {}
        <TouchableOpacity onPress={handleGetAuthButtonPress}>
          <View style={{ padding: 10, backgroundColor: 'blue', marginTop: 10 }}>
            <Text style={{ color: 'white' }}>Press me to get tokens</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 10,
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
    paragraph: {
      marginTop: 34,
      margin: 24,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    textInput: {
      height: 35,
      borderColor: 'gray',
      borderWidth: 0.5,
      padding: 4,
    },
  });
  
export default TestingScreen;