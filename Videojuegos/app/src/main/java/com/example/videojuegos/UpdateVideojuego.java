package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UpdateVideojuego extends AppCompatActivity {
    private ArrayList<Videojuego> videojuegos;
    private Videojuego videojuegoSelect;
    private EditText edit_ModifyTitulo;
    private EditText edit_ModifyDesarrollador;
    private EditText edit_ModifyLanzamiento;

    Map<String, String> columnasExpresiones = new HashMap<String, String>() {
        {
            put("Titulo", "^[A-Za-záéíóúüñÁÉÍÓÚÜÑ0-9]+([\\s'][A-Za-záéíóúüñÁÉÍÓÚÜÑ0-9]+)*$");
            put("Desarrollador", "^[A-Za-záéíóúüñÁÉÍÓÚÜÑ0-9]+([\\s'][A-Za-záéíóúüñÁÉÍÓÚÜÑ0-9]+)*$");
            put("Lanzamiento", "^(\\d{4}-\\d{2}-\\d{2}|)$");
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_videojuego);
        Intent intent = getIntent();
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        if (intent.hasExtra("indxVideojuego") && this.videojuegos != null) {
            int index = intent.getIntExtra("indxVideojuego", -1);
            if (index != -1 && index < this.videojuegos.size()) {
                this.videojuegoSelect = this.videojuegos.get(index);
            } else {
                showToast("Error: Índice de videojuego inválido.");
                return; // O maneja el error de forma adecuada
            }
        } else {
            showToast("Error: No se ha recibido el índice del videojuego.");
            return; // O maneja el error de forma adecuada
        }
        edit_ModifyTitulo = findViewById(R.id.edit_ModificarTitulo);
        edit_ModifyDesarrollador = findViewById(R.id.edit_ModificarDesarrollador);
        edit_ModifyLanzamiento = findViewById(R.id.edit_ModificarLanzamiento);
        // Establecer valores iniciales en los EditText
        this.edit_ModifyTitulo.setText(this.videojuegoSelect.getTitulo());
        this.edit_ModifyDesarrollador.setText(this.videojuegoSelect.getDesarrollador());
        this.edit_ModifyLanzamiento.setText(this.videojuegoSelect.getLanzamiento());
    }

    public void guardar(View view) {
        boolean error = false;
        if (!verificarExpresion(this.columnasExpresiones.get("Titulo"), this.edit_ModifyTitulo.getText().toString())) {
            error = true;
            showToast("Error en el titulo");
        }
        if (!verificarExpresion(this.columnasExpresiones.get("Desarrollador"), this.edit_ModifyDesarrollador.getText().toString())) {
            error = true;
            showToast("Error en los desarrollador");
        }
        if (!verificarExpresion(this.columnasExpresiones.get("Lanzamiento"), this.edit_ModifyLanzamiento.getText().toString())) {
            error = true;
            showToast("Error en el lanzamiento");
        }

        if (!error) {
            // Realizar la actualización del alumno en la base de datos
            CRUDOperations operaciones = CRUDOperations.getInstance(this);
            operaciones.updateVideojuego(
                    this.edit_ModifyTitulo.getText().toString(),
                    this.edit_ModifyDesarrollador.getText().toString(),
                    this.edit_ModifyLanzamiento.getText().toString()
            );

            // Actualizar la lista de videojuegos
            this.videojuegoSelect.setTitulo(this.edit_ModifyTitulo.getText().toString());
            this.videojuegoSelect.setDesarrollador(this.edit_ModifyDesarrollador.getText().toString());
            this.videojuegoSelect.setLanzamiento(this.edit_ModifyLanzamiento.getText().toString());

            // Mostrar mensaje de éxito
            showToast("Videojuego Actualizado");

        }
    }



    public boolean verificarExpresion(String patronCumplir, String textoBuscar) {
        Pattern patron = Pattern.compile(patronCumplir);
        Matcher matcher = patron.matcher(textoBuscar);
        return matcher.matches();
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onDestroy() {
        // Cerrar operaciones si es necesario
        super.onDestroy();
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