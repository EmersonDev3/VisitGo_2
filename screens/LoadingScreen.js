import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const LoadingScreen = () => {
  const { width, height } = Dimensions.get('window'); 

  const navigation = useNavigation(); 
  const [videoStatus, setVideoStatus] = useState({});

  const videoWidth = width * 0.9; 
  const videoHeight = height * 0.5;


  const onPlaybackStatusUpdate = (status) => {
    setVideoStatus(status);
    if (status.didJustFinish) {
    
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/VisitGo.mp4')} 
        style={[styles.video, { width: videoWidth, height: videoHeight }]}
        resizeMode="contain" 
        shouldPlay
        isLooping={false} 
        useNativeControls={false} 
        isMuted={true} 
        pointerEvents="none" 
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fbfbf9', 
  },
  video: {
    backgroundColor: '#fbfbf9',
    borderRadius: 10, 
  },
});

export default LoadingScreen;