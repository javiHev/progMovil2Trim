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
        if (intent.hasExtra("alumnos")) {
            this.videojuegos = (ArrayList<Videojuego>) intent.getSerializableExtra("videojuegos");
        }

        if (intent.hasExtra("indxVideojuego")) {
            this.videojuegoSelect = this.videojuegos.get(intent.getIntExtra("indexVideojuego", 0));
        }
        this.edit_ModifyTitulo = findViewById(R.id.edit_ModificarTitulo);
        this.edit_ModifyDesarrollador = findViewById(R.id.edit_ModificarDesarrollador);
        this.edit_ModifyLanzamiento = findViewById(R.id.edit_ModificarLanzamiento);

        // Establecer valores iniciales en los EditText
        this.edit_ModifyTitulo.setText(this.videojuegoSelect.getTitulo());
        this.edit_ModifyDesarrollador.setText(this.videojuegoSelect.getDesarrollador());
        this.edit_ModifyLanzamiento.setText(this.videojuegoSelect.getLanzamiento());
    }

    public void guardar(View view) {
        boolean error = false;
        if (!verificarExpresion(this.columnasExpresiones.get("Nombre"), this.edit_ModifyTitulo.getText().toString())) {
            error = true;
            showToast("Error en el nombre");
        }
        if (!verificarExpresion(this.columnasExpresiones.get("Apellidos"), this.edit_ModifyDesarrollador.getText().toString())) {
            error = true;
            showToast("Error en los apellidos");
        }
        if (!verificarExpresion(this.columnasExpresiones.get("Ciclo"), this.edit_ModifyLanzamiento.getText().toString())) {
            error = true;
            showToast("Error en el ciclo");
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

            // Regresar a la actividad anterior
            atras(view);
        }
    }

    public void atras(View view) {
        Intent intent = new Intent(this, UDVideojuego.class);
        intent.putExtra("indexVideojuegos", this.videojuegos.indexOf(this.videojuegoSelect));
        intent.putExtra("videojuegos", this.videojuegos);
        startActivity(intent);
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
}