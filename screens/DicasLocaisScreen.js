import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Animated, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

const API_KEY = 'fsq3xXo7ixWrN0ANMJiIYsSecFLzz7mEmkG+kRmkEMBj+Xk=';

const DicasLocaisScreen = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  const navigation = useNavigation();

  // Obter a localização do usuário
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

  // Buscar locais da API Foursquare
  useEffect(() => {
    if (location) {
      const fetchPlaces = async () => {
        try {
          const { latitude, longitude } = location;
          const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=5000&categories=13000&sort=rating&limit=10`;

          const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: API_KEY },
          });

          if (!response.ok) {
            throw new Error('Erro ao buscar locais na API.');
          }

          const data = await response.json();
          const formattedPlaces = data.results.map((place) => ({
            id: place.fsq_id,
            name: place.name,
            address: place.location.address || 'Endereço não disponível',
            latitude: place.geocodes.main.latitude,
            longitude: place.geocodes.main.longitude,
            image: place.categories[0]?.icon
              ? `${place.categories[0].icon.prefix}bg_64${place.categories[0].icon.suffix}`
              : 'https://via.placeholder.com/130',
          }));

          setPlaces(formattedPlaces);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar locais:', error);
          setErrorMsg('Não foi possível carregar os locais.');
          setLoading(false);
        }
      };

      fetchPlaces();
    }
  }, [location]);

  const toggleDetails = () => {
    setExpanded(!expanded);
    Animated.timing(animationValue, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={20} color="#000" />
      </TouchableOpacity>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {places.map((place) => (
          <Marker key={place.id} coordinate={{ latitude: place.latitude, longitude: place.longitude }}>
            <Callout onPress={() => setSelectedPlace(place)}>
              <View style={styles.callout}>
                <Image source={{ uri: place.image }} style={styles.calloutImage} />
                <Text style={styles.calloutTitle}>{place.name}</Text>
                <Text style={styles.calloutAddress}>{place.address}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.listContainer}>
        <FlatList
          data={places}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedPlace(item)}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardAddress}>{item.address}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {selectedPlace && (
        <Animated.View
          style={[
            styles.detailsContainer,
            {
              height: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '60%'],
              }),
            },
          ]}
        >
          <TouchableOpacity onPress={toggleDetails} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>{selectedPlace.name}</Text>
          <Text style={styles.detailsAddress}>{selectedPlace.address}</Text>
          <Image source={{ uri: selectedPlace.image }} style={styles.detailsImage} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Fundo com um tom claro de azul acinzentado
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: '50%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cardImage: {
    width: 110,
    height: 110,
    borderRadius: 15,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50', // Azul escuro elegante
  },
  cardAddress: {
    fontSize: 14,
    color: '#7f8c8d', // Cinza suave
    marginTop: 5,
  },
  callout: {
    alignItems: 'center',
    width: 160,
  },
  calloutImage: {
    width: 140,
    height: 140,
    borderRadius: 15,
    marginBottom: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#34495e', // Azul mais escuro
  },
  calloutAddress: {
    fontSize: 13,
    textAlign: 'center',
    color: '#95a5a6', // Cinza claro
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50', // Azul escuro elegante
  },
  detailsAddress: {
    fontSize: 16,
    color: '#7f8c8d', // Cinza suave
    marginTop: 5,
  },
  detailsImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginTop: 15,
  },
});


export default DicasLocaisScreen;
