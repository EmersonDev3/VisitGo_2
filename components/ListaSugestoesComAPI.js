import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView, Modal } from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListaSugestoesComAPI = () => {
    const [location, setLocation] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false); 

    const simulatedEvents = [
        {
            name: "Show de MPB - João das Neves",
            address: "Theatro 4 de Setembro, Centro",
            date: "2024-11-20",
            icon: "music-note",
        },
        {
            name: "Exposição de Arte - Cores do Piauí",
            address: "Palácio da Cultura, Praça Pedro II",
            date: "2024-11-21",
            icon: "brush",
        },
        {
            name: "Festival de Cinema Independente",
            address: "Cine Rex, Centro",
            date: "2024-11-22",
            icon: "movie",
        },
        {
            name: "Feira Literária de Teresina",
            address: "Parque da Cidadania",
            date: "2024-11-23",
            icon: "menu-book",
        },
        {
            name: "Show de Rock - Banda Os Piauienses",
            address: "Espaço Cultural Rosa dos Ventos",
            date: "2024-11-24",
            icon: "guitar",
        },
    ];

    
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
        const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
        console.log('Evento aleatório selecionado:', randomEvent);
        setEvent(randomEvent);
        setLoading(false);
    }, [location]);

    
    useEffect(() => {
        if (event) {
            setModalVisible(true);  
        }
    }, [event]);

    const hideModal = () => {
        setModalVisible(false); 
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Eventos e Shows em Teresina</Text>
            <ScrollView style={styles.scrollView}>
                {simulatedEvents.slice(0, 3).map((eventItem, index) => (
                    <TouchableOpacity key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name={eventItem.icon} size={32} color="#000" style={styles.icon} />
                            <Text style={styles.name}>{eventItem.name}</Text>
                        </View>
                        <View style={styles.cardDetails}>
                            <Text style={styles.address}>
                                <Icon name="place" size={20} color="#000" /> {eventItem.address}
                            </Text>
                            <Text style={styles.date}>
                                <Icon name="calendar-today" size={20} color="#000" /> {eventItem.date}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

             
                {event && (
                    <TouchableOpacity style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name={event.icon} size={32} color="#000" style={styles.icon} />
                            <Text style={styles.name}>{event.name}</Text>
                        </View>
                        <View style={styles.cardDetails}>
                            <Text style={styles.address}>
                                <Icon name="place" size={20} color="#000" /> {event.address}
                            </Text>
                            <Text style={styles.date}>
                                <Icon name="calendar-today" size={20} color="#000" /> {event.date}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}

                {!event && (
                    <Text style={styles.noEvents}>Nenhum evento encontrado.</Text>
                )}
            </ScrollView>

       
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={hideModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Novo Evento!</Text>
                        <Text style={styles.modalText}>{event.name}</Text>
                        <Text style={styles.modalText}>{event.date}</Text>
                        <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        marginRight: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    cardDetails: {
        marginTop: 5,
    },
    address: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        color: '#555',
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
        backgroundColor: '#f4f4f4',
    },
    loadingText: {
        marginTop: 10,
        color: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ListaSugestoesComAPI;
