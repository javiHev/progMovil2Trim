package com.example.videojuegos;

import java.io.Serializable;

public class Videojuego implements Serializable {
        private String titulo;
        private String desarrollador;
        private String lanzamiento;

    public Videojuego(String titulo, String desarrollador, String lanzamiento) {
            this.titulo = titulo;
            this.desarrollador = desarrollador;
            this.lanzamiento = lanzamiento;
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
}
