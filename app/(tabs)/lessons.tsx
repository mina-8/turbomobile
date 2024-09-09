import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { Card , Text} from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { getToken } from '@/hooks/saveUserToken';
import axios from 'axios';
interface Lesson {
    id: number;
    name: string;
  }
export default function lessons() {
    const route = useRoute();
    const { lessons }: { lessons: Lesson[] } = route.params as { lessons: Lesson[] }; // Type casting for route.params
    const api = process.env.EXPO_PUBLIC_API_URL;
    const navigation: any = useNavigation();
    const GetVideo = async (LessonId: number) => {
        try{
            const TokenExist = await getToken();
            const response = await axios.get(`${api}/api/lessons/video/${LessonId}`, {
                headers: {
                    'Authorization': `Bearer ${TokenExist}`, // Correct header format
                    'Content-Type': 'application/json', // Optional: ensure the content type is set
                },
            });
            navigation.navigate('ShowLesson', response.data.videos)
            
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
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Mr David</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
                {lessons.map((lesson: any) =>
                    <Card style={styles.CardContainer} key={lesson.id} onPress={() => GetVideo(lesson.id)}>
                        <Card.Content>
                            <Text variant="titleLarge" style={styles.textcolor}>{lesson.name}</Text>
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