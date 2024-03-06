import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image,FlatList,RefreshControl} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import menuDelDiaImage from '../assets/menuDia.png';
import imagenPorDefecto from '../assets/imagenPorDefecto.png';




function MenuScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchMenuItems = async () => {
    setRefreshing(true);
    try {
      // Suponiendo que la dirección es correcta y que el servidor responde adecuadamente
      const response = await fetch('http://10.0.2.2:8000/menu/');
      const data = await response.json();
      setMenuItems(data.map(item=>({...item,cantidad:0}))); // Supongamos que este es el formato correcto de tu respuesta
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchMenuItems();
  }, []);


  const incrementarCantidad = (id) => {
    setMenuItems(currentItems =>
      currentItems.map(item => {
        
        if (item.id === id) {
          // console.log(item.platos)
          // Si el ítem es un menú, busca el stock mínimo entre sus platos
          if (item.tipo === "Menú") {
            const stocks = item.platos.map(platoId => {
              console.log(platoId['id'])
              const plato = currentItems.find(plato => plato.id === platoId.id);
              console.log(plato)
              return plato ? plato.stock : Infinity; // Usar Infinity como valor predeterminado si no se encuentra el plato
            });
            const minStock = Math.min(...stocks);
  
            // Incrementa la cantidad solo si es menor que el stock mínimo
            if (item.cantidad < minStock) {
              return { ...item, cantidad: item.cantidad + 1 };
            }
          } else {
            // Si el ítem no es un menú, simplemente verifica contra su stock
            if (item.cantidad < item.stock) {
              return { ...item, cantidad: item.cantidad + 1 };
            }
          }
        }
        return item;
      })
    );
  };

  const decrementarCantidad = (id) => {
    setMenuItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id && item.cantidad > 0) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      })
    );
  };
  
  const getIconName = (tipo) => {
    switch (tipo) {
      case "Plato":
        return "fast-food"; // icono para comida (Ionicons v5+)
      case "Bebida":
        return "beer"; // icono para bebida (Ionicons v5+)
      default:
        return "help-circle"; // icono por defecto (Ionicons v5+)
    }
  };

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={fetchMenuItems} />
    }>
      {menuItems.map((item) => (
      item.tipo !== "Bebida" && (
      <View key={item.id} style={styles.card}>
        <Image
          style={styles.itemImage}
          source={
            item.tipo === "Menú" 
            ? menuDelDiaImage 
            : item.imagen 
              ? { uri: item.imagen } 
              : imagenPorDefecto
          }
        />
            <View style={styles.infoContainer}>
              <Text style={styles.itemNombre}>{item.nombre}</Text>
              <Text style={styles.itemPrecio}>{`$${item.precio}`}</Text>
              {item.tipo === "Menú" && (
                <ScrollView style={styles.scrollPlatos}  horizontal={true} // Habilita el desplazamiento horizontal
                showsHorizontalScrollIndicator={false} >
                {item.tipo === "Menú" && (
                  (
                    <View style={styles.menuPlatosContainer}>
                      {item.platos.map((plato) => (
                        <View key={plato.id} style={styles.platoContainer}>
                          <Ionicons name={getIconName(plato.tipo)} size={24} color="#FF7622" />
                          <Text style={styles.platoNombre}>{plato.nombre}</Text>
                        </View>
                      ))}
                    </View>
                ))}
              </ScrollView>
              )}
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
        )
      ))}
    </ScrollView>
  );
}

// Nuevos estilos basados en la imagen proporcionada
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

export default MenuScreen;