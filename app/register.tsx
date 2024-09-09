import { View, Text, StyleSheet , ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';
import { saveToken } from '@/hooks/saveUserToken';

interface LoginForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
export default function index() {
    const api = process.env.EXPO_PUBLIC_API_URL;
    const navigation: any = useNavigation();
    const [Loading, setLoading] = useState(false)
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const showPass = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const [NameError, setNameError] = useState(null);
    const [EmailError, setEmailError] = useState(null);
    const [PasswordError, setPasswordError] = useState(null);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const onSubmit = async (Values: LoginForm) => {
        setLoading(true)
        try {
            const response = await axios.post(`${api}/api/register`, Values);

            if (response.data && response.data.token) {
                await saveToken(response.data.token)
                navigation.replace('(tabs)')
            }
        } catch (error: any) {
            if (error.response.data.errors.name) {
                setNameError(error.response.data.errors.name)
            } else {
                setEmailError(null)
            }
            if (error.response.data.errors.email) {
                setEmailError(error.response.data.errors.email)
            } else {
                setEmailError(null)
            }
            if (error.response.data.errors.password) {
                setPasswordError(error.response.data.errors.password)
            } else {
                setPasswordError(null)
            }
        } finally {
            setLoading(false)
        }
    }
    const LoginPage = () => {
        navigation.replace('index');
    }
    const theme = {
        colors: {
            primary: 'blue',
            error: 'red',
        },
    };
    return (
        (Loading) ?
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={'#0000ff'} />
            </View>
            :
            <View style={styles.pageContainer}>
                <Text style={styles.titleContainer}>Register</Text>

                <Controller
                    control={control}
                    rules={{ required: 'name is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.email}
                            theme={theme}
                        />
                    )}
                    name="name"
                />
                {NameError && <Text style={styles.errorText}>{NameError}</Text>}
                <Controller
                    control={control}
                    rules={{
                        required: 'email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Enter a valid email address'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.email}
                            theme={theme}
                        />
                    )}
                    name="email"
                />
                {EmailError && <Text style={styles.errorText}>{EmailError}</Text>}
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                <Controller
                    control={control}
                    rules={{ required: 'Password is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Password"
                            secureTextEntry={secureTextEntry}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.password}
                            right={<TextInput.Icon icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={showPass} />}
                            theme={theme}
                        />
                    )}
                    name="password"
                />
                {PasswordError && <Text style={styles.errorText}>{PasswordError}</Text>}
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                <Controller
                    control={control}
                    rules={{ required: 'Password is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Password"
                            secureTextEntry={secureTextEntry}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.password}
                            right={<TextInput.Icon icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={showPass} />}
                            theme={theme}
                        />
                    )}
                    name="password_confirmation"
                />
                {PasswordError && <Text style={styles.errorText}>{PasswordError}</Text>}
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                    Register
                </Button>
                <Text>Or</Text>
                <Button onPress={LoginPage}>Login</Button>
            </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        color: '#000',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        margin: 10,
    },
    pageContainer: {
        backgroundColor: '#EEE',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 200,
        // height:100,
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});
