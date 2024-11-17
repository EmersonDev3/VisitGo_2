import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [places, setPlaces] = useState([]); // Lista de lugares
  const [allPlaces, setAllPlaces] = useState([]); // Lista de todos os lugares
  const [placePhotos, setPlacePhotos] = useState({}); // Fotos de cada lugar

  useEffect(() => {
    const API_KEY = 'fsq3xXo7ixWrN0ANMJiIYsSecFLzz7mEmkG+kRmkEMBj+Xk=';
    const latitude = '40.748817'; // Latitude de exemplo (Nova York)
    const longitude = '-73.985428'; // Longitude de exemplo (Nova York)

    const fetchPlaces = async () => {
      try {
        // Busca inicial de lugares (limite 3 lugares)
        const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=2000&categories=13000&limit=4`;
        const placeResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': API_KEY,
          },
        });
        const placeData = await placeResponse.json();
        const placesWithPhotos = placeData.results;
        
        // Salva os 3 primeiros lugares
        setPlaces(placesWithPhotos);

        // Busca todos os lugares para mostrar no "Ver tudo"
        const allPlacesUrl = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=2000&categories=13000&limit=20`;
        const allPlaceResponse = await fetch(allPlacesUrl, {
          method: 'GET',
          headers: {
            'Authorization': API_KEY,
          },
        });
        const allPlaceData = await allPlaceResponse.json();
        setAllPlaces(allPlaceData.results); // Salva todos os lugares

        // Busca fotos para os lugares
        const photos = {};
        for (const place of placesWithPhotos) {
          const photoUrl = `https://api.foursquare.com/v3/places/${place.fsq_id}/photos?limit=1`;
          const photoResponse = await fetch(photoUrl, {
            method: 'GET',
            headers: {
              'Authorization': API_KEY,
            },
          });
          const photoData = await photoResponse.json();
          if (photoData && photoData.length > 0) {
            const photo = photoData[0];
            photos[place.fsq_id] = `${photo.prefix}600x600${photo.suffix}`; // Salva a foto do lugar
          } else {
            photos[place.fsq_id] = 'https://via.placeholder.com/600x400?text=Imagem+indisponível';
          }
        }
        setPlacePhotos(photos); // Atualiza as fotos
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
      }
    };

    fetchPlaces();
  }, []);

  const handleViewAll = () => {
    // Ao clicar em "Ver tudo", mostramos todos os lugares
    setPlaces(allPlaces);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbarTop}>
        <TouchableOpacity onPress={() => alert('VisitGo clicado!')}>
          <Text style={styles.navbarTextLeft}>VisitGo</Text>
        </TouchableOpacity>
        <Ionicons name="heart" size={30} color="red" style={styles.iconRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Primeira foto isolada no topo */}
        {places.length > 0 && placePhotos[places[0].fsq_id] && (
          <View style={styles.placeCard}>
            <Image source={{ uri: placePhotos[places[0].fsq_id] }} style={styles.placeImage} />
            <View style={styles.overlayTextContainer}>
              <Text style={styles.placeName}>{places[0].name}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Descubra agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Seção "Restaurantes próximos" */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Restaurantes próximos</Text>
          <TouchableOpacity onPress={handleViewAll}>
            <Text style={styles.viewAllText}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        {/* Fotos adicionais abaixo (sem nome e botão) */}
        <View style={styles.imageContainer}>
          {places.slice(1).map((place) => (
            <View key={place.fsq_id} style={styles.placeCard}>
              {placePhotos[place.fsq_id] && (
                <Image source={{ uri: placePhotos[place.fsq_id] }} style={styles.placeImage} />
              )}
            </View>
          ))}
        </View>

        {[...Array(10)].map((_, index) => (
          <Text key={index} style={styles.contentText}>
            Conteúdo rolável número {index + 1}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.navbarBottom}>
        <TouchableOpacity style={styles.navbarItem}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.navbarItemText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarItem}>
          <Ionicons name="map" size={24} color="white" />
          <Text style={styles.navbarItemText}>Meus Spots</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarItem}>
          <Ionicons name="bulb" size={24} color="white" />
          <Text style={styles.navbarItemText}>Suas Dicas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarItem}>
          <Ionicons name="locate" size={24} color="white" />
          <Text style={styles.navbarItemText}>Dicas Locais</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Reduzimos a margem inferior para aproximar o conteúdo abaixo
    marginTop: 4, // Ajuste para mover para cima
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#666', // Cor cinza
  },
  viewAllText: {
    color: '#666',
    fontSize: 15,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
