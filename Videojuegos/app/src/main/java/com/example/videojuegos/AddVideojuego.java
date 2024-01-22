package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AddVideojuego extends AppCompatActivity {
    EditText edit_Titulo;
    EditText edit_Desarrollador;
    EditText edit_Lanzamiento;
    private ArrayList<Videojuego> videojuegos = new ArrayList<>();
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
        setContentView(R.layout.add_videojuego);
    }
    public void crearAlumno(View view) {
        boolean error = false;

        if (!verificarExpresion(columnasExpresiones.get("Titulo"), edit_Titulo.getText().toString())) {
            showToast("Error al añadir Titulo");
            error = true;
        }

        if (!verificarExpresion(columnasExpresiones.get("Desarrollador"), edit_Desarrollador.getText().toString())) {
            showToast("Error al añadir Desarrollador");
            error = true;
        }

        if (!verificarExpresion(columnasExpresiones.get("Lanzamiento"), edit_Lanzamiento.getText().toString())) {
            showToast("Error en el Lanzamiento");
            error = true;
        }

        if (error) {
            return;
        }

        Optional<Videojuego> alumnoRepetidoOptional = videojuegos.stream()
                .filter(videojuego -> videojuego.getTitulo().equalsIgnoreCase(edit_Titulo.getText().toString()))
                .findAny();

        if (alumnoRepetidoOptional.isPresent()) {
            showToast("El videojuego ya estaba creado");
            return;
        }

        CRUDOperations operaciones = CRUDOperations.getInstance(this);
        operaciones.addVideojuego(edit_Titulo.getText().toString(), edit_Desarrollador.getText().toString(), edit_Lanzamiento.getText().toString());
        videojuegos.add(new Videojuego(edit_Titulo.getText().toString(), edit_Desarrollador.getText().toString(), edit_Lanzamiento.getText().toString()));

        showToast("Videojuego añadido");
    }

    public void atras(View view) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        showToast("Volviendo a la pantalla principal");
    }

    private boolean verificarExpresion(String patronCumplir, String textoBuscar) {
        Pattern patron = Pattern.compile(patronCumplir);
        Matcher matcher = patron.matcher(textoBuscar);
        return matcher.matches();
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

}