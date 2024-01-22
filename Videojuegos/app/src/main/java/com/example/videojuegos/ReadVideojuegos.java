package com.example.videojuegos;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

public class ReadVideojuegos extends AppCompatActivity {
    private ArrayList<Videojuego> videojuegos = new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read_videojuegos);
        LinearLayout linearLayout = findViewById(R.id.LinearLayoutAlumnos);

        Intent intent = getIntent();
        if (intent.hasExtra("videojuegos")) {
            this.videojuegos = (ArrayList<Videojuego>) intent.getSerializableExtra("videojuegos");
        }

        for (int i = 0; i < this.videojuegos.size(); i++) {
            TextView textView = new TextView(this);
            textView.setText(this.videojuegos.get(i).getTitulo());
            textView.setTextSize(18);
            textView.setPadding(0, 200, 16, 16);

            // Configurar estilo de texto en negrita
            textView.setTypeface(null, Typeface.BOLD);

            int finalI = i;

            textView.setOnClickListener(view -> openVideojuego(finalI));

            // Configurar el gravity para centrar verticalmente el TextView
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );
            layoutParams.gravity = Gravity.CENTER;
            textView.setLayoutParams(layoutParams);

            linearLayout.addView(textView);
        }
    }

    public void atras(View view) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        showToast("Volviendo a la pantalla principal");
    }

    private void openVideojuego(int indxJuego) {
        Intent intent = new Intent(this, AddVideojuego.class);
        intent.putExtra("indxJuego", indxJuego);
        intent.putExtra("videojuego", this.videojuegos);
        startActivity(intent);
        showToast("Abriendo detalles del alumno");
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}
