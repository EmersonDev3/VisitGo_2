// screens/LoadingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = ({ navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    };
    checkAuth();
  }, []);

  return (
    <View>
      <Text>Carregando...</Text>
    </View>
  );
};

export default LoadingScreen;
