import { Image, StyleSheet, Platform, ScrollView, RefreshControl, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Card, Text } from 'react-native-paper';
import { getToken } from '@/hooks/saveUserToken';
import axios from 'axios';

export default function assigments() {
    const api = process.env.EXPO_PUBLIC_API_URL;
    const navigation: any = useNavigation();
    const [Assigments, setAssigments] = useState([])
    const [Refresh, setRefresh] = useState(false)
    const FetchPosts = async () => {
        try {

            const UserToken = await getToken();
            const response = await axios.get(`${api}/api/assigments`, {
                headers: {
                    'Authorization': `Bearer ${UserToken}`,
                    'Content-Type': 'application/json'
                },
            });
            setAssigments(response.data.assigments)
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        }

    }
    useEffect(() => {
        FetchPosts()
    }, [])
    // refresh page
    const onRefreshing = useCallback(async () => {
        setRefresh(true)
        FetchPosts()
        setRefresh(false)
    }, [])
    // get lesson by id
    const GetAssigment =  async(assigmentId: number) => {
            try{
                const UserToken = await getToken();
                const checkassigment = await axios.get(`${api}/api/checkassigment/${assigmentId}`, {
                    headers: {
                        'Authorization': `Bearer ${UserToken}`,
                        'Content-Type': 'application/json'
                    },
                });
                if(checkassigment.data.success){
                    // console.log(checkassigment.data)
                    navigation.navigate('showassigment' , {Id: assigmentId});
                }else{
                    Alert.alert(checkassigment.data.message)
                }
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
                    {Assigments.map((assigment: any) =>
                        <Card style={styles.CardContainer} key={assigment.id} onPress={() => GetAssigment(assigment.id)}>
                            <Card.Content>
                                <Text variant="titleLarge" style={styles.textcolor}>{assigment.name}</Text>
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
