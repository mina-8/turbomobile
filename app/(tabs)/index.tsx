import { Image, StyleSheet, Platform , ScrollView, RefreshControl} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Card , Text} from 'react-native-paper';
import { getToken } from '@/hooks/saveUserToken';
import axios from 'axios';


export default function HomeScreen() {
  const api = process.env.EXPO_PUBLIC_API_URL;
  const navigation: any = useNavigation();
  const [Classrooms, setClassrooms] = useState([])
  const [Refresh , setRefresh] = useState(false)
  const FetchClassroom = async ()=>{
    try{

      const UserToken = await getToken();
      const response = await axios.get(`${api}/api/classroom` ,{
        headers:{
          'Authorization':`Bearer ${UserToken}`,
          'Content-Type' : 'application/json'
        },
      });
      setClassrooms(response.data.classrooms)
      console.log(response.data)
    }catch(error){
      console.error("Error fetching classrooms:", error);
    }
    
  }
  useEffect(()=>{
    FetchClassroom()
  },[])
  // refresh page
  const onRefreshing = useCallback(async()=>{
    setRefresh(true)
    FetchClassroom()
    setRefresh(false)
  } , [])
  // get lesson by id
  const GetLesson = async (classroomid : number)=>{
    try{
      const TokenExist = await getToken();
      const response = await axios.get(`${api}/api/lessons/${classroomid}` , {
        headers: {
          'Authorization': `Bearer ${TokenExist}`, // Correct header format
          'Content-Type': 'application/json', // Optional: ensure the content type is set
        },
      });
      navigation.navigate('lessons' , { lessons: response.data.lessons });
    }catch(error){
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
        <ScrollView
        contentContainerStyle={styles.titleContainer}
        refreshControl={
          <RefreshControl refreshing={Refresh} onRefresh={onRefreshing} />
        }
        >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Mr David</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        {Classrooms.map((classroom: any) =>
          <Card style={styles.CardContainer} key={classroom.id} onPress={()=>GetLesson(classroom.id)}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.textcolor}>{classroom.name}</Text>
            </Card.Content>
          </Card>
        )}

      </ThemedView>
      </ScrollView>
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
