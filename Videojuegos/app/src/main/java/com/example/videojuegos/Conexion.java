package com.example.videojuegos;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class Conexion extends SQLiteOpenHelper {
    private static String TITULO_BD = "videojuegos.db";
    private static final int version = 1;

    public Conexion(Context context) {
        super(context, TITULO_BD, null, version);
    }


    @Override
    public void onCreate(SQLiteDatabase db) {
        /*Este metodo crea la tabla videojuego*/
        String query = "Create table videojuego (titulo, desarrollador, lanzamiento)";
        db.execSQL(query);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        /* Este metodo borra la tabla videojuego si existe */
        db.execSQL("DROP TABLE IF EXISTS videojuego");
        onCreate(db);
    }
}
