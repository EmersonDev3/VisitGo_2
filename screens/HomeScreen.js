import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Função para obter a localização do usuário
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão para acessar a localização foi negada.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    fetchNearbyPlaces(currentLocation.coords.latitude, currentLocation.coords.longitude);
  };

  // Simulação de Pontos Turísticos Próximos
  const fetchNearbyPlaces = (latitude, longitude) => {
    const places = [
      { id: 1, name: 'Museu de Arte', latitude: latitude + 0.01, longitude: longitude + 0.01 },
      { id: 2, name: 'Parque Central', latitude: latitude - 0.01, longitude: longitude - 0.01 },
      { id: 3, name: 'Restaurante Gourmet', latitude: latitude + 0.02, longitude: longitude - 0.01 },
    ];
    setNearbyPlaces(places);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao "Descubra Sua Cidade"!</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
      {location ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Marcador do Usuário */}
            <Marker
              coordinate={location}
              title="Você está aqui"
              pinColor="blue"
            />
            {/* Marcadores de Pontos Turísticos */}
            {nearbyPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.name}
              />
            ))}
          </MapView>

          {/* Lista de Pontos Turísticos */}
          <FlatList
            data={nearbyPlaces}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Text style={styles.place}>{item.name}</Text>}
          />
        </View>
      ) : (
        <Text>{errorMsg || 'Obtendo localização...'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  place: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default HomeScreen;
