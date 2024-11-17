import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';

const LugaresParaConhecer = () => {
    const [location, setLocation] = useState(null);
    const [places, setPlaces] = useState([]);
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
            const fetchPlaces = async () => {
                try {
                    const { latitude, longitude } = location;

                    
                    const categories = '19014,10032,16000';
                    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=5000&categories=${categories}&sort=rating&limit=10`;
                    const placeResponse = await fetch(url, {
                        method: 'GET',
                        headers: {
                            Authorization: API_KEY,
                        },
                    });

                    const data = await placeResponse.json();

                
                    const placesWithPhotos = [];
                    for (const place of data.results) {
                        const photo = await fetchPlacePhoto(place.fsq_id, API_KEY);
                        if (photo) {
                            placesWithPhotos.push({
                                ...place,
                                photo,
                            });
                        }
                        if (placesWithPhotos.length === 5) break; 
                    }

                    setPlaces(placesWithPhotos);
                } catch (error) {
                    console.error('Erro ao obter os lugares:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPlaces();
        }
    }, [location]);

    const fetchPlacePhoto = async (fsq_id, API_KEY) => {
        try {
            const url = `https://api.foursquare.com/v3/places/${fsq_id}/photos`;
            const photoResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: API_KEY,
                },
            });

            const photos = await photoResponse.json();
            if (photos.length > 0) {
                return photos[0].prefix + 'original' + photos[0].suffix;
            }
            return null;
        } catch (error) {
            console.error(`Erro ao buscar foto para o lugar ${fsq_id}:`, error);
            return null;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lugares para conhecer</Text>
            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                {places.map((place) => (
                    <View key={place.fsq_id} style={styles.card}>
                        <Image
                            source={{ uri: place.photo }}
                            style={styles.image}
                        />
                        <Text style={styles.name}>{place.name}</Text>
                        <Text style={styles.address}>{place.location?.address || 'Sem endereço disponível'}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollView: {
        flexDirection: 'row',
    },
    card: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        marginRight: 16,
        width: 150,
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    address: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LugaresParaConhecer;
