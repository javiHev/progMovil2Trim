import React, { useState, useEffect } from 'react';


import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

function CartScreen({ totalMenu, totalDrinks,telefono}) {
  const [cartItems, setCartItems] = useState([]);
  const [pedidoItems, setPedidoItems] = useState([]); //Items que han pedido
  // const {totalMenu,totalDrinks,telefono}=route.params;
  let totalAPagar=totalMenu+totalDrinks;



  // Haces una peticion a la base de datos que te devuelve el menu entero
  const fetchMenuItems = async () => {
    setRefreshing(true);
    try {
      // Suponiendo que la dirección es correcta y que el servidor responde adecuadamente
      const response = await fetch('http://10.0.2.2:8000/menu/');
      const data = await response.json();
      setPedidoItems(data.map(item=>({...item,cantidad:0}))); // Supongamos que este es el formato correcto de tu respuesta

      // Ahora hago una pericion a la base de datos y recojo todos los pedidos vinculados al numero de telefono de la reserva
      const response_pedido = await fetch(`http://10.0.2.2:8000/pedidos/telefono/${telefono}`);
      if (!response_pedido.ok) {
        throw new Error('No se pudo obtener la respuesta del servidor');
      }
      const data_pedido = await response.json();
      setCartItems(data_pedido); // Suponiendo que la API devuelve un array de items
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  
  
  useEffect(() => {
    fetchMenuItems();
    console.log(`Items Carta: ${cartItems.length}\n Pedido Items: ${pedidoItems}`);
  }, []);



  
  // Función que renderiza cada item del pedido
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imagen }} style={styles.imageStyle} />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemPrice}>Cantidad: {item.cantidad}</Text>
      </View>
    </View>
  );

  // // Calcular el total
  // const total = pedidoItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={pedidoItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.totalText}>TOTAL: ${totalAPagar}</Text>
      <TouchableOpacity style={styles.payButton} onPress={() => {/* Lógica de pago */}}>
        <Text style={styles.payText}>PAY & CONFIRM</Text>
      </TouchableOpacity>
    </View>
  );
}
  
  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      padding: 10,
      backgroundColor: 'white', // Color de fondo general de la pantalla
    },
    itemContainer: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },
    imageStyle: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    detailsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    itemName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemPrice: {
      fontSize: 14,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    payButton: {
      backgroundColor: '#FF7622',
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    payText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    // ...otros estilos que necesites
  });




export default CartScreen;