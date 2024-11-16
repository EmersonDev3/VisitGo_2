import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar Superior */}
      <View style={styles.navbarTop}>
        {/* Nome "VisitGo" clicável */}
        <TouchableOpacity onPress={() => alert('VisitGo clicado!')}>
          <Text style={styles.navbarTextLeft}>VisitGo</Text>
        </TouchableOpacity>
        <Ionicons name="heart" size={30} color="red" style={styles.iconRight} />
      </View>

      {/* Conteúdo rolável entre as barras */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.contentText}>Texto longo aqui para rolar o conteúdo...</Text>
        {/* Adicione mais texto ou componentes aqui */}
        {[...Array(30)].map((_, index) => (
          <Text key={index} style={styles.contentText}>Conteúdo rolável número {index + 1}</Text>
        ))}
      </ScrollView>

      {/* Navbar Inferior com ícones e texto */}
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
    height: 80, // Altura da navbar superior
    backgroundColor: 'white',
    flexDirection: 'row', // Alinha os itens horizontalmente
    justifyContent: 'space-between', // Espaço entre os elementos
    alignItems: 'center', // Alinhamento vertical central
    paddingHorizontal: 16, // Espaçamento horizontal
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Ajuste para Android
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Garante que a navbar fique sobre o conteúdo
    borderBottomWidth: 1, // Borda sutil
    borderBottomColor: '#ccc', // Cor da borda
  },
  navbarBottom: {
    height: 65, // Altura da navbar inferior
    backgroundColor: 'black',
    flexDirection: 'row', // Alinha os itens horizontalmente
    justifyContent: 'space-around', // Espaço igual entre os itens
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Garante que a navbar fique sobre o conteúdo
  },
  navbarItem: {
    alignItems: 'center', // Alinha ícone e texto no centro
  },
  navbarItemText: {
    color: 'white',
    fontSize: 12, // Tamanho do texto
    marginTop: 5, // Espaço entre o ícone e o texto
  },
  navbarText: {
    color: 'white',
    fontSize: 20, // Tamanho do texto
    fontWeight: 'bold',
  },
  navbarTextLeft: {
    color: 'black', // Cor do texto
    fontSize: 25, // Tamanho maior para o texto
    fontWeight: 'bold', // Peso do texto
  },
  iconRight: {
    marginRight: 7, // Espaço à direita
  },
  scrollContent: {
    paddingTop: 100, // Espaço para a navbar superior
    paddingBottom: 100, // Espaço para a navbar inferior
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
});

export default HomeScreen;
