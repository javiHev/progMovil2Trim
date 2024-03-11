import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Alert, Modal } from 'react-native';

function CartScreen({ idsEspacios, telefono }) {
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pedidoItems, setPedidoItems] = useState([]); //Items que han pedido
  const [totalAPagar, setTotalAPagar] = useState(0);
  const navigation = useNavigation();


  // Haces una peticion a la base de datos que te devuelve el menu entero
  const fetchMenuItems = async () => {
    setRefreshing(true);
    try {
      // Suponiendo que la dirección es correcta y que el servidor responde adecuadamente
      const response = await fetch('http://10.0.2.2:8000/menu/');
      const data = await response.json();
      setPedidoItems(data); // Supongamos que este es el formato correcto de tu respuesta

      // Ahora hago una pericion a la base de datos y recojo todos los pedidos vinculados al numero de telefono de la reserva
      const response_pedido = await fetch(`http://10.0.2.2:8000/pedidos/telefono/${telefono}`);
      if (!response_pedido.ok) {
        throw new Error('No se pudo obtener la respuesta del servidor');
      }
      const data_pedido = await response_pedido.json();
      setCartItems(data_pedido); // Suponiendo que la API devuelve un array de items
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };



  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    let nuevoTotal = 0;
    cartItems.forEach((pedido) => {
      pedido.items.forEach((item) => {
        const itemDetails = pedidoItems.find((pedidoItem) => pedidoItem.id === item.idItem);
        if (itemDetails) {
          nuevoTotal += itemDetails.precio * item.cantidad;
        }
      });
    });
    setTotalAPagar(nuevoTotal);
  }, [cartItems, pedidoItems]); // Este efecto se ejecutará cada vez que cartItems o pedidoItems cambien






  const findItemDetails = (idItem) => {
    const itemDetails = pedidoItems.find((pedidoItem) => pedidoItem.id === idItem);
    return itemDetails ? itemDetails : { nombre: '', precio: 0, imagen: null };

  };
  const cancelItem = async (id) => {
    try {
      // Realizar la petición DELETE a tu API para eliminar el pedido por su ID
      const response = await fetch(`http://10.0.2.2:8000/pedidos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Si la respuesta no es exitosa, lanzar un error
        throw new Error('No se pudo eliminar el pedido');
      }

      // Si la eliminación fue exitosa, mostrar una alerta de éxito
      Alert.alert('Éxito', 'Pedido eliminado con éxito', [{ text: 'OK' }]);

      // Opcional: Actualizar la lista de pedidos en la interfaz para reflejar los cambios
      fetchMenuItems(); // Suponiendo que esta función actualiza la lista de pedidos

    } catch (error) {
      // En caso de error, mostrar una alerta informando del problema
      Alert.alert('Error', 'Error al eliminar el pedido: ' + error.message, [{ text: 'OK' }]);
    }
  };


  const handlePaymentOption = async (method) => {
    try {
      // 1. Eliminar reservas por número de teléfono
      await fetch(`http://10.0.2.2:8000/reservas/eliminar/${telefono}`, {
        method: 'DELETE',
      });

      // 2. Eliminar todos los pedidos en cartItems por ID
      for (const pedido of cartItems) {
        await fetch(`http://10.0.2.2:8000/pedidos/${pedido.id}`, {
          method: 'DELETE',
        });
      }


      // 3. Cambiar el estado de los espacios a disponible
      await fetch(`http://10.0.2.2:8000/espacios/cambiar-estado/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(idsEspacios), // Asegúrate de que el endpoint acepte el formato correcto
      });

      setTotalAPagar(0);
      // Muestra el mensaje de confirmación
      Alert.alert('Confirmación de Pago', `El pago se realizará en ${method}. En unos momentos nuestro empleado procederá con el cobro.`, [
        { text: 'OK', onPress: () => { navigation.navigate('Login'); setShowModal(false); } }
      ]);
      // setShowModal(false); // Cierra el modal


    } catch (error) {
      // Manejo de errores
      Alert.alert('Error', 'Ha ocurrido un error durante el proceso de pago: ' + error.message);
    }
  };

  const renderItem = ({ item }) => {
    try {
      return (
        <View style={styles.card}>
          {item.items.map((cartItem, index) => {
            const itemDetails = findItemDetails(cartItem.idItem);
            if (!itemDetails) {
              return null;
            }

            const { nombre, precio, imagen } = itemDetails;
            const subtotal = precio * cartItem.cantidad;

            return (
              <View key={index} style={styles.itemContainer}>
                {imagen && <Image source={{ uri: imagen }} style={styles.itemImage} />}
                <View style={styles.itemDetailsContainer}>
                  <Text style={styles.itemNombre}>{nombre}</Text>
                  <Text style={styles.itemPrecio}>{`Precio: $${precio} x ${cartItem.cantidad} = $${subtotal}`}</Text>
                </View>
                {item.estado === 'Pendiente' && (
                  <TouchableOpacity onPress={() => cancelItem(item.id)} style={styles.cancelButton}>
                    <Ionicons name="trash" size={24} color="#FFFFFF" />
                  </TouchableOpacity>

                )}
              </View>
            );
          })}
        </View>
      );
    } catch (error) {
      console.error('Error en renderItem:', error);
      return <Text>Error al renderizar el item</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // Ajuste sugerido
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchMenuItems} />
        }
      />
      <View style={styles.basketButton}>
        <Text style={styles.totalText}>TOTAL: ${totalAPagar}</Text>
        <TouchableOpacity style={styles.payButton} onPress={() => setShowModal(true)}>
          <Text style={styles.payText}>PAGAR</Text>
        </TouchableOpacity>

        <Modal visible={showModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.optionButton} onPress={() => handlePaymentOption('efectivo')}>
                <Ionicons name="cash" size={38} color="green" />
                <Text style={styles.typePay}>Efectivo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionButton} onPress={() => handlePaymentOption('tarjeta')}>
                <Ionicons name="card" size={38} color="blue" />
                <Text style={styles.typePay}>Tarjeta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionButton: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: 'orange',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  typePay: {
    color: '#3C3633',
    fontSize: 20,
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemDetailsContainer: {
    flex: 1,
  },
  itemNombre: {
    color: '#FF7622',
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemPrecio: {
    color: '#32343E',
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemImage: {
    width: 50, // Ajusta según necesites
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#D71313',
    borderRadius: 50 / 2,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  payButton: {
    width: '80%',
    backgroundColor: '#FF7622',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  payText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  basketButton: {
    padding: 10,
    backgroundColor: '#F0F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#e2e2e2',
  },
  // Agrega aquí cualquier otro estilo que necesites
});





export default CartScreen;