import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

const ListaSugestoesComAPI = () => {
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão negada!', 'Não foi possível acessar a localização.');
                    setLoading(false);
                    return;
                }

                const userLocation = await Location.getCurrentPositionAsync({});
                setLocation(userLocation.coords);
            } catch (error) {
                console.error('Erro ao obter a localização:', error);
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    useEffect(() => {
        if (location) {
            const API_KEY = 'fsq3xXo7ixWrN0ANMJiIYsSecFLzz7mEmkG+kRmkEMBj+Xk=';
            const fetchEvents = async () => {
                try {
                    const { latitude, longitude } = location;

                    // Categorias de eventos ajustadas: Música ao Vivo, Arte e Entretenimento, Teatros, Eventos
                    const categories = '13000,15000,16000,18000';  // Música ao vivo, Arte, Teatros, Locais de eventos
                    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=5000&categories=${categories}&sort=rating&limit=10`;
                    const eventResponse = await fetch(url, {
                        method: 'GET',
                        headers: {
                            Authorization: API_KEY,
                        },
                    });

                    const data = await eventResponse.json();

                    // Obtenha a data atual e a data de amanhã
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);

                    // Filtre os eventos que vão ocorrer hoje ou amanhã
                    const eventData = data.results.filter(event => {
                        const eventDate = new Date(event.date); // Ajuste isso conforme a estrutura de data que vem da API
                        return (eventDate >= today && eventDate <= tomorrow);
                    }).map(event => ({
                        name: event.name,
                        address: event.location?.address || 'Sem endereço disponível',
                    }));

                    setEvents(eventData);
                } catch (error) {
                    console.error('Erro ao obter os eventos:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchEvents();
        }
    }, [location]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Eventos e Shows</Text>
            <ScrollView style={styles.scrollView}>
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <TouchableOpacity key={index} style={styles.card}>
                            <Text style={styles.name}>{event.name}</Text>
                            <Text style={styles.address}>{event.address}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noEvents}>Nenhum evento encontrado.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        elevation: 5,  // Sombra para dar profundidade no Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    address: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    noEvents: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        marginTop: 10,
        color: '#007BFF',
    },
});

export default ListaSugestoesComAPI;
