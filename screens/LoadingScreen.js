import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const LoadingScreen = () => {
  const { width, height } = Dimensions.get('window'); // Obtém as dimensões da tela

  const navigation = useNavigation(); // Hook para navegação
  const [videoStatus, setVideoStatus] = useState({});

  // Definindo a largura e altura para o vídeo
  const videoWidth = width * 0.9; // O vídeo terá no máximo 90% da largura da tela
  const videoHeight = height * 0.5; // O vídeo terá no máximo 50% da altura da tela

  // Função que será chamada quando o status de reprodução do vídeo mudar
  const onPlaybackStatusUpdate = (status) => {
    setVideoStatus(status);
    if (status.didJustFinish) {
      // Se o vídeo terminou, navega para a tela de login
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/VisitGo.mp4')} // Altere para o formato de vídeo correto
        style={[styles.video, { width: videoWidth, height: videoHeight }]} // Aplica as dimensões ajustadas
        resizeMode="contain" // O vídeo se ajusta dentro da área sem cortar
        shouldPlay
        isLooping={false} // Não repete o vídeo
        useNativeControls={false} // Desativa os controles nativos do vídeo
        isMuted={true} // Desativa o som do vídeo
        pointerEvents="none" // Impede qualquer interação com o vídeo
        onPlaybackStatusUpdate={onPlaybackStatusUpdate} // Define a função de status do vídeo
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz o contêiner ocupar toda a tela
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    backgroundColor: '#fbfbf9', // Define o fundo da tela como #fbfbf9
  },
  video: {
    backgroundColor: '#fbfbf9', // Garante que o fundo do vídeo seja a mesma cor
    borderRadius: 10, // Opcional: adicionar bordas arredondadas no vídeo
  },
});

export default LoadingScreen;
