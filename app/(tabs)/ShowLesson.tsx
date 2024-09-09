import { View, Image, StyleSheet, Alert } from 'react-native'
import React, { useEffect } from 'react'
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { Card, Text } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { getToken } from '@/hooks/saveUserToken';
import axios from 'axios';

export default function ShowLesson() {
  const route = useRoute();
  const videos: any = route.params; // Ensure route.params is correctly typed
  const api = process.env.EXPO_PUBLIC_API_URL;
  const navigation: any = useNavigation();

  const GetVideo = async (id: number) => {
    try {
      const TokenExist = await getToken();
      const response = await axios.get(`${api}/api/showlesson/${id}`, {
        headers: {
          'Authorization': `Bearer ${TokenExist}`, // Correct header format
          'Content-Type': 'application/json', // Optional: ensure the content type is set
        },
      });
      if(response.data.success){
        // console.log(response.status , 'show lesson')
        if(response.status === 200){
          navigation.navigate('Videos', response.data.video)
          console.log(response.data.video)
        }        
      }else{
        navigation.navigate('CheckView' , {videoId:response.data.view})
        console.log(response.data.view, 'show from views')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Mr David</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        {videos.map((video: any) =>
          <Card style={styles.CardContainer} key={video.pivot.lessonable_id} onPress={() => GetVideo(video.pivot.lessonable_id)}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.textcolor}>{video.name}</Text>
            </Card.Content>
          </Card>
        )}

      </ThemedView>

    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: '100%'
  },
  CardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 8,
    backgroundColor: "#6482AD",
  },
  textcolor: {
    color: '#F8EDED',

  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});