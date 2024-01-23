package com.example.videojuegos;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

public class CRUDOperations {
    private static CRUDOperations instancia;
    private SQLiteDatabase baseDatos;
    private Conexion conexion;

    private CRUDOperations(Context context) {
        try {
            conexion = new Conexion(context.getApplicationContext());
            baseDatos = conexion.getWritableDatabase();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public long addVideojuego(String titulo, String desarrollador, String lanzamiento) {
        ContentValues valores = new ContentValues();
        valores.put("Titulo", titulo);
        valores.put("Desarrollador", desarrollador);
        valores.put("Lanzamiento", lanzamiento);
        System.out.println("Añadiendo videojuego a la base de datos...");
        return baseDatos.insert("videojuego", null, valores);
    }

    public Cursor devolverVideojuego() {
        return baseDatos.query("videojuego", new String[]{"id", "titulo", "desarrollador", "lanzamiento"}, null, null, null, null, null);
    }

    public int updateVideojuego(String titulo, String desarrollador, String lanzamiento) {
        ContentValues valores = new ContentValues();
        valores.put("Titulo", titulo);
        valores.put("Desarrollador", desarrollador);
        valores.put("Lanzamiento", lanzamiento);
        return baseDatos.update("videojuego", valores, "titulo = ?", new String[]{String.valueOf(titulo)});
    }

    public void deleteVideojuego(String titulo) {
        baseDatos.delete("videojuego", "titulo = ?", new String[]{String.valueOf(titulo)});
    }

    public static synchronized CRUDOperations getInstance(Context context) {
        if (instancia == null) {
            instancia = new CRUDOperations(context.getApplicationContext());
        }
        return instancia;
    }
}
