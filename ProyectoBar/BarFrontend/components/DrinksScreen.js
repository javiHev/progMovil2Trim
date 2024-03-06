import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import imagenPorDefecto from '../assets/imagenPorDefecto.png';

function DrinksScreen({ navigation }) {
  const [drinkItems, setDrinkItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDrinkItems = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('http://10.0.2.2:8000/menu/');
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new TypeError('La respuesta del servidor no es un array');
      }
  
      setDrinkItems(data.map(item => ({ ...item, cantidad: 0 })));
    } catch (error) {
      console.error('Error al recuperar los elementos del menú:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDrinkItems();
  }, []);

  const incrementarCantidad = (id) => {
    setDrinkItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id && item.stock > item.cantidad) { // Asegurarse de que no se exceda el stock
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      })
    );
  };

  const decrementarCantidad = (id) => {
    setDrinkItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id && item.cantidad > 0) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      })
    );
  };

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={fetchDrinkItems} />
    }>
      {drinkItems.map((item) => (
        item.tipo=='Bebida'&&
        <View key={item.id} style={styles.card}>
          <Image
            style={styles.itemImage}
            source={item.imagen ? { uri: item.imagen } : imagenPorDefecto}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.itemNombre}>{item.nombre}</Text>
            <Text style={styles.itemPrecio}>{`$${item.precio}`}</Text>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={() => decrementarCantidad(item.id)} style={styles.button}>
              <Ionicons name="remove-circle-outline" size={24} color="orange" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{item.cantidad}</Text>
            <TouchableOpacity onPress={() => incrementarCantidad(item.id)} style={styles.button}>
              <Ionicons name="add-circle-outline" size={24} color="orange" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F5FA', // Color de fondo del contenedor principal
    },
    scrollPlatos:{
      flexDirection: 'row',
      backgroundColor:'#FFFFFF'
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      margin: 10,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    infoContainer: {
      flex: 1,
    },
    itemNombre: {
      width:'100%',
      color: '#FF7622',
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    itemPrecio: {
      color: '#32343E',
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 5,
      
    },
    menuPlatosContainer: {
      // flexDirection: 'row',
      alignItems: 'flex-start'
    },
    platoNombre: {
      fontSize: 12,
      marginRight: 10,
      marginLeft: 1,
      color: '#32343E',
    },
    platoContainer: {
      flexDirection: 'row', // Elementos en fila para icono y texto
      alignItems: 'center', // Centra los elementos verticalmente en la fila
      paddingVertical: 4, // Un poco de padding vertical para separar los elementos
      backgroundColor:'#FFFFFF'
    },
    counterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    button: {
      marginHorizontal: 10,
    },
    buttonText: {
      color: 'orange',
      fontSize: 24,
    },
    counterText: {
      fontSize: 16,
      color: '#32343E',
    },
    itemImage: {
      width: '30%', // O un tamaño específico
      height: 100, // Altura fija para la imagen
      borderTopLeftRadius: 20, // Redondear esquinas superiores
      borderTopRightRadius: 20,
      backgroundColor: '#FFFFFF', // Un color de fondo en caso de que la imagen no cargue o mientras carga
      marginRight:20
    }
  });

export default DrinksScreen;
