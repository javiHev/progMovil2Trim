package com.example.videojuegos;

import java.io.Serializable;
import java.util.Objects;

public class Videojuego implements Serializable {
    private static int contadorId = 0; // Contador estático para el ID
    private int id;
    private String titulo;
    private String desarrollador;
    private String lanzamiento;

    public Videojuego(String titulo, String desarrollador, String lanzamiento) {
        this.id = obtenerSiguienteId(); // Asigna el siguiente ID disponible
        this.titulo = titulo;
        this.desarrollador = desarrollador;
        this.lanzamiento = lanzamiento;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Videojuego videojuego = (Videojuego) obj;
        return id == videojuego.id; // Compara los IDs
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // Es buena práctica sobrescribir hashCode cuando sobrescribes equals
    }


    private static synchronized int obtenerSiguienteId() {
        return contadorId++; // Incrementa el contador y devuelve el valor
    }

    public int getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDesarrollador() {
        return desarrollador;
    }

    public String getLanzamiento() {
        return lanzamiento;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDesarrollador(String desarrollador) {
        this.desarrollador = desarrollador;
    }

    public void setLanzamiento(String lanzamiento) {
        this.lanzamiento = lanzamiento;
    }

    public void setId(int id) {
        this.id = id;
    }
}
