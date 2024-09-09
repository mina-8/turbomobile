import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, ScrollView, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { getToken } from '@/hooks/saveUserToken';
import axios from 'axios';
import { Button, Card, RadioButton, Text, TextInput } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';

interface Assigment {
    id: number;
    quistion: string;
    a: string;
    b: string;
    c: string;
    d: string;
    asnwer: string;
}

interface Answer {
    [key: string]: string;
}

export default function ShowAssigment() {
    const navigation: any = useNavigation();
    const api = process.env.EXPO_PUBLIC_API_URL;
    const route = useRoute();
    const assigmentid: any = route.params; // Retrieve the `id` parameter
    const [Assigment, setAssigment] = useState<any | []>([]);
    const [AssigmentId , setAssigmentId] = useState();
    const [Loading, setLoading] = useState(false)

    const GetAssigment = async (postid: number) => {
        setAssigment('')
        setLoading(true)
        try {
            const TokenExist = await getToken();
            const response = await axios.get(`${api}/api/assigment/${postid}`, {
                headers: {
                    'Authorization': `Bearer ${TokenExist}`, // Correct header format
                    'Content-Type': 'application/json', // Optional: ensure the content type is set
                },

            });

            setAssigmentId(response.data.assigmentId);
            setAssigment(response.data.assigment);
            

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        GetAssigment(assigmentid.Id)
    }, [assigmentid]);
    const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const { control, handleSubmit, formState: { errors }, reset } = useForm<Answer>();
    const onSubmit = async (Values: Answer) => {
        const FormData = Assigment.map((assigment: any, index: number) =>
        ({
            [`answer_${index}`]: Values[`answer_${index}`],
            [`rightanswer_${index}`]: assigment.answer
        })
        )
        reset()
        const Valuesfield = {
            'assigmentId' : AssigmentId,
            'assigmentAnswer' : FormData
        }
        try{

            const UserToken = await getToken();
            const assigmentresult = await axios.post(`${api}/api/resultassigment` , Valuesfield ,{
                headers: {
                    'Authorization': `Bearer ${UserToken}`,
                    'Content-Type': 'application/json'
                },
            })
            console.log(assigmentresult.data)
            if(assigmentresult.data.success){
                navigation.replace('(tabs)');
            }
        }catch(error){
            console.log(error)
        }

    }
    return (
        (Loading) ?
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={'#0000ff'} />
            </View>
            :
            <SafeAreaView style={styles.container} >
                <ScrollView style={styles.scrollView}>

                    <ThemedView style={styles.titleContainer}>
                        {Assigment.map((assigment: any, index: number) => {
                            // Shuffle the answer options for each assignment
                            const shuffledOptions = shuffleArray([
                                { label: assigment.a, value: assigment.a },
                                { label: assigment.b, value: assigment.b },
                                { label: assigment.c, value: assigment.c },
                                { label: assigment.d, value: assigment.d }
                            ]);

                            return (
                                <View style={styles.ViewAssgiment} key={`assignment_${index}`}>
                                    <Text key={`question_${index}`} variant="titleLarge" style={styles.textcolor}>
                                        {assigment.quistion}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name={`answer_${index}`} // Unique name for each question
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                {shuffledOptions.map((option, optIndex) => (
                                                    <RadioButton.Item
                                                        key={`answer_${index}_${optIndex}`} // Unique key for each option
                                                        label={option.label}
                                                        value={option.value}
                                                        status={value === option.value ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            onChange(option.value);
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    />
                                </View>
                            );
                        })}

                        <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={Loading}>
                            submit
                        </Button>

                    </ThemedView>
                </ScrollView>
            </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginTop: 40,

    },
    scrollView: {
        // backgroundColor: 'pink',
        // marginHorizontal: 20,
    },
    titleContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: '100%'
    },
    ViewAssgiment: {
        width: '100%'
    },
    textcolor: {
        color: '#F8EDED',
        backgroundColor: '#6482AD',
        padding: 10,

    },
    textanswer: {
        color: '#F8EDED',
        backgroundColor: '#6482AD',
        padding: 10,
        margin: 5
    },
    CardContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        marginBottom: 8,
        backgroundColor: "#6482AD",
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    asnwerinput: {
        // display:'none'
    }
});
