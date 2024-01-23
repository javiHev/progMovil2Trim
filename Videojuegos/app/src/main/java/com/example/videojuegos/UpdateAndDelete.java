package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

public class UpdateAndDelete extends AppCompatActivity {
    private ArrayList<Videojuego> videojuegos;
    private TextView verTitulo;
    private TextView verDesarrollador;
    private TextView verLanzamiento;
    private Videojuego videojuegoSelect;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_and_delete);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Mostrar el botón de retorno
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }
        Intent intent = getIntent();
        if (intent != null && intent.hasExtra("videojuego")) {
            videojuegoSelect = (Videojuego) intent.getSerializableExtra("videojuego");
        }

        verTitulo = findViewById(R.id.verTitulo);
        verDesarrollador = findViewById(R.id.verDesarrollador);
        verLanzamiento = findViewById(R.id.verLanzamiento);
        videojuegos = (ArrayList<Videojuego>) getIntent().getSerializableExtra("videojuegos");
        if (videojuegoSelect != null) {
            verTitulo.setText(videojuegoSelect.getTitulo());
            verDesarrollador.setText(videojuegoSelect.getDesarrollador());
            verLanzamiento.setText(videojuegoSelect.getLanzamiento());
        } else {
            // Manejo de error en caso de que videojuegoSelect sea null
            showToast("Error: No se ha recibido el videojuego.");
        }
    }

    public void updateVideojuego(View view) {
        int index = videojuegos.indexOf(videojuegoSelect);
        System.out.println("Hola:"+videojuegoSelect.getId());

        if (index != -1) { // Verifica que el videojuego esté en la lista
            Intent intent = new Intent(UpdateAndDelete.this, UpdateVideojuego.class);
            intent.putExtra("indxVideojuego", index);
            intent.putExtra("videojuegos", videojuegos);
            startActivity(intent);
            showToast("Abriendo Modificar videojuego");
        } else {
            showToast("Error: Videojuego no encontrado en la lista.");
        }
    }

    public void deleteVideojuego(View view) {
        // Elimina directamente el alumno de la lista
        this.videojuegos.remove(this.videojuegoSelect);

        CRUDOperations operacionesBase = CRUDOperations.getInstance(this);
        operacionesBase.deleteVideojuego(this.videojuegoSelect.getTitulo());

        Intent intent = new Intent(this, AddVideojuego.class);
        intent.putExtra("videojuegos", this.videojuegos);
        startActivity(intent);
        showToast("Videojuego Eliminado");
    }


    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            Intent intent = new Intent(this, MainActivity.class); // Crea un intent para volver a MainActivity
            startActivity(intent);
            finish(); // Finaliza la actividad actual para que no quede en segundo plano
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

}