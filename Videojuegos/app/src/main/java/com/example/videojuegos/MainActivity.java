package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    RecyclerView recyclerView;
    FloatingActionButton add_button;
    TextView no_data;
    private VideojuegoAdapter adapter;

    private ArrayList<Videojuego> videojuegos = new ArrayList<>();
    private CRUDOperations operaciones;
    private Conexion bd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Inicialización de componentes de la vista
        recyclerView = findViewById(R.id.recyclerView);
        add_button = findViewById(R.id.add_button);
        no_data = findViewById(R.id.no_data);

        // Cargar datos de la base de datos
        cargarDatos();

        // Configurar RecyclerView

        adapter = new VideojuegoAdapter(this, videojuegos, this::onVideojuegoClick);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        // Actualizar la interfaz de usuario según los datos
        actualizarInterfazUsuario();

        add_button.setOnClickListener(view -> {
            Intent intent = new Intent(MainActivity.this, AddVideojuego.class);
            startActivity(intent);
        });
    }

    private void actualizarInterfazUsuario() {
        if (videojuegos.isEmpty()) {
            no_data.setVisibility(View.VISIBLE);
        } else {
            no_data.setVisibility(View.GONE);
        }
    }

    private void cargarDatos() {
        operaciones = CRUDOperations.getInstance(this);
        Cursor cursor = operaciones.devolverVideojuego();
        try {
            if (cursor != null && cursor.moveToFirst()) {
                //int id_posicion = cursor.getColumnIndex("id");
                int titulo_posicion = cursor.getColumnIndex("titulo");
                int desarrollador_posicion = cursor.getColumnIndex("desarrollador");
                int lanzamiento_posicion = cursor.getColumnIndex("lanzamiento");

                videojuegos.clear(); // Limpia la lista actual antes de agregar nuevos elementos

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

    private void onVideojuegoClick(int position) {
        Videojuego videojuegoSeleccionado = videojuegos.get(position);
        Intent intent = new Intent(MainActivity.this, UpdateAndDelete.class);
        intent.putExtra("videojuego", videojuegoSeleccionado);
        intent.putExtra("videojuegos", videojuegos); // Pasa la lista de videojuegos
        startActivity(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        cargarDatos(); // Método que carga los datos de los videojuegos
        adapter.notifyDataSetChanged(); // Notifica al adaptador del RecyclerView sobre los cambios de datos
    }


}