package com.example.videojuegos;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.widget.Toast;

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
        SQLiteDatabase bd =conexion.getWritableDatabase();
        return bd.insert("videojuego", null, valores);
    }

    public Cursor devolverVideojuego() {
        return baseDatos.query("videojuego", new String[]{"id", "titulo", "desarrollador", "lanzamiento"}, null, null, null, null, null);
    }

    public long updateVideojuego(Videojuego videojuegoSelect,String titulo, String desarrollador, String lanzamiento) {
        SQLiteDatabase bd = conexion.getWritableDatabase();
        ContentValues valores = new ContentValues();
        System.out.println(titulo);
        System.out.println(desarrollador);
        System.out.printf(lanzamiento);

        valores.put("titulo", titulo);
        valores.put("desarrollador", desarrollador);
        valores.put("lanzamiento", lanzamiento);

        long result = bd.update("videojuego", valores, "titulo = ?", new String[]{String.valueOf(videojuegoSelect.getTitulo())});

        if (result == 1) {
            System.out.println("Campos actualizados");
        } else {
            System.out.println("Fallo al actualizar datos");
        }

        return result;
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
