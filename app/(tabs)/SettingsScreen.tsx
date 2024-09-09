import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import { deleteToken, getToken } from '@/hooks/saveUserToken';


export default function SettingsScreen() {
  const navigation: any = useNavigation();
  const api = process.env.EXPO_PUBLIC_API_URL;
  const [Loading, setLoading] = useState(false);
  const settingsOptions = [
    { id: '1', title: 'Profile' },
    { id: '2', title: 'Notifications' },
    { id: '3', title: 'Privacy' },
    { id: '4', title: 'Logout', action: 'logout' },
  ];
  const Logout = async () => {
    setLoading(true)
    try {
      const TokenExist = await getToken();
      const Logout = await axios.post(`${api}/api/logout`, { 'token': TokenExist }, {
        headers: {
          'Authorization': `Bearer ${TokenExist}`, // Correct header format
          'Content-Type': 'application/json', // Optional: ensure the content type is set
        },
      });
      if (Logout.data.success === true) {
        await deleteToken()
        navigation.replace('index')
      }
    } catch (error: any) {
      // Handle the error here
      console.error('Error during login check:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false)
    }

  }
  const handlePress = (item: any) => {
    if (item.action === 'logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: Logout,
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    } else {
      // Handle other settings options
      navigation.navigate(item.title); // Example: navigate to corresponding screen
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.option} onPress={() => handlePress(item)}>
      <Text style={styles.optionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    (Loading) ?
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={'#0000ff'} />
      </View>
      :
      <View style={styles.container}>
        <FlatList
          data={settingsOptions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
},
});


