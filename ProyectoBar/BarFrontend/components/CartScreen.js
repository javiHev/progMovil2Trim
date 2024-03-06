import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]); // Asumiendo que cartItems es pasado como un prop o obtenido de un contexto/global store
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calcularTotal();
  }, [cartItems]);

  const calcularTotal = () => {
    const total = cartItems.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
    setTotal(total);
  };

  const realizarPedido = async () => {
    const pedido = {
      items: cartItems.map(item => ({
        idItem: item.id,
        cantidad: item.cantidad,
      })),
      // ... otros datos necesarios para tu pedido
    };

    try {
      const response = await fetch('http://10.0.2.2:8000/pedidos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });
      const data = await response.json();
      Alert.alert("Pedido realizado", "Tu pedido ha sido creado con éxito.");
      // Limpiar carrito o hacer navegación según sea necesario
    } catch (error) {
        console.error('Error al realizar el pedido:', error);
        Alert.alert("Error", "No se pudo crear el pedido.");
      }
    };
  
    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemCount}>{`Cantidad: ${item.cantidad}`}</Text>
        <Text style={styles.itemPrice}>{`Precio: $${(item.cantidad * item.precio).toFixed(2)}`}</Text>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <Button title="Realizar Pedido" onPress={realizarPedido} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    itemName: {
      fontSize: 18,
    },
    itemCount: {
      fontSize: 16,
    },
    itemPrice: {
      fontSize: 16,
    },
    total: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
    }
  });
  
  export default CartScreen;