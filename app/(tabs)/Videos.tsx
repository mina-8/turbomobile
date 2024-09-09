
import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, SafeAreaView, ScrollView, StatusBar, Dimensions, ActivityIndicator, } from 'react-native';
import { Button } from 'react-native-paper'
import { ResizeMode, Video, VideoFullscreenUpdate } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { usePreventScreenCapture } from 'expo-screen-capture';

export default function Videos() {
  usePreventScreenCapture()
  const navigate = useNavigation()
  const api = process.env.EXPO_PUBLIC_API_URL;
  const route = useRoute();
  const videos: any = route.params; // Retrieve the `id` parameter
  const [VideoUrl, setVideoUrl] = useState('');
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const video = useRef<any>(null);
  const [status, setStatus] = useState({});
    
  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setVideoUrl(`${api}/storage/${videos.url}`)
    const unsubscribe = navigate.addListener('blur' , ()=>{
      if (video.current) {
        video.current.pauseAsync(); // Pause the video
        video.current.unloadAsync(); // Unload the video
      }
      setVideoUrl(''); // Clear the video URL
      console.log('mina')
    });
    return ()=>{
      unsubscribe()
    }
  }, [VideoUrl])
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: VideoUrl }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onLoad={handleLoad}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
         {(isBuffering || isLoading) && (
          <View style={styles.bufferingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </ThemedView>


    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    // width: '90%',
    height: '100%',
    // margin: 8
  },
  video: {
    width: '90%',
    height: '90%',
    // width: Dimensions.get('window').height, // Swap width and height for rotation
    // height: Dimensions.get('window').width,
  },
  fullscreenVideo: {
    width: Dimensions.get('window').height, // Swap width and height for rotation
    height: Dimensions.get('window').width,
    transform: [{ rotate: '90deg' }],
  },
  bufferingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

