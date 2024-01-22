package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
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

        Intent intent = getIntent();
        if (intent.hasExtra("videojuegos")) {
            this.videojuegos = (ArrayList<Videojuego>) intent.getSerializableExtra("videojuegos");
        }

        if (intent.hasExtra("indexVideojuego")) {
            int indexVideojuego = intent.getIntExtra("indexVideojuego", 0);
            this.videojuegoSelect = this.videojuegos.get(indexVideojuego);
        }

        this.verTitulo = findViewById(R.id.verTitulo);
        this.verDesarrollador = findViewById(R.id.verDesarrollador);
        this.verLanzamiento = findViewById(R.id.verLanzamiento);
        this.verTitulo.setText(this.videojuegoSelect.getTitulo());
        this.verDesarrollador.setText(this.videojuegoSelect.getDesarrollador());
        this.verLanzamiento.setText(this.videojuegoSelect.getLanzamiento());
    }

    public void updateVideojuego(View view) {
        Intent intent = new Intent(this, UpdateVideojuego.class);
        intent.putExtra("indxVideojuego", this.videojuegos.indexOf(this.videojuegoSelect));
        intent.putExtra("videojuegos", this.videojuegos);
        startActivity(intent);
        showToast("Abriendo Modificar videojuego");
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


}