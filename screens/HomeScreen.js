import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones

const HomeScreen = () => {
  const [placeData, setPlaceData] = useState(null);
  const [placePhoto, setPlacePhoto] = useState(null);

  useEffect(() => {
    // Substitua pela sua chave da API do Foursquare
    const API_KEY = 'fsq3xXo7ixWrN0ANMJiIYsSecFLzz7mEmkG+kRmkEMBj+Xk=';

    // Exemplo de localização (pode ser dinâmica dependendo da localização do usuário)
    const latitude = '40.748817'; // Latitude de exemplo (Nova York)
    const longitude = '-73.985428'; // Longitude de exemplo (Nova York)

    // Endpoint da Foursquare Places API
    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=2000&categories=13000&limit=10`;

    // Requisição para buscar lugares
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const randomPlace = data.results[Math.floor(Math.random() * data.results.length)];
        setPlaceData(randomPlace);

        const photoUrl = `https://api.foursquare.com/v3/places/${randomPlace.fsq_id}/photos?limit=1`;
        return fetch(photoUrl, {
          method: 'GET',
          headers: {
            'Authorization': API_KEY,
          },
        });
      })
      .then((photoResponse) => photoResponse.json())
      .then((photoData) => {
        if (photoData && photoData.length > 0) {
          const photo = photoData[0];
          const photoUrl = `${photo.prefix}600x600${photo.suffix}`;
          setPlacePhoto(photoUrl);
        } else {
          setPlacePhoto('https://via.placeholder.com/600x400?text=Imagem+indisponível');
        }
      })
      .catch((error) => {
        console.error('Erro ao fazer a requisição:', error);
        setPlacePhoto('https://via.placeholder.com/600x400?text=Imagem+indisponível');
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar Superior */}
      <View style={styles.navbarTop}>
        <TouchableOpacity onPress={() => alert('VisitGo clicado!')}>
          <Text style={styles.navbarTextLeft}>VisitGo</Text>
        </TouchableOpacity>
        <Ionicons name="heart" size={30} color="red" style={styles.iconRight} />
      </View>

      {/* Conteúdo rolável entre as barras */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Foto com nome do lugar */}
        <View style={styles.imageContainer}>
          {placePhoto ? (
            <Image source={{ uri: placePhoto }} style={styles.placeImage} />
          ) : (
            <Text style={styles.contentText}>Carregando imagem do lugar...</Text>
          )}

          {placeData && (
            <View style={styles.overlayTextContainer}>
              <Text style={styles.placeName}>{placeData.name}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Descubra agora</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {[...Array(30)].map((_, index) => (
          <Text key={index} style={styles.contentText}>
            Conteúdo rolável número {index + 1}
          </Text>
        ))}
      </ScrollView>

      {/* Navbar Inferior */}
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
    marginBottom:20,
  },
  placeImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  imageContainer: {
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#FF6347',
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
