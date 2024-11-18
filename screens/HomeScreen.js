import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; 
import LugaresParaConhecer from '../components/HorizontalScroll';
import ListaSugestoesComAPI from '../components/ListaSugestoesComAPI';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [places, setPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [placePhotos, setPlacePhotos] = useState({});
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permissão para acessar a localização negada!');
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);
      } catch (error) {
        console.error('Erro ao obter a localização:', error);
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
          
          const placeUrl = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=5000&categories=13000&sort=rating&limit=4`;
          const allPlacesUrl = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=5000&categories=13000&sort=rating&limit=20`;

          const [placeResponse, allPlaceResponse] = await Promise.all([
            fetch(placeUrl, { method: 'GET', headers: { 'Authorization': API_KEY } }),
            fetch(allPlacesUrl, { method: 'GET', headers: { 'Authorization': API_KEY } })
          ]);

          const placeData = await placeResponse.json();
          const allPlaceData = await allPlaceResponse.json();
          
          const placesWithPhotos = placeData.results;
          const photos = {};

          const fetchPhotos = placesWithPhotos.map(async (place) => {
            const photoUrl = `https://api.foursquare.com/v3/places/${place.fsq_id}/photos?limit=1`;
            const photoResponse = await fetch(photoUrl, {
              method: 'GET',
              headers: { 'Authorization': API_KEY }
            });
            const photoData = await photoResponse.json();
            if (photoData && photoData.length > 0) {
              const photo = photoData[0];
              photos[place.fsq_id] = `${photo.prefix}600x600${photo.suffix}`;
            }
          });

          await Promise.all(fetchPhotos); // Wait for all photo requests

          setPlaces(placesWithPhotos.filter((place) => photos[place.fsq_id]));
          setPlacePhotos(photos);
          setAllPlaces(allPlaceData.results);
          
        } catch (error) {
          console.error('Erro ao fazer a requisição:', error);
        }
      };

      fetchPlaces();
    }
  }, [location]);

  const handleViewAll = () => {
    setPlaces(allPlaces);
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbarTop}>
        <TouchableOpacity onPress={() => alert('VisitGo clicado!')}>
          <Text style={styles.navbarTextLeft}>VisitGo</Text>
        </TouchableOpacity>
        <Ionicons name="heart" size={30} color="red" style={styles.iconRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {places.length > 0 && placePhotos[places[0].fsq_id] && (
          <View style={styles.placeCard}>
            <Image source={{ uri: placePhotos[places[0].fsq_id] }} style={styles.placeImage} />
            <View style={styles.overlayTextContainer}>
              <Text style={styles.placeName1}>{places[0].name}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Descubra agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Restaurantes</Text>
          <TouchableOpacity onPress={handleViewAll}>
            <Text style={styles.viewAllText}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {places.slice(1).map((place) => (
            <View key={place.fsq_id} style={styles.placeCard}>
              {placePhotos[place.fsq_id] && (
                <Image source={{ uri: placePhotos[place.fsq_id] }} style={styles.placeImage} />
              )}

              <Text style={styles.placeName}>{place.name}</Text>

              {place.location && place.location.address ? (
                <View style={styles.locationContainer}>
                  <Ionicons name="location-sharp" size={16} color="gray" />
                  <Text style={styles.locationText}>{place.location.address}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
        
        <LugaresParaConhecer />
        <ListaSugestoesComAPI />
      </ScrollView>

      <BottomNavbar navigation={navigation} />
    </SafeAreaView>
  );
};

const BottomNavbar = ({ navigation }) => {
  return (
    <View style={styles.navbarBottom}>
      <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color="white" />
        <Text style={styles.navbarItemText}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('MeusSpots')}>
        <Ionicons name="map" size={24} color="white" />
        <Text style={styles.navbarItemText}>Meus Spots</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('SuasDicas')}>
        <Ionicons name="bulb" size={24} color="white" />
        <Text style={styles.navbarItemText}>Suas Dicas</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navbarItem} 
        onPress={() => navigation.replace('DicasLocais')}
      >
        <Ionicons name="locate" size={24} color="white" />
        <Text style={styles.navbarItemText}>Dicas Locais</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbarTop: {
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navbarBottom: {
    height: 65,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  navbarItem: {
    alignItems: 'center',
  },
  navbarItemText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  navbarTextLeft: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  iconRight: {
    marginRight: 7,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  placeImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  placeCard: {
    position: 'relative',
    marginBottom: 20,
  },
  overlayTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 14,
    color: 'black', // Nome do restaurante em preto
    fontWeight: 'bold',
    marginTop: 8, // Adiciona um espaço entre a imagem e o nome
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    color: 'gray', // Localização em cinza
    marginLeft: 5, // Espaço entre o ícone e o texto
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '',
  },
  viewAllText: {
    fontSize: 16,
    color: '#007bff',
  },
  imageContainer: {
    marginBottom: 20,
  },

  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#FF6347', // Cor do botão
    borderRadius: 25, // Bordas arredondadas
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Para centralizar o texto
  },
  placeName1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },

  horizontalScroll: {
    marginVertical: 20,
  },
  placeCardHorizontal: {
    width: 260,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  placeImageHorizontal: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  placeInfoContainer: {
    padding: 15,
  },
  placeNameHorizontal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#5D5D5D',
    marginLeft: 5,
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: '#FF6F61',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});



export default HomeScreen;
