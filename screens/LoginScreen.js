import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from '../firebase/firebaseConfig';  
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const logoImage = require('../assets/VisitGO.png');

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const token = await user.getIdToken();
            await AsyncStorage.setItem('userToken', token);

            navigation.replace('Home');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <View style={styles.container}>
        
            <Image 
                source={logoImage}
                style={styles.logo} 
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#B0B0B0"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#B0B0B0"
            />

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF',  
    },
    logo: {
        width: 300,  
        height: 150,  
        marginBottom: 40,
        alignSelf: 'center',  
    },
    input: {
        height: 50,
        borderColor: '#000',  
        borderWidth: 1.5,
        borderRadius: 25, 
        marginBottom: 16,
        paddingLeft: 16,
        fontSize: 18,
        color: '#000',  
        fontFamily: 'Arial', 
    },
    error: {
        color: '#FF6347',  
        marginBottom: 12,
        textAlign: 'center',
        fontFamily: 'Arial',
    },
    button: {
        backgroundColor: '#000',  
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFF',  
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Georgia',  
    },
});

export default LoginScreen;
