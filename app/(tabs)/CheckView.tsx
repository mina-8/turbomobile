import { Text, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import { getToken } from '@/hooks/saveUserToken';
interface ViewForm {
    videoid: number;
    code: string;
}
export default function CheckView() {
    const navigation : any= useNavigation()
    const api = process.env.EXPO_PUBLIC_API_URL;
    const route = useRoute();
    const video: any = route.params; // Retrieve the `id` parameter
    const { control, handleSubmit, reset , formState: { errors } } = useForm<ViewForm>();
    const [BadCode, setBadCode] = useState(null)
    const [CodeError, setCodeError] = useState(null)
    const onSubmit = async (Values: ViewForm) => {
        const ValuesField = {
            VideoId: video.videoId,
            Code: Values.code,

        }
        try {
            const TokenExist = await getToken();
            const response = await axios.post(`${api}/api/checkcode`, ValuesField, {
                headers: {
                    'Authorization': `Bearer ${TokenExist}`, // Correct header format
                    'Content-Type': 'application/json', // Optional: ensure the content type is set
                }
            });
            if (response.data.success) {
                setBadCode(null)
                setCodeError(null)
                
                // console.log('Success', `Code is valid: ${response.data.message.id}`);
                const responseview = await axios.post(`${api}/api/checkview`, { 'viewId': response.data.view.id }, {
                    headers: {
                        'Authorization': `Bearer ${TokenExist}`, // Correct header format
                        'Content-Type': 'application/json', // Optional: ensure the content type is set
                    }
                });
                
                navigation.navigate('Videos', responseview.data.video)
                // console.log(responseview.data)
                // Clear the input after successful submission
                reset();
            } else {
                setBadCode(response.data.message)
            }
        } catch (error: any) {
            if (error.response.data) {
                setCodeError(error.response.data.message)
            }

        }

    }
    const theme = {
        colors: {
            primary: 'blue',
            error: 'red',
        },
    };
    return (
        <View style={styles.pageContainer}>
            <Text style={styles.titleContainer}>ادخل كود الدرس</Text>
            <Controller
                control={control}
                rules={{ required: 'Code is required', }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="enter code"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.code}
                        theme={theme}

                    />
                )}
                name="code"
            />
            {CodeError && <Text style={styles.errorText} >{CodeError}</Text>}
            {BadCode && <Text style={styles.errorText} >{BadCode}</Text>}
            {errors.code && <Text style={styles.errorText}>{errors.code.message}</Text>}
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                Send
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: '#F5F5F5',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: '#20232a',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        margin: 10,
        fontSize: 30,
        fontWeight: 'bold',
    },
    input: {
        width: 200,
        // height:100,
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#61dafb'
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },

})