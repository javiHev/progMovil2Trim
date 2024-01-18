package com.example.videojuegos_relacional;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.widget.Toast;

public class ConexionBD extends SQLiteOpenHelper {
    public static final String NOMBRE_BD="videojuegos.bd";
    private static final int version = 1;

    private static final String TABLE_NAME="videojuego";
    private static final String COLUMN_ID="_id";
    private static final String COLUMN_TITULO="Titulo";
    private static final String COLUMN_DESARROLLADOR="Desarrollador";
    private static final String COLUMN_LANZAMIENTO="Lanzamiento";
    private static final String COLUMN_GENERO="Genero";
    private final Context context;


    public ConexionBD(Context context) {
        super(context, NOMBRE_BD, null, version);
        this.context=context;
    }

    @Override
    public void onCreate(SQLiteDatabase baseDatos) {
        String consulta = "CREATE TABLE "+ TABLE_NAME+" ("+COLUMN_ID+ "INTEGER PRIMARY KEY AUTOINCREMENT,"+COLUMN_TITULO+"TEXT,"+
                COLUMN_DESARROLLADOR+"TEXT,"+
                COLUMN_LANZAMIENTO+"INTEGER,"+
                COLUMN_GENERO+"TEXT);";
        baseDatos.execSQL(consulta);

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS "+TABLE_NAME);
        onCreate(db);
    }
    void addVideojuego(String titulo,String desarrollador,int lanzamiento,String genero){
        SQLiteDatabase baseDatos =this.getWritableDatabase();
        ContentValues cv=new ContentValues();
        cv.put(COLUMN_TITULO, titulo);
        cv.put(COLUMN_DESARROLLADOR,desarrollador);
        cv.put(COLUMN_LANZAMIENTO,lanzamiento);
        cv.put(COLUMN_GENERO,genero);

        long resultado=baseDatos.insert(TABLE_NAME,null,cv);

        if(resultado==-1){
            Toast.makeText(context, "No se añadio correctamente", Toast.LENGTH_SHORT).show();
        }else{
            Toast.makeText(context,"Añadido correctamente",Toast.LENGTH_SHORT).show();
        }
    }

}

