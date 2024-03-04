import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';

function MenuScreen({navigation}) {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await fetch('http://10.0.2.2:8000/menu/');
      const data = await response.json();
      setMenuItems(data);
    };

    fetchMenuItems();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((item) => (
        item.tipo !== "Bebida" && (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemNombre}>{item.nombre}</Text>
            <Text style={styles.itemPrecio}>{item.precio} €</Text>
            {item.tipo === "Menú" && (
              <FlatList
                horizontal
                data={item.platos}
                renderItem={({ item }) => <Text style={styles.platoNombre}>{item.nombre}</Text>}
                keyExtractor={(plato) => plato.id}
              />
            )}
          </View>
        )
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // Estilos para el contenedor principal del ScrollView
  },
  itemContainer: {
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    padding: 10,
    margin: 10,
  },
  itemNombre: {
    color: '#FF7622',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrecio: {
    color: '#32343E',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-end', // Alinea el precio a la derecha
  },
  platoNombre: {
    color: '#FF7622', // Puedes ajustar este color si los platos del menú deben tener un color diferente
    fontSize: 14,
    marginRight: 10, // Espacio entre los nombres de los platos
  },
});

export default MenuScreen;