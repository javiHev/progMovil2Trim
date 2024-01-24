package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;

import java.util.ArrayList;

public class ReadVideojuegos extends AppCompatActivity {
    private RecyclerView recyclerView;
    private VideojuegoAdapter adapter;
    private ArrayList<Videojuego> videojuegos = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Inicializa el RecyclerView y el adaptador
        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new VideojuegoAdapter(this, videojuegos, this::openUpdateDeleteView);
        recyclerView.setAdapter(adapter);

        // Cargar datos en videojuegos
        loadData();
    }

    private void loadData() {
        Intent intent = getIntent();
        if (intent.hasExtra("videojuegos")) {
            this.videojuegos = (ArrayList<Videojuego>) intent.getSerializableExtra("videojuegos");
            adapter.notifyDataSetChanged(); // Notificar al adaptador que los datos han cambiado
        }
    }

    private void openUpdateDeleteView(int position) {
        // Lógica para abrir la actividad de actualización/eliminación
        Intent intent = new Intent(this, UpdateAndDelete.class);
        intent.putExtra("videojuego", videojuegos.get(position));
        startActivity(intent);
    }
}
