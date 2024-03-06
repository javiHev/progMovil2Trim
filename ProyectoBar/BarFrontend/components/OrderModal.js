import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const OrderModal = ({ visible, onDismiss, total, onPlaceOrder }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>TOTAL: ${total}</Text>
          <TouchableOpacity style={styles.placeOrderButton} onPress={onPlaceOrder}>
            <Text style={styles.textStyle}>PLACE ORDER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <Text style={styles.textStyle}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end', // Alinea el contenido al final del contenedor (parte inferior)
      alignItems: 'center', // Centra horizontalmente
      marginBottom: 55, // Deja espacio para el menú de navegación
    },
    modalView: {
      backgroundColor: 'white',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      padding: 20,
      alignItems: 'center', // Centra el contenido del modal
      shadowColor: '#000', // Sombra para el modal
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      width: '100%' // Ocupa todo el ancho
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 20, // Tamaño del texto total
      fontWeight: 'bold', // Negrita
      color: '#32343E' // Color del texto
    },
    placeOrderButton: {
      backgroundColor: '#FF7622', // Color del botón
      borderRadius: 20, // Borde redondeado del botón
      padding: 10, // Espacio interno del botón
      elevation: 2,
      width: '80%', // Ancho del botón
      marginBottom: 10 // Espacio debajo del botón
    },
    closeButton: {
      backgroundColor: '#F0F5FA', // Color de fondo del botón Edit
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width: '80%'
    },
    textStyle: {
      color: 'white', // Color del texto dentro del botón
      fontWeight: 'bold', // Negrita
      textAlign: 'center', // Centra el texto dentro del botón
      fontSize: 18 // Tamaño del texto
    }
  });

export default OrderModal;