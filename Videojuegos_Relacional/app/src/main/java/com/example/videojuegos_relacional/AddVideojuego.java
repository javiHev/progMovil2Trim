package com.example.videojuegos_relacional;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class AddVideojuego extends AppCompatActivity {
    EditText tituloInput,desarrolladorInput,lanzamientoInput,generoInput;
    Button addButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_videojuego);
        tituloInput=findViewById(R.id.tituloInput);
        desarrolladorInput=findViewById(R.id.desarrolladorInput);
        lanzamientoInput=findViewById(R.id.lanzamientoInput);
        generoInput=findViewById(R.id.generoInput);
        addButton=findViewById(R.id.addButton);
        addButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ConexionBD baseDatos=new ConexionBD(AddVideojuego.this);
                baseDatos.addVideojuego(tituloInput.getText().toString().trim(),
                        desarrolladorInput.getText().toString().trim(),
                        Integer.valueOf(lanzamientoInput.getText().toString().trim()),
                        generoInput.getText().toString().trim());
            }
        });

    }
}