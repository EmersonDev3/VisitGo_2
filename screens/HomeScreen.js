// screens/HomeScreen.js
import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await auth().signOut();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text>Bem-vindo ao "Descubra Sua Cidade"!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
