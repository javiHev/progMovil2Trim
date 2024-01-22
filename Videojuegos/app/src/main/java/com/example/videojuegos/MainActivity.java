package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private ArrayList<Videojuego> videojuegos = new ArrayList<>();
    private CRUDOperations operaciones;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        operaciones = CRUDOperations.getInstance(this);
        Cursor cursor = null;

        try {
            cursor = operaciones.devolverVideojuego();
            if (cursor != null && cursor.moveToFirst()) {
                int titulo_posicion = cursor.getColumnIndex("titulo");
                int desarrollador_posicion = cursor.getColumnIndex("desarrollador");
                int lanzamiento_posicion = cursor.getColumnIndex("lanzamiento");

                do {
                    String titulo = cursor.getString(titulo_posicion);
                    String desarrollador = cursor.getString(desarrollador_posicion);
                    String lanzamiento = cursor.getString(lanzamiento_posicion);
                    Videojuego videojuego = new Videojuego(titulo, desarrollador, lanzamiento);
                    this.videojuegos.add(videojuego);
                } while (cursor.moveToNext());
            }
        } catch (Exception err) {
            System.out.println(err.getMessage());
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
    }

    public void addVideojuego(View view) {
        Intent intent = new Intent(this, AddVideojuego.class);
        intent.putExtra("", this.videojuegos);
        startActivity(intent);
        showToast("Añadiendo videojuego");
    }

    public void verListaAlumnos(View view) {
        Intent intent = new Intent(this, AddVideojuego.class);
        intent.putExtra("alumnos", this.videojuegos);
        startActivity(intent);
        showToast("Abriendo lista de alumnos");
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}