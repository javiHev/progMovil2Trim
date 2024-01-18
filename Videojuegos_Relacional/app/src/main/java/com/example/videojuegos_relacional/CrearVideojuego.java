package com.example.videojuegos_relacional;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
public class CrearVideojuego {
    EditText introTitulo;
    EditText introDesarrollador;
    EditText introducirPaginas;
    EditText introducirFecha;
    private ArrayList<Libro> libros = new ArrayList<>();
    Map<String, String> columnasExpresiones = new HashMap<String, String>() {
        {
            put("Paginas", "^\\d{1,5}$");
            put("Titulo", "^[\\w\\s.,!?-]{1,100}$");
            put("Autor", "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");
            put("Fecha", "^\\d{4}-\\d{2}-\\d{2}$");
        }

    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crear);
        this.introducirTitulo = findViewById(R.id.introducirTitulo);
        this.introducirAutor = findViewById(R.id.introducirAutor);
        this.introducirPaginas = findViewById(R.id.introducirPaginas);
        this.introducirFecha = findViewById(R.id.introducirFecha);
    }
    /**
     * Método que se encarga de crear un libro, comprueba el texto
     * */
    public void crearLibro(View view){
        System.out.println("creando el libro");
        boolean error = false;
        if(!validarDatos(this.columnasExpresiones.get("Titulo"),this.introducirTitulo.getText().toString())){
            error = true;
        }
        if(!validarDatos(this.columnasExpresiones.get("Autor"),this.introducirAutor.getText().toString())){
            error = true;
        }
        if(!validarDatos(this.columnasExpresiones.get("Paginas"),this.introducirPaginas.getText().toString())){
            error = true;
        }
        if(!validarDatos(this.columnasExpresiones.get("Fecha"),this.introducirFecha.getText().toString())){
            error = true;
        }

        if (error){
            System.out.println("error");
            return;
        }
        System.out.println("No hay errores");
        Optional<Libro> libroRepetidoOptional = this.libros.stream().filter(libro -> libro.getTitulo().equalsIgnoreCase(this.introducirTitulo.getText().toString())).findAny();
        if(libroRepetidoOptional.isPresent()){
            return;
        }
        CrudOperations CrudOperations = CrudOperations.getInstance(this);
        CrudOperations.meterLibro(this.introducirTitulo.getText().toString(),this.introducirAutor.getText().toString(),this.introducirFecha.getText().toString(),Integer.parseInt(this.introducirPaginas.getText().toString()));
        this.libros.add(new Libro(this.introducirTitulo.getText().toString(),this.introducirAutor.getText().toString(),Integer.parseInt(this.introducirPaginas.getText().toString()),
                this.introducirFecha.getText().toString()));

    }
    public void volver(View view){
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    /**
     * Método que se encarga de validar los datos para que se cumpla la
     * expresion regular.
     *
     * @param patronCumplir patron a cumplir
     * @param textoBuscar   string donde buscar el patron
     */
    public boolean validarDatos(String patronCumplir, String textoBuscar) {
        Pattern patron = Pattern.compile(patronCumplir);
        Matcher matcher = patron.matcher(textoBuscar);
        return matcher.matches();
    }
}
