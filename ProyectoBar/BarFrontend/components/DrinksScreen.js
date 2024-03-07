import React, { useEffect, useState } from 'react';
import OrderModal from './OrderModal';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import imagenPorDefecto from '../assets/imagenPorDefecto.png';

function DrinksScreen({navigation,idsEspacios,telefono}) {
  const [drinkItems, setDrinkItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [totalOrder, setTotalOrder] = useState(0);
  const totalPrice=0;
  navigation.navigate('CartScreen',{totalDrinks:totalPrice})

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

  const calculateTotal = () => {
    // Suma los precios de todos los items multiplicados por su cantidad
    const total = drinkItems.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
    setTotalOrder(total);
  };
  // Funcionalidades para pedir una bebida:
   // Muestra el modal con el total
   const showOrderModal = () => {
    calculateTotal();
    setModalVisible(true);
  };

  const handlePlaceOrder = async () => {
    try {
      await realizarPedido(); // Funcion para realizar el pedido
      Alert.alert('Éxito', 'Su pedido se ha realizado correctamente');
      setTotalOrder(0); // Resetea el total del pedido
      setModalVisible(false); // Cierra el modal
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al realizar el pedido');
      console.error(error);
    }
  };
  const realizarPedido = async () => {
    // Construyes el objeto pedido
  

    const print=drinkItems.filter(item => item.cantidad > 0).map(item => ({
      idItem: item.id,
      cantidad: item.cantidad
    }))
    const pedido = {
      id: `pedido_${Date.now()}`,
      idEspacios: idsEspacios, // Recibido desde el parametro de la app
      telefono:telefono,    // Telefono con el que identificamos la reserva y el pedido
      items: menuItems.filter(item => item.cantidad > 0).map(item => ({
        idItem: item.id,
        cantidad: item.cantidad
      })),
      estado: 'Pendiente',
      estadoPago: 'No Pagado'
    };
    console.log(JSON.stringify(pedido))
  
    // Realizas la petición POST para crear el pedido
    try {
      const responseCrearPedido = await fetch('http://10.0.2.2:8000/pedidos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });
  
      const pedidoCreado = await responseCrearPedido.json();
      
      // Si el pedido se crea con éxito, actualiza el stock
      if (responseCrearPedido.ok) {
        const stockUpdates = [];
  
        for (let item of drinkItems) {
          if (item.cantidad > 0) {
            if (item.tipo === 'Menú') {
              // Para los menús, añade una actualización de stock para cada plato
              for (let plato of item.platos) {
                stockUpdates.push({ idItem: plato.id, cantidad: item.cantidad });
              }
            } else {
              // Para items individuales, simplemente añade una actualización de stock
              stockUpdates.push({ idItem: item.id, cantidad: item.cantidad });
            }
          }
        }
  
        // Realiza la petición PATCH para actualizar el stock
        const restarStock = await fetch('http://10.0.2.2:8000/update-stock/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stockUpdates),
        });
        if (!restarStock.ok){
          print('No se pudo restar el pedido')
        }
      }else{
        print('El pedido no fue registrado')
      }
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
};

// Funcion para obtener los items haciendo la peticion a la API que conecta con MongoDB
const fetchMenuItems = async () => {
  setRefreshing(true);
  try {
    // Ponemos la direccion de la maquina virtual
    const response = await fetch('http://10.0.2.2:8000/menu/');
    const data = await response.json();
    setDrinkItems(data.map(item=>({...item,cantidad:0}))); 
  } catch (error) {
    console.error(error);
  } finally {
    setRefreshing(false);
  }
};
useEffect(() => {
  fetchMenuItems();
}, []);
  // 


  return (
    <View style={styles.screenContainer}>
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
    <TouchableOpacity style={styles.basketButton} onPress={showOrderModal}>
    <Ionicons name="basket" size={30} color="tomato" />
  </TouchableOpacity>
<OrderModal
  visible={isModalVisible}
  onDismiss={() => setModalVisible(false)}
  total={totalOrder}
  onPlaceOrder={handlePlaceOrder}
/>
</View>
  );
}
  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: 'space-between', // Esto asegura que el botón se quede en la parte inferior de la pantalla
    },
    basketButton: {
      padding: 10,
      backgroundColor: '#F0F5FA', 
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 1,
      borderColor: '#e2e2e2', // Color para el borde superior, cambia según tu diseño
    },
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
