import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

function CartScreen({ route }) {
  const [pedidoItems, setPedidoItems] = useState([]); //Items que han pedido
  let totalAPagar=0;
  const {totalMenu,totalDrinks}=route.params;



  // Haces una peticion a la base de datos que te devuelve el menu entero
  const fetchMenuItems = async () => {
    setRefreshing(true);
    try {
      // Suponiendo que la dirección es correcta y que el servidor responde adecuadamente
      const response = await fetch('http://10.0.2.2:8000/menu/');
      const data = await response.json();
      setPedidoItems(data.map(item=>({...item,cantidad:0}))); // Supongamos que este es el formato correcto de tu respuesta
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchMenuItems();
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

  // Calcular el total
  const total = itemsPedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={itemsPedido}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.totalText}>TOTAL: ${total}</Text>
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

});

export default CartScreen;